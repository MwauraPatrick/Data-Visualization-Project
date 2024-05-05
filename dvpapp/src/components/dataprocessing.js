// dataprocessing.js

import { fetchData } from './data'; // Update the path to match your file structure

let fetchedData = [];
let summary = []; // Declare summary here

async function processData() {
  try {
    fetchedData = await fetchData();

    console.log('Fetched data:', fetchedData); // Log the fetched data

    // Find the Customers.csv data
    const customersData = fetchedData.find((data) => data.file === 'Customers.csv');

    if (!customersData) {
      throw new Error('Customers.csv data not found');
    }

    // Group by CustomerCountry, CustomerCity, and PlantKey, and summarize by counts
    let groupedData = customersData.data.reduce((acc, customer) => {
      let key = `${customer.CustomerCountry}-${customer.CustomerCity}-${customer.PlantKey}`;
      acc[key] = acc[key] || [];
      acc[key].push(customer);
      return acc;
    }, {});

    summary = Object.keys(groupedData).map((key) => {
      let [CustomerCountry, CustomerCity, PlantKey] = key.split('-');
      return { CustomerCountry, CustomerCity, PlantKey, count: groupedData[key].length };
    });

    console.log('Summary:', summary); // Log the summary
  } catch (error) {
    console.error('Error:', error);
  }
}

export { summary, processData };
