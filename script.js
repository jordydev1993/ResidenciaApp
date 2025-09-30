// Sistema de Gestión de Residencias - JavaScript
// Funcionalidad completa para gestión de legajos NNA y alertas

// Variables globales
let legajos = [];
let alertas = [];
let legajoEditando = null;
let alertaEditando = null;

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarSistema();
    cargarDatosIniciales();
    configurarEventListeners();
});

// Función de inicialización
function inicializarSistema() {
    // Cargar datos del localStorage si existen
    const legajosGuardados = localStorage.getItem('legajos');
    const alertasGuardadas = localStorage.getItem('alertas');
    
    if (legajosGuardados) {
        legajos = JSON.parse(legajosGuardados);
    }
    
    if (alertasGuardadas) {
        alertas = JSON.parse(alertasGuardadas);
    }
    
    // Mostrar la sección de legajos por defecto
    showSection('legajos');
}

// Función para cargar datos de ejemplo
function cargarDatosIniciales() {
    if (legajos.length === 0) {
        // Datos de ejemplo para legajos
        legajos = [
            {
                id: 1,
                dni: '12345678',
                nombre: 'Juan Pérez',
                fechaNacimiento: '2010-05-15',
                fechaIngreso: '2023-01-10',
                estado: 'Activo',
                tutor: 'María González',
                observaciones: 'NNA con buen rendimiento académico'
            },
            {
                id: 2,
                dni: '87654321',
                nombre: 'Ana García',
                fechaNacimiento: '2008-12-03',
                fechaIngreso: '2022-11-20',
                estado: 'En seguimiento',
                tutor: 'Carlos López',
                observaciones: 'Requiere seguimiento psicológico'
            }
        ];
        guardarLegajos();
    }
    
    if (alertas.length === 0) {
        // Datos de ejemplo para alertas
        const hoy = new Date();
        const mañana = new Date(hoy);
        mañana.setDate(hoy.getDate() + 1);
        
        alertas = [
            {
                id: 1,
                tipo: 'Médica',
                descripcion: 'Control médico de rutina',
                fechaVencimiento: hoy.toISOString().slice(0, 16),
                prioridad: 'Alta',
                estado: 'Pendiente',
                fechaCreacion: new Date().toISOString()
            },
            {
                id: 2,
                tipo: 'Judicial',
                descripcion: 'Audiencia programada',
                fechaVencimiento: mañana.toISOString().slice(0, 16),
                prioridad: 'Media',
                estado: 'Pendiente',
                fechaCreacion: new Date().toISOString()
            }
        ];
        guardarAlertas();
    }
    
    actualizarVistas();
}

// Configurar event listeners
function configurarEventListeners() {
    // Formulario de legajos
    document.getElementById('legajoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarLegajo();
    });
    
    // Búsqueda de legajos
    document.getElementById('busquedaLegajos').addEventListener('input', function() {
        filtrarLegajos(this.value);
    });
    
    // Formulario de alertas
    document.getElementById('alertaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarAlerta();
    });
    
    // Validación en tiempo real para DNI
    document.getElementById('dni').addEventListener('blur', function() {
        validarDNIUnico(this.value);
    });
    
    // Validación de fechas
    document.getElementById('fechaNacimiento').addEventListener('change', function() {
        validarFechaNacimiento();
    });
    
    document.getElementById('fechaIngreso').addEventListener('change', function() {
        validarFechaIngreso();
    });
}

// ==================== GESTIÓN DE SECCIONES ====================

function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionName + '-section').style.display = 'block';
    
    // Actualizar navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Actualizar vistas según la sección
    if (sectionName === 'legajos') {
        actualizarTablaLegajos();
    } else if (sectionName === 'alertas') {
        actualizarVistaAlertas();
    }
}

// ==================== GESTIÓN DE LEGAJOS ====================

