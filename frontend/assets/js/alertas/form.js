import { createAlerta, listTipoAlertas, listPrioridades, listEstadoAlertas } from '../api/alertasApi.js';
import { listLegajos } from '../api/legajosApi.js';
import { $, serializeForm, showToast } from '../utils/dom.js';

/**
 * Carga todos los catálogos necesarios para el formulario
 */
export async function loadCatalogos() {
    try {
        // Cargar legajos (niños)
        const legajos = await listLegajos();
        const legajosArray = Array.isArray(legajos) ? legajos : (legajos?.items || []);
        const selectLegajo = $('#selectLegajo');
        if (selectLegajo) {
            selectLegajo.innerHTML = '<option value="">Seleccionar niño...</option>' + 
                legajosArray.map(l => {
                    const nombre = l.nombreNino || l.nombre || '';
                    const apellido = l.apellidoNino || l.apellido || '';
                    return `<option value="${l.id}">${nombre} ${apellido} - Legajo #${l.id}</option>`;
                }).join('');
        }

        // Cargar tipos de alerta
        const tipos = await listTipoAlertas();
        const tiposArray = Array.isArray(tipos) ? tipos : (tipos?.items || []);
        const selectTipo = $('#selectTipoAlerta');
        if (selectTipo) {
            selectTipo.innerHTML = '<option value="">Seleccionar tipo...</option>' + 
                tiposArray.map(t => `<option value="${t.id}">${t.nombre || t.descripcion}</option>`).join('');
        }

        // Cargar prioridades
        const prioridades = await listPrioridades();
        const prioridadesArray = Array.isArray(prioridades) ? prioridades : (prioridades?.items || []);
        const selectPrioridad = $('#selectPrioridad');
        if (selectPrioridad) {
            selectPrioridad.innerHTML = '<option value="">Seleccionar prioridad...</option>' + 
                prioridadesArray.map(p => `<option value="${p.id}">${p.nombre || p.descripcion}</option>`).join('');
        }

        // Cargar estados de alerta
        const estados = await listEstadoAlertas();
        const estadosArray = Array.isArray(estados) ? estados : (estados?.items || []);
        const selectEstado = $('#selectEstadoAlerta');
        if (selectEstado) {
            // El estado inicial suele ser "Pendiente" por defecto
            selectEstado.innerHTML = '<option value="">Pendiente (por defecto)</option>' + 
                estadosArray.map(e => `<option value="${e.id}">${e.nombre || e.descripcion}</option>`).join('');
        }
    } catch (error) {
        console.error('Error al cargar catálogos:', error);
        showToast('Error al cargar los catálogos');
    }
}

/**
 * Valida el formulario de alerta
 */
function validarFormulario(payload) {
    const errores = [];
    
    if (!payload.legajoId || payload.legajoId === '') {
        errores.push('Debe seleccionar un niño/legajo');
    }
    
    if (!payload.tipoAlertaId || payload.tipoAlertaId === '') {
        errores.push('Debe seleccionar el tipo de alerta');
    }
    
    if (!payload.prioridadId || payload.prioridadId === '') {
        errores.push('Debe seleccionar la prioridad');
    }
    
    if (!payload.descripcion || payload.descripcion.trim() === '') {
        errores.push('La descripción es obligatoria');
    }
    
    if (!payload.fechaVencimiento) {
        errores.push('La fecha de vencimiento es obligatoria');
    } else {
        // Validar que la fecha no sea en el pasado (opcional)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const vencimiento = new Date(payload.fechaVencimiento);
        vencimiento.setHours(0, 0, 0, 0);
        
        // Comentado: permitir fechas pasadas si es necesario
        // if (vencimiento < hoy) {
        //     errores.push('La fecha de vencimiento no puede ser en el pasado');
        // }
    }
    
    return errores;
}

/**
 * Vincula el formulario de alerta con su lógica de envío
 */
export function bindAlertaForm(onCreated) {
    const form = $('#alertaForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = serializeForm(form);
        
        // Validar formulario
        const errores = validarFormulario(payload);
        if (errores.length > 0) {
            showToast('❌ ' + errores.join('. '));
            return;
        }
        
        try {
            // Preparar datos para envío
            const alertaData = {
                LegajoId: parseInt(payload.legajoId),
                TipoId: parseInt(payload.tipoAlertaId),
                PrioridadId: payload.prioridadId ? parseInt(payload.prioridadId) : null,
                Descripcion: payload.descripcion.trim(),
                FechaVencimiento: payload.fechaVencimiento || null,
                EstadoId: payload.estadoAlertaId ? parseInt(payload.estadoAlertaId) : 1 // Pendiente por defecto
            };
            
            // Solo incluir estado si se seleccionó uno específico
            // Ya se incluye EstadoId arriba; no repetir claves con diferente casing
            
            await createAlerta(alertaData);
            
            showToast('✅ Alerta creada exitosamente');
            form.reset();
            
            // Cerrar modal
            const modal = document.getElementById('modalNuevaAlerta');
            if (modal) {
                modal.classList.add('hidden');
            }
            
            // Callback para recargar datos
            if (onCreated) await onCreated();
            
        } catch (err) {
            console.error('Error al crear alerta:', err);
            showToast(`❌ Error al crear alerta: ${err.message || 'Error desconocido'}`);
        }
    });
}

/**
 * Función auxiliar para guardar alerta (usada desde botones)
 */
export function guardarAlerta() {
    const form = $('#alertaForm');
    if (form) form.requestSubmit();
}


