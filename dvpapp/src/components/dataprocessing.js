// dataProcessing.js

import { fetchData, isolateData } from "./data"; // Adjust the path to match your actual file structure


async function fetchDataAndIsolateData(fileName) {
  try {
    const fetchedData = await fetchData();
    return isolateData(fetchedData, fileName);
  } catch (error) {
    console.error(`Error fetching and isolating data for ${fileName}:`, error);
    throw error;
  }
}


//////////////////////////////////////////////////////////////////////////////////
export async function summarizeCustomersByGroup() {
  try {
    const fetchedData = await fetchData();
    const customersData = isolateData(fetchedData, "Customers.csv");
    const geocodedCustomersData = isolateData(fetchedData, "geocoded_customers.csv");

    // Group by CustomerCountry, CustomerCity, and PlantKey
    const groupedData = customersData.reduce((acc, customer) => {
      const key = `Customer-${customer.CustomerCountry}-${customer.CustomerCity}-${customer.PlantKey}`;
      if (!acc[key]) {
        acc[key] = {
          CustomerCountry: customer.CustomerCountry,
          CustomerCity: customer.CustomerCity,
          PlantKey: customer.PlantKey,
          count: 0,
          lat: null,
          lon: null,
        };
      }
      acc[key].count++;
      return acc;
    }, {});

    // Update the grouped data with geocodes
    geocodedCustomersData.forEach((geoCustomer) => {
      const key = `Customer-${geoCustomer.CustomerCountry}-${geoCustomer.CustomerCity}-${geoCustomer.PlantKey}`;
      if (groupedData[key]) {
        groupedData[key].lat = geoCustomer.lat;
        groupedData[key].lon = geoCustomer.lon;
      }
    });

    // Convert the grouped data into an array
    const summarizedData = Object.values(groupedData);

    return summarizedData;
  } catch (error) {
    console.error("Error summarizing customers:", error);
    throw error;
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function summarizeInventoryByGroup() {
  try {
    const inventoryData = await fetchDataAndIsolateData("Inventory.csv");

    // Group by Material Key, SnapshotDate, and PlantKey and sum the quantities
    const groupedData = inventoryData.reduce((acc, invent) => {
      const key = `Inventory-${invent.SnapshotDate}-${invent.PlantKey}`;
      if (!acc[key]) {
        acc[key] = {
          Date: invent.SnapshotDate,
          PlantKey: invent.PlantKey,
          GIQ: 0,
          OSQ: 0,
          ITQ: 0,
          count: 0,
        };
      }
      acc[key].GIQ += parseFloat(invent.GrossInventoryQuantity);
      acc[key].OSQ += parseFloat(invent.OnShelfInventoryQuantity);
      acc[key].ITQ += parseFloat(invent.InTransitQuantity);
      acc[key].count++;
      return acc;
    }, {});

    // Convert the grouped data into an array
    return Object.values(groupedData);
  } catch (error) {
    console.error("Error summarizing inventory:", error);
    throw error;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function summarizeForecastByGroup() {
  try {
    const forecastData = await fetchDataAndIsolateData("Forecast.csv");

    // Group by RequestedDeliveryMonth PlantKey Quantity
    const groupedforeData = forecastData.reduce((acc, fore) => {
      const key = `Forecast-${fore.RequestedDeliveryMonth}-${fore.PlantKey}`;
      if (!acc[key]) {
        acc[key] = {
          Date: fore.RequestedDeliveryMonth,
          PlantKey: fore.PlantKey,
          FQ: 0,
          count: 0,
        };
      }
      acc[key].FQ += parseFloat(fore.Quantity);
      acc[key].count++;
      return acc;
    }, {});

    // Convert the grouped data into an array
    return Object.values(groupedforeData);
  } catch (error) {
    console.error("Error summarizing inventory:", error);
    throw error;
  }
}


////////////////////////////////////////////////////////////////////////////////////////////

export async function leftJoinDataWithCoordinates() {
  try {
    const inventorySummaries = await summarizeInventoryByGroup();
    const forecastSummaries = await summarizeForecastByGroup();
    const plantData = await fetchDataAndIsolateData("Plants.csv");

    // Create a map of PlantKey to coordinates
    const plantCoordinates = plantData.reduce((acc, plant) => {
      acc[plant.PlantKey] = { lat: plant.lat, lon: plant.lon };
      return acc;
    }, {});

    // Merge the inventory and forecast datasets
    const mergedData = inventorySummaries.map((inventory) => {
      const matchingForecast = forecastSummaries.find((forecast) => {
        return inventory.Date === forecast.Date && inventory.PlantKey === forecast.PlantKey;
      });
      return { ...inventory, ...matchingForecast, ...plantCoordinates[inventory.PlantKey] };
    });

    return mergedData;
  } catch (error) {
    console.error("Error merging datasets:", error);
    throw error;
  }
}
