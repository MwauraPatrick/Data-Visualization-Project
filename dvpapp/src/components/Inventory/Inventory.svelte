<script>
    import { onMount } from 'svelte';
    import { Chart as ChartJS } from 'chart.js/auto';
  
    let chart;
    let ctx;

    onMount(() => {
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
          responsive: true, // Makes chart responsive to screen size
          maintainAspectRatio: false, // Prevents chart distortion
        },
      });
    });
  </script>
  
  <style>
    #myChart {
      width: 400px;
      height: 400px;
    }
  </style>
  
  <canvas bind:this={chart} id = "Inventory" width=300 height=300 />
  