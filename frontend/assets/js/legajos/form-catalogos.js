import { $, renderHTML, serializeForm, showToast } from '../utils/dom.js';
import { createLegajo, updateLegajo } from '../api/legajosApi.js';
import { listNinos } from '../api/ninoApi.js';
import { listEstados } from '../api/legajosApi.js';
import { listTutores } from '../api/tutorApi.js';
import { CatalogModals } from '../utils/catalog-modals.js';

class LegajoFormManager {
    constructor() {
        this.ninos = [];
        this.estados = [];
        this.tutores = [];
        this.ninoSeleccionado = null;
        this.init();
    }

    async init() {
        try {
            await this.cargarCatalogos();
            this.bindEvents();
        } catch (error) {
            console.error('Error al inicializar LegajoFormManager:', error);
        }
    }

    async cargarCatalogos() {
        try {
            // Cargar catálogos en paralelo
            const [ninosData, estadosData, tutoresData] = await Promise.all([
                listNinos(),
                listEstados(),
                listTutores()
            ]);

            this.ninos = Array.isArray(ninosData) ? ninosData : (ninosData?.items || []);
            this.estados = Array.isArray(estadosData) ? estadosData : (estadosData?.items || []);
            this.tutores = Array.isArray(tutoresData) ? tutoresData : (tutoresData?.items || []);

            this.llenarSelectEstados();
            this.llenarSelectTutores();
        } catch (err) {
            console.warn('Error al cargar catálogos (modo offline):', err.message);
            // No mostrar error al usuario, solo llenar con datos vacíos
            this.ninos = [];
            this.estados = [];
            this.tutores = [];
            
            this.llenarSelectEstados();
            this.llenarSelectTutores();
        }
    }

