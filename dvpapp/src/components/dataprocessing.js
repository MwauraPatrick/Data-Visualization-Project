// Data processing
import { fetchData } from './data';
import { isolateData, summarizeDataByCounts } from './data';

(async () => {
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
})();




export function summarizeDataByCounts(data) {
  // Filter data for Customers.csv
  const filteredData = data.filter(row => row.file === 'Customers.csv');

  // Group filtered data by CustomerCountry, CustomerCity, and PlantKey and summarize by counts
  const groupedData = filteredData.reduce((acc, row) => {
    const key = `${row.CustomerCountry}-${row.CustomerCity}-${row.PlantKey}`;
    if (!acc[key]) {
      acc[key] = 1;
    } else {
      acc[key]++;
    }
    return acc;
  }, {});

  // Convert grouped data to array of objects
  const summarizedData = Object.entries(groupedData).map(([key, count]) => {
    const [CustomerCountry, CustomerCity, PlantKey] = key.split('-');
    return { CustomerCountry, CustomerCity, PlantKey, Count: count };
  });

  return summarizedData;
}
