import { $, renderHTML, showToast } from '../utils/dom.js';
import { listPrioridades } from '../api/alertasApi.js';

function rowTemplate(r) {
    const id = r.Id ?? r["Id"] ?? r.id ?? r[0];
    const nombre = r.Nombre ?? r["Nombre"] ?? r.nombre ?? r[1];
    const color = r.Color ?? r["Color"] ?? r.color ?? r[2] ?? '#3B82F6';
    const orden = r.Orden ?? r["Orden"] ?? r.orden ?? r[3] ?? '';
    const descripcion = r.Descripcion ?? r["Descripcion"] ?? r.descripcion ?? r[4] ?? '';
    
    return `<tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${nombre}</td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm" style="background-color: ${color}"></div>
                <span class="text-xs text-gray-600 font-mono">${color}</span>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ${orden || 'Sin orden'}
            </span>
        </td>
        <td class="px-6 py-4 text-sm text-gray-600">${descripcion || '<span class="text-gray-400">Sin descripción</span>'}</td>
    </tr>`;
}

async function load() {
    try {
        const data = await listPrioridades();
        const items = Array.isArray(data) ? data : (data?.items || data);
        
        // Actualizar contador
        const contador = $('#totalRegistros');
        if (contador) contador.textContent = items?.length || 0;
        
        if (!items || !items.length) {
            renderHTML($('#tablaPrioridad'), `<tr><td colspan="5" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                    <i class="bi bi-inbox text-4xl text-gray-300 mb-2"></i>
                    <p>No hay prioridades registradas</p>
                </div>
            </td></tr>`);
            return;
        }
        renderHTML($('#tablaPrioridad'), items.map(rowTemplate).join(''));
    } catch (err) {
        showToast(`❌ Error al cargar: ${err.message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    load();
});
