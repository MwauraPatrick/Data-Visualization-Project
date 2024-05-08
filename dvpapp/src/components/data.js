// data.js

import Papa from "papaparse";

export async function fetchData() {
  const fileNames = [
    "BOM.csv",
    "Customers.csv",
    "Forecast.csv",
    "Inventory.csv",
    "Plants.csv",
    "MaterialPlantRelation.csv",
    "Materials.csv",
    "Purchases.csv",
    "Sales.csv",
    "Vendors.csv",
    "geocoded_plants.csv",
    "geocoded_customers.csv"
  ];
  const fetchedData = [];

  for (const fileName of fileNames) { 
    const url = `https://raw.githubusercontent.com/MwauraPatrick/Data-Visualization-Project/main/dvpapp/src/lib/data/${fileName}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data for ${fileName}: ${response.statusText}`
      );
    }

    const csvData = await response.text();
    const parsedData = Papa.parse(csvData, {
      skipEmptyLines: true,
      header: true,
    });

    const nonEmptyKeys = parsedData.meta.fields.filter(
      (key) => key.trim() !== ""
    );

    // Include file name, variable names, and data
    fetchedData.push({
      file: fileName,
      keys: nonEmptyKeys,
      data: parsedData.data, // Entire parsed data (including headers)
    });
  }

  return fetchedData;
}

export function isolateData(fetchedData, fileName) {
  // Find the entry for the specified file name
  const dataEntry = fetchedData.find((entry) => entry.file === fileName);

  if (!dataEntry) {
    throw new Error(`${fileName} data not found in fetched data`);
  }

  return dataEntry.data;
}
