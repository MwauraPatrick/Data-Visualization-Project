<script>
    import { onMount, onDestroy } from 'svelte';
    import { Chart as ChartJS } from 'chart.js/auto';
    import { LineElement, LinearScale, PointElement } from 'chart.js'; // For line chart

    import 'chartjs-adapter-moment';
  
    import * as helper from '../helper/helper.js'

    ChartJS.register(LineElement, LinearScale, PointElement); // Register components
  
    let ctx;
    let chart; // Declare a variable to hold the Chart.js instance

    let filteredData;

    let startDate =  new Date('2024-03-01'); 
    let endDate = new Date('2024-03-10'); 

    let csvDataSales = null;


    function updateChartDate() {
        console.log("Date updated " + startDate + " " + endDate)

        if( startDate < endDate){
            console.log("Start date is behind of end date")
            filteredData = helper.applyFilter(csvDataSales, new Date(startDate), new Date(endDate));
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
        csvDataSales = await helper.fetchData("Sales", "");

        filteredData = helper.applyFilter(csvDataSales, startDate, endDate);
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

