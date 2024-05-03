<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { createMap } from './map.js';

  let mapElement;
  let map;

  onMount(async () => {
      if (browser) {
          map = await createMap(mapElement);
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
    height: 600px; /* Adjust height as needed */
    width: 1000px; /* Adjust width as needed */

  }
</style>
