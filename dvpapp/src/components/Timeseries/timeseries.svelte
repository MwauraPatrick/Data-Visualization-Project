<script>
    import { onMount, onDestroy } from 'svelte';
    import { Chart as ChartJS } from 'chart.js/auto';
    import { LineElement, LinearScale, PointElement } from 'chart.js'; // For line chart
    import moment from 'moment'; // Import Moment.js
    import 'chartjs-adapter-moment';
    import pkg from 'papaparse';

    const {parse} = pkg;    


    ChartJS.register(LineElement, LinearScale, PointElement); // Register components
  
    let ctx;
    let chart; // Declare a variable to hold the Chart.js instance
  
    let startDate =  new Date('2024-03-01'); 
    let endDate = new Date('2024-03-10'); 

    let salesFilteredData = {};
    let salesQuanityData = {};

    let foreacastFilteredData = {};
    let forcastQuantityData = {}
    
    const forecastLabelsToExtract = ["RequestedDeliveryMonth","Quantity"];
    const salesLabelsToExtract = ["SalesOrderCreationDate", "OrderQuantity"];

    let url = `https://raw.githubusercontent.com/JannesPeeters/suncharge/main/data/`

    async function fetchData(file_name, ...labelsToExtract) {
        try {
            const file_path = url + file_name + ".csv"
            const response = await fetch(file_path); // Replace with your server-side endpoint
            if (!response.ok) {
                throw new Error(`Failed to fetch CSV data: ${response.statusText}`);
            }
            console.log("Fetching " + file_name + " file")
            const csvString = await response.text();
            
            const results = {};
            const parsedData = processData(csvString, results, ...labelsToExtract);

            return (results)

        } catch (error) {
            console.error('Error fetching CSV data:', error);
           
        }
        
    }

    function processData(csvString, results, ...rowLabels) {
        console.log("Processing csv data");

        const parsedData = parse(csvString, { header: true }); // Assume headers

        if (!parsedData.data || !parsedData.data.length) {
            console.error('Error: Empty CSV data or invalid format');
            return []; // Return empty array for error handling
        }
        //skip the first 2 rows
        const data = parsedData.data.slice(2);

        for (const label of rowLabels) {
            results[label] = data.map(row => row[label]); // Store entire matching row as value
        }
        // Extract labels and data from all rows
        const labels = data.map(row => row['SalesOrderCreationDate']);
        const quantity = data.map(row => parseFloat(row['OrderQuantity']));
        
        return { labels, quantity };
    }

    function applyFilter(data, startDate, endDate, ...rowLabels ) {
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

    /**
     * 
     * @param data
     * @param startDate
     * @param endDate
     * @param rowLabels
     */
    function applyFilter2(data, startDate, endDate, results, ...rowLabels) {
        console.log("extracting data between " + startDate + " and " + endDate)
        const filteredData = data[rowLabels[0]].reduce((acc, label, index) => {
            const date = new Date(label);
            
            // Filter based on date being within the start and end date range (inclusive)
            if (date >= startDate && date <= endDate) {
                const dateString = date.toDateString(); // Convert to date string for grouping
                acc[dateString] = acc[dateString] || {};
                for (let i = 1; i < rowLabels.length; i++) {
                    const l = rowLabels[i];
                    acc[dateString][l] = (acc[dateString][l] || 0) + Number(data[l][index]); // Use label for indexing
                }
            }

            return acc;
        }, {});


        // Convert grouped data to arrays for labels (dates) and quantity
        const filteredLabels = Object.keys(filteredData).sort((a, b) => new Date(a) - new Date(b));;
        
        results[rowLabels[0]] = filteredLabels

        for (let i = 1; i < rowLabels.length; i++) {
            const l = rowLabels[i];
            results[l] = filteredLabels.map(dateString => filteredData[dateString][l])
        };

        // Optional: Format dates using Moment.js (if imported)
        if (moment) {
            results[rowLabels[0]].forEach((label, index) => {
            results[rowLabels[0]][index] = moment(label).format('MM-DD-YYYY');
            });
        }
        
        return 1;
    }

    /**
     * 
     * @param date
     */
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
        return `${year}-${month}-${day}`;
    }

    function updateChartDate() {
        console.log("Date updated " + startDate + " " + endDate)

        if( startDate < endDate){
            console.log("Start date is behind of end date, updating chart")
            const labelsToExtract = ["SalesOrderCreationDate", "OrderQuantity"];
            
            applyFilter2(salesQuanityData, startDate, endDate, salesFilteredData, ...salesLabelsToExtract);
 
            chart.data.labels = salesFilteredData[salesLabelsToExtract[0]];
            chart.data.datasets[0].data = salesFilteredData[salesLabelsToExtract[1]];
            chart.update()
          
        }
        else if( startDate > endDate){
            console.log("Start date is ahead of end date")
        }
    }

    async function createChart()  {
        self.console.log("Inside chart")
        
        /* get csvData */
        salesQuanityData = await fetchData("Sales", ...salesLabelsToExtract)
        forcastQuantityData = await await fetchData("Forecast", ...forecastLabelsToExtract)

        applyFilter2(forcastQuantityData, startDate, endDate, foreacastFilteredData, ...forecastLabelsToExtract);
        applyFilter2(salesQuanityData, startDate, endDate, salesFilteredData, ...salesLabelsToExtract);
        
        ctx = chart.getContext('2d');

        chart = new ChartJS(ctx, {
        type: 'line', 
            data: {
                labels: salesFilteredData[salesLabelsToExtract[0]],
                datasets: [{
                    label: "Quantity",
                    data: salesFilteredData[salesLabelsToExtract[1]],
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 2
                },
                {
                    label: "Forecast",
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
        <input type="date" id="startDate" value="2024-03-01" on:change={() => { startDate = new Date(formatDate(new Date(event.target.value))); updateChartDate(); }}>
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate"  value="2024-03-10" on:change={() => { endDate = new Date(formatDate(new Date(event.target.value))); updateChartDate(); }}>
    </div>

    <canvas bind:this={chart} id = "TimeSeries" width=200 height=50 />
</div>

