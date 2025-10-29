import { $, renderHTML, serializeForm, showToast } from '../utils/dom.js';
import { listTutores, createTutor, updateTutor, deleteTutor } from '../api/tutorApi.js';

let tutoresData = [];
let filteredData = [];
let tutorToDelete = null;
let selectedTutor = null; // Tutor actualmente seleccionado
let sortColumn = 'apellido'; // Columna de ordenamiento por defecto
let sortDirection = 'asc'; // Dirección: 'asc' o 'desc'

// Normaliza texto: minúsculas y sin tildes para búsquedas flexibles
function normalizeText(value) {
    return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function rowTemplate(t) {
    // DataTable serializado: [0]=Id, [1]=Nombre, [2]=Apellido, [3]=Telefono, [4]=Email
    const id = t.Id ?? t["Id"] ?? t[0];
    const nombre = t.Nombre ?? t["Nombre"] ?? t[1] ?? '';
    const apellido = t.Apellido ?? t["Apellido"] ?? t[2] ?? '';
    const telefono = t.Telefono ?? t["Telefono"] ?? t[3] ?? '';
    const email = t.Email ?? t["Email"] ?? t[4] ?? '';
    
    return `<tr data-id="${id}" class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${apellido}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${nombre}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            ${telefono ? `<span class="inline-flex items-center"><i class="bi bi-telephone-fill text-green-600 mr-1"></i>${telefono}</span>` : '<span class="text-gray-400">Sin teléfono</span>'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
            ${email ? `<a href="mailto:${email}" class="inline-flex items-center text-blue-600 hover:underline"><i class="bi bi-envelope-fill mr-1"></i>${email}</a>` : '<span class="text-gray-400">Sin email</span>'}
        </td>
    </tr>`;
}

async function load() {
    try {
        const data = await listTutores();
        const items = Array.isArray(data) ? data : (data?.items || data);
        tutoresData = items || [];
        filteredData = [...tutoresData];
        updateKPIs();
        applyFilters(); // Esto ya aplica sortData() y renderTable()
        updateActionButtons(); // Inicializar estado de botones
    } catch (err) {
        showToast(`❌ Error al cargar: ${err.message}`);
    }
}

function renderTable() {
    const tableBody = $('#tablaTutores');
    const emptyState = $('#emptyState');
    const contador = $('#totalRegistrosTabla');
    
    if (!filteredData || !filteredData.length) {
        tableBody.innerHTML = '';
        emptyState?.classList.remove('hidden');
        if (contador) contador.textContent = '0';
        selectedTutor = null;
        updateActionButtons();
        return;
    }
    
    emptyState?.classList.add('hidden');
    renderHTML(tableBody, filteredData.map(rowTemplate).join(''));
    if (contador) contador.textContent = filteredData.length;
    bindRowSelection();
}

/**
 * Selecciona una fila de tutor
 */
function selectRow(id) {
    selectedTutor = filteredData.find(t => String(t.Id ?? t["Id"] ?? t[0]) === String(id));
    
    // Actualizar clases visuales
    const tableBody = $('#tablaTutores');
    if (tableBody) {
        tableBody.querySelectorAll('tr').forEach(tr => tr.classList.remove('selected'));
        const selectedRow = tableBody.querySelector(`tr[data-id="${id}"]`);
        if (selectedRow) {
            selectedRow.classList.add('selected');
        }
    }
    
    updateActionButtons();
}

/**
 * Deselecciona la fila actual
 */
function unselectRow() {
    selectedTutor = null;
    const tableBody = $('#tablaTutores');
    if (tableBody) {
        tableBody.querySelectorAll('tr').forEach(tr => tr.classList.remove('selected'));
    }
    updateActionButtons();
}

/**
 * Actualiza el estado de los botones de acción
 */
function updateActionButtons() {
    const btnEditar = $('#btnEditarTutor');
    const btnEliminar = $('#btnEliminarTutor');
    
    if (selectedTutor) {
        btnEditar?.removeAttribute('disabled');
        btnEliminar?.removeAttribute('disabled');
    } else {
        btnEditar?.setAttribute('disabled', 'true');
        btnEliminar?.setAttribute('disabled', 'true');
    }
}

/**
 * Vincula eventos de selección de filas
 */
function bindRowSelection() {
    const tableBody = $('#tablaTutores');
    if (!tableBody) return;
    
    tableBody.querySelectorAll('tr[data-id]').forEach(row => {
        row.addEventListener('click', (e) => {
            // Ignorar clicks en enlaces
            if (e.target.tagName === 'A' || e.target.closest('a')) return;
            
            const id = row.getAttribute('data-id');
            
            // Si la fila ya está seleccionada, deseleccionar
            if (row.classList.contains('selected')) {
                unselectRow();
            } else {
                selectRow(id);
            }
        });
    });
}

function updateKPIs() {
    // Total de tutores
    const totalTutores = tutoresData.length;
    const totalElement = $('#totalTutores');
    if (totalElement) totalElement.textContent = totalTutores;
    
    // Con teléfono
    const conTel = tutoresData.filter(t => {
        const telefono = t.Telefono ?? t["Telefono"] ?? t[2] ?? '';
        return telefono && telefono.trim() !== '';
    }).length;
    const conTelElement = $('#conTelefono');
    if (conTelElement) conTelElement.textContent = conTel;
    
    // Con email
    const conEmail = tutoresData.filter(t => {
        const email = t.Email ?? t["Email"] ?? t[3] ?? '';
        return email && email.trim() !== '';
    }).length;
    const conEmailElement = $('#conEmail');
    if (conEmailElement) conEmailElement.textContent = conEmail;
}

function applyFilters() {
    const nombreFiltro = normalizeText($('#filtroNombre')?.value);
    const apellidoFiltro = normalizeText($('#filtroApellido')?.value);
    const telefonoFiltro = normalizeText($('#filtroTelefono')?.value);
    const emailFiltro = normalizeText($('#filtroEmail')?.value);
    
    filteredData = tutoresData.filter(tutor => {
        const nombre = normalizeText(tutor.Nombre ?? tutor["Nombre"] ?? tutor[1] ?? '');
        const apellido = normalizeText(tutor.Apellido ?? tutor["Apellido"] ?? tutor[2] ?? '');
        const telefono = normalizeText(tutor.Telefono ?? tutor["Telefono"] ?? tutor[3] ?? '');
        const email = normalizeText(tutor.Email ?? tutor["Email"] ?? tutor[4] ?? '');
        
        const matchNombre = !nombreFiltro || nombre.includes(nombreFiltro);
        const matchApellido = !apellidoFiltro || apellido.includes(apellidoFiltro);
        const matchTelefono = !telefonoFiltro || telefono.includes(telefonoFiltro);
        const matchEmail = !emailFiltro || email.includes(emailFiltro);
        
        return matchNombre && matchApellido && matchTelefono && matchEmail;
    });
    
    sortData();
    renderTable();
}

function sortData() {
    filteredData.sort((a, b) => {
        let valueA, valueB;
        
        switch(sortColumn) {
            case 'apellido':
                valueA = normalizeText(a.Apellido ?? a["Apellido"] ?? a[2] ?? '');
                valueB = normalizeText(b.Apellido ?? b["Apellido"] ?? b[2] ?? '');
                break;
            case 'nombre':
                valueA = normalizeText(a.Nombre ?? a["Nombre"] ?? a[1] ?? '');
                valueB = normalizeText(b.Nombre ?? b["Nombre"] ?? b[1] ?? '');
                break;
            case 'telefono':
                valueA = a.Telefono ?? a["Telefono"] ?? a[3] ?? '';
                valueB = b.Telefono ?? b["Telefono"] ?? b[3] ?? '';
                break;
            case 'email':
                valueA = normalizeText(a.Email ?? a["Email"] ?? a[4] ?? '');
                valueB = normalizeText(b.Email ?? b["Email"] ?? b[4] ?? '');
                break;
            default:
                return 0;
        }
        
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
}

function toggleSort(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    // Actualizar íconos
    document.querySelectorAll('th[data-sort]').forEach(th => {
        const icon = th.querySelector('.sort-icon');
        if (th.dataset.sort === column) {
            icon.className = sortDirection === 'asc' 
                ? 'bi bi-sort-alpha-down text-blue-600 sort-icon'
                : 'bi bi-sort-alpha-up text-blue-600 sort-icon';
        } else {
            icon.className = 'bi bi-arrow-down-up text-gray-400 sort-icon';
        }
    });
    
    sortData();
    renderTable();
}

function bindEvents() {
    // Eventos de ordenamiento en los encabezados
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSort(th.dataset.sort);
        });
    });
    
    // Eventos de filtros
    const filtroNombre = $('#filtroNombre');
    const filtroApellido = $('#filtroApellido');
    const filtroTelefono = $('#filtroTelefono');
    const filtroEmail = $('#filtroEmail');
    const btnLimpiar = $('#btnLimpiarFiltros');
    
    if (filtroNombre) filtroNombre.addEventListener('input', applyFilters);
    if (filtroApellido) filtroApellido.addEventListener('input', applyFilters);
    if (filtroTelefono) filtroTelefono.addEventListener('input', applyFilters);
    if (filtroEmail) filtroEmail.addEventListener('input', applyFilters);
    if (btnLimpiar) btnLimpiar.addEventListener('click', clearFilters);
    
    // Eventos de los botones del header
    const btnNuevo = $('#btnNuevoTutor');
    const btnEditar = $('#btnEditarTutor');
    const btnEliminar = $('#btnEliminarTutor');
    
    if (btnNuevo) {
        btnNuevo.addEventListener('click', () => {
            unselectRow(); // Limpiar selección al crear nuevo
            showModal();
        });
    }
    
    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            if (selectedTutor) {
                const id = selectedTutor.Id ?? selectedTutor["Id"] ?? selectedTutor[0];
                editTutor(id);
            }
        });
    }
    
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            if (selectedTutor) {
                const id = selectedTutor.Id ?? selectedTutor["Id"] ?? selectedTutor[0];
                deleteTutorConfirm(id);
            }
        });
    }
    
    // Eventos del modal
    const btnCerrar = $('#btnCerrarModal');
    const btnCancelar = $('#btnCancelarModal');
    const modalTutor = $('#modalTutor');
    
    if (btnCerrar) btnCerrar.addEventListener('click', hideModal);
    if (btnCancelar) btnCancelar.addEventListener('click', hideModal);
    
    // Cerrar modal al hacer clic fuera
    if (modalTutor) {
        modalTutor.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                hideModal();
            }
        });
    }
    
    // Eventos del modal de confirmación
    const btnCancelarEliminar = $('#btnCancelarEliminar');
    const btnConfirmarEliminar = $('#btnConfirmarEliminar');
    const modalConfirmacion = $('#modalConfirmacion');
    
    if (btnCancelarEliminar) btnCancelarEliminar.addEventListener('click', hideConfirmModal);
    if (btnConfirmarEliminar) btnConfirmarEliminar.addEventListener('click', confirmDelete);
    
    // Cerrar modal de confirmación al hacer clic fuera
    if (modalConfirmacion) {
        modalConfirmacion.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                hideConfirmModal();
            }
        });
    }
}

