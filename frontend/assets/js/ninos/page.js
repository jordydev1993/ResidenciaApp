import { $, renderHTML, serializeForm, showToast } from '../utils/dom.js';
import { upsertNino, listNinos, deleteNino, existsDni } from '../api/ninoApi.js';

let ninosData = [];
let filteredData = [];
let ninoToDelete = null;
let sortColumn = 'apellido'; // Columna de ordenamiento por defecto
let sortDirection = 'asc'; // Dirección: 'asc' o 'desc'

// Normaliza texto: minúsculas y sin tildes para búsquedas flexibles
function normalizeText(value) {
    return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function rowTemplate(n) {
    // DataTable serializado: [0]=Id, [1]=Dni, [2]=Apellido, [3]=Nombre, [4]=FechaNacimiento, [5]=FechaCreacion, [6]=FechaModificacion, [7]=Estado, [8]=LegajoId
    const dni = n.DNI ?? n.Dni ?? n["DNI"] ?? n["Dni"] ?? n[1];
    const nombre = n.Nombre ?? n["Nombre"] ?? n[3] ?? '';
    const apellido = n.Apellido ?? n["Apellido"] ?? n[2] ?? '';
    const fnac = (n.FechaNacimiento ?? n["FechaNacimiento"] ?? n[4]) || '';
    const estado = n.Estado ?? n["Estado"] ?? n[7] ?? '';
    const legajoId = n.LegajoId ?? n["LegajoId"] ?? n[8] ?? '';
    
    // Determinar badge según el estado
    let estadoBadge;
    if (!estado || estado === '') {
        estadoBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Sin legajo</span>';
    } else if (estado.toLowerCase() === 'activo') {
        estadoBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>';
    } else if (estado.toLowerCase() === 'egresado') {
        estadoBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Egresado</span>';
    } else {
        estadoBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${estado}</span>`;
    }
    
    return `<tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${apellido}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${nombre}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${dni}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${String(fnac).substring(0,10)}</td>
        <td class="px-6 py-4 whitespace-nowrap">${estadoBadge}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${legajoId ? `<a href="./legajos.html?id=${legajoId}" class="text-blue-600 hover:underline">${legajoId}</a>` : 
              `<span class="text-gray-400">Sin legajo</span>`}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex space-x-2">
                <button data-dni="${dni}" class="btn-edit text-blue-600 hover:text-blue-900" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button data-dni="${dni}" class="btn-delete text-red-600 hover:text-red-900" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    </tr>`;
}

async function load() {
    try {
        const data = await listNinos();
        const items = Array.isArray(data) ? data : (data?.items || data);
        ninosData = items || [];
        filteredData = [...ninosData];
        updateKPIs(); // Actualizar KPIs
        renderTable();
        bindEvents();
        
        // Mostrar indicador de modo demo si hay datos de prueba
        const demoMode = $('#demoMode');
        if (demoMode && ninosData.length > 0) {
            // Verificar si son datos de prueba (DNI específicos de prueba)
            const isDemoData = ninosData.some(n => 
                (n.DNI ?? n["DNI"] ?? n[0]) === '12345678' || 
                (n.DNI ?? n["DNI"] ?? n[0]) === '87654321'
            );
            if (isDemoData) {
                demoMode.classList.remove('hidden');
            }
        }
    } catch (err) {
        showToast(`Error al listar: ${err.message}`);
    }
}

function renderTable() {
    const tableBody = $('#tablaNinos');
    const emptyState = $('#emptyState');
    const contador = $('#totalRegistrosTabla');
    
    if (!filteredData || !filteredData.length) {
        tableBody.innerHTML = '';
        emptyState?.classList.remove('hidden');
        if (contador) contador.textContent = '0';
        return;
    }
    
    emptyState?.classList.add('hidden');
    renderHTML(tableBody, filteredData.map(rowTemplate).join(''));
    if (contador) contador.textContent = filteredData.length;
}

function updateKPIs() {
    // Total de niños (todos los datos sin filtrar)
    const totalNinos = ninosData.length;
    const totalElement = $('#contadorNinos');
    if (totalElement) totalElement.textContent = totalNinos;
    
    // Niños activos
    const activos = ninosData.filter(n => {
        const estado = (n.Estado ?? n["Estado"] ?? n[7] ?? '').toLowerCase();
        return estado === 'activo';
    }).length;
    const activosElement = $('#ninosActivos');
    if (activosElement) activosElement.textContent = activos;
    
    // Niños egresados
    const egresados = ninosData.filter(n => {
        const estado = (n.Estado ?? n["Estado"] ?? n[7] ?? '').toLowerCase();
        return estado === 'egresado';
    }).length;
    const egresadosElement = $('#ninosEgresados');
    if (egresadosElement) egresadosElement.textContent = egresados;
    
    // Niños con legajo
    const conLegajo = ninosData.filter(n => {
        const legajoId = n.LegajoId ?? n["LegajoId"] ?? n[8] ?? '';
        return legajoId && legajoId !== '' && legajoId != null;
    }).length;
    const conLegajoElement = $('#ninosConLegajo');
    if (conLegajoElement) conLegajoElement.textContent = conLegajo;
}

function applyFilters() {
    // Filtros del panel superior (si existen)
    const estadoFiltro = $('#filtroEstado')?.value || '';
    const dniFiltro = normalizeText($('#filtroDni')?.value);
    const nombreFiltro = normalizeText($('#filtroNombre')?.value);
    const apellidoFiltro = normalizeText($('#filtroApellido')?.value);
    
    filteredData = ninosData.filter(nino => {
        const dni = normalizeText(nino.DNI ?? nino.Dni ?? nino["DNI"] ?? nino["Dni"] ?? nino[1] ?? '');
        const nombre = normalizeText(nino.Nombre ?? nino["Nombre"] ?? nino[3] ?? '');
        const apellido = normalizeText(nino.Apellido ?? nino["Apellido"] ?? nino[2] ?? '');
        const estado = (nino.Estado ?? nino["Estado"] ?? nino[7] ?? '').toLowerCase();
        
        // Aplicar filtros del panel superior
        const matchEstado = !estadoFiltro || estado === estadoFiltro;
        const matchDni = !dniFiltro || dni.includes(dniFiltro);
        const matchNombre = !nombreFiltro || nombre.includes(nombreFiltro);
        const matchApellido = !apellidoFiltro || apellido.includes(apellidoFiltro);
        
        return matchEstado && matchDni && matchNombre && matchApellido;
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
                valueA = normalizeText(a.Nombre ?? a["Nombre"] ?? a[3] ?? '');
                valueB = normalizeText(b.Nombre ?? b["Nombre"] ?? b[3] ?? '');
                break;
            case 'dni':
                valueA = a.DNI ?? a.Dni ?? a["DNI"] ?? a["Dni"] ?? a[1] ?? '';
                valueB = b.DNI ?? b.Dni ?? b["DNI"] ?? b["Dni"] ?? b[1] ?? '';
                break;
            case 'fecha':
                valueA = a.FechaNacimiento ?? a["FechaNacimiento"] ?? a[4] ?? '';
                valueB = b.FechaNacimiento ?? b["FechaNacimiento"] ?? b[4] ?? '';
                break;
            case 'estado':
                valueA = (a.Estado ?? a["Estado"] ?? a[7] ?? '').toLowerCase();
                valueB = (b.Estado ?? b["Estado"] ?? b[7] ?? '').toLowerCase();
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
        // Si es la misma columna, cambiar dirección
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        // Si es nueva columna, ordenar ascendente
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    // Actualizar íconos de ordenamiento
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
    // Eventos de la tabla
    $('#tablaNinos')?.addEventListener('click', async (e) => {
        const btnEdit = e.target.closest('.btn-edit');
        const btnDelete = e.target.closest('.btn-delete');
        
        if (btnEdit) {
            const dni = btnEdit.getAttribute('data-dni');
            editNino(dni);
        } else if (btnDelete) {
            const dni = btnDelete.getAttribute('data-dni');
            deleteNinoConfirm(dni);
        }
    });
    
    // Eventos de ordenamiento en los encabezados
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            toggleSort(th.dataset.sort);
        });
    });
    
    // Eventos de filtros del panel superior
    $('#filtroEstado')?.addEventListener('change', applyFilters);
    $('#filtroDni')?.addEventListener('input', applyFilters);
    $('#filtroNombre')?.addEventListener('input', applyFilters);
    $('#filtroApellido')?.addEventListener('input', applyFilters);
    $('#btnLimpiarFiltros')?.addEventListener('click', clearFilters);
    
    // Eventos del modal
    $('#btnNuevoNino')?.addEventListener('click', showModal);
    $('#btnCerrarModal')?.addEventListener('click', hideModal);
    $('#btnCancelarModal')?.addEventListener('click', hideModal);
    
    // Cerrar modal al hacer clic fuera de él
    $('#modalNino')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            hideModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal();
        }
    });
    
    // Eventos del modal de confirmación
    $('#btnCancelarEliminar')?.addEventListener('click', hideConfirmModal);
    $('#btnConfirmarEliminar')?.addEventListener('click', confirmDelete);
    
    // Cerrar modal de confirmación al hacer clic fuera de él
    $('#modalConfirmacion')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            hideConfirmModal();
        }
    });
    
    // Cerrar modal de confirmación con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const confirmModal = $('#modalConfirmacion');
            if (confirmModal && !confirmModal.classList.contains('hidden')) {
                hideConfirmModal();
            }
        }
    });
}

function editNino(dni) {
    const nino = ninosData.find(n => (n.DNI ?? n.Dni ?? n["DNI"] ?? n["Dni"] ?? n[1]) === dni);
    if (!nino) return;
    
    const form = $('#ninoForm');
    const modalTitle = $('#modalTitle');
    
    // Llenar el formulario con los datos del niño
    // DataTable serializado: [0]=Id, [1]=Dni, [2]=Apellido, [3]=Nombre, [4]=FechaNacimiento
    form.querySelector('[name="id"]').value = nino.Id ?? nino["Id"] ?? nino[0] ?? '';
    form.querySelector('[name="dni"]').value = nino.DNI ?? nino.Dni ?? nino["DNI"] ?? nino["Dni"] ?? nino[1] ?? '';
    form.querySelector('[name="nombre"]').value = nino.Nombre ?? nino["Nombre"] ?? nino[3] ?? '';
    form.querySelector('[name="apellido"]').value = nino.Apellido ?? nino["Apellido"] ?? nino[2] ?? '';
    form.querySelector('[name="fechaNacimiento"]').value = (nino.FechaNacimiento ?? nino["FechaNacimiento"] ?? nino[4] ?? '').substring(0, 10);
    
    modalTitle.innerHTML = '<i class="bi bi-pencil-square mr-2"></i>Editar NNA';
    showModal();
}

function deleteNinoConfirm(dni) {
    const nino = ninosData.find(n => (n.DNI ?? n.Dni ?? n["DNI"] ?? n["Dni"] ?? n[0]) === dni);
    if (!nino) return;
    
    const nombre = `${nino.Nombre ?? nino["Nombre"] ?? nino[1] ?? ''} ${nino.Apellido ?? nino["Apellido"] ?? nino[2] ?? ''}`.trim();
    
    // Guardar referencia del niño a eliminar
    ninoToDelete = { dni, nino, nombre };
    
    // Actualizar mensaje de confirmación
    const mensaje = $('#confirmacionMensaje');
    if (mensaje) {
        mensaje.innerHTML = `¿Está seguro que desea eliminar al niño <strong>${nombre}</strong> (DNI: ${dni})?<br><br><span class="text-red-600 font-medium">Esta acción no se puede deshacer.</span>`;
    }
    
    // Mostrar modal de confirmación
    showConfirmModal();
}

function showModal() {
    const modal = $('#modalNino');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
}

function hideModal() {
    const modal = $('#modalNino');
    const form = $('#ninoForm');
    const modalTitle = $('#modalTitle');
    
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
    
    // Resetear formulario
    form.reset();
    form.querySelector('[name="id"]').value = '';
    modalTitle.innerHTML = '<i class="bi bi-person-plus mr-2"></i>Registrar Nuevo Niño';
}

function showConfirmModal() {
    const modal = $('#modalConfirmacion');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
}

function hideConfirmModal() {
    const modal = $('#modalConfirmacion');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
    ninoToDelete = null; // Limpiar referencia
}

async function confirmDelete() {
    if (!ninoToDelete) return;
    
    try {
        await deleteNino(ninoToDelete.dni);
        showToast('Niño eliminado correctamente');
        hideConfirmModal();
        load();
    } catch (err) {
        showToast(`Error al eliminar: ${err.message}`);
    }
}

function clearFilters() {
    $('#filtroEstado').value = '';
    $('#filtroDni').value = '';
    $('#filtroNombre').value = '';
    $('#filtroApellido').value = '';
    applyFilters();
}

function bindForm() {
    const form = $('#ninoForm');
    if (!form) return;
    // Validación de DNI en blur (en tiempo real)
    const dniInput = form.querySelector('[name="dni"]');
    const idInput = form.querySelector('[name="id"]');
    if (dniInput) {
        dniInput.addEventListener('blur', async () => {
            const dni = String(dniInput.value || '').trim();
            const isAlta = !idInput || !String(idInput.value || '').trim();
            if (!dni || !/^\d{7,8}$/.test(dni) || !isAlta) return;
            try {
                const yaExiste = await existsDni(dni);
                if (yaExiste) {
                    showToast('El DNI ya está registrado en el sistema');
                }
            } catch (_) {
                // Silenciar errores de red momentáneos
            }
        });
    }
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = serializeForm(form);
        
        // Validaciones
        if (!payload.dni || !/^\d{7,8}$/.test(payload.dni)) {
            return showToast('DNI inválido. Debe tener entre 7 y 8 dígitos.');
        }
        // Verificar DNI único cuando es alta (sin Id)
        try {
            if (!payload.id || String(payload.id).trim() === '') {
                const yaExiste = await existsDni(String(payload.dni).trim());
                if (yaExiste) {
                    return showToast('El DNI ya está registrado en el sistema');
                }
            }
        } catch (e2) {
            // Si falla la verificación por red, seguimos validando con backend, pero notificamos
            console.warn('No se pudo validar DNI único en frontend:', e2);
        }
        if (!payload.nombre?.trim()) {
            return showToast('Nombre requerido');
        }
        if (!payload.apellido?.trim()) {
            return showToast('Apellido requerido');
        }
        if (!payload.fechaNacimiento) {
            return showToast('Fecha de nacimiento requerida');
        }
        
        // Validar que la fecha no sea futura
        const fechaNac = new Date(payload.fechaNacimiento);
        const hoy = new Date();
        if (fechaNac > hoy) {
            return showToast('La fecha de nacimiento no puede ser futura');
        }
        
        try {
            // Convertir Id a número, si existe y es válido
            const idValue = payload.id ? parseInt(payload.id, 10) : 0;
            
            const ninoData = {
                Id: idValue > 0 ? idValue : 0,
                DNI: String(payload.dni).trim(),
                Nombre: String(payload.nombre).trim(),
                Apellido: String(payload.apellido).trim(),
                FechaNacimiento: payload.fechaNacimiento
            };
            
            console.log('Datos a enviar:', ninoData); // Debug
            
            await upsertNino(ninoData);
            hideModal();
            showToast('Niño guardado correctamente');
            load();
        } catch (err) {
            showToast(`Error al guardar: ${err.message}`);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bindForm();
    load();
});


