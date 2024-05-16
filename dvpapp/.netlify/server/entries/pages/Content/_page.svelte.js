import { c as create_ssr_component, o as onDestroy, b as add_attribute, f as each, e as escape, s as subscribe, v as validate_component } from "../../../chunks/ssr.js";
import "leaflet";
import Papa from "papaparse";
import moment from "moment";
import { Chart } from "chart.js/auto";
import { LineElement, LinearScale, PointElement, Title, Tooltip, BarElement, CategoryScale } from "chart.js";
import "chartjs-adapter-moment";
import { w as writable } from "../../../chunks/index.js";
async function fetchData() {
  const fileNames = [
    "BOM.csv",
    "Customers.csv",
    "Forecast.csv",
    "Inventory.csv",
    "Plants.csv",
    "MaterialPlantRelation.csv",
    "Materials.csv",
    "Purchases.csv",
    "Sales.csv",
    "Vendors.csv",
    "geocoded_plants.csv",
    "geocoded_customers.csv"
  ];
  const fetchedData = [];
  for (const fileName of fileNames) {
    const url = `https://raw.githubusercontent.com/MwauraPatrick/Data-Visualization-Project/main/dvpapp/src/lib/data/${fileName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data for ${fileName}: ${response.statusText}`
      );
    }
    const csvData = await response.text();
    const parsedData = Papa.parse(csvData, {
      skipEmptyLines: true,
      header: true
    });
    const nonEmptyKeys = parsedData.meta.fields.filter(
      (key) => key.trim() !== ""
    );
    fetchedData.push({
      file: fileName,
      keys: nonEmptyKeys,
      data: parsedData.data
      // Entire parsed data (including headers)
    });
  }
  return fetchedData;
}
function isolateData(fetchedData, fileName) {
  const dataEntry = fetchedData.find((entry) => entry.file === fileName);
  if (!dataEntry) {
    throw new Error(`${fileName} data not found in fetched data`);
  }
  return dataEntry.data;
}
async function fetchDataAndIsolateData(fileName) {
  try {
    const fetchedData = await fetchData();
    return isolateData(fetchedData, fileName);
  } catch (error) {
    console.error(`Error fetching and isolating data for ${fileName}:`, error);
    throw error;
  }
}
async function summarizeInventoryByGroup() {
  try {
    const inventoryData = await fetchDataAndIsolateData("Inventory.csv");
    const customersData = await fetchDataAndIsolateData("Customers.csv");
    const groupedData = inventoryData.reduce((acc, invent) => {
      const key = `Inventory-${invent.SnapshotDate}-${invent.PlantKey}`;
      if (!acc[key]) {
        acc[key] = {
          Date: moment(invent.SnapshotDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
          PlantKey: invent.PlantKey,
          GIQ: 0,
          OSQ: 0,
          ITQ: 0,
          count: 0
        };
      }
      acc[key].GIQ += parseFloat(invent.GrossInventoryQuantity);
      acc[key].OSQ += parseFloat(invent.OnShelfInventoryQuantity);
      acc[key].ITQ += parseFloat(invent.InTransitQuantity);
      acc[key].count++;
      return acc;
    }, {});
    customersData.forEach((customer) => {
      const key = `Inventory-${customer.PlantKey}`;
      if (groupedData[key]) {
        groupedData[key].CustomerCity = customer.CustomerCity;
      }
    });
    return Object.values(groupedData);
  } catch (error) {
    console.error("Error summarizing inventory:", error);
    throw error;
  }
}
async function summarizeForecastByGroup() {
  try {
    const forecastData = await fetchDataAndIsolateData("Forecast.csv");
    const customersData = await fetchDataAndIsolateData("Customers.csv");
    const groupedforeData = forecastData.reduce((acc, fore) => {
      const key = `Forecast-${fore.RequestedDeliveryMonth}-${fore.PlantKey}`;
      if (!acc[key]) {
        acc[key] = {
          Date: fore.RequestedDeliveryMonth,
          PlantKey: fore.PlantKey,
          FQ: 0,
          // FQ is initialized
          count: 0
        };
      }
      customersData.forEach((customer) => {
        if (customer.PlantKey === fore.PlantKey) {
          acc[key].CustomerCity = customer.CustomerCity;
        }
      });
      acc[key].FQ += parseFloat(fore.Quantity);
      acc[key].count++;
      return acc;
    }, {});
    const summarizedData = Object.values(groupedforeData);
    return summarizedData;
  } catch (error) {
    console.error("Error summarizing forecast:", error);
    throw error;
  }
}
const css$1 = {
  code: "@import 'leaflet/dist/leaflet.css';main.svelte-fzm0zb.svelte-fzm0zb{display:flex;flex-direction:column;align-items:center;margin-top:0;padding:0}.input-group.svelte-fzm0zb.svelte-fzm0zb{align-items:center;margin:0;padding:0;height:20px;margin-bottom:10px}.input-group.svelte-fzm0zb label.svelte-fzm0zb{margin-right:10px}main.svelte-fzm0zb div.svelte-fzm0zb{height:600px;width:100%}",
  map: `{"version":3,"file":"leafletMap.svelte","sources":["leafletMap.svelte"],"sourcesContent":["<script>\\r\\n  import L from 'leaflet';\\r\\n  import { onMount, onDestroy } from 'svelte';\\r\\n  import { browser } from '$app/environment';\\r\\n  import { createMap } from './map.js';\\r\\n  import { summarizeCustomersByGroup, summarizeInventoryByGroup, summarizeForecastByGroup } from './../dataprocessing.js';\\r\\n\\r\\n  let mapElement;\\r\\n  let map;\\r\\n  let showCustomers = true;\\r\\n  let showInventory = false;\\r\\n  let showForecast = false;\\r\\n  let selectedDate = '31/01/2022'; // Default date\\r\\n  let dateOptions = []; // Array to hold date options\\r\\n\\r\\n  async function updateMarkers() {\\r\\n    if (map) {\\r\\n      let data = [];\\r\\n\\r\\n      if (showCustomers) {\\r\\n        const customersData = await summarizeCustomersByGroup();\\r\\n        data.push(...customersData);\\r\\n      }\\r\\n\\r\\n      let inventoryData = [];\\r\\n      if (showInventory) {\\r\\n        inventoryData = await summarizeInventoryByGroup(selectedDate);\\r\\n        data.push(...inventoryData);\\r\\n      }\\r\\n\\r\\n      let forecastData = [];\\r\\n      if (showForecast) {\\r\\n        forecastData = await summarizeForecastByGroup(selectedDate);\\r\\n        data.push(...forecastData);\\r\\n      }\\r\\n\\r\\n      // Clear existing markers\\r\\n      map.eachLayer((layer) => {\\r\\n        if (layer instanceof L.Marker) {\\r\\n          map.removeLayer(layer);\\r\\n        }\\r\\n      });\\r\\n\\r\\n      // markers based on selected data\\r\\n      data.filter(item => item.count >= 2).forEach((item) => {\\r\\n        const { CustomerCity, PlantKey, count, lat, lon } = item;\\r\\n        let popupContent = \`<b>City: \${CustomerCity}</b><br>Plant Key: \${PlantKey}</b><br>Customer Count: \${count}\`;\\r\\n\\r\\n        if (showInventory) {\\r\\n          const inventoryItemsInRange = inventoryData.filter((inventoryItem) => {\\r\\n            return inventoryItem.PlantKey === item.PlantKey &&\\r\\n                   inventoryItem.Date === selectedDate;\\r\\n          });\\r\\n\\r\\n          if (inventoryItemsInRange.length > 0) {\\r\\n            const latestInventoryItem = inventoryItemsInRange[0];\\r\\n\\r\\n            popupContent += \`<br>Date: \${latestInventoryItem.Date}<br>Gross Inventory Quantity: \${latestInventoryItem.GIQ}<br>On Shelf Inventory Quantity: \${latestInventoryItem.OSQ}<br>In Transit Quantity: \${latestInventoryItem.ITQ}\`;\\r\\n          }\\r\\n        }\\r\\n\\r\\n        if (showForecast) {\\r\\n          const forecastItemsInRange = forecastData.filter((forecastItem) => {\\r\\n            return forecastItem.PlantKey === item.PlantKey &&\\r\\n                   forecastItem.Date === selectedDate;\\r\\n          });\\r\\n\\r\\n          if (forecastItemsInRange.length > 0) {\\r\\n            const latestForecastItem = forecastItemsInRange[0];\\r\\n\\r\\n            popupContent += \`<br>Date: \${latestForecastItem.Date}<br>Forecast Quantity: \${latestForecastItem.FQ}\`;\\r\\n          }\\r\\n        }\\r\\n\\r\\n        L.marker([lat, lon]).addTo(map)\\r\\n          .bindPopup(popupContent)\\r\\n          .openPopup();\\r\\n      });\\r\\n    }\\r\\n  }\\r\\n\\r\\n  onMount(async () => {\\r\\n    if (browser) {\\r\\n      map = await createMap(mapElement);\\r\\n      await updateMarkers();\\r\\n\\r\\n      // Create a custom control for the reset button\\r\\n      L.Control.ResetView = L.Control.extend({\\r\\n        onAdd: function(map) {\\r\\n          const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');\\r\\n          div.innerHTML = 'Reset';\\r\\n          div.style.backgroundColor = 'white';\\r\\n          div.style.borderRadius = '4px';\\r\\n          div.style.padding = '5px 10px';\\r\\n          div.style.cursor = 'pointer';\\r\\n          div.onclick = function() {\\r\\n            map.setView([50.8283, 10.5795], 4);\\r\\n          };\\r\\n          return div;\\r\\n        }\\r\\n      });\\r\\n\\r\\n      L.control.resetView = function(opts) {\\r\\n        return new L.Control.ResetView(opts);\\r\\n      };\\r\\n\\r\\n      L.control.resetView({ position: 'topright' }).addTo(map); // Add the reset button to the map\\r\\n    }\\r\\n  });\\r\\n\\r\\n  onDestroy(async () => {\\r\\n    if (map) {\\r\\n      console.log('Unloading Leaflet map.');\\r\\n      map.remove();\\r\\n    }\\r\\n  });\\r\\n\\r\\n  // Function to update markers when date is changed\\r\\n  function handleDateChange(event) {\\r\\n    selectedDate = event.target.value;\\r\\n    updateMarkers();\\r\\n  }\\r\\n\\r\\n  async function fetchDateOptions() {\\r\\n    try {\\r\\n      // Fetch all unique dates from inventory and forecast data\\r\\n      const inventoryDates = (await summarizeInventoryByGroup()).map(item => item.Date);\\r\\n      const forecastDates = (await summarizeForecastByGroup()).map(item => item.Date);\\r\\n      dateOptions = [...new Set([...inventoryDates, ...forecastDates])].sort().reverse();\\r\\n    } catch (error) {\\r\\n      console.error(\\"Error fetching date options:\\", error);\\r\\n    }\\r\\n  }\\r\\n\\r\\n  fetchDateOptions(); // Fetch date options on component mount\\r\\n\\r\\n  function resetView() {\\r\\n    if (map) {\\r\\n      map.setView([50.8283, 10.5795], 4);\\r\\n    }\\r\\n  }\\r\\n\\r\\n<\/script>\\r\\n\\r\\n<main>\\r\\n  <div class=\\"input-group\\">\\r\\n    <label>\\r\\n      <input type=\\"checkbox\\" bind:checked={showCustomers} on:change={updateMarkers} /> Customers\\r\\n    </label>\\r\\n    <label>\\r\\n      <input type=\\"checkbox\\" bind:checked={showForecast} on:change={updateMarkers} /> Forecast\\r\\n    </label>\\r\\n    <label>\\r\\n      <input type=\\"checkbox\\" bind:checked={showInventory} on:change={updateMarkers} /> Inventory\\r\\n    </label>\\r\\n    <label for=\\"selectedDate\\">Select Date:</label>\\r\\n    <select id=\\"selectedDate\\" bind:value={selectedDate} on:change={handleDateChange}>\\r\\n      {#each dateOptions as date}\\r\\n        <option value={date}>{date}</option>\\r\\n      {/each}\\r\\n    </select>\\r\\n  </div>\\r\\n  <div bind:this={mapElement}></div>\\r\\n</main>\\r\\n\\r\\n\\r\\n<style>\\r\\n  @import 'leaflet/dist/leaflet.css';\\r\\n  main {\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    align-items: center;\\r\\n    margin-top: 0;\\r\\n    padding: 0;\\r\\n  }\\r\\n\\r\\n  .input-group {\\r\\n    align-items: center;\\r\\n    margin: 0;\\r\\n    padding: 0;\\r\\n    height: 20px;\\r\\n    margin-bottom: 10px;\\r\\n  }\\r\\n\\r\\n  .input-group label {\\r\\n    margin-right: 10px;\\r\\n  }\\r\\n\\r\\n  main div {\\r\\n    height: 600px;\\r\\n    width: 100%;\\r\\n  }\\r\\n\\r\\n  #map {\\r\\n    height: 100%;\\r\\n    width: 100%;\\r\\n    border-radius: 10px;\\r\\n    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\\r\\n  }\\r\\n\\r\\n  .leaflet-control-attribution {\\r\\n    font-size: 12px;\\r\\n    font-family: Arial, sans-serif;\\r\\n  }\\r\\n\\r\\n  .leaflet-control-zoom {\\r\\n    bottom: 20px;\\r\\n    right: 20px;\\r\\n  }\\r\\n\\r\\n  .leaflet-control-zoom-in, .leaflet-control-zoom-out {\\r\\n    font-size: 16px;\\r\\n    line-height: 24px;\\r\\n    width: 30px;\\r\\n    height: 30px;\\r\\n    border-radius: 5px;\\r\\n    background-color: #fff;\\r\\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\\r\\n    cursor: pointer;\\r\\n    text-align: center;\\r\\n  }\\r\\n\\r\\n  .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {\\r\\n    background-color: #f0f0f0;\\r\\n  }\\r\\n\\r\\n  .leaflet-control-zoom-in:active, .leaflet-control-zoom-out:active {\\r\\n    background-color: #e9e9e9;\\r\\n  }\\r\\n\\r\\n  \\r\\n  .leaflet-control-custom {\\r\\n    background-color: #fff;\\r\\n    border-radius: 50%;\\r\\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\\r\\n    cursor: pointer;\\r\\n    text-align: center;\\r\\n    line-height: 30px; \\r\\n    width: 30px; \\r\\n    height: 30px;\\r\\n    margin-top: 10px;\\r\\n    margin-right: 10px;\\r\\n  }\\r\\n</style>\\r\\n"],"names":[],"mappings":"AAuKE,QAAQ,0BAA0B,CAClC,gCAAK,CACH,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,CAAC,CACb,OAAO,CAAE,CACX,CAEA,wCAAa,CACX,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,IACjB,CAEA,0BAAY,CAAC,mBAAM,CACjB,YAAY,CAAE,IAChB,CAEA,kBAAI,CAAC,iBAAI,CACP,MAAM,CAAE,KAAK,CACb,KAAK,CAAE,IACT"}`
};
const LeafletMap = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let mapElement;
  let showCustomers = true;
  let showInventory = false;
  let showForecast = false;
  let dateOptions = [];
  onDestroy(async () => {
  });
  async function fetchDateOptions() {
    try {
      const inventoryDates = (await summarizeInventoryByGroup()).map((item) => item.Date);
      const forecastDates = (await summarizeForecastByGroup()).map((item) => item.Date);
      dateOptions = [.../* @__PURE__ */ new Set([...inventoryDates, ...forecastDates])].sort().reverse();
    } catch (error) {
      console.error("Error fetching date options:", error);
    }
  }
  fetchDateOptions();
  $$result.css.add(css$1);
  return `<main class="svelte-fzm0zb"><div class="input-group svelte-fzm0zb"><label class="svelte-fzm0zb"><input type="checkbox"${add_attribute("checked", showCustomers, 1)}> Customers</label> <label class="svelte-fzm0zb"><input type="checkbox"${add_attribute("checked", showForecast, 1)}> Forecast</label> <label class="svelte-fzm0zb"><input type="checkbox"${add_attribute("checked", showInventory, 1)}> Inventory</label> <label for="selectedDate" class="svelte-fzm0zb" data-svelte-h="svelte-166a445">Select Date:</label> <select id="selectedDate">${each(dateOptions, (date) => {
    return `<option${add_attribute("value", date, 0)}>${escape(date)}</option>`;
  })}</select></div> <div class="svelte-fzm0zb"${add_attribute("this", mapElement, 0)}></div> </main>`;
});
const Timeseries = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  Chart.register(LineElement, LinearScale, PointElement);
  let chart;
  return `<div class="container"><div class="inputs"><label for="startDate" data-svelte-h="svelte-a381xo">Start Date:</label> <input type="date" id="startDate" value="2024-03-01"> <label for="endDate" data-svelte-h="svelte-1gbtc26">End Date:</label> <input type="date" id="endDate" value="2024-03-10"></div> <canvas id="TimeSeries" width="200" height="50"${add_attribute("this", chart, 0)}></canvas></div>`;
});
const Correlation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  Chart.register(PointElement, LinearScale, Title, Tooltip);
  let chart;
  return `<canvas id="ScatterChart"${add_attribute("width", 50, 0)}${add_attribute("height", 50, 0)}${add_attribute("this", chart, 0)}></canvas>`;
});
const Timecost = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);
  let chart;
  return `<canvas id="BarChart"${add_attribute("width", 50, 0)}${add_attribute("height", 50, 0)}${add_attribute("this", chart, 0)}></canvas>`;
});
const Inventory = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let chart;
  let selectedMonthYear;
  return `<div class="container"><div class="inputs"><label for="invDate" data-svelte-h="svelte-65ug9t">Select Month and Year:</label> <input type="month" id="invDate"${add_attribute("value", selectedMonthYear, 0)}></div> <canvas id="Inventory" width="400" height="400"${add_attribute("this", chart, 0)}></canvas></div>`;
});
const css = {
  code: "nav.svelte-sxgpsw{margin-bottom:20px;text-align:center}.tabs-container.svelte-sxgpsw{list-style-type:none;padding:0;margin:0;display:flex;justify-content:center;background-color:#021b28;border-bottom:1px solid #ccc}li.svelte-sxgpsw{margin-right:10px}button.svelte-sxgpsw{padding:8px 16px;border:none;background-color:rgb(73, 158, 227);cursor:pointer;font-size:14px;color:#06000c;transition:background-color 0.3s}button.selected.svelte-sxgpsw{background-color:#238fa2;color:#000;font-weight:bold}button.svelte-sxgpsw:hover{background-color:#471e9e}.content.svelte-sxgpsw{padding:20px;border:1px solid #02152b;border-radius:4px}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { onMount } from 'svelte';\\nimport LeafletMap from './../../components/Map/leafletMap.svelte';\\nimport TimeSeries from './../../components/Timeseries/timeseries.svelte';\\nimport Correlation from './../../components/Correlation/correlation.svelte';\\nimport TimeCost from './../../components/TimeCost/timecost.svelte';\\nimport Inventory from '../../components/Inventory/Inventory.svelte';\\nimport { fetchData } from './../../components/data';\\nimport { summarizeCustomersByGroup, summarizeInventoryByGroup, fullJoinDataWithCoordinates } from './../../components/dataprocessing';\\nlet fetchedData = [];\\nlet summary = [];\\nlet inventorySummary = [];\\nlet selectedFile = 'Customers.csv'; // Default selected file\\nlet mergedData = [];\\nonMount(() => __awaiter(void 0, void 0, void 0, function* () {\\n    try {\\n        fetchedData = yield fetchData();\\n        summary = yield summarizeCustomersByGroup();\\n        inventorySummary = yield summarizeInventoryByGroup();\\n        mergedData = yield fullJoinDataWithCoordinates();\\n        //console.log(summary);\\n        //console.log(inventorySummary);\\n        //console.log(mergedData);\\n    }\\n    catch (error) {\\n        console.error('Error:', error);\\n    }\\n}));\\nfunction handleChange(event) {\\n    return __awaiter(this, void 0, void 0, function* () {\\n        selectedFile = event.target.value;\\n    });\\n}\\nconst tabs = [\\n    { id: \\"map\\", label: \\"Map\\" },\\n    { id: \\"timeSeries\\", label: \\"Time Series Plot\\" },\\n    { id: \\"correlations\\", label: \\"Correlations\\" },\\n    { id: \\"plantcustomerdemand\\", label: \\"Plant Customer Demand\\" },\\n    { id: \\"inventoryquantities\\", label: \\"Inventory Quantities\\" },\\n    { id: \\"timecost\\", label: \\"Time-Cost\\" },\\n    { id: \\"news\\", label: \\"News\\" },\\n];\\nimport { writable } from \\"svelte/store\\";\\nconst activeTab = writable(\\"map\\"); // Default active tab\\nfunction setActiveTab(tabId) {\\n    activeTab.set(tabId);\\n}\\n<\/script>\\r\\n\\r\\n\\r\\n<svelte:head>\\r\\n    <title>Content</title>\\r\\n    <meta name=\\"description\\" content=\\"Main content\\" />\\r\\n</svelte:head>\\r\\n\\r\\n<nav>\\r\\n    <ul role=\\"tablist\\" class=\\"tabs-container\\">\\r\\n        {#each tabs as { id, label }}\\r\\n        <li>\\r\\n            <button\\r\\n                role=\\"tab\\"\\r\\n                aria-selected={$activeTab === id}\\r\\n                class:selected={$activeTab === id}\\r\\n                on:click={() => setActiveTab(id)}\\r\\n                >\\r\\n                {label}\\r\\n            </button>\\r\\n        </li>\\r\\n        {/each}\\r\\n    </ul>\\r\\n</nav>\\r\\n\\r\\n{#each tabs as { id, label }}\\r\\n    {#if $activeTab === id}\\r\\n        <section class=\\"content\\">\\r\\n            {#if id === \\"map\\"}\\r\\n                <div>\\r\\n                    <h1>Inventory Orders Sales by Country</h1>\\r\\n                    <LeafletMap />\\r\\n                </div>\\r\\n            {:else if id === \\"timeSeries\\"}\\r\\n                <div>\\r\\n                    <TimeSeries />\\r\\n                </div>\\r\\n            {:else if id === \\"correlations\\"}\\r\\n                <h2>{label} Content</h2>\\r\\n                <div>\\r\\n                    <Correlation />\\r\\n                </div>\\r\\n            {:else if id === \\"plantcustomerdemand\\"}\\r\\n                <h2>{label} Content</h2>\\r\\n                <p>This is the content for the {label} tab.</p>\\r\\n                <!-- Add plant customer demand component here -->\\r\\n                <!-- Your Svelte component template -->\\r\\n                <div>\\r\\n                  <h1>Merged Data Summary</h1>\\r\\n\\r\\n                  {#if mergedData.length > 0}\\r\\n                  <table>\\r\\n                      <thead>\\r\\n                          <tr>\\r\\n                              <th>Date</th>\\r\\n                              <th>Plant Key</th>\\r\\n                              <th>GIQ</th>\\r\\n                              <th>OSQ</th>\\r\\n                              <th>ITQ</th>\\r\\n                              <th>FQ</th>\\r\\n                              <th>Latitude</th>\\r\\n                              <th>Longitude</th>\\r\\n                          </tr>\\r\\n                      </thead>\\r\\n                      <tbody>\\r\\n                          {#each mergedData as { Date, PlantKey, GIQ, OSQ, ITQ, FQ, lat, lon }}\\r\\n                          <tr>\\r\\n                              <td>{Date}</td>\\r\\n                              <td>{PlantKey}</td>\\r\\n                              <td>{GIQ}</td>\\r\\n                              <td>{OSQ}</td>\\r\\n                              <td>{ITQ}</td>\\r\\n                              <td>{FQ}</td>\\r\\n                              <td>{lat}</td>\\r\\n                              <td>{lon}</td>\\r\\n                          </tr>\\r\\n                          {/each}\\r\\n                      </tbody>\\r\\n                  </table>\\r\\n                  {:else}\\r\\n    <p>No data available.</p>\\r\\n      {/if}\\r\\n              </div> \\r\\n            {:else if id === \\"inventoryquantities\\"}\\r\\n              <div>\\r\\n                <Inventory />\\r\\n              </div>\\r\\n            {:else if id === \\"timecost\\"}\\r\\n                <h2>{label} Content</h2>\\r\\n                <div>\\r\\n                    <TimeCost />\\r\\n                </div>\\r\\n            {:else if id === \\"news\\"}\\r\\n            <div>\\r\\n                <h1>Data Summary</h1>\\r\\n                <select bind:value={selectedFile} on:change={handleChange}>\\r\\n                  <option value=\\"\\">Select a file</option>\\r\\n                  {#each fetchedData as { file }}\\r\\n                    <option value={file}>{file}</option>\\r\\n                  {/each}\\r\\n                </select>\\r\\n              \\r\\n                {#each fetchedData as { file, keys, data }}\\r\\n                  {#if file === selectedFile}\\r\\n                    <div>\\r\\n                      <h3>{file}</h3>\\r\\n                      <ul>\\r\\n                        {#each keys as key}\\r\\n                          <li>{key}</li>\\r\\n                        {/each}\\r\\n                      </ul>\\r\\n                      <table>\\r\\n                        <thead>\\r\\n                          <tr>\\r\\n                            {#each keys as key}\\r\\n                              <th>{key}</th>\\r\\n                            {/each}\\r\\n                          </tr>\\r\\n                        </thead>\\r\\n                        <tbody>\\r\\n                          {#each data as row}\\r\\n                            <tr>\\r\\n                              {#each keys as key}\\r\\n                                <td>{row[key]}</td>\\r\\n                              {/each}\\r\\n                            </tr>\\r\\n                          {/each}\\r\\n                        </tbody>\\r\\n                      </table>\\r\\n                    </div>\\r\\n                  {/if}\\r\\n                {/each}\\r\\n              </div>\\r\\n            {/if}\\r\\n        </section>\\r\\n    {/if}\\r\\n{/each}\\r\\n\\r\\n<style>\\r\\n    nav {\\r\\n        margin-bottom: 20px;\\r\\n        text-align: center;\\r\\n    }\\r\\n\\r\\n    .tabs-container {\\r\\n        list-style-type: none;\\r\\n        padding: 0;\\r\\n        margin: 0;\\r\\n        display: flex;\\r\\n        justify-content: center;\\r\\n        background-color: #021b28;\\r\\n        border-bottom: 1px solid #ccc;\\r\\n    }\\r\\n\\r\\n    li {\\r\\n        margin-right: 10px;\\r\\n    }\\r\\n\\r\\n    button {\\r\\n        padding: 8px 16px;\\r\\n        border: none;\\r\\n        background-color: rgb(73, 158, 227);\\r\\n        cursor: pointer;\\r\\n        font-size: 14px;\\r\\n        color: #06000c;\\r\\n        transition: background-color 0.3s;\\r\\n    }\\r\\n\\r\\n    button.selected {\\r\\n        background-color: #238fa2;\\r\\n        color: #000;\\r\\n        font-weight: bold;\\r\\n    }\\r\\n\\r\\n    button:hover {\\r\\n        background-color: #471e9e;\\r\\n    }\\r\\n\\r\\n    .content {\\r\\n        padding: 20px;\\r\\n        border: 1px solid #02152b;\\r\\n        border-radius: 4px;\\r\\n    }\\r\\n</style>\\r\\n"],"names":[],"mappings":"AAkMI,iBAAI,CACA,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,MAChB,CAEA,6BAAgB,CACZ,eAAe,CAAE,IAAI,CACrB,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,gBAAgB,CAAE,OAAO,CACzB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAC7B,CAEA,gBAAG,CACC,YAAY,CAAE,IAClB,CAEA,oBAAO,CACH,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,MAAM,CAAE,IAAI,CACZ,gBAAgB,CAAE,IAAI,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CACnC,MAAM,CAAE,OAAO,CACf,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,OAAO,CACd,UAAU,CAAE,gBAAgB,CAAC,IACjC,CAEA,MAAM,uBAAU,CACZ,gBAAgB,CAAE,OAAO,CACzB,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,IACjB,CAEA,oBAAM,MAAO,CACT,gBAAgB,CAAE,OACtB,CAEA,sBAAS,CACL,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,OAAO,CACzB,aAAa,CAAE,GACnB"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $activeTab, $$unsubscribe_activeTab;
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let fetchedData = [];
  let selectedFile = "Customers.csv";
  let mergedData = [];
  const tabs = [
    { id: "map", label: "Map" },
    {
      id: "timeSeries",
      label: "Time Series Plot"
    },
    {
      id: "correlations",
      label: "Correlations"
    },
    {
      id: "plantcustomerdemand",
      label: "Plant Customer Demand"
    },
    {
      id: "inventoryquantities",
      label: "Inventory Quantities"
    },
    { id: "timecost", label: "Time-Cost" },
    { id: "news", label: "News" }
  ];
  const activeTab = writable("map");
  $$unsubscribe_activeTab = subscribe(activeTab, (value) => $activeTab = value);
  $$result.css.add(css);
  $$unsubscribe_activeTab();
  return `${$$result.head += `<!-- HEAD_svelte-ov818q_START -->${$$result.title = `<title>Content</title>`, ""}<meta name="description" content="Main content"><!-- HEAD_svelte-ov818q_END -->`, ""} <nav class="svelte-sxgpsw"><ul role="tablist" class="tabs-container svelte-sxgpsw">${each(tabs, ({ id, label }) => {
    return `<li class="svelte-sxgpsw"><button role="tab"${add_attribute("aria-selected", $activeTab === id, 0)} class="${["svelte-sxgpsw", $activeTab === id ? "selected" : ""].join(" ").trim()}">${escape(label)}</button> </li>`;
  })}</ul></nav> ${each(tabs, ({ id, label }) => {
    return `${$activeTab === id ? `<section class="content svelte-sxgpsw">${id === "map" ? `<div><h1 data-svelte-h="svelte-bifot2">Inventory Orders Sales by Country</h1> ${validate_component(LeafletMap, "LeafletMap").$$render($$result, {}, {}, {})} </div>` : `${id === "timeSeries" ? `<div>${validate_component(Timeseries, "TimeSeries").$$render($$result, {}, {}, {})} </div>` : `${id === "correlations" ? `<h2>${escape(label)} Content</h2> <div>${validate_component(Correlation, "Correlation").$$render($$result, {}, {}, {})} </div>` : `${id === "plantcustomerdemand" ? `<h2>${escape(label)} Content</h2> <p>This is the content for the ${escape(label)} tab.</p>   <div><h1 data-svelte-h="svelte-111zjoq">Merged Data Summary</h1> ${mergedData.length > 0 ? `<table><thead data-svelte-h="svelte-5umbfl"><tr><th>Date</th> <th>Plant Key</th> <th>GIQ</th> <th>OSQ</th> <th>ITQ</th> <th>FQ</th> <th>Latitude</th> <th>Longitude</th> </tr></thead> <tbody>${each(mergedData, ({ Date, PlantKey, GIQ, OSQ, ITQ, FQ, lat, lon }) => {
      return `<tr><td>${escape(Date)}</td> <td>${escape(PlantKey)}</td> <td>${escape(GIQ)}</td> <td>${escape(OSQ)}</td> <td>${escape(ITQ)}</td> <td>${escape(FQ)}</td> <td>${escape(lat)}</td> <td>${escape(lon)}</td> </tr>`;
    })}</tbody> </table>` : `<p data-svelte-h="svelte-pdq8ks">No data available.</p>`} </div>` : `${id === "inventoryquantities" ? `<div>${validate_component(Inventory, "Inventory").$$render($$result, {}, {}, {})} </div>` : `${id === "timecost" ? `<h2>${escape(label)} Content</h2> <div>${validate_component(Timecost, "TimeCost").$$render($$result, {}, {}, {})} </div>` : `${id === "news" ? `<div><h1 data-svelte-h="svelte-u7ocko">Data Summary</h1> <select><option value="" data-svelte-h="svelte-px9icf">Select a file</option>${each(fetchedData, ({ file }) => {
      return `<option${add_attribute("value", file, 0)}>${escape(file)}</option>`;
    })}</select> ${each(fetchedData, ({ file, keys, data }) => {
      return `${file === selectedFile ? `<div><h3>${escape(file)}</h3> <ul>${each(keys, (key) => {
        return `<li class="svelte-sxgpsw">${escape(key)}</li>`;
      })}</ul> <table><thead><tr>${each(keys, (key) => {
        return `<th>${escape(key)}</th>`;
      })} </tr></thead> <tbody>${each(data, (row) => {
        return `<tr>${each(keys, (key) => {
          return `<td>${escape(row[key])}</td>`;
        })} </tr>`;
      })} </tbody></table> </div>` : ``}`;
    })} </div>` : ``}`}`}`}`}`}`} </section>` : ``}`;
  })}`;
});
export {
  Page as default
};
