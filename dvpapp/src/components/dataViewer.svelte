//DataViewer.svelte

<!-- src/components/DataDisplay.svelte -->
<script>
	import DataViewer from './dataViewer.svelte';
  export let fileName;
  export let data;
</script>

<h2>{fileName}</h2>
<table>
  <thead>
    <tr>
      {#each Object.keys(data[0]) as column}
        <th>{column}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data as row}
      <tr>
        {#each Object.values(row) as value}
          <td>{value}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
