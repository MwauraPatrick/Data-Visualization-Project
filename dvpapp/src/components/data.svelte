<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  const csvFiles = [
    'https://raw.githubusercontent.com/MwauraPatrick/Data-Visualization-Project/main/dvpapp/src/lib/data/Plants.csv',
    'https://raw.githubusercontent.com/MwauraPatrick/Data-Visualization-Project/main/dvpapp/src/lib/data/Purchases.csv'
  ];

  onMount(async () => {
    try {
      const responses = await Promise.all(csvFiles.map(url => fetch(url)));
      const csvContents = await Promise.all(responses.map(response => response.text()));

      const parsedData = csvContents.map(contents => d3.csvParse(contents));
      console.log(parsedData);
    } catch (error) {
      console.error('Error fetching or parsing CSV files:', error);
    }
  });
</script>
