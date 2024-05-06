// dataProcessing.js

import { fetchData, isolateData } from "./data"; // Adjust the path to match your actual file structure
import { geocode } from "./geoCodes";

async function fetchDataAndIsolateData(fileName) {
  try {
    const fetchedData = await fetchData();
    return isolateData(fetchedData, fileName);
  } catch (error) {
    console.error(`Error fetching and isolating data for ${fileName}:`, error);
    throw error;
  }
}

///////////////////////////////////////////////////////////////////////////////////

import fs from 'fs';

let geocodingCache = new Map();

function loadCacheFromFile() {
  try {
    const cacheData = localStorage.getItem('geocodingCache');
    if (cacheData) {
      geocodingCache = new Map(JSON.parse(cacheData));
    }
  } catch (error) {
    console.error('Error loading cache from localStorage:', error);
  }
}


function saveCacheToFile() {
  try {
    const cacheData = JSON.stringify(Array.from(geocodingCache.entries()));
    localStorage.setItem('geocodingCache', cacheData);
  } catch (error) {
    console.error('Error saving cache to localStorage:', error);
  }
}

export async function summarizeInventoryByGroup() {
  try {
    const inventoryData = await fetchDataAndIsolateData("Inventory.csv");

    // Group by Material Key, SnapshotDate, and PlantKey and sum the quantities
    const groupedData = inventoryData.reduce((acc, invent) => {
      const key = `Inventory-${invent.MaterialKey}-${invent.SnapshotDate}-${invent.PlantKey}`;
      if (!acc[key]) {
        acc[key] = {
          MaterialKey: invent.MaterialKey,
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

////////////////////////////////////////////////////////////////////////////////////////////////////////
async function geocodeCity(city, country) {
  const cacheKey = `${city}-${country}`;

  // Check if the result is cached
  if (geocodingCache.has(cacheKey)) {
    return geocodingCache.get(cacheKey);
  }

  const baseUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=';
  const apiUrl = `${baseUrl}${encodeURIComponent(city)},${encodeURIComponent(country)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    let location;
    if (data.length > 0) {
      location = data[0].lat + ',' + data[0].lon;
      // Cache the result
      geocodingCache.set(cacheKey, location);
      // Save cache to file
      saveCacheToFile();
    } else {
      console.error(`No geocoding results found for ${city}, ${country}`);
      return null; // Return null when no results are found
    }

    return location;
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
    return null;
  }
}

export async function summarizeCustomersByGroup() {
  try {
    const fetchedData = await fetchData();
    const customersData = isolateData(fetchedData, "Customers.csv");

    // Group by CustomerCountry, CustomerCity, and PlantKey
    const groupedData = customersData.reduce(async (accPromise, customer) => {
      const acc = await accPromise;
      const key = `${customer.CustomerCountry}-${customer.CustomerCity}-${customer.PlantKey}`;
      if (!acc[key]) {
        // Geocode the city to get latitude and longitude
        const location = await geocodeCity(customer.CustomerCity, customer.CustomerCountry);
        if (location) {
          const [lat, lon] = location.split(',');
          acc[key] = {
            CustomerCountry: customer.CustomerCountry,
            CustomerCity: customer.CustomerCity,
            PlantKey: customer.PlantKey,
            count: 0,
            latitude: lat,
            longitude: lon
          };
        }
      }
      if (acc[key]) {
        acc[key].count++;
      }
      return acc;
    }, {});

    // Convert the grouped data into an array
    const summarizedData = Object.values(await groupedData);

    return summarizedData;
  } catch (error) {
    console.error("Error summarizing customers:", error);
    throw error;
  }
}

// Load cache from file when the application starts
loadCacheFromFile();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
export async function summarizeCustomersByGroup() {
  try {
    const fetchedData = await fetchData();
    const customersData = isolateData(fetchedData, "Customers.csv");

    // Group by CustomerCountry, CustomerCity, and PlantKey
    const groupedData = customersData.reduce((acc, customer) => {
      const key = `Customer-${customer.CustomerCountry}-${customer.CustomerCity}-${customer.PlantKey}`;
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
  } catch (error) {
    console.error("Error summarizing customers:", error);
    throw error;
  }
}
*/
