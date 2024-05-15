<script>
  import L from 'leaflet';
  import { onMount, onDestroy } from 'svelte';
  import moment from 'moment';
  import { browser } from '$app/environment';
  import { createMap } from './map.js';
  import { summarizeCustomersByGroup, summarizeInventoryByGroup, summarizeForecastByGroup } from './../dataprocessing.js';


  
// Path to the raw image file on GitHub
const locationIconUrl = 'https://raw.githubusercontent.com/MwauraPatrick/Data-Visualization-Project/main/dvpapp/static/pin.png';



  let mapElement;
  let map;
  let showCustomers = true;
  let showInventory = false;
  let showForecast = false;
  let selectedDate = moment('2022-01-31'); // Default date
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
      data.filter(item => item.count >= 2).forEach((item) => {
        const { CustomerCity, PlantKey, count, lat, lon } = item;
        let popupContent = `<b>City: ${CustomerCity}</b><br>Plant Key: ${PlantKey}</b><br>Customer Count: ${count}`;

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

        // Define a custom icon
const customIcon = L.icon({
    iconUrl: locationIconUrl,
    iconSize: [10, 20],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28]
});

// Use the custom icon for markers
L.marker([lat, lon], { icon: customIcon }).addTo(map)

          .bindPopup(popupContent)
          .openPopup();
      });
    }
  }

  onMount(async () => {
    if (browser) {
      map = await createMap(mapElement);
      await updateMarkers();

      // Create a custom control for the reset button
      L.Control.ResetView = L.Control.extend({
        onAdd: function(map) {
          const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
          div.innerHTML = 'Reset';
          div.style.backgroundColor = 'brown';
          div.style.borderRadius = '4px';
          div.style.padding = '5px 10px';
          div.style.cursor = 'pointer';
          div.onclick = function() {
            map.setView([50.8283, 10.5795], 4);
          };
          return div;
        }
      });

      L.control.resetView = function(opts) {
        return new L.Control.ResetView(opts);
      };

      L.control.resetView({ position: 'topright' }).addTo(map); // Add the reset button to the map
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

  function resetView() {
    if (map) {
      map.setView([50.8283, 10.5795], 4);
    }
  }

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
    width: 100%;
  }

  #map {
    height: 100%;
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .leaflet-control-attribution {
    font-size: 12px;
    font-family: Arial, sans-serif;
  }

  .leaflet-control-zoom {
    bottom: 20px;
    right: 20px;
  }

  .leaflet-control-zoom-in, .leaflet-control-zoom-out {
    font-size: 16px;
    line-height: 24px;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    text-align: center;
  }

  .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
    background-color: #f0f0f0;
  }

  .leaflet-control-zoom-in:active, .leaflet-control-zoom-out:active {
    background-color: #e9e9e9;
  }

  
  .leaflet-control-custom {
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    text-align: center;
    line-height: 30px; 
    width: 30px; 
    height: 30px;
    margin-top: 10px;
    margin-right: 10px;
  }
</style>
