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
  let startDate = '31/01/2022'; 
  let endDate = '31/01/2022'; 

  async function updateMarkers() {
    if (map) {
      let data = [];

      if (showCustomers) {
        const customersData = await summarizeCustomersByGroup();
        data.push(...customersData);
      }

      let inventoryData = [];
      if (showInventory) {
        inventoryData = await summarizeInventoryByGroup(startDate, endDate);
        data.push(...inventoryData);
      }

      let forecastData = [];
      if (showForecast) {
        forecastData = await summarizeForecastByGroup(startDate, endDate);
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
        const { CustomerCity,PlantKey ,count, lat, lon } = item;
        let popupContent = `<b>${CustomerCity}</b><br>Plant Key: ${PlantKey}</b><br>Customer Count: ${count}`;

        if (showInventory) {
  const inventoryItemsInRange = inventoryData.filter((inventoryItem) => {
    return inventoryItem.PlantKey === item.PlantKey &&
           inventoryItem.Date >= startDate && 
           inventoryItem.Date <= endDate;
  });

  if (inventoryItemsInRange.length > 0) {
    const latestInventoryItem = inventoryItemsInRange.reduce((prev, current) => (prev.Date > current.Date) ? prev : current);

    popupContent += `<br>Date: ${latestInventoryItem.Date}<br>Gross Inventory Quantity: ${latestInventoryItem.GIQ}<br>On Shelf Inventory Quantity: ${latestInventoryItem.OSQ}<br>In Transit Quantity: ${latestInventoryItem.ITQ}`;
  }
}

if (showForecast) {
  const forecastItemsInRange = forecastData.filter((forecastItem) => {
    return forecastItem.PlantKey === item.PlantKey &&
           forecastItem.Date >= startDate && 
           forecastItem.Date <= endDate;
  });

  if (forecastItemsInRange.length > 0) {
    const latestForecastItem = forecastItemsInRange.reduce((prev, current) => (prev.Date > current.Date) ? prev : current);

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
    <label for="startDate">Start Date:</label>
    <input id="startDate" type="date" bind:value={startDate} on:change={updateMarkers} />
    <label for="endDate">End Date:</label>
    <input id="endDate" type="date" bind:value={endDate} on:change={updateMarkers} />
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
