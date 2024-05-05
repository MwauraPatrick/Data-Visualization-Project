// Dataprocessing.svelte

<script>
  import { onMount } from 'svelte';
  import { processData, summary } from './dataprocessing'; // Update the path to match your file structure

  onMount(processData);
</script>


