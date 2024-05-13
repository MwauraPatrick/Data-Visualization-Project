// dataProcessing.js


import { fetchData, isolateData } from "./data"; 


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

    // grouped data with geocodes
    geocodedCustomersData.forEach((geoCustomer) => {
      const key = `Customer-${geoCustomer.CustomerCountry}-${geoCustomer.CustomerCity}-${geoCustomer.PlantKey}`;
      if (groupedData[key]) {
        groupedData[key].lat = geoCustomer.lat;
        groupedData[key].lon = geoCustomer.lon;
      }
    });

    // grouped data into an array
    const summarizedData = Object.values(groupedData);

    return summarizedData;
  } catch (error) {
    console.error("Error summarizing customers:", error);
    throw error;
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import moment from 'moment';

export async function summarizeInventoryByGroup() {
  try {
    const inventoryData = await fetchDataAndIsolateData("Inventory.csv");
    const customersData = await fetchDataAndIsolateData("Customers.csv");

    // Group by Material Key, SnapshotDate, and PlantKey and sum the quantities
    const groupedData = inventoryData.reduce((acc, invent) => {
      const key = `Inventory-${invent.SnapshotDate}-${invent.PlantKey}`;
      if (!acc[key]) {
        acc[key] = {
          Date: moment(invent.SnapshotDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
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

    // Match PlantKey from customersData
    customersData.forEach((customer) => {
      const key = `Inventory-${customer.PlantKey}`;
      if (groupedData[key]) {
        groupedData[key].CustomerCity = customer.CustomerCity;
      }
    });

    // grouped data into an array
    return Object.values(groupedData);
  } catch (error) {
    console.error("Error summarizing inventory:", error);
    throw error;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////


export async function summarizeForecastByGroup() {
  try {
    const forecastData = await fetchDataAndIsolateData("Forecast.csv");
    const customersData = await fetchDataAndIsolateData("Customers.csv");

    // Group by RequestedDeliveryMonth PlantKey Quantity
    const groupedforeData = forecastData.reduce((acc, fore) => {
      const key = `Forecast-${fore.RequestedDeliveryMonth}-${fore.PlantKey}`;
      if (!acc[key]) {
        acc[key] = {
          Date: fore.RequestedDeliveryMonth,
          PlantKey: fore.PlantKey,
          FQ: 0, // FQ is initialized
          count: 0,
        };
      }

      // Match PlantKey from customersData
      customersData.forEach((customer) => {
        if (customer.PlantKey === fore.PlantKey) {
          acc[key].CustomerCity = customer.CustomerCity;
        }
      });

      acc[key].FQ += parseFloat(fore.Quantity);
      acc[key].count++;

      return acc;
    }, {});

    // Convert the grouped data into an array
    const summarizedData = Object.values(groupedforeData);
    console.log("Summarized Forecast Data:", summarizedData);
    return summarizedData;
  } catch (error) {
    console.error("Error summarizing forecast:", error);
    throw error;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
export async function fullJoinDataWithCoordinates() {
  try {
    const inventorySummaries = await summarizeInventoryByGroup();
    const forecastSummaries = await summarizeForecastByGroup();
    const plantData = await fetchDataAndIsolateData("geocoded_plants.csv");

    const plantCoordinates = plantData.reduce((acc, plant) => {
      acc[plant.PlantKey] = { lat: plant.lat, lon: plant.lon };
      return acc;
    }, {});

    const allDates = new Set([...inventorySummaries.map(item => item.Date), ...forecastSummaries.map(item => item.Date)]);
    const allPlantKeys = new Set([...inventorySummaries.map(item => item.PlantKey), ...forecastSummaries.map(item => item.PlantKey)]);

    const mergedData = [];
    for (const date of allDates) {
      for (const plantKey of allPlantKeys) {
        const inventory = inventorySummaries.find(item => item.Date === date && item.PlantKey === plantKey);
        const forecast = forecastSummaries.find(item => item.Date === date && item.PlantKey === plantKey);

        const mergedItem = {
          Date: date,
          PlantKey: plantKey,
          GIQ: inventory?.GIQ || "NA",
          OSQ: inventory?.OSQ || "NA",
          ITQ: inventory?.ITQ || "NA",
          FQ: forecast?.FQ || "NA",
          ...plantCoordinates[plantKey]
        };

        mergedData.push(mergedItem);
      }
    }

    return mergedData;
  } catch (error) {
    console.error("Error merging datasets:", error);
    throw error;
  }
}
