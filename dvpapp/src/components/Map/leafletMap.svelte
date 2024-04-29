<!-- leafletMap.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import L from 'leaflet';

  export let lat;
  export let lon;
  export let zoom;

  let map;

  onMount(() => {
    // Create a Leaflet map
    map = L.map('map').setView([lat, lon], zoom);

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  });
</script>

<div id="map" style="width: 100%; height: 400px;"></div>

<style>
  #map {
    height: 100%;
  }
</style>