    llenarSelectEstados() {
        const select = $('select[name="estadoId"]');
        if (!select) return;

        if (this.estados.length === 0) {
            select.innerHTML = '<option value="">Sin conexión - Estados no disponibles</option>';
        } else {
            select.innerHTML = '<option value="">Seleccionar estado...</option>';
            this.estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.Id || estado["Id"] || estado[0];
                option.textContent = estado.Nombre || estado["Nombre"] || estado[1];
                select.appendChild(option);
            });
        }
    }

    llenarSelectTutores() {
        const select = $('select[name="tutorId"]');
        if (!select) return;

        if (this.tutores.length === 0) {
            select.innerHTML = '<option value="">Sin conexión - Tutores no disponibles</option>';
        } else {
            select.innerHTML = '<option value="">Sin tutor</option>';
            this.tutores.forEach(tutor => {
                const option = document.createElement('option');
                option.value = tutor.Id || tutor["Id"] || tutor[0];
                option.textContent = tutor.Nombre || tutor["Nombre"] || tutor[1];
                select.appendChild(option);
            });
        }
    }

    bindEvents() {
        this.bindBuscadorNino();
        this.bindFormulario();
        this.bindLimpiarFormulario();
        this.bindModalButtons();
    }

    bindModalButtons() {
        // Botón crear niño
        const crearNinoBtn = $('#crearNinoBtn');
        if (crearNinoBtn) {
            crearNinoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                try {
                    if (typeof CatalogModals === 'undefined') {
                        showToast('Error: CatalogModals no está disponible', 'error');
                        return;
                    }
                    
                    CatalogModals.mostrarModalNino((nuevoNino) => {
                        // Recargar lista de niños y seleccionar el nuevo
                        this.cargarCatalogos().then(() => {
                            // Buscar el niño recién creado por DNI
                            const nino = this.ninos.find(n => String(n.DNI || n["DNI"] || n[0]) === nuevoNino.dni);
                            if (nino) {
                                this.seleccionarNino({
                                    dni: nino.DNI || nino["DNI"] || nino[0],
                                    nombre: nino.Nombre || nino["Nombre"] || nino[1],
                                    fechaNac: nino.FechaNacimiento || nino["FechaNacimiento"] || nino[2]
                                });
                            }
                        });
                    });
                } catch (error) {
                    console.error('Error al abrir modal niño:', error);
                    showToast('Error al abrir modal: ' + error.message, 'error');
                }
            });
        }

        // Botón crear tutor
        const crearTutorBtn = $('#crearTutorBtn');
        if (crearTutorBtn) {
            crearTutorBtn.addEventListener('click', () => {
                CatalogModals.mostrarModalTutor((nuevoTutor) => {
                    // Recargar lista de tutores
                    this.cargarCatalogos().then(() => {
                        showToast('Tutor creado. Seleccione el nuevo tutor de la lista.');
                    });
                });
            });
        }

        // Botón crear estado
        const crearEstadoBtn = $('#crearEstadoBtn');
        if (crearEstadoBtn) {
            crearEstadoBtn.addEventListener('click', () => {
                CatalogModals.mostrarModalEstado((nuevoEstado) => {
                    // Recargar lista de estados
                    this.cargarCatalogos().then(() => {
                        showToast('Estado creado. Seleccione el nuevo estado de la lista.');
                    });
                });
            });
        }
    }

    bindBuscadorNino() {
        const buscador = $('#buscadorNino');
        const resultados = $('#resultadosNino');
        const ninoSeleccionado = $('#ninoSeleccionado');

        if (!buscador) return;

        let timeoutId;
        buscador.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                resultados.classList.add('hidden');
                return;
            }

            timeoutId = setTimeout(() => {
                this.buscarNinos(query, resultados);
            }, 300);
        });

        // Ocultar resultados al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!buscador.contains(e.target) && !resultados.contains(e.target)) {
                resultados.classList.add('hidden');
            }
        });

        // Limpiar niño seleccionado
        const limpiarNino = $('#limpiarNino');
        if (limpiarNino) {
            limpiarNino.addEventListener('click', () => {
                this.limpiarNinoSeleccionado();
            });
        }
    }

    buscarNinos(query, resultados) {
        if (this.ninos.length === 0) {
            resultados.innerHTML = '<div class="p-3 text-gray-500 text-sm">Sin conexión - No se pueden buscar niños</div>';
            resultados.classList.remove('hidden');
            return;
        }

        const coincidencias = this.ninos.filter(nino => {
            const dni = String(nino.DNI || nino["DNI"] || nino[0] || '');
            const nombre = String(nino.Nombre || nino["Nombre"] || nino[1] || '').toLowerCase();
            const queryLower = query.toLowerCase();
            
            return dni.includes(query) || nombre.includes(queryLower);
        }).slice(0, 10); // Limitar a 10 resultados

        if (coincidencias.length === 0) {
            resultados.innerHTML = '<div class="p-3 text-gray-500 text-sm">No se encontraron resultados</div>';
        } else {
            resultados.innerHTML = coincidencias.map(nino => {
                const dni = nino.DNI || nino["DNI"] || nino[0];
                const nombre = nino.Nombre || nino["Nombre"] || nino[1];
                const fechaNac = nino.FechaNacimiento || nino["FechaNacimiento"] || nino[2];
                
                return `
                    <div class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 nino-resultado" 
                         data-dni="${dni}" 
                         data-nombre="${nombre}" 
                         data-fecha-nac="${fechaNac}">
                        <div class="font-medium text-gray-900">${nombre}</div>
                        <div class="text-sm text-gray-500">DNI: ${dni} | Nacimiento: ${fechaNac ? new Date(fechaNac).toLocaleDateString() : 'N/A'}</div>
                    </div>
                `;
            }).join('');
        }

        // Bind eventos a los resultados
        resultados.querySelectorAll('.nino-resultado').forEach(item => {
            item.addEventListener('click', () => {
                const dni = item.getAttribute('data-dni');
                const nombre = item.getAttribute('data-nombre');
                const fechaNac = item.getAttribute('data-fecha-nac');
                
                this.seleccionarNino({ dni, nombre, fechaNac });
                resultados.classList.add('hidden');
            });
        });

        resultados.classList.remove('hidden');
    }

    seleccionarNino(nino) {
        this.ninoSeleccionado = nino;
        
        // Llenar campos ocultos
        $('input[name="dni"]').value = nino.dni;
        $('input[name="nombre"]').value = nino.nombre;
        $('input[name="fechaNacimiento"]').value = nino.fechaNac;

        // Mostrar información del niño seleccionado
        $('#ninoNombre').textContent = nino.nombre;
        $('#ninoDni').textContent = nino.dni;
        $('#ninoSeleccionado').classList.remove('hidden');

        // Limpiar buscador
        $('#buscadorNino').value = '';
    }

    limpiarNinoSeleccionado() {
        this.ninoSeleccionado = null;
        
        // Limpiar campos
        $('input[name="dni"]').value = '';
        $('input[name="nombre"]').value = '';
        $('input[name="fechaNacimiento"]').value = '';

        // Ocultar información
        $('#ninoSeleccionado').classList.add('hidden');
        $('#resultadosNino').classList.add('hidden');
    }

    bindFormulario() {
        const form = $('#legajoForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.procesarFormulario();
        });
    }

    bindLimpiarFormulario() {
        const boton = $('#limpiarFormulario');
        if (!boton) return;

        boton.addEventListener('click', () => {
            this.limpiarFormulario();
        });
    }

    async procesarFormulario() {
        const payload = serializeForm($('#legajoForm'));
        
        // Validaciones
        if (!this.ninoSeleccionado) {
            showToast('Debe seleccionar un niño');
            return;
        }
        
        if (!payload.fechaIngreso) {
            showToast('Fecha de ingreso requerida');
            return;
        }
        
        if (!payload.estadoId) {
            showToast('Estado requerido');
            return;
        }

        try {
            const body = {
                DNI: this.ninoSeleccionado.dni,
                FechaIngreso: payload.fechaIngreso,
                EstadoId: Number(payload.estadoId),
                TutorId: payload.tutorId ? Number(payload.tutorId) : null,
                Observaciones: payload.observaciones?.trim() || null,
            };

            if (payload.id) {
                await updateLegajo(payload.id, body);
                showToast('Legajo actualizado correctamente');
            } else {
                await createLegajo(body);
                showToast('Legajo creado correctamente');
            }

            this.limpiarFormulario();
            
            // Notificar a la tabla para recargar
            if (window.recargarTablaLegajos) {
                window.recargarTablaLegajos();
            }
        } catch (err) {
            showToast(`Error al guardar: ${err.message}`);
        }
    }

    limpiarFormulario() {
        $('#legajoForm').reset();
        this.limpiarNinoSeleccionado();
    }

    // Método público para editar un legajo existente
    editarLegajo(legajo) {
        // Llenar formulario con datos del legajo
        $('input[name="id"]').value = legajo.id || '';
        $('input[name="fechaIngreso"]').value = legajo.fechaIngreso || '';
        $('select[name="estadoId"]').value = legajo.estadoId || '';
        $('select[name="tutorId"]').value = legajo.tutorId || '';
        $('textarea[name="observaciones"]').value = legajo.observaciones || '';

        // Buscar y seleccionar el niño
        const nino = this.ninos.find(n => String(n.DNI || n["DNI"] || n[0]) === String(legajo.dni));
        if (nino) {
            this.seleccionarNino({
                dni: nino.DNI || nino["DNI"] || nino[0],
                nombre: nino.Nombre || nino["Nombre"] || nino[1],
                fechaNac: nino.FechaNacimiento || nino["FechaNacimiento"] || nino[2]
            });
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.legajoFormManager = new LegajoFormManager();
    } catch (error) {
        console.error('Error al crear LegajoFormManager:', error);
    }
});

export { LegajoFormManager };
