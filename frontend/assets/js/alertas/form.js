import { createAlerta, updateAlerta, listTipoAlertas, listPrioridades, listEstadoAlertas } from '../api/alertasApi.js';
import { listLegajos } from '../api/legajosApi.js';
import { $, serializeForm, showToast } from '../utils/dom.js';

/**
 * Carga todos los catálogos necesarios para el formulario
 * OPTIMIZADO: Carga todo en paralelo con Promise.all
 */
export async function loadCatalogos() {
    try {
        // 🚀 Cargar todos los catálogos en paralelo
        const [legajos, tipos, prioridades, estados] = await Promise.all([
            listLegajos(),
            listTipoAlertas(),
            listPrioridades(),
            listEstadoAlertas()
        ]);
        
        // Procesar legajos
        const legajosArray = Array.isArray(legajos) ? legajos : (legajos?.items || []);
        const selectLegajo = $('#selectLegajo');
        if (selectLegajo) {
            selectLegajo.innerHTML = '<option value="">Seleccionar niño...</option>' + 
                legajosArray.map(l => {
                    // La vista VW_LegajoDetalle retorna: LegajoId, NinoNombre, NinoApellido, Dni
                    const legajoId = l.LegajoId || l.legajoId || l.Id || l.id || '';
                    const nombre = l.NinoNombre || l.ninoNombre || l.Nombre || l.nombre || '';
                    const apellido = l.NinoApellido || l.ninoApellido || l.Apellido || l.apellido || '';
                    const dni = l.Dni || l.dni || '';
                    
                    // Construir el texto del option
                    const nombreCompleto = `${apellido} ${nombre}`.trim() || 'Sin nombre';
                    const textoDni = dni ? `(DNI: ${dni})` : '(Sin DNI)';
                    const textoLegajo = legajoId ? `- Legajo #${legajoId}` : '';
                    
                    return `<option value="${legajoId}">${nombreCompleto} ${textoDni} ${textoLegajo}</option>`;
                }).join('');
        }

        // Procesar tipos de alerta
        const tiposArray = Array.isArray(tipos) ? tipos : (tipos?.items || []);
        const selectTipo = $('#selectTipoAlerta');
        if (selectTipo) {
            selectTipo.innerHTML = '<option value="">Seleccionar tipo...</option>' + 
                tiposArray.map(t => {
                    const nombre = t.Nombre || t.nombre || t.Descripcion || t.descripcion || 'Sin nombre';
                    const id = t.Id || t.id;
                    return `<option value="${id}">${nombre}</option>`;
                }).join('');
        }

        // Procesar prioridades
        const prioridadesArray = Array.isArray(prioridades) ? prioridades : (prioridades?.items || []);
        const selectPrioridad = $('#selectPrioridad');
        if (selectPrioridad) {
            selectPrioridad.innerHTML = '<option value="">Seleccionar prioridad...</option>' + 
                prioridadesArray.map(p => {
                    const nombre = p.Nombre || p.nombre || p.Descripcion || p.descripcion || 'Sin nombre';
                    const id = p.Id || p.id;
                    return `<option value="${id}">${nombre}</option>`;
                }).join('');
        }

        // Procesar estados de alerta
        const estadosArray = Array.isArray(estados) ? estados : (estados?.items || []);
        const selectEstado = $('#selectEstadoAlerta');
        if (selectEstado) {
            // El estado inicial suele ser "Pendiente" por defecto
            selectEstado.innerHTML = '<option value="">Pendiente (por defecto)</option>' + 
                estadosArray.map(e => {
                    const nombre = e.Nombre || e.nombre || e.Descripcion || e.descripcion || 'Sin nombre';
                    const id = e.Id || e.id;
                    return `<option value="${id}">${nombre}</option>`;
                }).join('');
        }

        // Retornar los datos para reutilizar en page.js
        return { tipos: tiposArray, prioridades: prioridadesArray, estados: estadosArray };
    } catch (error) {
        console.error('Error al cargar catálogos:', error);
        showToast('Error al cargar los catálogos');
        return { tipos: [], prioridades: [], estados: [] };
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
            
            // Verificar si es edición o creación
            const alertaId = payload.alertaId;
            
            if (alertaId) {
                // Es edición
                await updateAlerta(parseInt(alertaId), alertaData);
                showToast('✅ Alerta actualizada exitosamente');
            } else {
                // Es creación
                await createAlerta(alertaData);
                showToast('✅ Alerta creada exitosamente');
            }
            
            form.reset();
            
            // Resetear título del modal
            const modal = document.getElementById('modalNuevaAlerta');
            const modalTitle = modal?.querySelector('h5');
            if (modalTitle) {
                modalTitle.textContent = 'Registrar Alerta';
            }
            
            // Remover el input hidden de alertaId si existe
            const inputId = form.querySelector('[name="alertaId"]');
            if (inputId) {
                inputId.remove();
            }
            
            // Cerrar modal
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
            
            // Callback para recargar datos
            if (onCreated) await onCreated();
            
        } catch (err) {
            console.error('Error al guardar alerta:', err);
            showToast(`❌ Error al guardar alerta: ${err.message || 'Error desconocido'}`);
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


