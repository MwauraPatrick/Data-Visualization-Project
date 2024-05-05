<script lang="ts">
  import { fetchData } from './../../components/data';
  import LeafletMap from './../../components/Map/leafletMap.svelte';
  import TimeSeries from './../../components/Timeseries/timeseries.svelte';
  import Correlation from './../../components/Correlation/correlation.svelte';
  import TimeCost from './../../components/TimeCost/timecost.svelte';
  import { writable } from "svelte/store";

  let fetchedData = [];

  async function loadData() {
    fetchedData = await fetchData();
  }

  loadData();

  const tabs = [
    { id: "map", label: "Map" },
    { id: "timeSeries", label: "Time Series Plot" },
    { id: "correlations", label: "Correlations" },
    { id: "plantcustomerdemand", label: "Plant Customer Demand" },
    { id: "inventoryquantities", label: "Inventory Quantities" },
    { id: "timecost", label: "Time-Cost" },
    { id: "news", label: "News" },
  ];

  const activeTab = writable("map"); // Default active tab

  function setActiveTab(tabId: string) {
    activeTab.set(tabId);
  }
</script>

<!---->
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
							<h2>{label} Content</h2>
							<div>
									<p>This is the content for the {label} tab.</p>
									<LeafletMap />
							</div>
					{:else if id === "timeSeries"}
							<h2>{label} Content</h2>
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
					{:else if id === "inventoryquantities"}
							<h2>{label} Content</h2>
							<p>This is the content for the {label} tab.</p>
							<!-- Add inventory quantities component here -->
					{:else if id === "timecost"}
							<h2>{label} Content</h2>
							<div>
							<TimeCost />
							</div>
					{:else if id === "news"}
							<h1>Data Content</h1>
							<h2>Here is our first news, we have been able to fetch 11 datasets for our application</h2>
							<p>Please view the list below of the said datasets and the variables in them</p>
    {#each tabs as { id, label }}
    {#if $activeTab === id}
    <section class="content">




        {#if id === "map"}
        <h2>{label} Content</h2>
        <div>
            <p>This is the content for the {label} tab.</p>
            <LeafletMap />
        </div>
        {:else if id === "timeSeries"}
        <h2>{label} Content</h2>
        <p>This is the content for the {label} tab.</p>
        <!-- Add time series plot component here -->
        {:else if id === "correlations"}
        <h2>{label} Content</h2>
        <p>This is the content for the {label} tab.</p>
        <!-- Add correlations component here -->
        {:else if id === "plantcustomerdemand"}
        <h2>{label} Content</h2>
        <p>This is the content for the {label} tab.</p>
        <!-- Add plant customer demand component here -->
        {:else if id === "inventoryquantities"}
        <h2>{label} Content</h2>
        <p>This is the content for the {label} tab.</p>
        <!-- Add inventory quantities component here -->
        {:else if id === "timecost"}
        <h2>{label} Content</h2>
        <p>This is the content for the {label} tab.</p>
        <!-- Add time-cost component here -->
        {:else if id === "news"}
        <h1>Data Content</h1>
        <h2>Here is our first news, we have been able to fetch 11 datasets for our application</h2>
        <p>Please view the list below of the said datasets and the variables in them</p>
 {#each fetchedData as { file, keys }}
        <div>
            <h3>{file}</h3>
            <ul>
                {#each keys as key}
                <li>{key}</li>
                {/each}
            </ul>
        </div>
        {/each}
<!-- {#each fetchedData as { file, content }}
        <div>
            <h3>{file}</h3>
            {#if content && Array.isArray(content)}
                <ul>
                    {#each content as row}
                        <li>{JSON.stringify(row)}</li>
                    {/each}
                </ul>
            {:else}
                <p>No content available for {file}</p>
            {/if}
        </div>
    {/each}
    -->
       
      
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
