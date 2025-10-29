import { listAlertas, dashboardAlertas } from '../api/alertasApi.js';
import { listLegajos } from '../api/legajosApi.js';
import { buildBarChart } from './charts.js';
import { $, setText } from '../utils/dom.js';
import { http } from '../utils/http.js';

/**
 * Carga los KPIs del dashboard
 */
async function loadKPIs() {
    try {
        console.log('📊 Cargando KPIs del dashboard...');
        
        // Cargar legajos
        const legajos = await listLegajos();
        const legajosArray = Array.isArray(legajos) ? legajos : (legajos?.items || []);
        setText($('#totalLegajos'), legajosArray.length);
        console.log(`✓ Total legajos: ${legajosArray.length}`);

        // Cargar alertas
        const alertas = await listAlertas();
        const alertasArray = Array.isArray(alertas) ? alertas : (alertas?.items || []);
        console.log(`✓ Total alertas: ${alertasArray.length}`);
        
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        // Contar alertas vencidas (manejar PascalCase y camelCase)
        const vencidas = alertasArray.filter(a => {
            const fechaVenc = a.FechaVencimiento || a.fechaVencimiento;
            const estado = (a.Estado || a.estado || '').toLowerCase();
            
            if (!fechaVenc) return false;
            
            const venc = new Date(fechaVenc);
            venc.setHours(0, 0, 0, 0);
            return venc < hoy && !estado.includes('completada') && !estado.includes('finalizada');
        }).length;
        
        // Contar alertas próximas (próximos 3 días)
        const proximasTresDias = alertasArray.filter(a => {
            const fechaVenc = a.FechaVencimiento || a.fechaVencimiento;
            const estado = (a.Estado || a.estado || '').toLowerCase();
            
            if (!fechaVenc) return false;
            
            const venc = new Date(fechaVenc);
            venc.setHours(0, 0, 0, 0);
            const diffDias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
            return diffDias >= 0 && diffDias <= 3 && !estado.includes('completada') && !estado.includes('finalizada');
        }).length;
        
        // Contar alertas completadas
        const completadas = alertasArray.filter(a => {
            const estado = (a.Estado || a.estado || '').toLowerCase();
            return estado.includes('completada') || estado.includes('finalizada');
        }).length;
        
        setText($('#alertasVencidas'), vencidas);
        setText($('#alertasProximas'), proximasTresDias);
        setText($('#alertasCompletadas'), completadas);
        
        console.log(`✓ Alertas vencidas: ${vencidas}`);
        console.log(`✓ Alertas próximas (3 días): ${proximasTresDias}`);
        console.log(`✓ Alertas completadas: ${completadas}`);
    } catch (error) {
        console.error('❌ Error al cargar KPIs:', error);
    }
}

/**
 * Carga los gráficos del dashboard
 */
async function loadCharts() {
    try {
        console.log('📈 Cargando gráficos del dashboard...');
        
        const alertas = await listAlertas();
        const alertasArray = Array.isArray(alertas) ? alertas : (alertas?.items || []);
        
        // Agrupar por estado (manejar PascalCase y camelCase)
        const estadoCounts = {};
        alertasArray.forEach(a => {
            const estado = a.Estado || a.estado || 'Sin estado';
            estadoCounts[estado] = (estadoCounts[estado] || 0) + 1;
        });
        const labelsEstado = Object.keys(estadoCounts);
        const valuesEstado = Object.values(estadoCounts);
        console.log('✓ Estados:', estadoCounts);
        
        // Agrupar por prioridad (manejar PascalCase y camelCase)
        const prioridadCounts = {};
        alertasArray.forEach(a => {
            const prioridad = a.Prioridad || a.prioridad || 'Sin prioridad';
            prioridadCounts[prioridad] = (prioridadCounts[prioridad] || 0) + 1;
        });
        const labelsPrioridad = Object.keys(prioridadCounts);
        const valuesPrioridad = Object.values(prioridadCounts);
        console.log('✓ Prioridades:', prioridadCounts);
        
        // Crear gráficos
        const chartStatus = document.getElementById('chart-status');
        const chartPriority = document.getElementById('chart-priority');
        
        if (chartStatus) {
            buildBarChart(chartStatus, 'Alertas por estado', labelsEstado, valuesEstado);
            console.log('✓ Gráfico de estados creado');
        }
        
        if (chartPriority) {
            buildBarChart(chartPriority, 'Alertas por prioridad', labelsPrioridad, valuesPrioridad);
            console.log('✓ Gráfico de prioridades creado');
        }
    } catch (error) {
        console.error('❌ Error al cargar gráficos:', error);
    }
}

/**
 * Carga las estadísticas desde el endpoint optimizado del backend
 * (Más eficiente que hacer múltiples llamadas)
 */
async function loadDashboardStats() {
    try {
        console.log('📊 Cargando estadísticas del dashboard...');
        
        const stats = await http('/api/Dashboard/Stats', { method: 'GET' });
        
        if (stats && stats.success) {
            // Actualizar KPIs
            setText($('#totalLegajos'), stats.kpis.totalLegajos);
            setText($('#alertasVencidas'), stats.kpis.alertasVencidas);
            setText($('#alertasProximas'), stats.kpis.alertasProximas);
            setText($('#alertasCompletadas'), stats.kpis.alertasCompletadas);
            
            console.log('✓ KPIs actualizados:', stats.kpis);
            
            // Crear gráficos
            if (stats.charts.porEstado && stats.charts.porEstado.length > 0) {
                const labelsEstado = stats.charts.porEstado.map(item => item.label);
                const valuesEstado = stats.charts.porEstado.map(item => item.value);
                const chartStatus = document.getElementById('chart-status');
                if (chartStatus) {
                    buildBarChart(chartStatus, 'Alertas por estado', labelsEstado, valuesEstado);
                    console.log('✓ Gráfico de estados creado');
                }
            }
            
            if (stats.charts.porPrioridad && stats.charts.porPrioridad.length > 0) {
                const labelsPrioridad = stats.charts.porPrioridad.map(item => item.label);
                const valuesPrioridad = stats.charts.porPrioridad.map(item => item.value);
                const chartPriority = document.getElementById('chart-priority');
                if (chartPriority) {
                    buildBarChart(chartPriority, 'Alertas por prioridad', labelsPrioridad, valuesPrioridad);
                    console.log('✓ Gráfico de prioridades creado');
                }
            }
            
            console.log('✅ Dashboard cargado exitosamente');
        }
    } catch (error) {
        console.warn('⚠️ Endpoint de dashboard no disponible, usando método alternativo...');
        // Fallback al método antiguo
        await loadKPIs();
        await loadCharts();
    }
}

/**
 * Inicialización del dashboard
 */
async function init() {
    // Intentar cargar desde el endpoint optimizado
    await loadDashboardStats();
}

document.addEventListener('DOMContentLoaded', init);


