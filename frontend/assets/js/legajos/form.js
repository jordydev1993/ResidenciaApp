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
            // Separar nombre completo en nombre y apellido si es necesario
            const nombreCompleto = String(payload.nombre).trim();
            const partesNombre = nombreCompleto.split(' ');
            const apellido = partesNombre.length > 1 ? partesNombre.pop() : nombreCompleto;
            const nombre = partesNombre.length > 0 ? partesNombre.join(' ') : nombreCompleto;
            
            // Upsert Nino antes de crear el Legajo (satisface FK DNI)
            await upsertNino({
                DNI: String(payload.dni).trim(),
                Nombre: nombre,
                Apellido: apellido,
                FechaNacimiento: payload.fechaNacimiento
            });

            const estadoId = Number(payload.estadoId || mapEstadoNombreToId(payload.estado));
            if (!estadoId || Number.isNaN(estadoId)) { showToast('Estado inválido'); return; }

            // Buscar el NinoId consultando el backend de Nino por DNI no está implementado.
            // El SP de legajo requiere NinoId, por lo que aquí asumimos que el backend
            // resolverá NinoId a partir del DNI si recibe el DNI. Si no, deberíamos
            // agregar un endpoint para obtener NinoId por DNI. Temporalmente usamos
            // un cuerpo compatible con el backend actual: incluye NinoId si está presente.

            const body = {
                FechaIngreso: payload.fechaIngreso,
                EstadoId: estadoId,
                TutorId: payload.tutorId ? Number(payload.tutorId) : null,
                Observaciones: payload.observaciones && String(payload.observaciones).trim() ? String(payload.observaciones).trim() : null,
            };

            // Si el formulario incluye ninoId oculto/derivado, adjuntarlo
            if (payload.ninoId) {
                body.NinoId = Number(payload.ninoId);
            }

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


