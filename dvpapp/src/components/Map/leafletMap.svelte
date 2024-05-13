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
  let startDate = '2024-01-01'; 
  let endDate = '2024-01-01'; 

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
        const { CustomerCity, count, lat, lon } = item;
        let popupContent = `<b>${CustomerCity}</b><br>Customer Count: ${count}`;

        if (showInventory) {
          inventoryData.forEach((inventoryItem) => {
            if (inventoryItem.PlantKey === item.PlantKey) {
              popupContent += `<br>Gross Inventory Quantity: ${inventoryItem.GIQ}<br>On Shelf Inventory Quantity: ${inventoryItem.OSQ}<br>In Transit Quantity: ${inventoryItem.ITQ}`;
            }
          });
        }

        if (showForecast) {
          forecastData.forEach((forecastItem) => {
            if (forecastItem.PlantKey === item.PlantKey) {
              popupContent += `<br>Forecast Quantity: ${forecastItem.FQ}`;
            }
          });
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
