import { listLegajos } from '../api/legajosApi.js';
import { $, renderHTML, showToast } from '../utils/dom.js';

function rowTemplate(r) {
    return `
        <tr>
            <td>${r.dni ?? ''}</td>
            <td>${r.nombre ?? ''}</td>
            <td>${r.estado ?? ''}</td>
            <td>${r.fechaIngreso ? new Date(r.fechaIngreso).toLocaleDateString() : ''}</td>
            <td>${r.tutor ?? ''}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary" disabled>Editar</button>
            </td>
        </tr>
    `;
}

export async function loadLegajos(params = {}) {
    try {
        const data = await listLegajos(params);
        const items = Array.isArray(data) ? data : (data?.items || []);
        if (!items.length) {
            renderHTML($('#tablaLegajos'), `<tr><td colspan="6" class="empty-state">Sin resultados</td></tr>`);
            return;
        }
        renderHTML($('#tablaLegajos'), items.map(rowTemplate).join(''));
    } catch (err) {
        showToast(`Error al listar: ${err.message}`);
    }
}


