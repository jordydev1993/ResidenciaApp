import { listLegajos, deleteLegajo } from '../api/legajosApi.js';
import { $, renderHTML, showToast } from '../utils/dom.js';

function rowTemplate(r) {
    const estadoColor = r.estadoNombre === 'Activo' ? 'text-green-600' : 
                       r.estadoNombre === 'Egresado' ? 'text-blue-600' : 
                       r.estadoNombre === 'En seguimiento' ? 'text-yellow-600' : 'text-gray-600';
    
    return `
        <tr>
            <td class="px-6 py-3">${r.dni ?? ''}</td>
            <td class="px-6 py-3">${r.nombre ?? ''}</td>
            <td class="px-6 py-3">
                <span class="${estadoColor} font-medium">${r.estadoNombre ?? r.estado ?? ''}</span>
            </td>
            <td class="px-6 py-3">${r.fechaIngreso ? new Date(r.fechaIngreso).toLocaleDateString() : ''}</td>
            <td class="px-6 py-3">${r.tutorNombre ?? r.tutor ?? 'Sin tutor'}</td>
            <td class="px-6 py-3 space-x-3">
                <button data-id="${r.id || r.Id || ''}" 
                        data-dni="${r.dni}" 
                        data-nombre="${r.nombre}" 
                        data-fechaIngreso="${r.fechaIngreso}" 
                        data-estadoId="${r.estadoId || r.EstadoId}" 
                        data-tutorId="${r.tutorId || r.TutorId}" 
                        data-observaciones="${r.observaciones || ''}" 
                        class="btn-edit text-blue-600 hover:underline">Editar</button>
                <button data-id="${r.id || r.Id || ''}" 
                        class="btn-delete text-red-600 hover:underline">Eliminar</button>
            </td>
        </tr>
    `;
}

export async function loadLegajos(params = {}) {
    try {
        const data = await listLegajos(params);
        const items = Array.isArray(data) ? data : (data?.items || []);
        if (!items.length) {
            renderHTML($('#tablaLegajos'), `<tr><td colspan="6" class="px-6 py-3 text-center text-gray-500">Sin resultados</td></tr>`);
            return;
        }
        renderHTML($('#tablaLegajos'), items.map(rowTemplate).join(''));
        bindRowActions();
    } catch (err) {
        showToast(`Error al listar: ${err.message}`);
    }
}

function bindRowActions() {
    const tbody = $('#tablaLegajos');
    if (!tbody) return;
    
    tbody.addEventListener('click', async (e) => {
        const editBtn = e.target.closest('.btn-edit');
        const deleteBtn = e.target.closest('.btn-delete');
        
        if (editBtn) {
            const legajo = {
                id: editBtn.getAttribute('data-id'),
                dni: editBtn.getAttribute('data-dni'),
                nombre: editBtn.getAttribute('data-nombre'),
                fechaIngreso: editBtn.getAttribute('data-fechaIngreso'),
                estadoId: editBtn.getAttribute('data-estadoId'),
                tutorId: editBtn.getAttribute('data-tutorId'),
                observaciones: editBtn.getAttribute('data-observaciones')
            };
            
            // Usar el manager de formulario para editar
            if (window.legajoFormManager) {
                window.legajoFormManager.editarLegajo(legajo);
            }
        }
        
        if (deleteBtn) {
            const id = deleteBtn.getAttribute('data-id');
            if (confirm('¿Está seguro de que desea eliminar este legajo?')) {
                try {
                    await deleteLegajo(id);
                    showToast('Legajo eliminado correctamente');
                    loadLegajos();
                } catch (err) {
                    showToast(`Error al eliminar: ${err.message}`);
                }
            }
        }
    });
}

// Función global para recargar la tabla
window.recargarTablaLegajos = () => loadLegajos();


