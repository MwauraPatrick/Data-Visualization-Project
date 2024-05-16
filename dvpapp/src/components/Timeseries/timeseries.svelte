<script>
    import { onMount, onDestroy } from 'svelte';
    import { Chart as ChartJS } from 'chart.js/auto';
    import { LineElement, LinearScale, PointElement } from 'chart.js'; // For line chart
    import {fetchData, formatDate, applyFilter2} from '../Helper/helper'
 

    ChartJS.register(LineElement, LinearScale, PointElement); // Register components
  
    let ctx;
    let chart; // Declare a variable to hold the Chart.js instance
    let monthlyChart;

    let startDate =  new Date('2024-05-01'); 
    let endDate = new Date('2024-05-30'); 

    let salesFilteredData = {};
    let salesQuantityData = {};
    
    let monthlySalesFilteredData = {};
    let foreacastFilteredData = {};
    let forcastQuantityData = {}
    
    const forecastLabelsToExtract = ["RequestedDeliveryMonth","Quantity"];
    const salesLabelsToExtract = ["SalesOrderCreationDate", "OrderQuantity"];

    let url = `https://raw.githubusercontent.com/JannesPeeters/suncharge/main/data/`

    /**
     * 
     */
    function updateChartDate() {
        console.log("Date updated " + startDate + " " + endDate)

        if( startDate < endDate){
            console.log("Start date is behind of end date, updating chart")
            const labelsToExtract = ["SalesOrderCreationDate", "OrderQuantity"];
            
            applyFilter2(salesQuantityData, startDate, endDate, salesFilteredData, ...salesLabelsToExtract);
 
            chart.data.labels = salesFilteredData[salesLabelsToExtract[0]];
            chart.data.datasets[0].data = salesFilteredData[salesLabelsToExtract[1]];
            chart.update()
          
        }
        else if( startDate > endDate){
            console.log("Start date is ahead of end date")
        }
    }

    function updateSelectedDate(selectedMonth, selectedYear) {
        if (selectedMonth && selectedYear) {
            //Do nothing
        } else {
            const today = new Date();
            const month = (today.getMonth()+1).toString(); // Get month as a number (0-11)
            const year = today.getFullYear().toString(); // Get full year (YYYY)
            const day =  today.getDay().toString();
            
            startDate = year + '-' + month.padStart(2, '0') + day.padStart(2, '0')

        }
    }
    /**
     * 
     */
    async function createChart()  {
        self.console.log("Inside chart")
        
        /* get csvData */
        salesQuantityData = await fetchData("Sales", ...salesLabelsToExtract)
    
        applyFilter2(salesQuantityData, startDate, endDate, salesFilteredData, ...salesLabelsToExtract);
        
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

onMount(() => {
    createChart();
    
}); // Create the chart on component mount
</script>
<div class = "container">
    <div class = "inputs">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" value="2024-05-01" on:change={() => { startDate = new Date(formatDate(new Date(event.target.value))); updateChartDate(); }}>
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate"  value="2024-05-30" on:change={() => { endDate = new Date(formatDate(new Date(event.target.value))); updateChartDate(); }}>
    </div>

    <canvas bind:this={chart} id = "TimeSeries" width=200 height=50 />
    
</div>

