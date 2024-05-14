<script>
    import { onMount } from 'svelte';
    import { Chart as ChartJS } from 'chart.js/auto';
  
    let chart;
    let ctx;

    async function createChart()   {
        const canvas = document.getElementById('Inventory');
        if (canvas){
            ctx = chart.getContext('2d');
            const data = {
            labels: ['Data 1', 'Data 2', 'Data 3'],
            datasets: [
            {
                data: [30, 50, 20],
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
        <label for="myDate">Select Month and Year:</label>
        <input type="month" id="myDate" >
    </div>
    <canvas bind:this={chart} id = "Inventory" width=400 height=400 />
  
</div>


  