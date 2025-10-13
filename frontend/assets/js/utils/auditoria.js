/**
 * Utilidad para mostrar información de auditoría
 * @module utils/auditoria
 */

/**
 * Formatea una fecha para mostrar en auditoría
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatearFechaAuditoria(fecha) {
    if (!fecha) return 'No disponible';
    const date = new Date(fecha);
    const opciones = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('es-AR', opciones);
}

/**
 * Genera HTML para mostrar información de auditoría
 * @param {Object} data - Datos del registro
 * @param {string} data.fechaCreacion - Fecha de creación
 * @param {string} data.usuarioCreacion - Usuario que creó
 * @param {string} data.fechaModificacion - Fecha de última modificación
 * @param {string} data.usuarioModificacion - Usuario que modificó
 * @returns {string} HTML de la sección de auditoría
 */
export function generarSeccionAuditoria(data) {
    const fechaCreacion = data.FechaCreacion ?? data.fechaCreacion ?? data['FechaCreacion'];
    const usuarioCreacion = data.UsuarioCreacion ?? data.usuarioCreacion ?? data['UsuarioCreacion'];
    const fechaModificacion = data.FechaModificacion ?? data.fechaModificacion ?? data['FechaModificacion'];
    const usuarioModificacion = data.UsuarioModificacion ?? data.usuarioModificacion ?? data['UsuarioModificacion'];
    
    return `
        <div class="mt-4 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <i class="bi bi-shield-check mr-2 text-blue-600"></i>
                Información de Auditoría
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-500">Creado:</span>
                    <div class="font-medium text-gray-900 mt-1">
                        ${formatearFechaAuditoria(fechaCreacion)}
                    </div>
                    ${usuarioCreacion ? `
                        <div class="text-xs text-gray-500 mt-1">
                            Por: ${usuarioCreacion}
                        </div>
                    ` : ''}
                </div>
                ${fechaModificacion ? `
                    <div>
                        <span class="text-gray-500">Última modificación:</span>
                        <div class="font-medium text-gray-900 mt-1">
                            ${formatearFechaAuditoria(fechaModificacion)}
                        </div>
                        ${usuarioModificacion ? `
                            <div class="text-xs text-gray-500 mt-1">
                                Por: ${usuarioModificacion}
                            </div>
                        ` : ''}
                    </div>
                ` : '<div class="text-gray-400 text-xs">Sin modificaciones</div>'}
            </div>
        </div>
    `;
}

/**
 * Agrega un botón de auditoría a una fila de tabla
 * @param {number|string} id - ID del registro
 * @param {Object} data - Datos completos del registro
 * @returns {string} HTML del botón de auditoría
 */
export function botonAuditoria(id, data) {
    const dataAttr = encodeURIComponent(JSON.stringify({
        fechaCreacion: data.FechaCreacion ?? data.fechaCreacion,
        usuarioCreacion: data.UsuarioCreacion ?? data.usuarioCreacion,
        fechaModificacion: data.FechaModificacion ?? data.fechaModificacion,
        usuarioModificacion: data.UsuarioModificacion ?? data.usuarioModificacion
    }));
    
    return `
        <button 
            class="btn-auditoria p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" 
            data-id="${id}"
            data-auditoria="${dataAttr}"
            title="Ver auditoría">
            <i class="bi bi-info-circle-fill"></i>
        </button>
    `;
}

/**
 * Muestra un modal con información de auditoría
 * @param {Object} data - Datos de auditoría
 */
export function mostrarModalAuditoria(data) {
    const modalHTML = `
        <div id="modalAuditoria" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                    <h3 class="text-xl font-bold text-white flex items-center">
                        <i class="bi bi-shield-check mr-2"></i>
                        Información de Auditoría
                    </h3>
                    <button onclick="cerrarModalAuditoria()" class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors">
                        <i class="bi bi-x-lg text-xl"></i>
                    </button>
                </div>
                <div class="p-6">
                    ${generarSeccionAuditoria(data)}
                </div>
            </div>
        </div>
    `;
    
    // Eliminar modal anterior si existe
    const modalAnterior = document.getElementById('modalAuditoria');
    if (modalAnterior) modalAnterior.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Agregar función de cierre global si no existe
    if (!window.cerrarModalAuditoria) {
        window.cerrarModalAuditoria = () => {
            const modal = document.getElementById('modalAuditoria');
            if (modal) modal.remove();
        };
    }
}

/**
 * Inicializa los listeners para botones de auditoría
 * @param {string} containerId - ID del contenedor que contiene los botones
 */
export function inicializarBotonesAuditoria(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.addEventListener('click', (e) => {
        const btnAuditoria = e.target.closest('.btn-auditoria');
        if (btnAuditoria) {
            try {
                const dataStr = btnAuditoria.getAttribute('data-auditoria');
                const data = JSON.parse(decodeURIComponent(dataStr));
                mostrarModalAuditoria(data);
            } catch (err) {
                console.error('Error al mostrar auditoría:', err);
            }
        }
    });
}

