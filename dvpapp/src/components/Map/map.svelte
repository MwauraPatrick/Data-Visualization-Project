<script lang="ts">
  import { onMount, onDestroy, setContext } from 'svelte';
  import L from 'leaflet';

  const key = {};

  // Initialize map context
  setContext(key, {
    getMap: () => map
  });

  // Define props
  export let lat: number;
  export let lon: number;
  export let zoom: number;

  let container: HTMLElement;
  let map: L.Map;

  onMount(() => {
    // Create map when component mounts
    container = document.getElementById('map')!;
    map = L.map(container).setView([lat, lon], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  });

  onDestroy(() => {
    // Remove map when component is destroyed
    if (map) map.remove();
  });
</script>
