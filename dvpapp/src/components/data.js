// data.js
import Papa from 'papaparse';

export async function fetchData() {
  const fileNames = ['data/BOM.csv', 'data/Plants.csv']; // Add more file names as needed
  const fetchedData = [];

  for (const fileName of fileNames) {
    const url = `https://raw.githubusercontent.com/JannesPeeters/suncharge/main/${fileName}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${fileName}: ${response.statusText}`);
    }

    const csvData = await response.text();
    const parsedData = Papa.parse(csvData, { skipEmptyLines: true, header: true });

    fetchedData.push({ file: fileName, keys: parsedData.meta.fields });
  }

  return fetchedData;
}

