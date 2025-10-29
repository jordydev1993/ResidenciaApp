import { bindAlertaForm, loadCatalogos } from './form.js';
import { loadAlertas, rowTemplate } from './table.js';
import { $, setText, showToast } from '../utils/dom.js';
import { listAlertas, listTipoAlertas, listPrioridades, listEstadoAlertas, updateAlerta, deleteAlerta } from '../api/alertasApi.js';
import { Pagination } from '../utils/pagination.js';

// Variable para mantener la alerta seleccionada
let selectedAlerta = null;
let alertasData = [];
let filteredData = []; // Datos filtrados (sin paginar)
let pagination = null; // Instancia de paginación

/**
 * Carga las estadísticas del dashboard
 */
async function loadStats() {
    try {
        const alertas = await listAlertas();
        const items = Array.isArray(alertas) ? alertas : (alertas?.items || []);
        
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const vencidas = items.filter(a => {
            const venc = new Date(a.FechaVencimiento || a.fechaVencimiento);
            venc.setHours(0, 0, 0, 0);
            const estadoNombre = a.Estado || a.estado || '';
            return venc < hoy && !String(estadoNombre).toLowerCase().includes('completada');
        }).length;
        
        const proximasTresDias = items.filter(a => {
            const venc = new Date(a.FechaVencimiento || a.fechaVencimiento);
            venc.setHours(0, 0, 0, 0);
            const diffDias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
            const estadoNombre = a.Estado || a.estado || '';
            return diffDias >= 0 && diffDias <= 3 && !String(estadoNombre).toLowerCase().includes('completada');
        }).length;
        
        const pendientes = items.filter(a => {
            const estadoNombre = a.Estado || a.estado || '';
            const lower = String(estadoNombre).toLowerCase();
            return lower.includes('pendiente') || lower.includes('proceso');
        }).length;
        
        const completadas = items.filter(a => {
            const estadoNombre = a.Estado || a.estado || '';
            return String(estadoNombre).toLowerCase().includes('completada');
        }).length;
        
        setText($('#alertasVencidas'), vencidas);
        setText($('#alertasProximas'), proximasTresDias);
        setText($('#alertasPendientes'), pendientes);
        setText($('#alertasCompletadas'), completadas);
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// Hacer loadStats disponible globalmente para que table.js pueda llamarla
window.loadStats = loadStats;

/**
 * Carga los selectores de filtros con los catálogos (reutiliza datos de form.js)
 */
function loadFiltros(tipos, prioridades, estados) {
    try {
        // Cargar tipos de alerta
        const tiposArray = Array.isArray(tipos) ? tipos : (tipos?.items || []);
        const selectTipo = $('#filtroTipo');
        if (selectTipo) {
            selectTipo.innerHTML = '<option value="">Todos</option>' + 
                tiposArray.map(t => {
                    const nombre = t.Nombre || t.nombre || t.Descripcion || t.descripcion || 'Sin nombre';
                    const id = t.Id || t.id;
                    return `<option value="${id}">${nombre}</option>`;
                }).join('');
        }

        // Cargar prioridades
        const prioridadesArray = Array.isArray(prioridades) ? prioridades : (prioridades?.items || []);
        const selectPrioridad = $('#filtroPrioridad');
        if (selectPrioridad) {
            selectPrioridad.innerHTML = '<option value="">Todas</option>' + 
                prioridadesArray.map(p => {
                    const nombre = p.Nombre || p.nombre || p.Descripcion || p.descripcion || 'Sin nombre';
                    const id = p.Id || p.id;
                    return `<option value="${id}">${nombre}</option>`;
                }).join('');
        }

        // Cargar estados de alerta
        const estadosArray = Array.isArray(estados) ? estados : (estados?.items || []);
        const selectEstado = $('#filtroEstado');
        if (selectEstado) {
            selectEstado.innerHTML = '<option value="">Todos</option>' + 
                estadosArray.map(e => {
                    const nombre = e.Nombre || e.nombre || e.Descripcion || e.descripcion || 'Sin nombre';
                    const id = e.Id || e.id;
                    return `<option value="${id}">${nombre}</option>`;
                }).join('');
        }
    } catch (error) {
        console.error('Error al cargar filtros:', error);
    }
}

/**
 * Obtiene los parámetros de filtro actuales
 */
function getFiltrosActivos() {
    const params = {};
    
    const busqueda = $('#filtroBusqueda')?.value?.trim();
    if (busqueda) params.busqueda = busqueda;
    
    const tipo = $('#filtroTipo')?.value;
    if (tipo) params.tipoId = tipo;
    
    const prioridad = $('#filtroPrioridad')?.value;
    if (prioridad) params.prioridadId = prioridad;
    
    const estado = $('#filtroEstado')?.value;
    if (estado) params.estadoId = estado;
    
    const vencimiento = $('#filtroVencimiento')?.value;
    if (vencimiento) params.vencimiento = vencimiento;
    
    return params;
}

/**
 * Normaliza texto quitando acentos/tildes para búsqueda
 */
function normalizarTexto(texto) {
    if (!texto) return '';
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Remueve diacríticos
}

/**
 * Aplica los filtros (en el frontend)
 */
async function aplicarFiltros() {
    const filtros = getFiltrosActivos();
    
    console.log('📊 Aplicando filtros:', filtros);
    
    // Si no hay datos cargados, cargarlos primero
    if (!alertasData || alertasData.length === 0) {
        const items = await loadAlertas();
        alertasData = items || [];
    }
    
    console.log('📦 Total alertas antes de filtrar:', alertasData.length);
    if (alertasData.length > 0) {
        console.log('📝 Todas las propiedades de la primera alerta:', Object.keys(alertasData[0]));
        console.log('📝 Primera alerta completa:', alertasData[0]);
    }
    
    // Cargar catálogos una sola vez para mapear IDs → Nombres
    const catalogos = await loadCatalogos();
    const tipos = catalogos?.tipos || [];
    const prioridades = catalogos?.prioridades || [];
    const estados = catalogos?.estados || [];
    
    // Filtrar los datos en el frontend
    let filtradas = [...alertasData];
    
    // Filtro por búsqueda (descripción, niño, legajo) - SIN TILDES
    if (filtros.busqueda) {
        const busqueda = normalizarTexto(filtros.busqueda);
        filtradas = filtradas.filter(a => {
            const descripcion = normalizarTexto(a.Descripcion || a.descripcion || '');
            const nino = normalizarTexto(a.Nino || `${a.nombreNino || ''} ${a.apellidoNino || ''}`);
            const legajoId = String(a.LegajoId || a.legajoId || '');
            return descripcion.includes(busqueda) || nino.includes(busqueda) || legajoId.includes(busqueda);
        });
    }
    
    // Filtro por tipo - Mapear ID → Nombre
    if (filtros.tipoId) {
        console.log('🔍 Filtrando por tipo ID:', filtros.tipoId);
        const antesFiltr = filtradas.length;
        
        const tipoSeleccionado = tipos.find(t => String(t.Id || t.id) === String(filtros.tipoId));
        const tipoNombre = tipoSeleccionado?.Nombre || tipoSeleccionado?.nombre;
        
        console.log(`   Buscando tipo con nombre: "${tipoNombre}"`);
        
        if (tipoNombre) {
            filtradas = filtradas.filter(a => {
                const tipoAlerta = String(a.Tipo || a.tipo || '');
                return tipoAlerta === tipoNombre;
            });
        }
        console.log(`   Antes: ${antesFiltr}, Después: ${filtradas.length}`);
    }
    
    // Filtro por prioridad - Mapear ID → Nombre
    if (filtros.prioridadId) {
        console.log('🔍 Filtrando por prioridad ID:', filtros.prioridadId);
        const antesFiltr = filtradas.length;
        
        const prioridadSeleccionada = prioridades.find(p => String(p.Id || p.id) === String(filtros.prioridadId));
        const prioridadNombre = prioridadSeleccionada?.Nombre || prioridadSeleccionada?.nombre;
        
        console.log(`   Buscando prioridad con nombre: "${prioridadNombre}"`);
        
        if (prioridadNombre) {
            filtradas = filtradas.filter(a => {
                const prioridadAlerta = String(a.Prioridad || a.prioridad || '');
                return prioridadAlerta === prioridadNombre;
            });
        }
        console.log(`   Antes: ${antesFiltr}, Después: ${filtradas.length}`);
    }
    
    // Filtro por estado - Mapear ID → Nombre
    if (filtros.estadoId) {
        console.log('🔍 Filtrando por estado ID:', filtros.estadoId);
        const antesFiltr = filtradas.length;
        
        const estadoSeleccionado = estados.find(e => String(e.Id || e.id) === String(filtros.estadoId));
        const estadoNombre = estadoSeleccionado?.Nombre || estadoSeleccionado?.nombre;
        
        console.log(`   Buscando estado con nombre: "${estadoNombre}"`);
        
        if (estadoNombre) {
            filtradas = filtradas.filter(a => {
                const estadoAlerta = String(a.Estado || a.estado || '');
                return estadoAlerta === estadoNombre;
            });
        }
        console.log(`   Antes: ${antesFiltr}, Después: ${filtradas.length}`);
    }
    
    // Filtro por vencimiento
    if (filtros.vencimiento) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        filtradas = filtradas.filter(a => {
            const fechaVenc = new Date(a.FechaVencimiento || a.fechaVencimiento);
            fechaVenc.setHours(0, 0, 0, 0);
            const diffDias = Math.ceil((fechaVenc - hoy) / (1000 * 60 * 60 * 24));
            
            switch(filtros.vencimiento) {
                case 'vencidas':
                    return diffDias < 0;
                case 'hoy':
                    return diffDias === 0;
                case 'proximas':
                    return diffDias >= 0 && diffDias <= 3;
                case 'semana':
                    return diffDias >= 0 && diffDias <= 7;
                case 'mes':
                    return diffDias >= 0 && diffDias <= 30;
                default:
                    return true;
            }
        });
    }
    
    // Resultado final
    console.log('✅ Total alertas después de filtrar:', filtradas.length);
    
    // Guardar datos filtrados
    filteredData = filtradas;
    
    // Actualizar paginación con los nuevos datos
    if (pagination) {
        pagination.setData(filteredData);
        renderCurrentPage(pagination.getCurrentPageData());
        pagination.render();
    } else {
        // Si no hay paginación inicializada, renderizar sin paginar
        renderCurrentPage(filteredData);
    }
    
    // Actualizar contador total
    const totalRegistros = $('#totalRegistros');
    if (totalRegistros) {
        totalRegistros.textContent = filteredData.length;
    }
    
    selectedAlerta = null;
    updateActionButtons();
    bindRowSelection();
}

/**
 * Renderiza los datos de la página actual
 */
function renderCurrentPage(pageData) {
    const tableBody = $('#tablaAlertas');
    if (!tableBody) return;
    
    if (!pageData || pageData.length === 0) {
        tableBody.innerHTML = `
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
        `;
    } else {
        // Renderizar solo los datos de la página actual
        tableBody.innerHTML = pageData.map(a => rowTemplate(a) || '').join('');
    }
    
    // Re-vincular eventos después de renderizar
    selectedAlerta = null;
    updateActionButtons();
    bindRowSelection();
}

/**
 * Selecciona una fila de alerta
 */
function selectRow(id) {
    // Convertir id a string para comparación consistente
    const idStr = String(id);
    
    // Buscar la alerta en los datos (puede venir como AlertaId, Id o id)
    selectedAlerta = alertasData.find(a => {
        const alertaId = String(a.AlertaId ?? a.Id ?? a.id ?? '');
        return alertaId === idStr;
    });
    
    console.log('Seleccionando alerta ID:', idStr, 'Encontrada:', !!selectedAlerta); // Debug
    
    // Actualizar clases visuales
    const tableBody = $('#tablaAlertas');
    if (tableBody) {
        // Remover selección de todas las filas
        tableBody.querySelectorAll('tr[data-id]').forEach(tr => {
            tr.classList.remove('selected');
        });
        
        // Agregar selección a la fila clickeada
        const selectedRow = tableBody.querySelector(`tr[data-id="${idStr}"]`);
        if (selectedRow) {
            selectedRow.classList.add('selected');
            console.log('✅ Fila seleccionada visualmente'); // Debug
        } else {
            console.warn('⚠️ No se encontró la fila con data-id:', idStr); // Debug
            // Listar todos los data-id disponibles para debugging
            const allIds = Array.from(tableBody.querySelectorAll('tr[data-id]'))
                .map(tr => tr.getAttribute('data-id'));
            console.log('IDs disponibles:', allIds); // Debug
        }
    }
    
    updateActionButtons();
}

/**
 * Deselecciona la fila actual
 */
function unselectRow() {
    selectedAlerta = null;
    const tableBody = $('#tablaAlertas');
    if (tableBody) {
        tableBody.querySelectorAll('tr').forEach(tr => tr.classList.remove('selected'));
    }
    updateActionButtons();
}

/**
 * Actualiza el estado de los botones de acción según la selección
 */
function updateActionButtons() {
    const btnVerDetalle = $('#btnVerDetalle');
    const btnEditar = $('#btnEditarAlerta');
    const btnEliminar = $('#btnEliminarAlerta');
    
    if (selectedAlerta) {
        btnVerDetalle?.removeAttribute('disabled');
        btnEditar?.removeAttribute('disabled');
        btnEliminar?.removeAttribute('disabled');
    } else {
        btnVerDetalle?.setAttribute('disabled', 'disabled');
        btnEditar?.setAttribute('disabled', 'disabled');
        btnEliminar?.setAttribute('disabled', 'disabled');
    }
}

/**
 * Vincula los eventos de selección de filas
 */
function bindRowSelection() {
    const tableBody = $('#tablaAlertas');
    if (!tableBody) return;
    
    // Limpiar event listeners anteriores
    const newTableBody = tableBody.cloneNode(true);
    tableBody.parentNode.replaceChild(newTableBody, tableBody);
    
    // Obtener la referencia actualizada después del reemplazo
    const tbody = $('#tablaAlertas');
    if (!tbody) return;
    
    // Event delegation: un solo listener en el tbody
    tbody.addEventListener('click', (e) => {
        const row = e.target.closest('tr[data-id]');
        if (!row) return;
        
        const id = row.getAttribute('data-id');
        console.log('Click en fila ID:', id); // Debug
        
        // Si la fila ya está seleccionada, deseleccionar
        if (row.classList.contains('selected')) {
            unselectRow();
        } else {
            selectRow(id);
        }
    });
    
    // Event listener para doble clic (ver detalle)
    tbody.addEventListener('dblclick', (e) => {
        const row = e.target.closest('tr[data-id]');
        if (!row) return;
        
        const id = row.getAttribute('data-id');
        const idStr = String(id);
        
        // Buscar alerta con soporte para AlertaId, Id o id
        const alerta = alertasData.find(a => {
            const alertaId = String(a.AlertaId ?? a.Id ?? a.id ?? '');
            return alertaId === idStr;
        });
        
        if (alerta) {
            mostrarDetalleAlerta(alerta);
        } else {
            console.warn('No se encontró alerta para mostrar detalle. ID:', idStr);
        }
    });
}

/**
 * Muestra el modal con el detalle completo de una alerta
 */
function mostrarDetalleAlerta(alerta) {
    // Función helper para formatear fechas
    const formatearFecha = (fecha) => {
        if (!fecha) return '-';
        const date = new Date(fecha);
        const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('es-AR', opciones);
    };

    // Función helper para obtener badge de estado
    const getEstadoBadge = (estado) => {
        const e = estado?.toLowerCase() || '';
        if (e.includes('completada') || e.includes('resuelta')) return 'bg-green-100 text-green-800 border border-green-300';
        if (e.includes('proceso') || e.includes('curso')) return 'bg-blue-100 text-blue-800 border border-blue-300';
        if (e.includes('pendiente')) return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
        if (e.includes('cancelada')) return 'bg-gray-100 text-gray-800 border border-gray-300';
        return 'bg-purple-100 text-purple-800 border border-purple-300';
    };

    // Función helper para obtener badge de prioridad
    const getPrioridadBadge = (prioridad) => {
        const p = prioridad?.toLowerCase() || '';
        if (p.includes('alta')) return 'bg-red-100 text-red-800 border border-red-300';
        if (p.includes('media')) return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
        if (p.includes('baja')) return 'bg-green-100 text-green-800 border border-green-300';
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    };

    // Extraer datos con soporte para ambos formatos
    const id = alerta.AlertaId ?? alerta.Id ?? alerta.id ?? '-';
    const estado = alerta.Estado ?? alerta.estado ?? '-';
    const tipo = alerta.Tipo ?? alerta.tipo ?? '-';
    const prioridad = alerta.Prioridad ?? alerta.prioridad ?? '-';
    const descripcion = alerta.Descripcion ?? alerta.descripcion ?? '-';
    const fechaCreacion = alerta.FechaCreacion ?? alerta.fechaCreacion;
    const fechaVencimiento = alerta.FechaVencimiento ?? alerta.fechaVencimiento;
    const fechaModificacion = alerta.FechaModificacion ?? alerta.fechaModificacion;
    const legajoId = alerta.LegajoId ?? alerta.legajoId ?? '-';
    const nombreNino = alerta.Nino ?? (alerta.nombreNino && alerta.apellidoNino ? `${alerta.nombreNino} ${alerta.apellidoNino}`.trim() : '-');
    
    const contenido = `
        <div class="space-y-6">
            <!-- Header con ID y Estado -->
            <div class="flex items-center justify-between pb-4 border-b">
                <div>
                    <h3 class="text-2xl font-bold text-gray-900">Alerta #${id}</h3>
                    <p class="text-sm text-gray-500 mt-1">Creada el ${formatearFecha(fechaCreacion)}</p>
                </div>
                <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getEstadoBadge(estado)}">
                    <i class="bi bi-flag-fill mr-2"></i>${estado}
                </span>
            </div>

            <!-- Información Principal -->
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold text-gray-500 mb-2">Tipo de Alerta</label>
                    <span class="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300">
                        <i class="bi bi-tag-fill mr-2"></i>${tipo}
                    </span>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-500 mb-2">Prioridad</label>
                    <span class="inline-flex items-center px-3 py-2 rounded-lg text-sm font-bold ${getPrioridadBadge(prioridad)}">
                        <i class="bi bi-exclamation-circle-fill mr-2"></i>${prioridad}
                    </span>
                </div>
            </div>

            <!-- Niño/Legajo -->
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <label class="block text-sm font-semibold text-blue-700 mb-3">
                    <i class="bi bi-person-fill mr-1"></i>Niño/Legajo Asociado
                </label>
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        ${(nombreNino || 'N')[0]}
                    </div>
                    <div>
                        <p class="font-semibold text-gray-900">${nombreNino}</p>
                        <p class="text-sm text-gray-600">
                            <i class="bi bi-file-text mr-1"></i>Legajo #${legajoId}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Descripción -->
            <div>
                <label class="block text-sm font-semibold text-gray-500 mb-2">
                    <i class="bi bi-file-text-fill mr-1"></i>Descripción Completa
                </label>
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p class="text-gray-700 whitespace-pre-wrap">${descripcion}</p>
                </div>
            </div>

            <!-- Fechas -->
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold text-gray-500 mb-2">
                        <i class="bi bi-calendar-event-fill mr-1"></i>Fecha de Vencimiento
                    </label>
                    <div class="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <p class="font-semibold text-gray-900">${formatearFecha(fechaVencimiento)}</p>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-500 mb-2">
                        <i class="bi bi-clock-history mr-1"></i>Última Modificación
                    </label>
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p class="font-semibold text-gray-900">${formatearFecha(fechaModificacion) || 'Sin modificaciones'}</p>
                    </div>
                </div>
            </div>

            <!-- Info adicional -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div class="flex items-start gap-2">
                    <i class="bi bi-info-circle-fill text-blue-600 text-xl mt-0.5"></i>
                    <div class="text-sm text-gray-700">
                        <strong class="text-gray-900">Consejo:</strong> Puede editar esta alerta seleccionándola y haciendo clic en el botón "Editar" del menú superior.
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modalContent = $('#detalleAlertaContenido');
    if (modalContent) {
        modalContent.innerHTML = contenido;
    }
    
    // Mostrar modal
    const modal = $('#modalDetalleAlerta');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Limpia todos los filtros
 */
async function limpiarFiltros() {
    const inputs = ['filtroBusqueda', 'filtroTipo', 'filtroPrioridad', 'filtroEstado', 'filtroVencimiento'];
    inputs.forEach(id => {
        const el = $('#' + id);
        if (el) el.value = '';
    });
    
    // Recargar sin filtros
    const items = await loadAlertas();
    alertasData = items || [];
    filteredData = alertasData;
    
    // Actualizar paginación
    if (pagination) {
        pagination.setData(filteredData);
        renderCurrentPage(pagination.getCurrentPageData());
        pagination.render();
    } else {
        renderCurrentPage(filteredData);
    }
    
    selectedAlerta = null;
    updateActionButtons();
    loadStats();
}

/**
 * Inicialización al cargar el DOM
 * OPTIMIZADO: Carga todo en paralelo con Promise.all
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.time('⏱️ Carga inicial');
        
        // 🚀 PASO 1: Cargar catálogos y alertas en paralelo
        const [catalogos, items] = await Promise.all([
            loadCatalogos(),
            loadAlertas()
        ]);
        
        // 🚀 PASO 2: Poblar filtros con datos ya cargados (sin nueva llamada API)
        if (catalogos) {
            loadFiltros(catalogos.tipos, catalogos.prioridades, catalogos.estados);
        }
        
        // 🚀 PASO 3: Configurar datos y estadísticas
        alertasData = items || [];
        filteredData = alertasData; // Inicialmente, filtrados = todos
        
        // 🚀 PASO 4: Inicializar paginación
        pagination = new Pagination({
            data: filteredData,
            itemsPerPage: 10,
            containerId: 'paginationControls',
            onPageChange: (page, pageData) => {
                console.log(`📄 Cambio a página ${page}`);
                renderCurrentPage(pageData);
            },
            onItemsPerPageChange: (itemsPerPage) => {
                console.log(`📋 Items por página cambiados a: ${itemsPerPage}`);
            }
        });
        
        // Renderizar primera página
        renderCurrentPage(pagination.getCurrentPageData());
        pagination.render();
        
        updateActionButtons();
        loadStats(); // No necesita await, es síncrono ahora que tiene los datos
        
        console.timeEnd('⏱️ Carga inicial');
    } catch (error) {
        console.error('Error en inicialización:', error);
        showToast('❌ Error al cargar la página. Intente recargar.');
    }
    
    // Vincular formulario (después de la carga inicial)
    bindAlertaForm(async () => { 
        const items = await loadAlertas(); 
        alertasData = items || [];
        filteredData = alertasData;
        
        // Actualizar paginación
        if (pagination) {
            pagination.setData(filteredData);
            renderCurrentPage(pagination.getCurrentPageData());
            pagination.render();
        } else {
            renderCurrentPage(filteredData);
        }
        
        selectedAlerta = null;
        updateActionButtons();
        loadStats(); 
    });
    
    // Eventos de filtros - aplicar automáticamente al cambiar
    const filtroInputs = ['filtroBusqueda', 'filtroTipo', 'filtroPrioridad', 'filtroEstado', 'filtroVencimiento'];
    filtroInputs.forEach(id => {
        const el = $('#' + id);
        if (el) {
            el.addEventListener('change', aplicarFiltros);
            if (id === 'filtroBusqueda') {
                el.addEventListener('input', debounce(aplicarFiltros, 500));
            }
        }
    });
    
    // Botón limpiar filtros
    const btnLimpiar = $('#btnLimpiarFiltros');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarFiltros);
    }
    
    // Eventos de los botones de acción del header
    const btnVerDetalle = $('#btnVerDetalle');
    if (btnVerDetalle) {
        btnVerDetalle.addEventListener('click', () => {
            if (selectedAlerta) {
                mostrarDetalleAlerta(selectedAlerta);
            }
        });
    }
    
    const btnEditar = $('#btnEditarAlerta');
    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            if (selectedAlerta) {
                editarAlerta(selectedAlerta);
            }
        });
    }
    
    const btnEliminar = $('#btnEliminarAlerta');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            if (selectedAlerta) {
                eliminarAlerta(selectedAlerta);
            }
        });
    }
});

/**
 * Edita una alerta existente
 */
async function editarAlerta(alerta) {
    try {
        const alertaId = alerta.AlertaId ?? alerta.Id ?? alerta.id;
        const legajoId = alerta.LegajoId ?? alerta.legajoId;
        const tipoId = alerta.TipoId ?? alerta.tipoId;
        const prioridadId = alerta.PrioridadId ?? alerta.prioridadId;
        const estadoId = alerta.EstadoId ?? alerta.estadoId;
        const descripcion = alerta.Descripcion ?? alerta.descripcion ?? '';
        const fechaVencimiento = alerta.FechaVencimiento ?? alerta.fechaVencimiento ?? '';
        
        // Abrir modal y cargar datos
        const modal = $('#modalNuevaAlerta');
        const form = $('#alertaForm');
        const modalTitle = modal?.querySelector('h5');
        
        if (modalTitle) {
            modalTitle.textContent = 'Editar Alerta';
        }
        
        // Cargar datos en el formulario
        if (form) {
            form.querySelector('[name="legajoId"]').value = legajoId || '';
            form.querySelector('[name="tipoAlertaId"]').value = tipoId || '';
            form.querySelector('[name="prioridadId"]').value = prioridadId || '';
            form.querySelector('[name="estadoAlertaId"]').value = estadoId || '';
            form.querySelector('[name="descripcion"]').value = descripcion;
            
            // Formatear fecha para input type="date"
            if (fechaVencimiento) {
                const fecha = new Date(fechaVencimiento);
                const fechaStr = fecha.toISOString().split('T')[0];
                form.querySelector('[name="fechaVencimiento"]').value = fechaStr;
            }
            
            // Agregar ID oculto para identificar que es edición
            let inputId = form.querySelector('[name="alertaId"]');
            if (!inputId) {
                inputId = document.createElement('input');
                inputId.type = 'hidden';
                inputId.name = 'alertaId';
                form.appendChild(inputId);
            }
            inputId.value = alertaId;
        }
        
        // Mostrar modal
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Error al editar alerta:', error);
        showToast('❌ Error al cargar alerta para edición');
    }
}

/**
 * Elimina una alerta
 */
async function eliminarAlerta(alerta) {
    const alertaId = alerta.AlertaId ?? alerta.Id ?? alerta.id;
    const descripcion = alerta.Descripcion ?? alerta.descripcion ?? '';
    const nombreNino = alerta.Nino ?? (alerta.nombreNino && alerta.apellidoNino ? `${alerta.nombreNino} ${alerta.apellidoNino}`.trim() : 'Desconocido');
    
    const mensaje = `¿Está seguro que desea eliminar esta alerta?\n\n` +
                    `Alerta #${alertaId}\n` +
                    `NNA: ${nombreNino}\n` +
                    `Descripción: ${descripcion.substring(0, 50)}${descripcion.length > 50 ? '...' : ''}\n\n` +
                    `Esta acción no se puede deshacer.`;
    
    if (!confirm(mensaje)) {
        return;
    }
    
    try {
        await deleteAlerta(alertaId);
        showToast('✅ Alerta eliminada exitosamente');
        
        // Recargar datos y aplicar filtros actuales
        const items = await loadAlertas();
        alertasData = items || [];
        
        // Re-aplicar filtros después de eliminar
        await aplicarFiltros();
        
        selectedAlerta = null;
        updateActionButtons();
        loadStats();
    } catch (error) {
        console.error('Error al eliminar alerta:', error);
        showToast(`❌ Error al eliminar alerta: ${error.message || 'Error desconocido'}`);
    }
}

/**
 * Debounce helper para evitar demasiadas llamadas en búsqueda
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


