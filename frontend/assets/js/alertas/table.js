import { listAlertas, completeAlerta } from '../api/alertasApi.js';
import { $, renderHTML, showToast, setText } from '../utils/dom.js';

/**
 * Calcula el estado de vencimiento de una alerta
 * @param {string} fechaVencimiento - Fecha de vencimiento
 * @param {string} estado - Estado de la alerta
 * @returns {object} Estado con clase CSS y texto
 */
function getVencimientoStatus(fechaVencimiento, estado) {
    if (!fechaVencimiento) return { clase: '', texto: '', icono: '' };
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fechaVencimiento);
    vencimiento.setHours(0, 0, 0, 0);
    const diffDias = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

    // Si está completada, no mostrar estado de vencimiento
    if (String(estado || '').toLowerCase().includes('completada')) {
        return { clase: 'bg-gray-100 text-gray-600', texto: '', icono: '' };
    }

    if (diffDias < 0) {
        return { 
            clase: 'bg-red-100 text-red-800 border border-red-200', 
            texto: `Vencida hace ${Math.abs(diffDias)} día(s)`, 
            icono: 'bi-exclamation-triangle-fill' 
        };
    } else if (diffDias === 0) {
        return { 
            clase: 'bg-orange-100 text-orange-800 border border-orange-200 animate-pulse', 
            texto: '¡Vence hoy!', 
            icono: 'bi-alarm-fill' 
        };
    } else if (diffDias <= 3) {
        return { 
            clase: 'bg-yellow-100 text-yellow-800 border border-yellow-200', 
            texto: `Vence en ${diffDias} día(s)`, 
            icono: 'bi-clock-fill' 
        };
    } else if (diffDias <= 7) {
        return { 
            clase: 'bg-blue-100 text-blue-800 border border-blue-200', 
            texto: `Vence en ${diffDias} días`, 
            icono: 'bi-calendar-check' 
        };
    }
    return { 
        clase: 'bg-green-100 text-green-800 border border-green-200', 
        texto: `${diffDias} días restantes`, 
        icono: 'bi-check-circle' 
    };
}

/**
 * Obtiene la clase CSS según la prioridad
 */
function getPrioridadBadge(prioridad) {
    const p = prioridad?.toLowerCase() || '';
    if (p.includes('alta')) return 'bg-red-100 text-red-800 border border-red-300';
    if (p.includes('media')) return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    if (p.includes('baja')) return 'bg-green-100 text-green-800 border border-green-300';
    return 'bg-gray-100 text-gray-800 border border-gray-300';
}

/**
 * Obtiene la clase CSS según el estado
 */
function getEstadoBadge(estado) {
    const e = estado?.toLowerCase() || '';
    if (e.includes('completada') || e.includes('resuelta')) return 'bg-green-100 text-green-800 border border-green-300';
    if (e.includes('proceso') || e.includes('curso')) return 'bg-blue-100 text-blue-800 border border-blue-300';
    if (e.includes('pendiente')) return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    if (e.includes('cancelada')) return 'bg-gray-100 text-gray-800 border border-gray-300';
    return 'bg-purple-100 text-purple-800 border border-purple-300';
}

/**
 * Formatea una fecha para mostrar
 */
function formatearFecha(fecha) {
    if (!fecha) return '-';
    const date = new Date(fecha);
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-AR', opciones);
}

/**
 * Template para una fila de la tabla
 */
export function rowTemplate(a) {
    // Extraer ID (puede venir como AlertaId, Id o id)
    const alertaId = a.AlertaId ?? a.Id ?? a.id ?? '';
    const fechaVenc = a.FechaVencimiento || a.fechaVencimiento;
    const estadoNombre = a.Estado || a.estado;
    const prioridadNombre = a.Prioridad || a.prioridad;
    const tipoNombre = a.Tipo || a.tipo;
    const nombreNino = a.Nino || `${a.nombreNino || ''} ${a.apellidoNino || ''}`.trim();
    const legajoId = a.LegajoId || a.legajoId || '-';

    const vencimiento = getVencimientoStatus(fechaVenc, estadoNombre);
    const prioridadClass = getPrioridadBadge(prioridadNombre);
    const estadoClass = getEstadoBadge(estadoNombre);
    const descripcionCorta = (a.Descripcion || a.descripcion || '').length > 80 
        ? (a.Descripcion || a.descripcion || '').substring(0, 80) + '...' 
        : (a.Descripcion || a.descripcion || '-');

    return `
        <tr class="hover:bg-gray-50 transition-all duration-150 cursor-pointer" data-id="${alertaId}">
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getPrioridadBadge(tipoNombre)} shadow-sm">
                    <i class="bi bi-tag-fill mr-1.5"></i>${tipoNombre ?? '-'}
                </span>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        ${(nombreNino || 'NN').trim()[0] || 'N'}
                    </div>
                    <div>
                        <div class="text-sm font-semibold text-gray-900">${nombreNino || '-'}</div>
                        <div class="text-xs text-gray-500 flex items-center gap-1">
                            <i class="bi bi-file-text"></i>Legajo #${legajoId}
                        </div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 max-w-md">
                <p class="text-sm text-gray-700 line-clamp-2" title="${a.descripcion || ''}">${descripcionCorta}</p>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${prioridadClass} shadow-sm">
                    <i class="bi bi-exclamation-circle-fill mr-1.5"></i>${prioridadNombre ?? '-'}
                </span>
            </td>
            <td class="px-6 py-4">
                <div class="space-y-1.5">
                    <div class="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                        <i class="bi bi-calendar3 text-gray-400"></i>${formatearFecha(fechaVenc)}
                    </div>
                    ${vencimiento.texto ? `
                        <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${vencimiento.clase} shadow-sm">
                            <i class="${vencimiento.icono} mr-1.5"></i>${vencimiento.texto}
                        </span>
                    ` : ''}
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${estadoClass} shadow-sm">
                    <i class="bi bi-flag-fill mr-1.5"></i>${estadoNombre ?? '-'}
                </span>
            </td>
        </tr>
    `;
}

