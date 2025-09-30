import { statsBy } from '../api/alertasApi.js';
import { buildBarChart } from './charts.js';

async function init() {
    try {
        const byEstado = await statsBy('estado');
        const byPrioridad = await statsBy('prioridad');
        const labelsEstado = byEstado.map(x => x.label);
        const valuesEstado = byEstado.map(x => x.value);
        const labelsPrioridad = byPrioridad.map(x => x.label);
        const valuesPrioridad = byPrioridad.map(x => x.value);
        buildBarChart(document.getElementById('chart-status'), 'Alertas por estado', labelsEstado, valuesEstado);
        buildBarChart(document.getElementById('chart-priority'), 'Alertas por prioridad', labelsPrioridad, valuesPrioridad);
    } catch (e) {
        console.error('Error dashboard', e);
    }
}

document.addEventListener('DOMContentLoaded', init);


