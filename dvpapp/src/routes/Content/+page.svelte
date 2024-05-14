<script lang="ts">
  import { onMount } from 'svelte';
  import LeafletMap from './../../components/Map/leafletMap.svelte';
  import TimeSeries from './../../components/Timeseries/timeseries.svelte';
  import Correlation from './../../components/Correlation/correlation.svelte';
  import TimeCost from './../../components/TimeCost/timecost.svelte';
  import Inventory  from '../../components/Inventory/Inventory.svelte';
  import { fetchData } from './../../components/data';
  import { summarizeCustomersByGroup, summarizeInventoryByGroup, fullJoinDataWithCoordinates } from './../../components/dataprocessing';

  let fetchedData = [];
  let summary = [];
  let inventorySummary = [];
  let selectedFile = 'Customers.csv'; // Default selected file
  let mergedData = [];

  onMount(async () => {
      try {
          fetchedData = await fetchData();
          summary = await summarizeCustomersByGroup();
          inventorySummary = await summarizeInventoryByGroup();
          mergedData = await fullJoinDataWithCoordinates() 
          console.log(summary);
          console.log(inventorySummary);
          console.log(mergedData);
      } catch (error) {
          console.error('Error:', error);
      }
  });

  async function handleChange(event) {
      selectedFile = event.target.value;
  }

  const tabs = [
      { id: "map", label: "Map" },
      { id: "timeSeries", label: "Time Series Plot" },
      { id: "correlations", label: "Correlations" },
      { id: "plantcustomerdemand", label: "Plant Customer Demand" },
      { id: "inventoryquantities", label: "Inventory Quantities" },
      { id: "timecost", label: "Time-Cost" },
      { id: "news", label: "News" },
  ];

  import { writable } from "svelte/store";
  const activeTab = writable("map"); // Default active tab

  function setActiveTab(tabId: string) {
      activeTab.set(tabId);
  }
</script>


<svelte:head>
    <title>Content</title>
    <meta name="description" content="Main content" />
</svelte:head>

<nav>
    <ul role="tablist" class="tabs-container">
        {#each tabs as { id, label }}
        <li>
            <button
                role="tab"
                aria-selected={$activeTab === id}
                class:selected={$activeTab === id}
                on:click={() => setActiveTab(id)}
                >
                {label}
            </button>
        </li>
        {/each}
    </ul>
</nav>

{#each tabs as { id, label }}
    {#if $activeTab === id}
        <section class="content">
            {#if id === "map"}
                <div>
                    <h1>Inventory Orders Sales by Country</h1>
                    <LeafletMap />
                </div>
            {:else if id === "timeSeries"}
                <div>
                    <TimeSeries />
                </div>
            {:else if id === "correlations"}
                <h2>{label} Content</h2>
                <div>
                    <Correlation />
                </div>
            {:else if id === "plantcustomerdemand"}
                <h2>{label} Content</h2>
                <p>This is the content for the {label} tab.</p>
                <!-- Add plant customer demand component here -->
                <!-- Your Svelte component template -->
                <div>
                  <h1>Merged Data Summary</h1>

                  {#if mergedData.length > 0}
                  <table>
                      <thead>
                          <tr>
                              <th>Date</th>
                              <th>Plant Key</th>
                              <th>GIQ</th>
                              <th>OSQ</th>
                              <th>ITQ</th>
                              <th>FQ</th>
                              <th>Latitude</th>
                              <th>Longitude</th>
                          </tr>
                      </thead>
                      <tbody>
                          {#each mergedData as { Date, PlantKey, GIQ, OSQ, ITQ, FQ, lat, lon }}
                          <tr>
                              <td>{Date}</td>
                              <td>{PlantKey}</td>
                              <td>{GIQ}</td>
                              <td>{OSQ}</td>
                              <td>{ITQ}</td>
                              <td>{FQ}</td>
                              <td>{lat}</td>
                              <td>{lon}</td>
                          </tr>
                          {/each}
                      </tbody>
                  </table>
                  {:else}
    <p>No data available.</p>
      {/if}
              </div> 
            {:else if id === "inventoryquantities"}
              <div>
                <Inventory />
              </div>
            {:else if id === "timecost"}
                <h2>{label} Content</h2>
                <div>
                    <TimeCost />
                </div>
            {:else if id === "news"}
            <div>
                <h1>Data Summary</h1>
                <select bind:value={selectedFile} on:change={handleChange}>
                  <option value="">Select a file</option>
                  {#each fetchedData as { file }}
                    <option value={file}>{file}</option>
                  {/each}
                </select>
              
                {#each fetchedData as { file, keys, data }}
                  {#if file === selectedFile}
                    <div>
                      <h3>{file}</h3>
                      <ul>
                        {#each keys as key}
                          <li>{key}</li>
                        {/each}
                      </ul>
                      <table>
                        <thead>
                          <tr>
                            {#each keys as key}
                              <th>{key}</th>
                            {/each}
                          </tr>
                        </thead>
                        <tbody>
                          {#each data as row}
                            <tr>
                              {#each keys as key}
                                <td>{row[key]}</td>
                              {/each}
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  {/if}
                {/each}
              </div>
            {/if}
        </section>
    {/if}
{/each}

<style>
    nav {
        margin-bottom: 20px;
        text-align: center;
    }

    .tabs-container {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        background-color: #021b28;
        border-bottom: 1px solid #ccc;
    }

    li {
        margin-right: 10px;
    }

    button {
        padding: 8px 16px;
        border: none;
        background-color: rgb(73, 158, 227);
        cursor: pointer;
        font-size: 14px;
        color: #06000c;
        transition: background-color 0.3s;
    }

    button.selected {
        background-color: #238fa2;
        color: #000;
        font-weight: bold;
    }

    button:hover {
        background-color: #471e9e;
    }

    .content {
        padding: 20px;
        border: 1px solid #02152b;
        border-radius: 4px;
    }
</style>