function guardarLegajo() {
    const form = document.getElementById('legajoForm');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    const legajo = {
        id: legajoEditando ? legajoEditando.id : Date.now(),
        dni: document.getElementById('dni').value.trim(),
        nombre: document.getElementById('nombre').value.trim(),
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        fechaIngreso: document.getElementById('fechaIngreso').value,
        estado: document.getElementById('estado').value,
        tutor: document.getElementById('tutor').value.trim(),
        observaciones: document.getElementById('observaciones').value.trim()
    };
    
    // Validar DNI único
    if (!validarDNIUnico(legajo.dni, legajo.id)) {
        return;
    }
    
    if (legajoEditando) {
        // Actualizar legajo existente
        const index = legajos.findIndex(l => l.id === legajoEditando.id);
        legajos[index] = legajo;
        mostrarNotificacion('Legajo actualizado correctamente', 'success');
    } else {
        // Agregar nuevo legajo
        legajos.push(legajo);
        mostrarNotificacion('Legajo guardado correctamente', 'success');
    }
    
    guardarLegajos();
    actualizarTablaLegajos();
    limpiarFormulario();
    legajoEditando = null;
}

function editarLegajo(id) {
    const legajo = legajos.find(l => l.id === id);
    if (!legajo) return;
    
    legajoEditando = legajo;
    
    // Llenar formulario
    document.getElementById('dni').value = legajo.dni;
    document.getElementById('nombre').value = legajo.nombre;
    document.getElementById('fechaNacimiento').value = legajo.fechaNacimiento;
    document.getElementById('fechaIngreso').value = legajo.fechaIngreso;
    document.getElementById('estado').value = legajo.estado;
    document.getElementById('tutor').value = legajo.tutor;
    document.getElementById('observaciones').value = legajo.observaciones;
    
    // Scroll al formulario
    document.getElementById('legajoForm').scrollIntoView({ behavior: 'smooth' });
    
    // Cambiar texto del botón
    const botonGuardar = document.querySelector('#legajoForm button[type="submit"]');
    botonGuardar.innerHTML = '<i class="bi bi-check-circle me-1"></i>Actualizar';
}

function eliminarLegajo(id) {
    if (confirm('¿Está seguro de que desea eliminar este legajo?')) {
        legajos = legajos.filter(l => l.id !== id);
        guardarLegajos();
        actualizarTablaLegajos();
        mostrarNotificacion('Legajo eliminado correctamente', 'info');
    }
}

