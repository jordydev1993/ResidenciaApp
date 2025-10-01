import { bindAlertaForm } from './form.js';
import { loadAlertas } from './table.js';
import { $, setText } from '../utils/dom.js';
import { statsBy } from '../api/alertasApi.js';

async function loadStats() {
    try {
        const hoy = await statsBy('hoy');
        const proximas = await statsBy('proximas');
        const total = await statsBy('total');
        const completadas = await statsBy('completadas');
        setText($('#alertasHoy'), hoy?.value ?? 0);
        setText($('#alertasProximas'), proximas?.value ?? 0);
        setText($('#totalAlertas'), total?.value ?? 0);
        setText($('#alertasCompletadas'), completadas?.value ?? 0);
    } catch {}
}

document.addEventListener('DOMContentLoaded', () => {
    bindAlertaForm(() => { loadAlertas(); loadStats(); });
    loadAlertas();
    loadStats();
});


