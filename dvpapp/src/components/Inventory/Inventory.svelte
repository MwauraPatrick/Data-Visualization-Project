<script>
    import { onMount } from 'svelte';
    import { Chart as ChartJS } from 'chart.js/auto';
    import {fetchData, formatDate, applyFilter2} from '../Helper/helper'

    import moment from 'moment'; // Import Moment.js
    import 'chartjs-adapter-moment';

    let chart;
    let ctx;
    
    //startMonth
    let inventoryData = {};
    let inventoryFilteredData = {};
    const inventoryLabelsToExtract = ["SnapshotDate","OnShelfInventoryQuantity", 'InTransitQuantity'];
    
    let selectedDate;
    let selectedMonthYear;

    function applyFilter(data, startDate, endDate, results, ...rowLabels) {
        console.log("extracting data between " + startDate + " and " + endDate)
        const filteredData = data[rowLabels[0]].reduce((acc, label, index) => {

            try{
                const date = new Date(label)
                console.log(date)
                // Filter based on date being within the start and end date range (inclusive)
                //if (date >= startDate && date <= endDate) {
                if (date.getMonth() == startDate.getMonth() && date.getFullYear() == startDate.getFullYear()){
                    const dateString = date.toDateString(); // Convert to date string for grouping
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
     * @param selectedMonth
     * @param selectedYear
     */
    function updateSelectedDate(selectedMonth, selectedYear) {
        if (selectedMonth && selectedYear) {
            //Do nothing
        } else {
            const today = new Date();
            const month = (today.getMonth()+1).toString(); // Get month as a number (0-11)
            const year = today.getFullYear().toString(); // Get full year (YYYY)

            selectedMonthYear = year + '-' + month.padStart(2, '0')

            selectedDate = new Date(parseInt(year), parseInt(month) , 0);
        }
    }
    /**
     * 
     */
    function updateChartDate(){
        console.log("Updating pi chart date")
        const [year, month] = selectedMonthYear.split("-");
        selectedDate = new Date(parseInt(year), parseInt(month) , 0);
        console.log(year, month, selectedDate)

        applyFilter(inventoryData,selectedDate, selectedDate, inventoryFilteredData, ...inventoryLabelsToExtract)

        let data_a = inventoryFilteredData[inventoryLabelsToExtract[1]]
        let data_b = inventoryFilteredData[inventoryLabelsToExtract[2]]
    

        if (data_a.length|| data_b.length){
            chart.data.datasets[0].data = [data_a, data_b]
            chart.update()
        }
        else{
            console.error("No data available for the selected month")
        }
        console.log(inventoryFilteredData)
    }
    /**
     * 
     */
    async function createChart()   {
        const canvas = document.getElementById('Inventory');
        
        updateSelectedDate();
        
        inventoryData = await fetchData("Inventory", ...inventoryLabelsToExtract)
        applyFilter(inventoryData,selectedDate, selectedDate, inventoryFilteredData, ...inventoryLabelsToExtract)

        let data_a = inventoryFilteredData[inventoryLabelsToExtract[1]]
        let data_b = inventoryFilteredData[inventoryLabelsToExtract[2]]
      

        if (! data_a.length|| ! data_b.length ){
            data_a = 33.33
            data_b = 33.33
        }

        if (canvas){
            ctx = chart.getContext('2d');
            const data = {
            labels: ['Gross', 'On Shelf', 'In Transit'],
            datasets: [
            {
                data: [data_a, data_b],
                backgroundColor: ['red', 'green', 'blue'],
                hoverBackgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                borderColor: 'white',
                borderWidth: 1,
            },
            ],
        };
  
        chart = new ChartJS(ctx, {
            type: 'doughnut',
            data,
            options: {
            // Optional chart options (refer to Chart.js documentation)
            responsive: false, // Makes chart responsive to screen size
            maintainAspectRatio: false, // Prevents chart distortion
            },
        });
    }
    };

    onMount(() => createChart()); // Create the chart on component mount
  </script>

<div class = "container">
    <div class = "inputs">
        <label for="invDate">Select Month and Year:</label>
        <input type="month" id="invDate" bind:value={selectedMonthYear} on:change={() => { updateChartDate(); }}>
    </div>
    <canvas bind:this={chart} id = "Inventory" width=400 height=400 />
  
</div>


  