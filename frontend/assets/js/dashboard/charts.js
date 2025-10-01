export function buildBarChart(ctx, label, labels, data) {
    /* global Chart */
    return new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label, data, backgroundColor: '#0d6efd' }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
}


