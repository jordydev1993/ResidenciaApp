import { listAlertas, completeAlerta } from '../api/alertasApi.js';
import { $, renderHTML, showToast } from '../utils/dom.js';

function rowTemplate(a) {
    return `
        <tr>
            <td>${a.id ?? ''}</td>
            <td>${a.tipo ?? ''}</td>
            <td>${a.descripcion ?? ''}</td>
            <td>${a.prioridad ?? ''}</td>
            <td>${a.vencimiento ? new Date(a.vencimiento).toLocaleString() : ''}</td>
            <td>${a.estado ?? ''}</td>
            <td>
                <button class="btn btn-sm btn-outline-success" data-action="complete" data-id="${a.id ?? ''}">Completar</button>
            </td>
        </tr>
    `;
}

export async function loadAlertas(params = {}) {
    try {
        const data = await listAlertas(params);
        const items = Array.isArray(data) ? data : (data?.items || []);
        if (!items.length) {
            renderHTML($('#tablaAlertas'), `<tr><td colspan="7" class="empty-state">Sin alertas</td></tr>`);
            return;
        }
        renderHTML($('#tablaAlertas'), items.map(rowTemplate).join(''));
        $('#tablaAlertas')?.addEventListener('click', async (e) => {
            const btn = e.target.closest('button[data-action="complete"]');
            if (!btn) return;
            const id = btn.getAttribute('data-id');
            try {
                await completeAlerta(id);
                showToast('Alerta completada');
                await loadAlertas();
            } catch (err) {
                showToast(`Error al completar: ${err.message}`);
            }
        }, { once: true });
    } catch (err) {
        showToast(`Error al listar alertas: ${err.message}`);
    }
}


