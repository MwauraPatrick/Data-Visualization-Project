
// Leaflet map script
<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { createMap } from './map.js';
  import { summarizeCustomersByGroup } from './../dataprocessing.js';

  let mapElement;
  let map;

  onMount(async () => {
    if (browser) {
      map = await createMap(mapElement);
      const customers = await summarizeCustomersByGroup();

      customers.filter(customer => customer.count >= 5).forEach((customer) => {
        const { CustomerCity, count, lat, lon } = customer;
        L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${CustomerCity}</b><br>Customer No.: ${count}`)
          .openPopup();
      });
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
</main>

<style>
  @import 'leaflet/dist/leaflet.css';
  main {
    display: flex;
    justify-content: right;
    align-items: center;
    margin: 0px;
  }
  main div {
    height: 800px; /* Adjust height as needed */
    width: 800px; /* Adjust width as needed */
  }
</style>
