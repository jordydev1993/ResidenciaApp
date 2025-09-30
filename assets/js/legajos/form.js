import { createLegajo } from '../api/legajosApi.js';
import { $, serializeForm, showToast } from '../utils/dom.js';

function validate(payload) {
    if (!payload.dni || !/^\d{7,8}$/.test(payload.dni)) return 'DNI inválido';
    if (!payload.nombre || payload.nombre.trim().length === 0) return 'Nombre requerido';
    if (!payload.fechaNacimiento) return 'Fecha de nacimiento requerida';
    if (!payload.fechaIngreso) return 'Fecha de ingreso requerida';
    if (!payload.estado) return 'Estado requerido';
    return null;
}

export function bindLegajoForm(onCreated) {
    const form = $('#legajoForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = serializeForm(form);
        const error = validate(payload);
        if (error) { showToast(error); return; }
        try {
            await createLegajo(payload);
            form.reset();
            showToast('Legajo creado correctamente');
            onCreated && onCreated();
        } catch (err) {
            showToast(`Error al crear: ${err.message}`);
        }
    });
}

export function limpiarFormulario() {
    const form = $('#legajoForm');
    if (form) form.reset();
}


