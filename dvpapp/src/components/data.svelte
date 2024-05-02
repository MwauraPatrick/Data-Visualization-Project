//data.svelte
<!--const files = [
    'BOM.csv', 'CustomerPlantRelation.csv', 'Customers.csv', 'Forecast.csv', 
    'Inventory.csv', 'MaterialPlantRelation.csv', 'Materials.csv', 'Plants.csv', 
    'Purchases.csv', 'Sales.csv', 'Vendors.csv'-->
<!-- +page.svelte -->
<script lang="ts">
    import { writable } from 'svelte/store';
    import Papa from 'papaparse';
    
    // Create a writable store to hold the CSV data
    export const csvData = writable([]);

    async function fetchData(fileName) {
        try {
            const response = await fetch(`../lib/data/${fileName}`);
            if (!response.ok) {
                throw new Error(`Error fetching data for ${fileName}: ${response.statusText}`);
            }

            const text = await response.text();
            const { data } = Papa.parse(text, { header: true });
            return data;
        } catch (error) {
            console.error(`Error fetching data for ${fileName}:`, error);
            return [];
        }
    }

    onMount(async () => {
        const files = [
            'BOM.csv', 'CustomerPlantRelation.csv', 'Customers.csv', 'Forecast.csv', 
            'Inventory.csv', 'MaterialPlantRelation.csv', 'Materials.csv', 'Plants.csv', 
            'Purchases.csv', 'Sales.csv', 'Vendors.csv'
        ];

        for (const file of files) {
            const data = await fetchData(file);
            csvData.update(oldData => [...oldData, { fileName: file, data }]);
        }
    });

    function exportData() {
        const fileNames = [
            'BOM.csv', 'CustomerPlantRelation.csv', 'Customers.csv', 'Forecast.csv', 
            'Inventory.csv', 'MaterialPlantRelation.csv', 'Materials.csv', 'Plants.csv', 
            'Purchases.csv', 'Sales.csv', 'Vendors.csv'
        ];

        const dataText = fileNames.join('\n');

        const element = document.createElement('a');
        const file = new Blob([dataText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'fileNames.txt';
        document.body.appendChild(element); // Required for this to work in Firefox
        element.click();
        document.body.removeChild(element);
    }
</script>
