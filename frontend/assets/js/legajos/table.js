import { listLegajos, deleteLegajo } from '../api/legajosApi.js';
import { $, renderHTML, showToast } from '../utils/dom.js';

function rowTemplate(r) {
    const estadoColor = r.estadoNombre === 'Activo' ? 'text-green-600' : 
                       r.estadoNombre === 'Egresado' ? 'text-blue-600' : 
                       r.estadoNombre === 'En seguimiento' ? 'text-yellow-600' : 'text-gray-600';
    
    return `
        <tr data-id="${r.id || r.Id || ''}" 
            data-dni="${r.dni}" 
            data-nombre="${r.nombre}" 
            data-fechaIngreso="${r.fechaIngreso}" 
            data-estadoId="${r.estadoId || r.EstadoId}" 
            data-tutorId="${r.tutorId || r.TutorId}" 
            data-observaciones="${r.observaciones || ''}">
            <td class="px-6 py-3">${r.dni ?? ''}</td>
            <td class="px-6 py-3">${r.nombre ?? ''}</td>
            <td class="px-6 py-3">
                <span class="${estadoColor} font-medium">${r.estadoNombre ?? r.estado ?? ''}</span>
            </td>
            <td class="px-6 py-3">${r.fechaIngreso ? new Date(r.fechaIngreso).toLocaleDateString() : ''}</td>
            <td class="px-6 py-3">${r.tutorNombre ?? r.tutor ?? 'Sin tutor'}</td>
        </tr>
    `;
}

export async function loadLegajos(params = {}) {
    try {
        const data = await listLegajos(params);
        const items = Array.isArray(data) ? data : (data?.items || []);
        if (!items.length) {
            renderHTML($('#tablaLegajos'), `<tr><td colspan="5" class="px-6 py-3 text-center text-gray-500">Sin resultados</td></tr>`);
            return items;
        }
        renderHTML($('#tablaLegajos'), items.map(rowTemplate).join(''));
        return items;
    } catch (err) {
        showToast(`Error al listar: ${err.message}`);
        return [];
    }
}

// Función global para recargar la tabla
window.recargarTablaLegajos = () => loadLegajos();


