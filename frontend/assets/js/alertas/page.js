import { bindAlertaForm, loadCatalogos } from './form.js';
import { loadAlertas } from './table.js';
import { $, setText } from '../utils/dom.js';
import { listAlertas, listTipoAlertas, listPrioridades, listEstadoAlertas } from '../api/alertasApi.js';

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
 * Carga los selectores de filtros con los catálogos
 */
async function loadFiltros() {
    try {
        // Cargar tipos de alerta
        const tipos = await listTipoAlertas();
        const tiposArray = Array.isArray(tipos) ? tipos : (tipos?.items || []);
        const selectTipo = $('#filtroTipo');
        if (selectTipo) {
            selectTipo.innerHTML = '<option value="">Todos</option>' + 
                tiposArray.map(t => `<option value="${t.id}">${t.nombre || t.descripcion}</option>`).join('');
        }

        // Cargar prioridades
        const prioridades = await listPrioridades();
        const prioridadesArray = Array.isArray(prioridades) ? prioridades : (prioridades?.items || []);
        const selectPrioridad = $('#filtroPrioridad');
        if (selectPrioridad) {
            selectPrioridad.innerHTML = '<option value="">Todas</option>' + 
                prioridadesArray.map(p => `<option value="${p.id}">${p.nombre || p.descripcion}</option>`).join('');
        }

        // Cargar estados de alerta
        const estados = await listEstadoAlertas();
        const estadosArray = Array.isArray(estados) ? estados : (estados?.items || []);
        const selectEstado = $('#filtroEstado');
        if (selectEstado) {
            selectEstado.innerHTML = '<option value="">Todos</option>' + 
                estadosArray.map(e => `<option value="${e.id}">${e.nombre || e.descripcion}</option>`).join('');
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
 * Aplica los filtros y recarga la tabla
 */
function aplicarFiltros() {
    const filtros = getFiltrosActivos();
    loadAlertas(filtros);
}

/**
 * Limpia todos los filtros
 */
function limpiarFiltros() {
    const inputs = ['filtroBusqueda', 'filtroTipo', 'filtroPrioridad', 'filtroEstado', 'filtroVencimiento'];
    inputs.forEach(id => {
        const el = $('#' + id);
        if (el) el.value = '';
    });
    loadAlertas();
}

/**
 * Inicialización al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar catálogos para formulario y filtros
    await loadCatalogos();
    await loadFiltros();
    
    // Vincular formulario
    bindAlertaForm(async () => { 
        await loadAlertas(); 
        await loadStats(); 
    });
    
    // Cargar datos iniciales
    await loadAlertas();
    await loadStats();
    
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
});

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


