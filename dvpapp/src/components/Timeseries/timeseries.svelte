<script>
    import { onMount, onDestroy } from 'svelte';
    import { Chart as ChartJS } from 'chart.js/auto';
    import { LineElement, LinearScale, PointElement } from 'chart.js'; // For line chart
    import moment from 'moment'; // Import Moment.js
    import 'chartjs-adapter-moment';
    import pkg from 'papaparse';
    import { csv } from 'd3-fetch';
    const {parse} = pkg;    

    //const { parse } = require('papaparse');

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

    let filteredData;
    let startDate =  new Date('2024-03-01'); 
    let endDate = new Date('2024-03-10'); 

    let csvData = null;

    async function fetchData() {
        try {
            const url = `https://raw.githubusercontent.com/JannesPeeters/suncharge/main/data/Sales.csv`;
            const response = await fetch(url); // Replace with your server-side endpoint
            if (!response.ok) {
                throw new Error(`Failed to fetch CSV data: ${response.statusText}`);
            }
            console.log("Inside Fetch")
            const csvString = await response.text();
           
            const parsedData = processData(csvString);

            return(parsedData);

        } catch (error) {
            console.error('Error fetching CSV data:', error);
           
        }
        
    }

    function processData(csvString) {
        console.log("Processing csv data");

        const parsedData = parse(csvString, { header: true }); // Assume headers

        if (!parsedData.data || !parsedData.data.length) {
            console.error('Error: Empty CSV data or invalid format');
            return []; // Return empty array for error handling
        }
        //skip the first 2 rows
        const data = parsedData.data.slice(2);

        // Extract labels and data from all rows
        const labels = data.map(row => row['SalesOrderCreationDate']);
        const quantity = data.map(row => parseFloat(row['OrderQuantity']));
        
        return { labels, quantity };
    }

    function applyFilter(data, startDate, endDate ) {
        console.log("Updating chart")
        if (!data || !data.labels || !data.quantity || !startDate || !endDate) {
            console.error('Error: Missing data, labels, start date, or end date');
            return { labels: [], quantity: [] }; // Return empty arrays for error handling
        }

        const filteredData = data.labels.reduce((acc, label, index) => {
            const date = new Date(label);

            // Filter based on date being within the start and end date range (inclusive)
            if (date >= startDate && date <= endDate) {
            const dateString = date.toDateString(); // Convert to date string for grouping
            acc[dateString] = (acc[dateString] || 0) + data.quantity[index];
            }

            return acc;
        }, {});

        // Convert grouped data to arrays for labels (dates) and quantity
        const filteredLabels = Object.keys(filteredData).sort((a, b) => new Date(a) - new Date(b));;

        const filteredQuantity = filteredLabels.map(dateString => filteredData[dateString]);

        // Optional: Format dates using Moment.js (if imported)
        if (moment) {
            filteredLabels.forEach((label, index) => {
            filteredLabels[index] = moment(label).format('MM-DD-YYYY');
            });
        }

        return { labels: filteredLabels, quantity: filteredQuantity };
    }
    
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
        return `${year}-${month}-${day}`;
    }

    function updateChartDate() {
        console.log("Date updated " + startDate + " " + endDate)

        if( startDate < endDate){
            console.log("Start date is behind of end date")
            filteredData = applyFilter(csvData, new Date(startDate), new Date(endDate));
            console.log(filteredData)

            chart.data.labels = filteredData.labels;
            chart.data.datasets[0].data = filteredData.quantity;
            chart.update()
          
        }
        else if( startDate > endDate){
            console.log("Start date is ahead of end date")
        }
    }

    async function createChart()  {
        self.console.log("Inside chart")
        
        /* get csvData */
        csvData = await fetchData()

        filteredData = applyFilter(csvData, startDate, endDate);
        console.log(filteredData.labels, filteredData.quantity)
        
        ctx = chart.getContext('2d');

        chart = new ChartJS(ctx, {
        type: 'line', 
            data: {
                labels: filteredData.labels,
                datasets: [{
                    label: "Quantity",
                    data: filteredData.quantity,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 2
                },
                {
                    label: 'Dataset 2',
                    data: [5, 15, 20, 10, 25],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                }
            ]
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
                    type: 'time',
                    time:{
                        unit: 'day',
                        displayFormats: { // Configure date display format for x-axis labels
                             'day': 'DD-MM-YYYY', // Display as DD-MM-YYYY
                        },
                    },
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
<div class = "container">
    <div class = "inputs">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" value="2024-03-01" on:change={() => { startDate = formatDate(new Date(event.target.value)); updateChartDate(); }}>
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate"  value="2024-03-10" on:change={() => { endDate = formatDate(new Date(event.target.value)); updateChartDate(); }}>
    </div>

    <canvas bind:this={chart} id = "TimeSeries" width=200 height=50 />
</div>

