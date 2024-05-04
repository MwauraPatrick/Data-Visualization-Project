// data.js
import Papa from 'papaparse';

export async function fetchData() {
  const fileNames = [
    'BOM.csv',
    'Plants.csv',
    'Customers.csv',
    'Forecast.csv', 
    'Inventory.csv',
    'MaterialPlantRelation.csv',
    'Materials.csv',
    'Plants.csv',
    'Purchases.csv',
    'Sales.csv',
    'Vendors.csv']; 
  const fetchedData = [];

  for (const fileName of fileNames) {
    const url = `https://raw.githubusercontent.com/JannesPeeters/suncharge/main/data/${fileName}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${fileName}: ${response.statusText}`);
    }

    const csvData = await response.text();
    const parsedData = Papa.parse(csvData, { skipEmptyLines: true, header: true });

    const nonEmptyKeys = parsedData.meta.fields.filter(key => key.trim() !== '');
    fetchedData.push({ file: fileName, keys: nonEmptyKeys });
  }

  return fetchedData;
}

export function isolateData(fetchedData, fileName) {
  // Find the entry for the specified file name
  const dataEntry = fetchedData.find(entry => entry.file === fileName);

  if (!dataEntry) {
    throw new Error(`${fileName} data not found in fetched data`);
  }

  return dataEntry.data;
}

