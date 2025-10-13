import { $, renderHTML, showToast } from '../utils/dom.js';
import { listTipoAlertas } from '../api/alertasApi.js';

function rowTemplate(r) {
    const id = r.Id ?? r["Id"] ?? r[0];
    const nombre = r.Nombre ?? r["Nombre"] ?? r[1];
    const descripcion = r.Descripcion ?? r["Descripcion"] ?? r[2] ?? '';
    
    return `<tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${nombre}</td>
        <td class="px-6 py-4 text-sm text-gray-600">${descripcion || '<span class="text-gray-400">Sin descripción</span>'}</td>
    </tr>`;
}

async function load() {
    try {
        const data = await listTipoAlertas();
        const items = Array.isArray(data) ? data : (data?.items || data);
        
        // Actualizar contador
        const contador = $('#totalRegistros');
        if (contador) contador.textContent = items?.length || 0;
        
        if (!items || !items.length) {
            renderHTML($('#tablaTipoAlerta'), `<tr><td colspan="3" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                    <i class="bi bi-inbox text-4xl text-gray-300 mb-2"></i>
                    <p>No hay tipos de alerta registrados</p>
                </div>
            </td></tr>`);
            return;
        }
        renderHTML($('#tablaTipoAlerta'), items.map(rowTemplate).join(''));
    } catch (err) {
        showToast(`❌ Error al cargar: ${err.message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    load();
});
