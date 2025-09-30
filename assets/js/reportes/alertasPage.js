import { filtrosAlertas, dashboardAlertas } from '../api/alertasApi.js';
import { $, renderHTML, showToast } from '../utils/dom.js';

function estadoColor(a) {
    if (!a.vencimiento || a.estado === 'Completada') return '';
    const diff = new Date(a.vencimiento) - new Date();
    const day = 1000 * 60 * 60 * 24;
    if (diff < 0) return 'table-danger';
    if (diff <= day*2) return 'table-warning';
    return 'table-success';
}

function row(a) {
    return `
        <tr class="${estadoColor(a)}">
            <td>${a.id ?? ''}</td>
            <td>${a.tipo ?? ''}</td>
            <td>${a.descripcion ?? ''}</td>
            <td>${a.vencimiento ? new Date(a.vencimiento).toLocaleString() : ''}</td>
            <td>${a.prioridad ?? ''}</td>
            <td>${a.estado ?? ''}</td>
        </tr>
    `;
}

async function filtrarAlertas() {
    const params = {
        tipo: $('#fTipo')?.value,
        prioridad: $('#fPrioridad')?.value,
        estado: $('#fEstado')?.value,
    };
    try {
        const data = await filtrosAlertas(params);
        const items = Array.isArray(data) ? data : (data?.items || []);
        if (!items.length) {
            renderHTML($('#tablaReportesAlertas tbody'), `<tr><td colspan="6" class="empty-state">Sin resultados</td></tr>`);
            return [];
        }
        renderHTML($('#tablaReportesAlertas tbody'), items.map(row).join(''));
        return items;
    } catch (e) {
        showToast(`Error al filtrar: ${e.message}`);
        return [];
    }
}

function exportExcel(rows) {
    if (!rows || !rows.length) return showToast('No hay datos para exportar');
    const header = ['Id', 'Tipo', 'Descripción', 'Vencimiento', 'Prioridad', 'Estado'];
    const data = rows.map(a => [a.id, a.tipo, a.descripcion, a.vencimiento, a.prioridad, a.estado]);
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alertas');
    XLSX.writeFile(wb, 'reporte_alertas.xlsx');
}

function exportPdf(rows) {
    if (!rows || !rows.length) return showToast('No hay datos para exportar');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l');
    doc.setFontSize(12);
    doc.text('Reporte de Alertas', 14, 14);
    const header = ['Id', 'Tipo', 'Descripción', 'Vencimiento', 'Prioridad', 'Estado'];
    const body = rows.map(a => [String(a.id||''), String(a.tipo||''), String(a.descripcion||''), String(a.vencimiento||''), String(a.prioridad||''), String(a.estado||'')]);
    let y = 24;
    doc.setFontSize(9);
    doc.text(header.join(' | '), 14, y); y += 6;
    body.forEach(r => { doc.text(r.join(' | '), 14, y); y += 6; });
    doc.save('reporte_alertas.pdf');
}

function buildBar(ctx, label, labels, data) {
    /* global Chart */
    return new Chart(ctx, { type: 'bar', data: { labels, datasets: [{ label, data, backgroundColor: '#0d6efd' }] }, options: { responsive: true, maintainAspectRatio: false } });
}

async function renderDashboard() {
    try {
        const data = await dashboardAlertas();
        const est = data?.porEstado || [];
        const pri = data?.porPrioridad || [];
        buildBar(document.getElementById('chart-estado'), 'Por estado', est.map(x=>x.label), est.map(x=>x.value));
        buildBar(document.getElementById('chart-prioridad'), 'Por prioridad', pri.map(x=>x.label), pri.map(x=>x.value));
    } catch (e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', () => {
    let lastRows = [];
    $('#btnFiltrar')?.addEventListener('click', async () => { lastRows = await filtrarAlertas(); });
    $('#btnExportExcel')?.addEventListener('click', () => exportExcel(lastRows));
    $('#btnExportPdf')?.addEventListener('click', () => exportPdf(lastRows));
    renderDashboard();
});

export { filtrarAlertas, renderDashboard };


