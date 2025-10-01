import { $, $$ } from '../utils/dom.js';
import { bindLegajoForm } from './form.js';
import { loadLegajos } from './table.js';

function bindSearch() {
    const input = $('#busquedaLegajos');
    if (!input) return;
    input.addEventListener('input', () => {
        const q = input.value.trim();
        const params = q ? { q } : {};
        loadLegajos(params);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bindLegajoForm(() => loadLegajos());
    bindSearch();
    loadLegajos();
});


