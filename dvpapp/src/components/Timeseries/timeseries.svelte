<script>
    import { onMount, onDestroy } from 'svelte';
    import { Chart as ChartJS } from 'chart.js/auto';
    import { LineElement, LinearScale, PointElement } from 'chart.js'; // For line chart


    ChartJS.register(LineElement, LinearScale, PointElement); // Register components
  
    let ctx;
    let chart; // Declare a variable to hold the Chart.js instance
    let chartValues = [20, 10, 5, 2, 20, 30, 45];
    let chartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
    let labels = [];
    let data = [];

  const fileNames = [
    'BOM.csv',
    'Plants.csv',
    'Customers.csv',
    'Forecast.csv', 
    'Inventory.csv',
    'MaterialPlantRelation.csv',
    'Materials.csv',
    'Plants.csv',
    'Purchases.csv',
    'Sales.csv',
    'Vendors.csv']; 

   let fetchedData = [];

  async function fetchData() {
       try {
           const url = `https://raw.githubusercontent.com/JannesPeeters/suncharge/main/data/Sales.csv`;
           const response = await fetch(url); // Replace with your server-side endpoint
           if (!response.ok) {
               throw new Error(`Failed to fetch CSV data: ${response.statusText}`);
           }
           const csvData = await response.text();
           console.log("Inside Fetch")
           processData(csvData);
       } catch (error) {
           console.error('Error fetching CSV data:', error);
           // Handle error gracefully, e.g., display an error message to the user
       }
   }

   function processData(csvData) {
        const lines = csvData.split('\n');
        console.log("Processing Data")
        // Assuming the first line contains headers (adjust if different)
        const headers = lines[0].split(',');
        
        console.log(headers)

       const dateIndex = headers.indexOf('"SalesOrderCreationDate"'); // Use quoted header name
       const quantityIndex = headers.indexOf('"OrderQuantity"'); // Use quoted header name

        if (dateIndex === -1 || quantityIndex === -1) {
            console.error('Error: Missing "SalesOrderCreationDate" or "SalesOrderCreationDate" column in CSV');
            // Handle error gracefully, e.g., display an error message to the user
            return;
        }

        for (let i = 1; i < lines.length; i++) {
           const values = lines[i].split(',');
           const date = new Date(values[dateIndex]); // Assuming 'Date' column contains valid date strings
           labels.push(date);
           data.push(parseFloat(values[quantityIndex]));
       }
   }
  async function createChart()  {
    self.console.log("Inside chart")
    await fetchData()
    console.log(data)
    console.log(labels)
    ctx = chart.getContext('2d');

    chart = new ChartJS(ctx, {
    type: 'line', 
        data: {
            labels: chartLabels,
            datasets: [{
            label: "Time Series",
            data: chartValues,
            backgroundColor: 'rgb(255, 99, 132)',
		    borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2
        }]
      },
      options: {
        plugins: {
           datalabels: {
               anchor: 'end',
               align: 'end',
           },
       },
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Quantity'
                }
            }
        }
    }
    });
  };

  onMount(() => createChart()); // Create the chart on component mount
</script>

<canvas bind:this={chart} id = "TimeSeries" width={50} height={50} />