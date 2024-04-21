<script>
	import { writable } from "svelte/store";

	const tabs = [
		{ id: "map", label: "Map" },
		{ id: "timeSeries", label: "Time Series Plot" },
	];

	const activeTab = writable("map"); // Default active tab

	function setActiveTab(tabId) {
		activeTab.set(tabId);
	}
</script>

<svelte:head>
	<title>Content</title>
	<meta name="description" content="Main content" />
</svelte:head>

<nav>
	<ul>
		{#each tabs as tab}
			<li>
				<button
					class:selected={$activeTab === tab.id}
					on:click={() => setActiveTab(tab.id)}
				>
					{tab.label}
				</button>
			</li>
		{/each}
	</ul>
</nav>

{#if $activeTab === "map"}
	<!-- Render map component or content -->
	<div>Map component or content goes here</div>
{:else if $activeTab === "timeSeries"}
	<!-- Render time series plot component or content -->
	<div>Time series plot component or content goes here</div>
{/if}