/**
 * Carga las alertas con filtros opcionales
 */
export async function loadAlertas(params = {}) {
    try {
        const data = await listAlertas(params);
        const items = Array.isArray(data) ? data : (data?.items || []);
        
        // Actualizar contador total
        setText($('#totalRegistros'), items.length);
        
        if (!items.length) {
            renderHTML($('#tablaAlertas'), `
                <tr>
                    <td colspan="6" class="px-6 py-16 text-center">
                        <div class="flex flex-col items-center justify-center text-gray-500">
                            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <i class="bi bi-inbox text-5xl text-gray-300"></i>
                            </div>
                            <p class="text-lg font-semibold text-gray-700 mb-2">No se encontraron alertas</p>
                            <p class="text-sm text-gray-500">Intente ajustar los filtros o crear una nueva alerta</p>
                        </div>
                    </td>
                </tr>
            `);
            return;
        }
        
        renderHTML($('#tablaAlertas'), items.map(rowTemplate).join(''));
        
        // Retornar los items para que puedan ser usados por page.js para la selección
        return items;
    } catch (err) {
        showToast(`Error al listar alertas: ${err.message}`, 'error');
        renderHTML($('#tablaAlertas'), `
            <tr>
                <td colspan="6" class="px-6 py-16 text-center">
                    <div class="flex flex-col items-center justify-center text-red-500">
                        <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <i class="bi bi-exclamation-triangle text-5xl"></i>
                        </div>
                        <p class="text-lg font-semibold text-gray-900 mb-2">Error al cargar alertas</p>
                        <p class="text-sm text-gray-600">${err.message}</p>
                    </div>
                </td>
            </tr>
        `);
    }
}

/**
 * Muestra el modal con el detalle completo de una alerta
 */
function mostrarDetalleAlerta(alerta) {
    const vencimiento = getVencimientoStatus(alerta.fechaVencimiento, alerta.estado);
    const contenido = `
        <div class="space-y-6">
            <!-- Header con ID y Estado -->
            <div class="flex items-center justify-between pb-4 border-b">
                <div>
                    <h3 class="text-2xl font-bold text-gray-900">Alerta #${alerta.id}</h3>
                    <p class="text-sm text-gray-500 mt-1">Creada el ${formatearFecha(alerta.fechaCreacion)}</p>
                </div>
                <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getEstadoBadge(alerta.estado)}">
                    <i class="bi bi-flag-fill mr-2"></i>${alerta.estado}
                </span>
            </div>

            <!-- Información Principal -->
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold text-gray-500 mb-1">Tipo de Alerta</label>
                    <span class="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${getPrioridadBadge(alerta.tipo)}">
                        <i class="bi bi-tag-fill mr-2"></i>${alerta.tipo}
                    </span>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-500 mb-1">Prioridad</label>
                    <span class="inline-flex items-center px-3 py-2 rounded-lg text-sm font-bold ${getPrioridadBadge(alerta.prioridad)}">
                        <i class="bi bi-exclamation-circle-fill mr-2"></i>${alerta.prioridad}
                    </span>
                </div>
            </div>

            <!-- Niño/Legajo -->
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <label class="block text-sm font-semibold text-blue-700 mb-2">Niño/Legajo Asociado</label>
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        ${(alerta.nombreNino || 'N')[0]}${(alerta.apellidoNino || 'N')[0]}
                    </div>
                    <div>
                        <p class="font-semibold text-gray-900">${alerta.nombreNino} ${alerta.apellidoNino}</p>
                        <p class="text-sm text-gray-600">Legajo #${alerta.legajoId}</p>
                    </div>
                </div>
            </div>

            <!-- Descripción -->
            <div>
                <label class="block text-sm font-semibold text-gray-500 mb-2">Descripción</label>
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p class="text-gray-700">${alerta.descripcion || 'Sin descripción'}</p>
                </div>
            </div>

            <!-- Fechas -->
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold text-gray-500 mb-2">Fecha de Vencimiento</label>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p class="font-semibold text-gray-900">${formatearFecha(alerta.fechaVencimiento)}</p>
                        ${vencimiento.texto ? `
                            <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium mt-2 ${vencimiento.clase}">
                                <i class="${vencimiento.icono} mr-1"></i>${vencimiento.texto}
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-500 mb-2">Última Modificación</label>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p class="font-semibold text-gray-900">${formatearFecha(alerta.fechaModificacion)}</p>
                        ${alerta.usuarioModificacion ? `<p class="text-xs text-gray-500 mt-1">Por: ${alerta.usuarioModificacion}</p>` : ''}
                    </div>
                </div>
            </div>

            <!-- Auditoría -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 class="text-sm font-semibold text-gray-700 mb-2"><i class="bi bi-shield-check mr-1"></i>Información de Auditoría</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-gray-500">Creado por:</span>
                        <span class="font-medium text-gray-900 ml-2">${alerta.usuarioCreacion || 'Sistema'}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Modificado por:</span>
                        <span class="font-medium text-gray-900 ml-2">${alerta.usuarioModificacion || '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    renderHTML($('#detalleAlertaContenido'), contenido);
    toggleModal('modalDetalleAlerta');
}