function showModal(resetForm = true) {
    const modal = $('#modalTutor');
    const form = $('#tutorForm');
    const modalTitle = $('#modalTitle');
    
    if (resetForm) {
        form.reset();
        modalTitle.textContent = 'Registrar Tutor';
    }
    modal.classList.remove('hidden');
}

function hideModal() {
    const modal = $('#modalTutor');
    modal?.classList.add('hidden');
}

function editTutor(id) {
    const tutor = tutoresData.find(t => (t.Id ?? t["Id"] ?? t[0]) == id);
    if (!tutor) return;
    
    const form = $('#tutorForm');
    const modalTitle = $('#modalTitle');
    
    // Cargar datos en el formulario
    form.querySelector('[name="id"]').value = tutor.Id ?? tutor["Id"] ?? tutor[0] ?? '';
    form.querySelector('[name="nombre"]').value = tutor.Nombre ?? tutor["Nombre"] ?? tutor[1] ?? '';
    form.querySelector('[name="apellido"]').value = tutor.Apellido ?? tutor["Apellido"] ?? tutor[2] ?? '';
    form.querySelector('[name="telefono"]').value = tutor.Telefono ?? tutor["Telefono"] ?? tutor[3] ?? '';
    form.querySelector('[name="email"]').value = tutor.Email ?? tutor["Email"] ?? tutor[4] ?? '';
    
    // Cambiar título y abrir modal SIN resetear
    modalTitle.textContent = 'Editar Tutor';
    showModal(false); // false = no resetear el formulario
}

