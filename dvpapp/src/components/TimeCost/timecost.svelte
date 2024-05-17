<script>
    import { onMount, onDestroy } from 'svelte';
    import { Chart as ChartJS } from 'chart.js/auto';
    import { BarElement, CategoryScale, LinearScale, Title, Tooltip }from 'chart.js'; // For line chart

    ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);
  
    let ctx;
    let chart; // Declare a variable to hold the Chart.js instance
    let chartValues = [20, 10, 5, 2, 20, 30, 45];
    let chartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
    

    async function createBarChart()  {
        self.console.log("Inside chart")
        ctx = chart.getContext('2d');

        chart = new ChartJS(ctx, {
        type: 'bar', 
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

  onMount(() => createBarChart()); // Create the chart on component mount
</script>


<div class = "container">
    <canvas bind:this={chart} id = "TimeCost" width={200} height={50} />
</div>
