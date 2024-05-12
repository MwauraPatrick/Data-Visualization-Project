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
async function updateMarkers() {
  if (map) {
    let data = [];

    if (showCustomers) {
      const customersData = await summarizeCustomersByGroup();
      data.push(...customersData);
    }

    if (showInventory) {
      const inventoryData = await summarizeInventoryByGroup();
      data.push(...inventoryData);
    }

    if (showForecast) {
      const forecastData = await summarizeForecastByGroup();
      data.push(...forecastData);
    }

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers based on selected data
    data.filter(item => item.count >= 5).forEach((item) => {
      const { CustomerCity, count, lat, lon } = item;
      let popupContent = `<b>${CustomerCity}</b><br>Customer Count: ${count}`;

      if (showInventory) {
        popupContent += `<br>Gross Inventory Quantity: ${item.GIQ}<br>On Shelf Inventory Quantity: ${item.OSQ}<br>In Transit Quantity: ${item.ITQ}`;
      }

      if (showForecast) {
        popupContent += `<br>Forecast Quantity: ${item.FQ}`;
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
  <label>
    <input type="checkbox" bind:checked={showCustomers} on:change={updateMarkers} /> Customers
  </label>
  <label>
    <input type="checkbox" bind:checked={showInventory} on:change={updateMarkers} /> Inventory
  </label>
  <label>
    <input type="checkbox" bind:checked={showForecast} on:change={updateMarkers} /> Forecast
  </label>
  <div bind:this={mapElement}></div>
  
</main>

<style>
  @import 'leaflet/dist/leaflet.css';
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  main div {
    height: 600px;
    width: 800px;
  }
</style>
