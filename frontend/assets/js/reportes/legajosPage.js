import { reportesLegajos } from '../api/legajosApi.js';
import { $, renderHTML, showToast } from '../utils/dom.js';

function row(r) {
    const fecha = r.fechaIngreso ? new Date(r.fechaIngreso).toLocaleDateString() : '';
    return `
        <tr>
            <td>${r.dni ?? ''}</td>
            <td>${r.nombre ?? ''}</td>
            <td>${fecha}</td>
            <td>${r.estado ?? ''}</td>
            <td>${r.tutor ?? ''}</td>
            <td>${r.observaciones ?? ''}</td>
        </tr>
    `;
}

async function listarLegajosDetalle() {
    const params = {
        desde: $('#fDesde')?.value,
        hasta: $('#fHasta')?.value,
        estado: $('#fEstado')?.value,
        tutor: $('#fTutor')?.value,
    };
    try {
        const data = await reportesLegajos(params);
        const items = Array.isArray(data) ? data : (data?.items || []);
        if (!items.length) {
            renderHTML($('#tablaReportesLegajos tbody'), `<tr><td colspan="6" class="empty-state">Sin resultados</td></tr>`);
            return;
        }
        renderHTML($('#tablaReportesLegajos tbody'), items.map(row).join(''));
        return items;
    } catch (e) {
        showToast(`Error al generar reporte: ${e.message}`);
        return [];
    }
}

function exportarExcel(rows) {
    if (!rows || !rows.length) return showToast('No hay datos para exportar');
    const header = ['DNI', 'Nombre', 'FechaIngreso', 'Estado', 'Tutor', 'Observaciones'];
    const data = rows.map(r => [r.dni, r.nombre, r.fechaIngreso, r.estado, r.tutor, r.observaciones]);
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Legajos');
    XLSX.writeFile(wb, 'reporte_legajos.xlsx');
}

function exportarPdf(rows) {
    if (!rows || !rows.length) return showToast('No hay datos para exportar');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(12);
    doc.text('Reporte de Legajos', 14, 14);
    const header = ['DNI', 'Nombre', 'FechaIngreso', 'Estado', 'Tutor', 'Observaciones'];
    const body = rows.map(r => [String(r.dni||''), String(r.nombre||''), String(r.fechaIngreso||''), String(r.estado||''), String(r.tutor||''), String(r.observaciones||'')]);
    let y = 24;
    doc.setFontSize(9);
    doc.text(header.join(' | '), 14, y);
    y += 6;
    body.forEach(row => { doc.text(row.join(' | '), 14, y); y += 6; });
    doc.save('reporte_legajos.pdf');
}

document.addEventListener('DOMContentLoaded', () => {
    let lastRows = [];
    $('#btnGenerar')?.addEventListener('click', async () => { lastRows = await listarLegajosDetalle(); });
    $('#btnExportExcel')?.addEventListener('click', () => exportarExcel(lastRows));
    $('#btnExportPdf')?.addEventListener('click', () => exportarPdf(lastRows));
});

export { listarLegajosDetalle };


