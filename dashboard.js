var dataByLocation = [20000, 30000, 25000, 35000];
var locationLabels = ['Location 1', 'Location 2', 'Location 3', 'Location 4'];
var dataByType = [15000, 25000, 20000, 30000];
var typeLabels = ["Type 1", "Type 2", "Type 3", "Type 4"]

function createHorizontalBarChart(canvasId, label, data, chartLabels) {
    var ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

createHorizontalBarChart('revenueByLocationChart', 'Revenue by Job Location', dataByLocation, locationLabels);
createHorizontalBarChart('revenueByTypeChart', 'Revenue by Job Type', dataByType, typeLabels);