import { createLegajo } from '../api/legajosApi.js';
import { upsertNino } from '../api/ninoApi.js';
import { $, serializeForm, showToast } from '../utils/dom.js';

function validate(payload) {
    if (!payload.dni || !/^\d{7,8}$/.test(payload.dni)) return 'DNI inválido';
    if (!payload.nombre || payload.nombre.trim().length === 0) return 'Nombre requerido';
    if (!payload.fechaNacimiento) return 'Fecha de nacimiento requerida';
    if (!payload.fechaIngreso) return 'Fecha de ingreso requerida';
    if (!payload.estado && !payload.estadoId) return 'Estado requerido';
    return null;
}

function mapEstadoNombreToId(nombre) {
    const map = { 'Activo': 1, 'Egresado': 2, 'En seguimiento': 3 };
    const key = typeof nombre === 'string' ? nombre.trim() : '';
    return map[key] || null;
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
            // Upsert Nino antes de crear el Legajo (satisface FK DNI)
            await upsertNino({
                DNI: String(payload.dni).trim(),
                NombreCompleto: String(payload.nombre).trim(),
                FechaNacimiento: payload.fechaNacimiento
            });

            const estadoId = Number(payload.estadoId || mapEstadoNombreToId(payload.estado));
            if (!estadoId || Number.isNaN(estadoId)) { showToast('Estado inválido'); return; }

            const body = {
                DNI: payload.dni ? String(payload.dni).trim() : '',
                FechaIngreso: payload.fechaIngreso,
                EstadoId: estadoId,
                TutorAsignado: payload.tutor && String(payload.tutor).trim() ? String(payload.tutor).trim() : null,
                Observaciones: payload.observaciones && String(payload.observaciones).trim() ? String(payload.observaciones).trim() : null,
            };

            await createLegajo(body);
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


