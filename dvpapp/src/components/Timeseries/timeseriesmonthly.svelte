<script>
    import { onMount, onDestroy } from 'svelte';
    import { Chart as ChartJS } from 'chart.js/auto';
    import { LineElement, LinearScale, PointElement } from 'chart.js'; // For line chart
    import {fetchData, formatDate, applyFilter2} from '../Helper/helper'
 
    import moment from 'moment'; // Import Moment.js
    import 'chartjs-adapter-moment';

    ChartJS.register(LineElement, LinearScale, PointElement); // Register components
  
    let ctx;
    let monthlyChart;

    let startDate =  new Date('2024-03-01'); 
    let endDate = new Date('2024-04-01'); 

    let selectedStartDate;
    let selectedEndDate;

    let selectedStartMonthYear;
    let selectedEndMonthYear;

    let salesFilteredData = {};
    let salesQuantityData = {};
    
    let monthlySalesFilteredData = {};
    let foreacastFilteredData = {};
    let forcastQuantityData = {}
    
    const forecastLabelsToExtract = ["RequestedDeliveryMonth","Quantity"];
    const salesLabelsToExtract = ["SalesOrderCreationDate", "OrderQuantity"];

    let url = `https://raw.githubusercontent.com/JannesPeeters/suncharge/main/data/`
    


    function applyFilterMonth(data, startDate, endDate, results, ...rowLabels) {
        console.log("extracting data between " + startDate + " and " + endDate)
        const filteredData = data[rowLabels[0]].reduce((acc, label, index) => {

            try{
                const date = new Date(label)

                // Filter based on date being within the start and end date range (inclusive)
                const filtterCondition =  ( (date.getMonth() >= startDate.getMonth() && date.getFullYear() == startDate.getFullYear()) 
                                    && (date.getMonth() <= endDate.getMonth() && date.getFullYear() == startDate.getFullYear()) );

                if (filtterCondition){
                    
                    const month = (date.getMonth()).toString(); // Get month as a number (0-11)
                    const year = date.getFullYear().toString(); // Get full year (YYYY)

                    const dateString = new Date(parseInt(year), parseInt(month) , 1);

                    //const dateString = date.toDateString(); // Convert to date string for grouping
                    acc[dateString] = acc[dateString] || {};
                    for (let i = 1; i < rowLabels.length; i++) {
                        const l = rowLabels[i];
                        acc[dateString][l] = (acc[dateString][l] || 0) + Number(data[l][index]); // Use label for indexing
                    }
                }
            }catch(error)
            {
                console.error("Error parsing date:", error);
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
     */
    function updateChartDate() {
        console.log("Updating pi chart date")
        const [year1, month1] = selectedStartMonthYear.split("-");
        const [year2, month2] = selectedEndMonthYear.split("-");

        selectedStartDate = new Date(parseInt(year1), parseInt(month1) , 0);
        selectedEndDate = new Date(parseInt(year2), parseInt(month2) , 0);
        
        selectedEndDate.setDate(1)
        selectedStartDate.setDate(1)


        if( selectedStartDate < selectedEndDate){
            console.log("Start date is behind of end date, updating chart")
            const labelsToExtract = ["SalesOrderCreationDate", "OrderQuantity"];
            
            applyFilterMonth(forcastQuantityData, selectedStartDate, selectedEndDate, foreacastFilteredData, ...forecastLabelsToExtract);
            applyFilterMonth(salesQuantityData, selectedStartDate, selectedEndDate,  monthlySalesFilteredData, ...salesLabelsToExtract);

            monthlyChart.data.labels = monthlySalesFilteredData[salesLabelsToExtract[0]];
            monthlyChart.data.datasets[0].data = monthlySalesFilteredData[salesLabelsToExtract[1]];
            monthlyChart.data.datasets[1].data = foreacastFilteredData[forecastLabelsToExtract[1]];
            monthlyChart.update()
          
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
            const monthS = (today.getMonth()+1).toString(); // Get month as a number (0-11)
            const monthE = (today.getMonth()+2).toString();
            
            const year = today.getFullYear().toString(); // Get full year (YYYY)

            selectedStartMonthYear = year + '-' + monthS.padStart(2, '0')
            selectedEndMonthYear = year + '-' + monthE.padStart(2, '0')

            selectedStartDate = new Date(parseInt(year), parseInt(monthS) , 0);
            selectedEndDate = new Date(parseInt(year), parseInt(monthE) , 0);
        }
    }

    async function createMonthlyChart(){
        console.log("Creating Monthly Data Chart")

        updateSelectedDate();
        
        console.log(typeof selectedStartDate)
        forcastQuantityData = await fetchData("Forecast", ...forecastLabelsToExtract)
        applyFilterMonth(forcastQuantityData, selectedStartDate, selectedEndDate, foreacastFilteredData, ...forecastLabelsToExtract);
        salesQuantityData = await fetchData("Sales", ...salesLabelsToExtract)
        applyFilterMonth(salesQuantityData, selectedStartDate, selectedEndDate,  monthlySalesFilteredData, ...salesLabelsToExtract);
        
      

        console.log(foreacastFilteredData)
        ctx = monthlyChart.getContext('2d');

        monthlyChart = new ChartJS(ctx, {
        type: 'line', 
            data: {
                labels: monthlySalesFilteredData[salesLabelsToExtract[0]],
                datasets: [{
                        label:'Monthly Quantity',
                        data: monthlySalesFilteredData[salesLabelsToExtract[1]],
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2
                    },
                    {
                        label:'Forecasted Quantity',
                        data: foreacastFilteredData[forecastLabelsToExtract[1]],
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
                        unit: 'month',
                        displayFormats: { // Configure date display format for x-axis labels
                             'day': 'MM-YYYY', // Display as DD-MM-YYYY
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
    }
    

onMount(() => {
    createMonthlyChart();
}); // Create the chart on component mount
</script>
<div class = "container">
    <div class = "inputs">
        <label for="startDate">Start Month:</label>
        <input type="month" id="endDate" bind:value={selectedStartMonthYear} on:change={() => { updateChartDate(); }}>

        <label for="endDate">End Month:</label>
        <input type="month" id="startDate" bind:value={selectedEndMonthYear} on:change={() => { updateChartDate(); }}>
    </div>
    <canvas bind:this={monthlyChart} id = "TimeSeriesMonthly" width=200 height=50 />
</div>

