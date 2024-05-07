<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { createMap } from './map.js';
  import { summarizeCustomersByGroup ,leftJoinDataWithCoordinates } from './../dataprocessing.js';
  
  let mapElement;
  let map;
  let selectedData = "customers"; // Default selected data

  async function updateMarkers() {
    if (map) {
      let data;
      if (selectedData === "customers") {
        data = await summarizeCustomersByGroup();
      } else if (selectedData === "inventory") {
        data = await leftJoinDataWithCoordinates(); // Assuming this function fetches and merges inventory data
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
        L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${CustomerCity}</b><br>Customer Count: ${count}`)
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
  <div bind:this={mapElement}></div>
  <select bind:value={selectedData} on:change={updateMarkers}>
    <option value="customers">Customers</option>
    <option value="inventory">Inventory</option>
  </select>
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
