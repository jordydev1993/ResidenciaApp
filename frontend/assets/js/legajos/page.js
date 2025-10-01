import { $, $$ } from '../utils/dom.js';
import { bindLegajoForm } from './form.js';
import { loadLegajos } from './table.js';
import { listEstados } from '../api/legajosApi.js';

function bindSearch() {
    const input = $('#busquedaLegajos');
    if (!input) return;
    input.addEventListener('input', () => {
        const q = input.value.trim();
        const params = q ? { q } : {};
        loadLegajos(params);
    });
}

async function populateEstados() {
    const select = document.querySelector('select[name="estadoId"]') || document.querySelector('select[name="estado"]');
    if (!select) return;
    try {
        const data = await listEstados();
        const rows = Array.isArray(data) ? data : (data?.items || data?.Rows || data);
        const options = Array.isArray(rows) ? rows : [];
        select.innerHTML = '<option value="">Seleccionar</option>' + options.map(r => {
            const id = r.Id ?? r["Id"] ?? r[0];
            const nombre = r.Nombre ?? r["Nombre"] ?? r[1];
            return `<option value="${id}">${nombre}</option>`;
        }).join('');
    } catch (err) {
        // Si falla, dejamos opciones actuales (hardcode)
        console.error('Error cargando estados', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateEstados();
    bindLegajoForm(() => loadLegajos());
    bindSearch();
    loadLegajos();
});