function actualizarTablaLegajos() {
    const tbody = document.getElementById('tablaLegajos');
    tbody.innerHTML = '';
    
    if (legajos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="empty-state">
                        <i class="bi bi-person-x"></i>
                        <p class="mb-0">No hay legajos registrados</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    legajos.forEach(legajo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${legajo.dni}</td>
            <td>${legajo.nombre}</td>
            <td><span class="badge badge-${legajo.estado.toLowerCase().replace(' ', '')}">${legajo.estado}</span></td>
            <td>${formatearFecha(legajo.fechaIngreso)}</td>
            <td>${legajo.tutor || '-'}</td>
            <td>
                <button class="btn btn-outline-primary btn-sm btn-action" onclick="editarLegajo(${legajo.id})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm btn-action" onclick="eliminarLegajo(${legajo.id})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filtrarLegajos(termino) {
    const tbody = document.getElementById('tablaLegajos');
    const filas = tbody.querySelectorAll('tr');
    
    filas.forEach(fila => {
        const texto = fila.textContent.toLowerCase();
        if (texto.includes(termino.toLowerCase()) || termino === '') {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

function limpiarFormulario() {
    document.getElementById('legajoForm').reset();
    document.getElementById('legajoForm').classList.remove('was-validated');
    
    // Restaurar botón original
    const botonGuardar = document.querySelector('#legajoForm button[type="submit"]');
    botonGuardar.innerHTML = '<i class="bi bi-check-circle me-1"></i>Guardar';
    
    legajoEditando = null;
}

// ==================== GESTIÓN DE ALERTAS ====================

function guardarAlerta() {
    const form = document.getElementById('alertaForm');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    const alerta = {
        id: alertaEditando ? alertaEditando.id : Date.now(),
        tipo: document.getElementById('tipoAlerta').value,
        descripcion: document.getElementById('descripcionAlerta').value.trim(),
        fechaVencimiento: document.getElementById('fechaVencimiento').value,
        prioridad: document.getElementById('prioridadAlerta').value,
        estado: 'Pendiente',
        fechaCreacion: new Date().toISOString()
    };
    
    if (alertaEditando) {
        // Actualizar alerta existente
        const index = alertas.findIndex(a => a.id === alertaEditando.id);
        alertas[index] = alerta;
        mostrarNotificacion('Alerta actualizada correctamente', 'success');
    } else {
        // Agregar nueva alerta
        alertas.push(alerta);
        mostrarNotificacion('Alerta creada correctamente', 'success');
    }
    
    guardarAlertas();
    actualizarVistaAlertas();
    limpiarFormularioAlerta();
    alertaEditando = null;
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevaAlerta'));
    modal.hide();
}

function editarAlerta(id) {
    const alerta = alertas.find(a => a.id === id);
    if (!alerta) return;
    
    alertaEditando = alerta;
    
    // Llenar formulario
    document.getElementById('tipoAlerta').value = alerta.tipo;
    document.getElementById('descripcionAlerta').value = alerta.descripcion;
    document.getElementById('fechaVencimiento').value = alerta.fechaVencimiento;
    document.getElementById('prioridadAlerta').value = alerta.prioridad;
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalNuevaAlerta'));
    modal.show();
}

function eliminarAlerta(id) {
    if (confirm('¿Está seguro de que desea eliminar esta alerta?')) {
        alertas = alertas.filter(a => a.id !== id);
        guardarAlertas();
        actualizarVistaAlertas();
        mostrarNotificacion('Alerta eliminada correctamente', 'info');
    }
}

function completarAlerta(id) {
    const alerta = alertas.find(a => a.id === id);
    if (alerta) {
        alerta.estado = 'Completada';
        guardarAlertas();
        actualizarVistaAlertas();
        mostrarNotificacion('Alerta marcada como completada', 'success');
    }
}

function actualizarVistaAlertas() {
    actualizarDashboardAlertas();
    actualizarTablaAlertas();
}

function actualizarDashboardAlertas() {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0];
    const proximaSemana = new Date(hoy);
    proximaSemana.setDate(hoy.getDate() + 7);
    
    const alertasHoy = alertas.filter(a => 
        a.estado === 'Pendiente' && 
        a.fechaVencimiento.split('T')[0] === hoyStr
    ).length;
    
    const alertasProximas = alertas.filter(a => 
        a.estado === 'Pendiente' && 
        new Date(a.fechaVencimiento) <= proximaSemana &&
        new Date(a.fechaVencimiento) > hoy
    ).length;
    
    const totalAlertas = alertas.length;
    const alertasCompletadas = alertas.filter(a => a.estado === 'Completada').length;
    
    document.getElementById('alertasHoy').textContent = alertasHoy;
    document.getElementById('alertasProximas').textContent = alertasProximas;
    document.getElementById('totalAlertas').textContent = totalAlertas;
    document.getElementById('alertasCompletadas').textContent = alertasCompletadas;
}

function actualizarTablaAlertas() {
    const tbody = document.getElementById('tablaAlertas');
    tbody.innerHTML = '';
    
    if (alertas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="empty-state">
                        <i class="bi bi-bell-slash"></i>
                        <p class="mb-0">No hay alertas registradas</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    alertas.forEach(alerta => {
        const row = document.createElement('tr');
        const fechaVencimiento = new Date(alerta.fechaVencimiento);
        const esVencida = fechaVencimiento < new Date() && alerta.estado === 'Pendiente';
        
        row.innerHTML = `
            <td><span class="badge bg-secondary">${alerta.tipo}</span></td>
            <td>${alerta.descripcion}</td>
            <td><span class="badge badge-${alerta.prioridad.toLowerCase()}">${alerta.prioridad}</span></td>
            <td class="${esVencida ? 'text-danger fw-bold' : ''}">${formatearFechaHora(alerta.fechaVencimiento)}</td>
            <td><span class="badge ${alerta.estado === 'Pendiente' ? 'bg-warning' : 'bg-success'}">${alerta.estado}</span></td>
            <td>
                ${alerta.estado === 'Pendiente' ? `
                    <button class="btn btn-outline-success btn-sm btn-action" onclick="completarAlerta(${alerta.id})" title="Completar">
                        <i class="bi bi-check-circle"></i>
                    </button>
                ` : ''}
                <button class="btn btn-outline-primary btn-sm btn-action" onclick="editarAlerta(${alerta.id})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm btn-action" onclick="eliminarAlerta(${alerta.id})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function aplicarFiltros() {
    const tipoFiltro = document.getElementById('filtroTipo').value;
    const prioridadFiltro = document.getElementById('filtroPrioridad').value;
    
    const tbody = document.getElementById('tablaAlertas');
    const filas = tbody.querySelectorAll('tr');
    
    filas.forEach(fila => {
        const tipo = fila.cells[0].textContent.trim();
        const prioridad = fila.cells[2].textContent.trim();
        
        const cumpleTipo = !tipoFiltro || tipo === tipoFiltro;
        const cumplePrioridad = !prioridadFiltro || prioridad === prioridadFiltro;
        
        if (cumpleTipo && cumplePrioridad) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

function limpiarFormularioAlerta() {
    document.getElementById('alertaForm').reset();
    document.getElementById('alertaForm').classList.remove('was-validated');
    alertaEditando = null;
}

// ==================== VALIDACIONES ====================

function validarDNIUnico(dni, idExcluir = null) {
    const dniExiste = legajos.some(legajo => 
        legajo.dni === dni && legajo.id !== idExcluir
    );
    
    const inputDNI = document.getElementById('dni');
    
    if (dniExiste) {
        inputDNI.setCustomValidity('El DNI ya está registrado');
        inputDNI.classList.add('is-invalid');
        return false;
    } else {
        inputDNI.setCustomValidity('');
        inputDNI.classList.remove('is-invalid');
        return true;
    }
}

function validarFechaNacimiento() {
    const fechaNacimiento = new Date(document.getElementById('fechaNacimiento').value);
    const hoy = new Date();
    const input = document.getElementById('fechaNacimiento');
    
    if (fechaNacimiento >= hoy) {
        input.setCustomValidity('La fecha de nacimiento debe ser anterior a hoy');
        input.classList.add('is-invalid');
    } else {
        input.setCustomValidity('');
        input.classList.remove('is-invalid');
    }
}

function validarFechaIngreso() {
    const fechaIngreso = new Date(document.getElementById('fechaIngreso').value);
    const hoy = new Date();
    const input = document.getElementById('fechaIngreso');
    
    if (fechaIngreso > hoy) {
        input.setCustomValidity('La fecha de ingreso no puede ser futura');
        input.classList.add('is-invalid');
    } else {
        input.setCustomValidity('');
        input.classList.remove('is-invalid');
    }
}

// ==================== UTILIDADES ====================

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES');
}

function formatearFechaHora(fechaHora) {
    return new Date(fechaHora).toLocaleString('es-ES');
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    const toast = document.getElementById('toastNotificacion');
    const toastMensaje = document.getElementById('toastMensaje');
    
    // Cambiar color según el tipo
    const header = toast.querySelector('.toast-header');
    const icono = header.querySelector('i');
    
    icono.className = `bi me-2`;
    header.className = 'toast-header';
    
    switch (tipo) {
        case 'success':
            icono.classList.add('bi-check-circle-fill', 'text-success');
            break;
        case 'error':
        case 'danger':
            icono.classList.add('bi-exclamation-triangle-fill', 'text-danger');
            break;
        case 'warning':
            icono.classList.add('bi-exclamation-circle-fill', 'text-warning');
            break;
        default:
            icono.classList.add('bi-info-circle-fill', 'text-primary');
    }
    
    toastMensaje.textContent = mensaje;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

function guardarLegajos() {
    localStorage.setItem('legajos', JSON.stringify(legajos));
}

function guardarAlertas() {
    localStorage.setItem('alertas', JSON.stringify(alertas));
}

function actualizarVistas() {
    actualizarTablaLegajos();
    actualizarVistaAlertas();
}

// ==================== FUNCIONES GLOBALES ====================

// Hacer funciones disponibles globalmente
window.showSection = showSection;
window.limpiarFormulario = limpiarFormulario;
window.editarLegajo = editarLegajo;
window.eliminarLegajo = eliminarLegajo;
window.guardarAlerta = guardarAlerta;
window.editarAlerta = editarAlerta;
window.eliminarAlerta = eliminarAlerta;
window.completarAlerta = completarAlerta;
window.aplicarFiltros = aplicarFiltros;
