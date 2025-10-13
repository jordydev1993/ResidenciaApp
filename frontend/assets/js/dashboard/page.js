import { listAlertas } from '../api/alertasApi.js';
import { listLegajos } from '../api/legajosApi.js';
import { buildBarChart } from './charts.js';
import { $, setText } from '../utils/dom.js';

/**
 * Carga los KPIs del dashboard
 */
async function loadKPIs() {
    try {
        // Cargar legajos
        const legajos = await listLegajos();
        const legajosArray = Array.isArray(legajos) ? legajos : (legajos?.items || []);
        setText($('#totalLegajos'), legajosArray.length);

        // Cargar alertas
        const alertas = await listAlertas();
        const alertasArray = Array.isArray(alertas) ? alertas : (alertas?.items || []);
        
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const vencidas = alertasArray.filter(a => {
            const venc = new Date(a.fechaVencimiento);
            venc.setHours(0, 0, 0, 0);
            return venc < hoy && !a.estado?.toLowerCase().includes('completada');
        }).length;
        
        const proximasTresDias = alertasArray.filter(a => {
            const venc = new Date(a.fechaVencimiento);
            venc.setHours(0, 0, 0, 0);
            const diffDias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
            return diffDias >= 0 && diffDias <= 3 && !a.estado?.toLowerCase().includes('completada');
        }).length;
        
        const completadas = alertasArray.filter(a => 
            a.estado?.toLowerCase().includes('completada')
        ).length;
        
        setText($('#alertasVencidas'), vencidas);
        setText($('#alertasProximas'), proximasTresDias);
        setText($('#alertasCompletadas'), completadas);
    } catch (error) {
        console.error('Error al cargar KPIs:', error);
    }
}

/**
 * Carga los gráficos del dashboard
 */
async function loadCharts() {
    try {
        const alertas = await listAlertas();
        const alertasArray = Array.isArray(alertas) ? alertas : (alertas?.items || []);
        
        // Agrupar por estado
        const estadoCounts = {};
        alertasArray.forEach(a => {
            const estado = a.estado || 'Sin estado';
            estadoCounts[estado] = (estadoCounts[estado] || 0) + 1;
        });
        const labelsEstado = Object.keys(estadoCounts);
        const valuesEstado = Object.values(estadoCounts);
        
        // Agrupar por prioridad
        const prioridadCounts = {};
        alertasArray.forEach(a => {
            const prioridad = a.prioridad || 'Sin prioridad';
            prioridadCounts[prioridad] = (prioridadCounts[prioridad] || 0) + 1;
        });
        const labelsPrioridad = Object.keys(prioridadCounts);
        const valuesPrioridad = Object.values(prioridadCounts);
        
        // Crear gráficos
        buildBarChart(document.getElementById('chart-status'), 'Alertas por estado', labelsEstado, valuesEstado);
        buildBarChart(document.getElementById('chart-priority'), 'Alertas por prioridad', labelsPrioridad, valuesPrioridad);
    } catch (error) {
        console.error('Error al cargar gráficos:', error);
    }
}

/**
 * Inicialización del dashboard
 */
async function init() {
    await loadKPIs();
    await loadCharts();
}

document.addEventListener('DOMContentLoaded', init);


