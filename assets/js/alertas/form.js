import { createAlerta } from '../api/alertasApi.js';
import { $, serializeForm, showToast } from '../utils/dom.js';

export function bindAlertaForm(onCreated) {
    const form = $('#alertaForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = serializeForm(form);
        if (!payload.tipoAlerta) return showToast('Tipo requerido');
        if (!payload.descripcionAlerta) return showToast('Descripción requerida');
        if (!payload.fechaVencimiento) return showToast('Vencimiento requerido');
        if (!payload.prioridadAlerta) return showToast('Prioridad requerida');
        try {
            await createAlerta({
                tipo: payload.tipoAlerta,
                descripcion: payload.descripcionAlerta,
                vencimiento: payload.fechaVencimiento,
                prioridad: payload.prioridadAlerta,
            });
            showToast('Alerta creada');
            form.reset();
            onCreated && onCreated();
            const modalEl = document.getElementById('modalNuevaAlerta');
            if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
        } catch (err) {
            showToast(`Error al crear alerta: ${err.message}`);
        }
    });
}

export function guardarAlerta() {
    const form = $('#alertaForm');
    if (form) form.requestSubmit();
}


