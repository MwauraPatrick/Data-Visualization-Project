// Data processing
import { onMount } from 'svelte';
import { fetchData, isolateData } from './data';

onMount(async () => {
  try {
    const fetchedData = await fetchData();

    // isolate data for Customers.csv and summarize by counts
    const customersData = isolateData(fetchedData, 'Customers.csv');
    const summarizedCustomersData = summarizeDataByCounts(customersData);
    console.log(summarizedCustomersData);
    

    // isolate data for Sales.csv
    const salesData = isolateData(fetchedData, 'Sales.csv');
    console.log(salesData);

    // You can continue processing other files in a similar manner
  } catch (error) {
    console.error(error);
  }
});


export function summarizeDataByCounts(data) {
  // Filter data for Customers.csv
  const filteredData = filterData(data, 'Customers.csv');

  // Group filtered data by CustomerCountry, CustomerCity, and PlantKey and summarize by counts
  const groupedData = filteredData.reduce((acc, row) => {
    const { CustomerCountry, CustomerCity, PlantKey } = row;
    if (!CustomerCountry || !CustomerCity || !PlantKey) {
      return acc; // Skip rows with missing keys
    }

    const key = `${CustomerCountry}-${CustomerCity}-${PlantKey}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Convert grouped data to array of objects
  const summarizedData = Object.entries(groupedData).map(([key, count]) => {
    const [CustomerCountry, CustomerCity, PlantKey] = key.split('-');
    return { CustomerCountry, CustomerCity, PlantKey, Count: count };
  });

  return summarizedData;
}

function filterData(data, file) {
  return data.filter(row => row.file === file);
}