function deleteTutorConfirm(id) {
    const tutor = tutoresData.find(t => (t.Id ?? t["Id"] ?? t[0]) == id);
    if (!tutor) return;
    
    tutorToDelete = { id };
    const mensaje = $('#confirmacionMensaje');
    if (mensaje) {
        const nombre = tutor.Nombre ?? tutor["Nombre"] ?? tutor[1] ?? '';
        mensaje.textContent = `¿Está seguro que desea eliminar al tutor "${nombre}"? Esta acción no se puede deshacer.`;
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
    tutorToDelete = null;
}

async function confirmDelete() {
    if (!tutorToDelete) return;
    
    try {
        await deleteTutor(tutorToDelete.id);
        showToast('✅ Tutor eliminado correctamente');
        hideConfirmModal();
        unselectRow(); // Limpiar selección
        load();
    } catch (err) {
        showToast(`❌ Error al eliminar: ${err.message}`);
    }
}

function clearFilters() {
    if ($('#filtroNombre')) $('#filtroNombre').value = '';
    if ($('#filtroApellido')) $('#filtroApellido').value = '';
    if ($('#filtroTelefono')) $('#filtroTelefono').value = '';
    if ($('#filtroEmail')) $('#filtroEmail').value = '';
    applyFilters();
}

function bindForm() {
    const form = $('#tutorForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = serializeForm(form);
        
        // Validaciones
        if (!payload.nombre?.trim()) {
            return showToast('❌ Nombre requerido');
        }
        
        try {
            const tutorData = { 
                Nombre: String(payload.nombre).trim(),
                Apellido: payload.apellido ? String(payload.apellido).trim() : null,
                Telefono: payload.telefono || null,
                Email: payload.email || null
            };
            
            if (payload.id) {
                await updateTutor(payload.id, tutorData);
                showToast('✅ Tutor actualizado correctamente');
            } else {
                await createTutor(tutorData);
                showToast('✅ Tutor creado correctamente');
            }
            hideModal();
            unselectRow(); // Limpiar selección
            load();
        } catch (err) {
            showToast(`❌ Error al guardar: ${err.message}`);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bindForm();
    bindEvents();
    load();
});
