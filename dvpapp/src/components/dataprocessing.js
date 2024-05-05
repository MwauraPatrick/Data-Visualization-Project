// dataprocessing.js
import { fetchData, isolateData } from "./data"; // Adjust the path to match your actual file structure

export async function summarizeCustomersByGroup() {
  const fetchedData = await fetchData();
  const customersData = isolateData(fetchedData, "Customers.csv");

  // Group by CustomerCountry, CustomerCity, and PlantKey
  const groupedData = customersData.reduce((acc, customer) => {
    const key = `${customer.CustomerCountry}-${customer.CustomerCity}-${customer.PlantKey}`;
    if (!acc[key]) {
      acc[key] = {
        CustomerCountry: customer.CustomerCountry,
        CustomerCity: customer.CustomerCity,
        PlantKey: customer.PlantKey,
        count: 0,
      };
    }
    acc[key].count++;
    return acc;
  }, {});

  // Convert the grouped data into an array
  const summarizedData = Object.values(groupedData);

  return summarizedData;
}



export async function summarizeInventoryByGroup() {

  const fetchedData = await fetchData();
  const inventoryData = isolateData(fetchedData, "Inventory.csv");
  // Group by MaterialPlantKey, SnapshotDate, and PlantKey and sum the quantities
  const groupedData1 = inventoryData.reduce((acc, invent) => {
    const key = `${invent.MaterialPlantKey}-${invent.SnapshotDate}-${invent.PlantKey}`;
    if (!acc[key]) {
      acc[key] = {
        MaterialPlantKey: invent.MaterialPlantKey,
        Date: invent.SnapshotDate,
        PlantKey: invent.PlantKey,
        GIQ: 0,
        OSQ: 0,
        ITQ: 0,
        count: 0, // Initialize count to 0
      };
    }
    acc[key].GIQ += invent.GrossInventoryQuantity;
    acc[key].OSQ += invent.OnShelfInventoryQuantity;
    acc[key].ITQ += invent.InTransitQuantity;
    acc[key].count++; // Increment count for the group
    return acc; // Make sure to return the accumulator object
  }, {});

  // Convert the grouped data into an array
  const summarizedData1 = Object.values(groupedData1);

  return summarizedData1; // Return the final summarized data array
}
