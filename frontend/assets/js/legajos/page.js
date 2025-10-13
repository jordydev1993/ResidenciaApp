import { $, renderHTML, serializeForm, showToast } from '../utils/dom.js';
import { listLegajos, createLegajo, updateLegajo, deleteLegajo } from '../api/legajosApi.js';
import { listNinos } from '../api/ninoApi.js';
import { listEstados } from '../api/catalogosApi.js';
import { listTutores, createTutor } from '../api/tutorApi.js';
import { upsertNino } from '../api/ninoApi.js';

let legajosData = [];
let filteredData = [];
let ninosData = [];
let estadosData = [];
let tutoresData = [];
let legajoToDelete = null;
let sortColumn = 'fechaIngreso'; // Columna de ordenamiento por defecto
let sortDirection = 'desc'; // Dirección: 'asc' o 'desc'
let ninoSeleccionado = null;
let tutorSeleccionado = null;
let eventsBindedOnce = false; // Flag para evitar múltiples bindings

// Normaliza texto: minúsculas y sin tildes
function normalizeText(value) {
    return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function rowTemplate(leg) {
    // DataTable serializado o JSON directo
    const id = leg.LegajoId ?? leg["LegajoId"] ?? leg.Id ?? leg["Id"] ?? leg.id ?? leg[0];
    const ninoId = leg.NinoId ?? leg["NinoId"] ?? leg.ninoId ?? leg[1];
    const dni = leg.Dni ?? leg["Dni"] ?? leg.dni ?? '';
    const nombre = leg.NinoNombre ?? leg["NinoNombre"] ?? leg.Nombre ?? leg["Nombre"] ?? leg.nombre ?? '';
    const apellido = leg.NinoApellido ?? leg["NinoApellido"] ?? leg.Apellido ?? leg["Apellido"] ?? leg.apellido ?? '';
    const fechaIngreso = leg.FechaIngreso ?? leg["FechaIngreso"] ?? leg.fechaIngreso ?? '';
    const estado = leg.Estado ?? leg["Estado"] ?? leg.estado ?? leg.estadoNombre ?? '';
    const estadoId = leg.EstadoId ?? leg["EstadoId"] ?? leg.estadoId ?? '';
    const tutorId = leg.TutorId ?? leg["TutorId"] ?? leg.tutorId ?? null;
    const tutorNombre = leg.TutorNombreCompleto ?? leg["TutorNombreCompleto"] ?? leg.Tutor ?? leg["Tutor"] ?? leg.TutorNombre ?? leg["TutorNombre"] ?? leg.tutorNombre ?? '';
    
    // Badge de estado
    let estadoBadge;
    const estadoLower = String(estado).toLowerCase();
    if (estadoLower === 'activo') {
        estadoBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>';
    } else if (estadoLower === 'egresado') {
        estadoBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Egresado</span>';
    } else {
        estadoBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${estado}</span>`;
    }
    
    const nombreCompleto = apellido ? `${apellido}, ${nombre}` : nombre;
    
    return `<tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${dni}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${nombreCompleto}</td>
        <td class="px-6 py-4 whitespace-nowrap">${estadoBadge}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${fechaIngreso ? String(fechaIngreso).substring(0, 10) : ''}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            ${tutorNombre ? `<span class="inline-flex items-center"><i class="bi bi-person-badge-fill text-purple-600 mr-1"></i>${tutorNombre}</span>` : '<span class="text-gray-400">Sin tutor</span>'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex space-x-2">
                <button data-id="${id}" data-nino-id="${ninoId}" data-estado-id="${estadoId}" data-tutor-id="${tutorId}" 
                        class="btn-edit text-blue-600 hover:text-blue-900" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button data-id="${id}" class="btn-delete text-red-600 hover:text-red-900" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    </tr>`;
}

async function load() {
    try {
        const data = await listLegajos();
        const items = Array.isArray(data) ? data : (data?.items || data);
        legajosData = items || [];
        filteredData = [...legajosData];
        updateKPIs();
        applyFilters();
    } catch (err) {
        showToast(`❌ Error al cargar: ${err.message}`);
    }
}

async function loadCatalogos() {
    try {
        // Cargar niños
        const ninosResp = await listNinos();
        ninosData = Array.isArray(ninosResp) ? ninosResp : (ninosResp?.items || ninosResp);
        
        // Cargar estados
        const estadosResp = await listEstados();
        estadosData = Array.isArray(estadosResp) ? estadosResp : (estadosResp?.items || estadosResp);
        
        // Cargar tutores
        const tutoresResp = await listTutores();
        tutoresData = Array.isArray(tutoresResp) ? tutoresResp : (tutoresResp?.items || tutoresResp);
        
        // Llenar selectores
        fillEstadoSelector();
        fillTutorSelector();
    } catch (err) {
        showToast(`❌ Error al cargar catálogos: ${err.message}`);
    }
}

function fillEstadoSelector() {
    const select = $('select[name="estadoId"]');
    if (!select) return;
    
    const options = estadosData.map(e => {
        const id = e.Id ?? e["Id"] ?? e[0];
        const nombre = e.Nombre ?? e["Nombre"] ?? e[1];
        return `<option value="${id}">${nombre}</option>`;
    }).join('');
    
    select.innerHTML = '<option value="">Seleccionar estado...</option>' + options;
}

function fillTutorSelector() {
    const select = $('select[name="tutorId"]');
    if (!select) return;
    
    const options = tutoresData.map(t => {
        const id = t.Id ?? t["Id"] ?? t[0];
        const nombre = t.Nombre ?? t["Nombre"] ?? t[1];
        const apellido = t.Apellido ?? t["Apellido"] ?? t[2] ?? '';
        const nombreCompleto = apellido ? `${apellido}, ${nombre}` : nombre;
        return `<option value="${id}">${nombreCompleto}</option>`;
    }).join('');
    
    select.innerHTML = '<option value="">Sin tutor</option>' + options;
}

function renderTable() {
    const tableBody = $('#tablaLegajos');
    const contador = $('#totalRegistrosTabla');
    
    if (!filteredData || !filteredData.length) {
        tableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-12 text-center text-gray-500">No hay legajos registrados</td></tr>';
        if (contador) contador.textContent = '0';
        return;
    }
    
    renderHTML(tableBody, filteredData.map(rowTemplate).join(''));
    if (contador) contador.textContent = filteredData.length;
}

function updateKPIs() {
    // Total de legajos
    const totalLegajos = legajosData.length;
    const totalElement = $('#totalLegajos');
    if (totalElement) totalElement.textContent = totalLegajos;
    
    // Legajos activos
    const activos = legajosData.filter(l => {
        const estado = (l.Estado ?? l["Estado"] ?? l.estado ?? '').toLowerCase();
        return estado === 'activo';
    }).length;
    const activosElement = $('#legajosActivos');
    if (activosElement) activosElement.textContent = activos;
    
    // Legajos egresados
    const egresados = legajosData.filter(l => {
        const estado = (l.Estado ?? l["Estado"] ?? l.estado ?? '').toLowerCase();
        return estado === 'egresado';
    }).length;
    const egresadosElement = $('#legajosEgresados');
    if (egresadosElement) egresadosElement.textContent = egresados;
    
    // Legajos con tutor
    const conTutor = legajosData.filter(l => {
        const tutorId = l.TutorId ?? l["TutorId"] ?? l.tutorId ?? null;
        return tutorId && tutorId != '';
    }).length;
    const conTutorElement = $('#legajosConTutor');
    if (conTutorElement) conTutorElement.textContent = conTutor;
}

function applyFilters() {
    const estadoFiltro = normalizeText($('#filtroEstado')?.value);
    const dniFiltro = normalizeText($('#filtroDni')?.value);
    const nombreFiltro = normalizeText($('#filtroNombre')?.value);
    const tutorFiltro = normalizeText($('#filtroTutor')?.value);
    const busqueda = normalizeText($('#busquedaLegajos')?.value);
    
    filteredData = legajosData.filter(legajo => {
        const dni = normalizeText(legajo.Dni ?? legajo["Dni"] ?? legajo.dni ?? '');
        const nombre = normalizeText(legajo.NinoNombre ?? legajo["NinoNombre"] ?? legajo.Nombre ?? legajo["Nombre"] ?? legajo.nombre ?? '');
        const apellido = normalizeText(legajo.NinoApellido ?? legajo["NinoApellido"] ?? legajo.Apellido ?? legajo["Apellido"] ?? legajo.apellido ?? '');
        const estado = normalizeText(legajo.Estado ?? legajo["Estado"] ?? legajo.estado ?? '');
        const tutorNombre = normalizeText(legajo.TutorNombreCompleto ?? legajo["TutorNombreCompleto"] ?? legajo.Tutor ?? legajo["Tutor"] ?? legajo.TutorNombre ?? legajo["TutorNombre"] ?? legajo.tutorNombre ?? '');
        
        const matchEstado = !estadoFiltro || estado.includes(estadoFiltro);
        const matchDni = !dniFiltro || dni.includes(dniFiltro);
        const matchNombre = !nombreFiltro || nombre.includes(nombreFiltro) || apellido.includes(nombreFiltro);
        const matchTutor = !tutorFiltro || tutorNombre.includes(tutorFiltro);
        const matchBusqueda = !busqueda || dni.includes(busqueda) || nombre.includes(busqueda) || apellido.includes(busqueda);
        
        return matchEstado && matchDni && matchNombre && matchTutor && matchBusqueda;
    });
    
    sortData();
    renderTable();
}

function sortData() {
    filteredData.sort((a, b) => {
        let valueA, valueB;
        
        switch(sortColumn) {
            case 'dni':
                valueA = a.Dni ?? a["Dni"] ?? a.dni ?? '';
                valueB = b.Dni ?? b["Dni"] ?? b.dni ?? '';
                break;
            case 'nombre':
                valueA = normalizeText(a.NinoApellido ?? a["NinoApellido"] ?? a.Apellido ?? a["Apellido"] ?? a.apellido ?? '');
                valueB = normalizeText(b.NinoApellido ?? b["NinoApellido"] ?? b.Apellido ?? b["Apellido"] ?? b.apellido ?? '');
                break;
            case 'fechaIngreso':
                valueA = a.FechaIngreso ?? a["FechaIngreso"] ?? a.fechaIngreso ?? '';
                valueB = b.FechaIngreso ?? b["FechaIngreso"] ?? b.fechaIngreso ?? '';
                break;
            case 'estado':
                valueA = normalizeText(a.Estado ?? a["Estado"] ?? a.estado ?? '');
                valueB = normalizeText(b.Estado ?? b["Estado"] ?? b.estado ?? '');
                break;
            default:
                return 0;
        }
        
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
}

function bindEvents() {
    // Prevenir múltiples bindings
    if (eventsBindedOnce) {
        return;
    }
    eventsBindedOnce = true;
    
    // Eventos de la tabla - usar event delegation en un contenedor que NO se re-renderiza
    // En lugar de escuchar en #tablaLegajos (tbody), escuchamos en document para que persista
    document.addEventListener('click', (e) => {
        const btnEdit = e.target.closest('.btn-edit');
        const btnDelete = e.target.closest('.btn-delete');
        
        if (btnEdit) {
            const id = btnEdit.getAttribute('data-id');
            editLegajo(id);
        } else if (btnDelete) {
            const id = btnDelete.getAttribute('data-id');
            deleteLegajoConfirm(id);
        }
    });
    
    // Búsqueda
    const inputBusqueda = $('#busquedaLegajos');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', applyFilters);
    }
    
    // Filtros
    const filtroEstado = $('#filtroEstado');
    const filtroDni = $('#filtroDni');
    const filtroNombre = $('#filtroNombre');
    const filtroTutor = $('#filtroTutor');
    const btnLimpiarFiltros = $('#btnLimpiarFiltros');
    
    if (filtroEstado) filtroEstado.addEventListener('change', applyFilters);
    if (filtroDni) filtroDni.addEventListener('input', applyFilters);
    if (filtroNombre) filtroNombre.addEventListener('input', applyFilters);
    if (filtroTutor) filtroTutor.addEventListener('input', applyFilters);
    if (btnLimpiarFiltros) btnLimpiarFiltros.addEventListener('click', clearFilters);
    
    // Eventos del modal de legajo
    const btnNuevoLegajo = $('#btnNuevoLegajo');
    const btnCerrarModal = $('#btnCerrarModal');
    const btnCancelarModal = $('#btnCancelarModal');
    const modalLegajo = $('#modalLegajo');
    
    if (btnNuevoLegajo) btnNuevoLegajo.addEventListener('click', showModal);
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', hideModal);
    if (btnCancelarModal) btnCancelarModal.addEventListener('click', hideModal);
    
    // Cerrar modal al hacer clic fuera
    if (modalLegajo) {
        modalLegajo.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                hideModal();
            }
        });
    }
    
    // Eventos del mini-modal de crear niño
    const btnCrearNinoRapido = $('#btnCrearNinoRapido');
    const btnCerrarModalNino = $('#btnCerrarModalNino');
    const btnCancelarNino = $('#btnCancelarNino');
    const modalCrearNino = $('#modalCrearNino');
    
    if (btnCrearNinoRapido) btnCrearNinoRapido.addEventListener('click', showModalCrearNino);
    if (btnCerrarModalNino) btnCerrarModalNino.addEventListener('click', hideModalCrearNino);
    if (btnCancelarNino) btnCancelarNino.addEventListener('click', hideModalCrearNino);
    
    // Cerrar mini-modal al hacer clic fuera
    if (modalCrearNino) {
        modalCrearNino.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                hideModalCrearNino();
            }
        });
    }
    
    // Eventos de la lista de niños
    const btnVerListaNinos = $('#btnVerListaNinos');
    const btnCerrarListaNinos = $('#btnCerrarListaNinos');
    
    if (btnVerListaNinos) btnVerListaNinos.addEventListener('click', mostrarListaNinos);
    if (btnCerrarListaNinos) btnCerrarListaNinos.addEventListener('click', ocultarListaNinos);
    
    // Buscador de niño
    const buscadorNino = $('#buscadorNino');
    if (buscadorNino) {
        buscadorNino.addEventListener('input', buscarNino);
        buscadorNino.addEventListener('focus', () => {
            if (buscadorNino.value.trim()) buscarNino();
        });
    }
    
    // Limpiar niño seleccionado
    const btnLimpiarNino = $('#limpiarNino');
    if (btnLimpiarNino) {
        btnLimpiarNino.addEventListener('click', limpiarNinoSeleccionado);
    }
    
    // Eventos de tutores
    const btnVerListaTutores = $('#btnVerListaTutores');
    const btnCerrarListaTutores = $('#btnCerrarListaTutores');
    const btnCrearTutorRapido = $('#btnCrearTutorRapido');
    const btnCerrarModalTutor = $('#btnCerrarModalTutor');
    const btnCancelarTutor = $('#btnCancelarTutor');
    const modalCrearTutor = $('#modalCrearTutor');
    
    if (btnVerListaTutores) btnVerListaTutores.addEventListener('click', mostrarListaTutores);
    if (btnCerrarListaTutores) btnCerrarListaTutores.addEventListener('click', ocultarListaTutores);
    if (btnCrearTutorRapido) btnCrearTutorRapido.addEventListener('click', showModalCrearTutor);
    if (btnCerrarModalTutor) btnCerrarModalTutor.addEventListener('click', hideModalCrearTutor);
    if (btnCancelarTutor) btnCancelarTutor.addEventListener('click', hideModalCrearTutor);
    
    // Cerrar mini-modal de tutor al hacer clic fuera
    if (modalCrearTutor) {
        modalCrearTutor.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                hideModalCrearTutor();
            }
        });
    }
    
    // Buscador de tutor
    const buscadorTutor = $('#buscadorTutor');
    if (buscadorTutor) {
        buscadorTutor.addEventListener('input', buscarTutor);
        buscadorTutor.addEventListener('focus', () => {
            if (buscadorTutor.value.trim()) buscarTutor();
        });
    }
    
    // Limpiar tutor seleccionado
    const btnLimpiarTutor = $('#limpiarTutor');
    if (btnLimpiarTutor) {
        btnLimpiarTutor.addEventListener('click', limpiarTutorSeleccionado);
    }
    
    // Modal de confirmación
    const btnCancelarEliminar = $('#btnCancelarEliminar');
    const btnConfirmarEliminar = $('#btnConfirmarEliminar');
    const modalConfirmacion = $('#modalConfirmacion');
    
    if (btnCancelarEliminar) btnCancelarEliminar.addEventListener('click', hideConfirmModal);
    if (btnConfirmarEliminar) btnConfirmarEliminar.addEventListener('click', confirmDelete);
    
    if (modalConfirmacion) {
        modalConfirmacion.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                hideConfirmModal();
            }
        });
    }
}

function buscarNino() {
    const input = $('#buscadorNino');
    const resultados = $('#resultadosNino');
    const query = normalizeText(input.value);
    
    if (!query || query.length < 2) {
        resultados.classList.add('hidden');
        return;
    }
    
    const coincidencias = ninosData.filter(n => {
        const dni = normalizeText(n.DNI ?? n.Dni ?? n["DNI"] ?? n["Dni"] ?? n[1] ?? '');
        const nombre = normalizeText(n.Nombre ?? n["Nombre"] ?? n[3] ?? '');
        const apellido = normalizeText(n.Apellido ?? n["Apellido"] ?? n[2] ?? '');
        return dni.includes(query) || nombre.includes(query) || apellido.includes(query);
    }).slice(0, 10);
    
    if (!coincidencias.length) {
        resultados.innerHTML = '<div class="px-4 py-3 text-sm text-gray-500">No se encontraron resultados</div>';
        resultados.classList.remove('hidden');
        return;
    }
    
    const html = coincidencias.map(n => {
        const id = n.Id ?? n["Id"] ?? n[0];
        const dni = n.DNI ?? n.Dni ?? n["DNI"] ?? n["Dni"] ?? n[1] ?? '';
        const nombre = n.Nombre ?? n["Nombre"] ?? n[3] ?? '';
        const apellido = n.Apellido ?? n["Apellido"] ?? n[2] ?? '';
        const fechaNac = n.FechaNacimiento ?? n["FechaNacimiento"] ?? n[4] ?? '';
        const nombreCompleto = apellido ? `${apellido}, ${nombre}` : nombre;
        
        return `<div class="px-4 py-3 hover:bg-gray-100 cursor-pointer resultado-nino" 
                     data-id="${id}" 
                     data-dni="${dni}" 
                     data-nombre="${nombre}"
                     data-apellido="${apellido}"
                     data-fecha-nac="${fechaNac}">
            <div class="font-semibold text-gray-900">${nombreCompleto}</div>
            <div class="text-xs text-gray-600">DNI: ${dni}</div>
        </div>`;
    }).join('');
    
    resultados.innerHTML = html;
    resultados.classList.remove('hidden');
    
    // Event delegation para los resultados
    resultados.querySelectorAll('.resultado-nino').forEach(item => {
        item.addEventListener('click', () => {
            seleccionarNino({
                id: item.getAttribute('data-id'),
                dni: item.getAttribute('data-dni'),
                nombre: item.getAttribute('data-nombre'),
                apellido: item.getAttribute('data-apellido'),
                fechaNacimiento: item.getAttribute('data-fecha-nac')
            });
        });
    });
}

function seleccionarNino(nino) {
    ninoSeleccionado = nino;
    
    // Mostrar niño seleccionado
    const ninoSeleccionadoDiv = $('#ninoSeleccionado');
    const ninoNombreSpan = $('#ninoNombre');
    const ninoDniSpan = $('#ninoDni');
    const ninoIdInput = $('#ninoId');
    const buscador = $('#buscadorNino');
    const resultados = $('#resultadosNino');
    
    const nombreCompleto = nino.apellido ? `${nino.apellido}, ${nino.nombre}` : nino.nombre;
    
    if (ninoNombreSpan) ninoNombreSpan.textContent = nombreCompleto;
    if (ninoDniSpan) ninoDniSpan.textContent = nino.dni;
    if (ninoIdInput) ninoIdInput.value = nino.id;
    ninoSeleccionadoDiv.classList.remove('hidden');
    
    // Limpiar buscador
    buscador.value = '';
    resultados.classList.add('hidden');
}

function limpiarNinoSeleccionado() {
    ninoSeleccionado = null;
    $('#ninoSeleccionado').classList.add('hidden');
    $('#buscadorNino').value = '';
    $('#resultadosNino').classList.add('hidden');
    const ninoIdInput = $('#ninoId');
    if (ninoIdInput) ninoIdInput.value = '';
}

function editLegajo(id) {
    const legajo = legajosData.find(l => (l.LegajoId ?? l["LegajoId"] ?? l.Id ?? l["Id"] ?? l.id ?? l[0]) == id);
    if (!legajo) return;
    
    // Buscar el niño correspondiente
    const ninoId = legajo.NinoId ?? legajo["NinoId"] ?? legajo.ninoId;
    const nino = ninosData.find(n => (n.Id ?? n["Id"] ?? n[0]) == ninoId);
    
    if (nino) {
        seleccionarNino({
            id: nino.Id ?? nino["Id"] ?? nino[0],
            dni: nino.DNI ?? nino.Dni ?? nino["DNI"] ?? nino["Dni"] ?? nino[1],
            nombre: nino.Nombre ?? nino["Nombre"] ?? nino[3],
            apellido: nino.Apellido ?? nino["Apellido"] ?? nino[2],
            fechaNacimiento: nino.FechaNacimiento ?? nino["FechaNacimiento"] ?? nino[4]
        });
    }
    
    // Buscar el tutor correspondiente si existe
    const tutorId = legajo.TutorId ?? legajo["TutorId"] ?? legajo.tutorId;
    if (tutorId) {
        const tutor = tutoresData.find(t => (t.Id ?? t["Id"] ?? t[0]) == tutorId);
        if (tutor) {
            seleccionarTutor({
                id: tutor.Id ?? tutor["Id"] ?? tutor[0],
                nombre: tutor.Nombre ?? tutor["Nombre"] ?? tutor[1],
                apellido: tutor.Apellido ?? tutor["Apellido"] ?? tutor[2],
                telefono: tutor.Telefono ?? tutor["Telefono"] ?? tutor[3],
                email: tutor.Email ?? tutor["Email"] ?? tutor[4]
            });
        }
    }
    
    const form = $('#legajoForm');
    const modalTitle = $('#modalTitle');
    
    form.querySelector('[name="id"]').value = legajo.LegajoId ?? legajo["LegajoId"] ?? legajo.Id ?? legajo["Id"] ?? legajo.id ?? legajo[0] ?? '';
    form.querySelector('[name="fechaIngreso"]').value = (legajo.FechaIngreso ?? legajo["FechaIngreso"] ?? legajo.fechaIngreso ?? '').substring(0, 10);
    form.querySelector('[name="estadoId"]').value = legajo.EstadoId ?? legajo["EstadoId"] ?? legajo.estadoId ?? '';
    form.querySelector('[name="observaciones"]').value = legajo.Observaciones ?? legajo["Observaciones"] ?? legajo.observaciones ?? '';
    
    // Cambiar título y abrir modal SIN resetear
    modalTitle.textContent = 'Editar Legajo';
    showModal(false);
}

function deleteLegajoConfirm(id) {
    const legajo = legajosData.find(l => (l.LegajoId ?? l["LegajoId"] ?? l.Id ?? l["Id"] ?? l.id ?? l[0]) == id);
    if (!legajo) return;
    
    legajoToDelete = { id };
    const mensaje = $('#confirmacionMensaje');
    if (mensaje) {
        const dni = legajo.Dni ?? legajo["Dni"] ?? legajo.dni ?? '';
        const nombre = legajo.Nombre ?? legajo["Nombre"] ?? legajo.nombre ?? '';
        mensaje.textContent = `¿Está seguro que desea eliminar el legajo de ${nombre} (DNI: ${dni})? Esta acción no se puede deshacer.`;
    }
    showConfirmModal();
}

function showConfirmModal() {
    const modal = $('#modalConfirmacion');
    modal?.classList.remove('hidden');
}

function hideConfirmModal() {
    const modal = $('#modalConfirmacion');
    modal?.classList.add('hidden');
    legajoToDelete = null;
}

async function confirmDelete() {
    if (!legajoToDelete) return;
    
    try {
        await deleteLegajo(legajoToDelete.id);
        showToast('✅ Legajo eliminado correctamente');
        hideConfirmModal();
        load();
    } catch (err) {
        // Cerrar el modal primero para que el mensaje sea más visible
        hideConfirmModal();
        
        // Mostrar mensaje de error detallado
        const mensaje = err.message || 'Error desconocido';
        showToast(`❌ ${mensaje}`, 'error');
        console.error('Error al eliminar legajo:', err);
    }
}

function showModal(resetForm = true) {
    const modal = $('#modalLegajo');
    const form = $('#legajoForm');
    const modalTitle = $('#modalTitle');
    
    if (resetForm) {
        form.reset();
        limpiarNinoSeleccionado();
        limpiarTutorSeleccionado();
        modalTitle.textContent = 'Registrar Legajo';
    }
    modal.classList.remove('hidden');
}

function hideModal() {
    const modal = $('#modalLegajo');
    modal?.classList.add('hidden');
}

function showModalCrearNino() {
    const modal = $('#modalCrearNino');
    const form = $('#ninoRapidoForm');
    form.reset();
    modal?.classList.remove('hidden');
}

function hideModalCrearNino() {
    const modal = $('#modalCrearNino');
    modal?.classList.add('hidden');
}

function mostrarListaNinos() {
    const container = $('#listaNinosContainer');
    const tabla = $('#tablaListaNinos');
    const contador = $('#totalNinosLista');
    
    if (!container || !tabla) return;
    
    // Ordenar niños por apellido, nombre
    const ninosOrdenados = [...ninosData].sort((a, b) => {
        const apellidoA = normalizeText(a.Apellido ?? a["Apellido"] ?? a[2] ?? '');
        const apellidoB = normalizeText(b.Apellido ?? b["Apellido"] ?? b[2] ?? '');
        const nombreA = normalizeText(a.Nombre ?? a["Nombre"] ?? a[3] ?? '');
        const nombreB = normalizeText(b.Nombre ?? b["Nombre"] ?? b[3] ?? '');
        
        if (apellidoA !== apellidoB) return apellidoA.localeCompare(apellidoB);
        return nombreA.localeCompare(nombreB);
    });
    
    // Renderizar filas
    const html = ninosOrdenados.map(n => {
        const id = n.Id ?? n["Id"] ?? n[0];
        const dni = n.DNI ?? n.Dni ?? n["DNI"] ?? n["Dni"] ?? n[1] ?? '';
        const nombre = n.Nombre ?? n["Nombre"] ?? n[3] ?? '';
        const apellido = n.Apellido ?? n["Apellido"] ?? n[2] ?? '';
        const fechaNac = n.FechaNacimiento ?? n["FechaNacimiento"] ?? n[4] ?? '';
        
        return `<tr class="hover:bg-blue-50 cursor-pointer nino-row" 
                    data-id="${id}" 
                    data-dni="${dni}" 
                    data-nombre="${nombre}"
                    data-apellido="${apellido}"
                    data-fecha-nac="${fechaNac}">
            <td class="px-3 py-2 text-gray-900">${apellido || '-'}</td>
            <td class="px-3 py-2 text-gray-900">${nombre}</td>
            <td class="px-3 py-2 text-gray-700">${dni}</td>
            <td class="px-3 py-2 text-center">
                <button type="button" class="btn-seleccionar-nino text-blue-600 hover:text-blue-800 font-medium text-xs" 
                        data-id="${id}" 
                        data-dni="${dni}" 
                        data-nombre="${nombre}"
                        data-apellido="${apellido}"
                        data-fecha-nac="${fechaNac}">
                    <i class="bi bi-check-circle-fill"></i> Seleccionar
                </button>
            </td>
        </tr>`;
    }).join('');
    
    tabla.innerHTML = html;
    contador.textContent = ninosOrdenados.length;
    container.classList.remove('hidden');
    
    // Event delegation para seleccionar
    tabla.querySelectorAll('.btn-seleccionar-nino, .nino-row').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = e.currentTarget;
            seleccionarNino({
                id: target.getAttribute('data-id'),
                dni: target.getAttribute('data-dni'),
                nombre: target.getAttribute('data-nombre'),
                apellido: target.getAttribute('data-apellido'),
                fechaNacimiento: target.getAttribute('data-fecha-nac')
            });
            ocultarListaNinos();
        });
    });
}

function ocultarListaNinos() {
    const container = $('#listaNinosContainer');
    container?.classList.add('hidden');
}

// ========== FUNCIONES PARA TUTORES ==========

function buscarTutor() {
    const input = $('#buscadorTutor');
    const resultados = $('#resultadosTutor');
    const query = normalizeText(input.value);
    
    if (!query || query.length < 2) {
        resultados.classList.add('hidden');
        return;
    }
    
    const coincidencias = tutoresData.filter(t => {
        const nombre = normalizeText(t.Nombre ?? t["Nombre"] ?? t[1] ?? '');
        const apellido = normalizeText(t.Apellido ?? t["Apellido"] ?? t[2] ?? '');
        const telefono = normalizeText(t.Telefono ?? t["Telefono"] ?? t[3] ?? '');
        return nombre.includes(query) || apellido.includes(query) || telefono.includes(query);
    }).slice(0, 10);
    
    if (!coincidencias.length) {
        resultados.innerHTML = '<div class="px-4 py-3 text-sm text-gray-500">No se encontraron resultados</div>';
        resultados.classList.remove('hidden');
        return;
    }
    
    const html = coincidencias.map(t => {
        const id = t.Id ?? t["Id"] ?? t[0];
        const nombre = t.Nombre ?? t["Nombre"] ?? t[1] ?? '';
        const apellido = t.Apellido ?? t["Apellido"] ?? t[2] ?? '';
        const telefono = t.Telefono ?? t["Telefono"] ?? t[3] ?? '';
        const email = t.Email ?? t["Email"] ?? t[4] ?? '';
        const nombreCompleto = apellido ? `${apellido}, ${nombre}` : nombre;
        
        return `<div class="px-4 py-3 hover:bg-purple-50 cursor-pointer resultado-tutor" 
                     data-id="${id}" 
                     data-nombre="${nombre}"
                     data-apellido="${apellido}"
                     data-telefono="${telefono}"
                     data-email="${email}">
            <div class="font-semibold text-gray-900">${nombreCompleto}</div>
            <div class="text-xs text-gray-600">Tel: ${telefono || 'Sin teléfono'}</div>
        </div>`;
    }).join('');
    
    resultados.innerHTML = html;
    resultados.classList.remove('hidden');
    
    // Event delegation para los resultados
    resultados.querySelectorAll('.resultado-tutor').forEach(item => {
        item.addEventListener('click', () => {
            seleccionarTutor({
                id: item.getAttribute('data-id'),
                nombre: item.getAttribute('data-nombre'),
                apellido: item.getAttribute('data-apellido'),
                telefono: item.getAttribute('data-telefono'),
                email: item.getAttribute('data-email')
            });
        });
    });
}

function seleccionarTutor(tutor) {
    tutorSeleccionado = tutor;
    
    // Mostrar tutor seleccionado
    const tutorSeleccionadoDiv = $('#tutorSeleccionado');
    const tutorNombreSpan = $('#tutorNombre');
    const tutorTelefonoSpan = $('#tutorTelefono');
    const tutorIdInput = $('#tutorId');
    const buscador = $('#buscadorTutor');
    const resultados = $('#resultadosTutor');
    
    const nombreCompleto = tutor.apellido ? `${tutor.apellido}, ${tutor.nombre}` : tutor.nombre;
    
    if (tutorNombreSpan) tutorNombreSpan.textContent = nombreCompleto;
    if (tutorTelefonoSpan) tutorTelefonoSpan.textContent = tutor.telefono || 'Sin teléfono';
    if (tutorIdInput) tutorIdInput.value = tutor.id;
    tutorSeleccionadoDiv.classList.remove('hidden');
    
    // Limpiar buscador
    buscador.value = '';
    resultados.classList.add('hidden');
}

function limpiarTutorSeleccionado() {
    tutorSeleccionado = null;
    $('#tutorSeleccionado').classList.add('hidden');
    $('#buscadorTutor').value = '';
    $('#resultadosTutor').classList.add('hidden');
    const tutorIdInput = $('#tutorId');
    if (tutorIdInput) tutorIdInput.value = '';
}

function mostrarListaTutores() {
    const container = $('#listaTutoresContainer');
    const tabla = $('#tablaListaTutores');
    const contador = $('#totalTutoresLista');
    
    if (!container || !tabla) return;
    
    // Ordenar tutores por apellido, nombre
    const tutoresOrdenados = [...tutoresData].sort((a, b) => {
        const apellidoA = normalizeText(a.Apellido ?? a["Apellido"] ?? a[2] ?? '');
        const apellidoB = normalizeText(b.Apellido ?? b["Apellido"] ?? b[2] ?? '');
        const nombreA = normalizeText(a.Nombre ?? a["Nombre"] ?? a[1] ?? '');
        const nombreB = normalizeText(b.Nombre ?? b["Nombre"] ?? b[1] ?? '');
        
        if (apellidoA !== apellidoB) return apellidoA.localeCompare(apellidoB);
        return nombreA.localeCompare(nombreB);
    });
    
    // Renderizar filas
    const html = tutoresOrdenados.map(t => {
        const id = t.Id ?? t["Id"] ?? t[0];
        const nombre = t.Nombre ?? t["Nombre"] ?? t[1] ?? '';
        const apellido = t.Apellido ?? t["Apellido"] ?? t[2] ?? '';
        const telefono = t.Telefono ?? t["Telefono"] ?? t[3] ?? '';
        const email = t.Email ?? t["Email"] ?? t[4] ?? '';
        
        return `<tr class="hover:bg-purple-50 cursor-pointer tutor-row" 
                    data-id="${id}" 
                    data-nombre="${nombre}"
                    data-apellido="${apellido}"
                    data-telefono="${telefono}"
                    data-email="${email}">
            <td class="px-3 py-2 text-gray-900">${apellido || '-'}</td>
            <td class="px-3 py-2 text-gray-900">${nombre}</td>
            <td class="px-3 py-2 text-gray-700">${telefono || '-'}</td>
            <td class="px-3 py-2 text-center">
                <button type="button" class="btn-seleccionar-tutor text-purple-600 hover:text-purple-800 font-medium text-xs" 
                        data-id="${id}" 
                        data-nombre="${nombre}"
                        data-apellido="${apellido}"
                        data-telefono="${telefono}"
                        data-email="${email}">
                    <i class="bi bi-check-circle-fill"></i> Seleccionar
                </button>
            </td>
        </tr>`;
    }).join('');
    
    tabla.innerHTML = html;
    contador.textContent = tutoresOrdenados.length;
    container.classList.remove('hidden');
    
    // Event delegation para seleccionar
    tabla.querySelectorAll('.btn-seleccionar-tutor, .tutor-row').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = e.currentTarget;
            seleccionarTutor({
                id: target.getAttribute('data-id'),
                nombre: target.getAttribute('data-nombre'),
                apellido: target.getAttribute('data-apellido'),
                telefono: target.getAttribute('data-telefono'),
                email: target.getAttribute('data-email')
            });
            ocultarListaTutores();
        });
    });
}

function ocultarListaTutores() {
    const container = $('#listaTutoresContainer');
    container?.classList.add('hidden');
}

function showModalCrearTutor() {
    const modal = $('#modalCrearTutor');
    const form = $('#tutorRapidoForm');
    form.reset();
    modal?.classList.remove('hidden');
}

function hideModalCrearTutor() {
    const modal = $('#modalCrearTutor');
    modal?.classList.add('hidden');
}

function clearFilters() {
    if ($('#filtroEstado')) $('#filtroEstado').value = '';
    if ($('#filtroDni')) $('#filtroDni').value = '';
    if ($('#filtroNombre')) $('#filtroNombre').value = '';
    if ($('#filtroTutor')) $('#filtroTutor').value = '';
    applyFilters();
}

function limpiarFormulario() {
    const form = $('#legajoForm');
    form.reset();
    limpiarNinoSeleccionado();
}

function bindNinoRapidoForm() {
    const form = $('#ninoRapidoForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = serializeForm(form);
        
        // Validaciones
        if (!payload.dni?.trim()) return showToast('❌ DNI requerido');
        if (!payload.nombre?.trim()) return showToast('❌ Nombre requerido');
        if (!payload.apellido?.trim()) return showToast('❌ Apellido requerido');
        if (!payload.fechaNacimiento) return showToast('❌ Fecha de nacimiento requerida');
        
        try {
            const ninoData = {
                DNI: payload.dni.trim(),
                Nombre: payload.nombre.trim(),
                Apellido: payload.apellido.trim(),
                FechaNacimiento: payload.fechaNacimiento
            };
            
            const ninoCreado = await upsertNino(ninoData);
            showToast('✅ Niño creado correctamente');
            
            // Recargar lista de niños
            await loadCatalogos();
            
            // Seleccionar automáticamente el niño recién creado
            const ninoId = ninoCreado.Id ?? ninoCreado.id ?? ninoCreado;
            const nino = ninosData.find(n => (n.Id ?? n["Id"] ?? n[0]) == ninoId) || ninoCreado;
            
            seleccionarNino({
                id: nino.Id ?? nino["Id"] ?? nino[0] ?? ninoId,
                dni: nino.DNI ?? nino.Dni ?? nino["DNI"] ?? nino["Dni"] ?? ninoData.DNI,
                nombre: nino.Nombre ?? nino["Nombre"] ?? ninoData.Nombre,
                apellido: nino.Apellido ?? nino["Apellido"] ?? ninoData.Apellido,
                fechaNacimiento: nino.FechaNacimiento ?? nino["FechaNacimiento"] ?? ninoData.FechaNacimiento
            });
            
            // Si la lista estaba abierta, actualizarla
            const listaContainer = $('#listaNinosContainer');
            if (listaContainer && !listaContainer.classList.contains('hidden')) {
                mostrarListaNinos();
            }
            
            hideModalCrearNino();
        } catch (err) {
            if (err.message.includes('DNI ya existe')) {
                showToast('❌ Ya existe un niño con este DNI');
            } else {
                showToast(`❌ Error al crear niño: ${err.message}`);
            }
        }
    });
}

function bindTutorRapidoForm() {
    const form = $('#tutorRapidoForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = serializeForm(form);
        
        // Validaciones
        if (!payload.nombre?.trim()) return showToast('❌ Nombre requerido');
        
        try {
            const tutorData = {
                Nombre: payload.nombre.trim(),
                Apellido: payload.apellido ? payload.apellido.trim() : null,
                Telefono: payload.telefono || null,
                Email: payload.email || null
            };
            
            const tutorCreado = await createTutor(tutorData);
            showToast('✅ Tutor creado correctamente');
            
            // Recargar lista de tutores
            await loadCatalogos();
            
            // Seleccionar automáticamente el tutor recién creado
            const tutorId = tutorCreado.Id ?? tutorCreado.id ?? tutorCreado;
            const tutor = tutoresData.find(t => (t.Id ?? t["Id"] ?? t[0]) == tutorId) || tutorCreado;
            
            seleccionarTutor({
                id: tutor.Id ?? tutor["Id"] ?? tutor[0] ?? tutorId,
                nombre: tutor.Nombre ?? tutor["Nombre"] ?? tutorData.Nombre,
                apellido: tutor.Apellido ?? tutor["Apellido"] ?? tutorData.Apellido,
                telefono: tutor.Telefono ?? tutor["Telefono"] ?? tutorData.Telefono,
                email: tutor.Email ?? tutor["Email"] ?? tutorData.Email
            });
            
            // Si la lista estaba abierta, actualizarla
            const listaContainer = $('#listaTutoresContainer');
            if (listaContainer && !listaContainer.classList.contains('hidden')) {
                mostrarListaTutores();
            }
            
            hideModalCrearTutor();
        } catch (err) {
            showToast(`❌ Error al crear tutor: ${err.message}`);
        }
    });
}

function bindForm() {
    const form = $('#legajoForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = serializeForm(form);
        
        // Validaciones
        if (!payload.ninoId || !ninoSeleccionado) {
            return showToast('❌ Debe seleccionar un niño');
        }
        
        if (!payload.fechaIngreso) {
            return showToast('❌ Fecha de ingreso requerida');
        }
        
        if (!payload.estadoId) {
            return showToast('❌ Estado requerido');
        }
        
        try {
            const legajoData = {
                NinoId: parseInt(payload.ninoId),
                FechaIngreso: payload.fechaIngreso,
                EstadoId: parseInt(payload.estadoId),
                TutorId: payload.tutorId ? parseInt(payload.tutorId) : null,
                Observaciones: payload.observaciones || null
            };
            
            if (payload.id) {
                await updateLegajo(payload.id, legajoData);
                showToast('✅ Legajo actualizado correctamente');
            } else {
                await createLegajo(legajoData);
                showToast('✅ Legajo creado correctamente');
            }
            hideModal();
            limpiarFormulario();
            load();
        } catch (err) {
            showToast(`❌ Error al guardar: ${err.message}`);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bindForm();
    bindNinoRapidoForm();
    bindTutorRapidoForm();
    bindEvents();
    loadCatalogos().then(() => load());
});
