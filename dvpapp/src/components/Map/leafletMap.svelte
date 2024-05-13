<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { createMap } from './map.js';
  import { summarizeCustomersByGroup, summarizeInventoryByGroup, summarizeForecastByGroup } from './../dataprocessing.js';

  let mapElement;
  let map;
  let showCustomers = true;
  let showInventory = false;
  let showForecast = false;
  let selectedDate = '31/01/2022'; // Default date
  let dateOptions = []; // Array to hold date options

  async function updateMarkers() {
  if (map) {
    let data = [];

    if (showCustomers) {
      const customersData = await summarizeCustomersByGroup();
      data.push(...customersData);
    }

    let inventoryData = [];
    if (showInventory) {
      inventoryData = await summarizeInventoryByGroup(selectedDate);
      data.push(...inventoryData);
    }

    let forecastData = [];
    if (showForecast) {
      forecastData = await summarizeForecastByGroup(selectedDate);
      data.push(...forecastData);
    }

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // markers based on selected data
    data.filter(item => item.count >= 5).forEach((item) => {
      const { CustomerCity, PlantKey, count, lat, lon } = item;
      let popupContent = `<b>${CustomerCity}</b><br>Plant Key: ${PlantKey}</b><br>Customer Count: ${count}`;

      if (showInventory) {
        const inventoryItemsInRange = inventoryData.filter((inventoryItem) => {
          return inventoryItem.PlantKey === item.PlantKey &&
                 inventoryItem.Date === selectedDate;
        });

        if (inventoryItemsInRange.length > 0) {
          const latestInventoryItem = inventoryItemsInRange[0];

          popupContent += `<br>Date: ${latestInventoryItem.Date}<br>Gross Inventory Quantity: ${latestInventoryItem.GIQ}<br>On Shelf Inventory Quantity: ${latestInventoryItem.OSQ}<br>In Transit Quantity: ${latestInventoryItem.ITQ}`;
        }
      }

      if (showForecast) {
        const forecastItemsInRange = forecastData.filter((forecastItem) => {
          return forecastItem.PlantKey === item.PlantKey &&
                 forecastItem.Date === selectedDate;
        });

        if (forecastItemsInRange.length > 0) {
          const latestForecastItem = forecastItemsInRange[0];

          popupContent += `<br>Date: ${latestForecastItem.Date}<br>Forecast Quantity: ${latestForecastItem.FQ}`;
        }
      }

      L.marker([lat, lon]).addTo(map)
        .bindPopup(popupContent)
        .openPopup();
    });
  }
}


  onMount(async () => {
    if (browser) {
      map = await createMap(mapElement);
      await updateMarkers();
    }
  });

  onDestroy(async () => {
    if (map) {
      console.log('Unloading Leaflet map.');
      map.remove();
    }
  });

  // Function to update markers when date is changed
  function handleDateChange(event) {
  selectedDate = event.target.value;
  updateMarkers();
}


  async function fetchDateOptions() {
    try {
      // Fetch all unique dates from inventory and forecast data
      const inventoryDates = (await summarizeInventoryByGroup()).map(item => item.Date);
      const forecastDates = (await summarizeForecastByGroup()).map(item => item.Date);
      dateOptions = [...new Set([...inventoryDates, ...forecastDates])].sort().reverse();
    } catch (error) {
      console.error("Error fetching date options:", error);
    }
  }

  fetchDateOptions(); // Fetch date options on component mount
</script>

<main>
  <div class="input-group">
    <label>
      <input type="checkbox" bind:checked={showCustomers} on:change={updateMarkers} /> Customers
    </label>
    <label>
      <input type="checkbox" bind:checked={showForecast} on:change={updateMarkers} /> Forecast
    </label>
    <label>
      <input type="checkbox" bind:checked={showInventory} on:change={updateMarkers} /> Inventory
    </label>
    <label for="selectedDate">Select Date:</label>
    <select id="selectedDate" bind:value={selectedDate} on:change={handleDateChange}>
      {#each dateOptions as date}
        <option value={date}>{date}</option>
      {/each}
    </select>
  </div>
  <div bind:this={mapElement}></div>
</main>

<style>
  @import 'leaflet/dist/leaflet.css';
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0;
    padding: 0;
  }

  .input-group {
    align-items: center;
    margin: 0;
    padding: 0;
    height: 20px;
    margin-bottom: 10px;
  }

  .input-group label {
    margin-right: 10px;
  }

  main div {
    height: 600px;
    width: 800px;
  }
</style>
