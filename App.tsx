import React, { useState } from 'react';

const App: React.FC = () => {
  const [csvData, setCsvData] = useState<string>('');
  const [jsonData, setJsonData] = useState<any>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
        convertCsvToJson(text);
      };
      reader.readAsText(file);
    }
  };

  const handleUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        setCsvData(text);
        convertCsvToJson(text);
      })
      .catch((error) => console.error('Error fetching CSV from URL:', error));
  };

  const convertCsvToJson = (csv: string) => {
    const lines = csv.split('\n');
    const result: any[] = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentline = lines[i].split(',');

      headers.forEach((header, index) => {
        obj[header.trim()] = currentline[index]?.trim();
      });

      result.push(obj);
    }

    setJsonData(result);
  };

  const copyToClipboard = () => {
    if (jsonData) {
      navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      alert('JSON copied to clipboard!');
    }
  };

  const downloadJson = () => {
    if (jsonData) {
      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min- flex flex-col items-center justify-center p-4`}>
      <button
        className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.005 9.005 0 003 12a9 9 0 0018 0z" />
          </svg>
        )}
      </button>
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Juana’s CSV to JSON Converter</h1>
        <p className="text-lg">Effortlessly convert CSV files to JSON format</p>
      </header>
      <div className="w-full max-w-4xl bg-gray-100 dark:bg-gray-800 rounded-lg p-8 shadow-lg">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Upload CSV File</label>
          <input
            type="file"
            accept=".csv"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFileUpload}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Or Enter CSV URL</label>
          <input
            type="text"
            placeholder="https://example.com/data.csv"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleUrlInput}
          />
        </div>
        {jsonData && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">JSON Output</label>
            <textarea
              value={JSON.stringify(jsonData, null, 2)}
              readOnly
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg h-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={copyToClipboard}
              >
                Copy to Clipboard
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={downloadJson}
              >
                Download JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;