import { Session } from './session.js';

const API_URL = 'http://localhost:50948/api';

/**
 * Inicializar funcionalidad de login
 */
document.addEventListener('DOMContentLoaded', () => {
    // Si ya está logueado, redirigir al dashboard
    if (Session.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const form = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    // Toggle mostrar/ocultar contraseña
    togglePassword?.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        eyeIcon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
    });

    // Enviar formulario
    form?.addEventListener('submit', handleLogin);
});

/**
 * Maneja el envío del formulario de login
 * @param {Event} e - Evento del formulario
 */
async function handleLogin(e) {
    e.preventDefault();

    const usuarioInput = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value;
    const recordar = document.getElementById('recordar').checked;

    // Validaciones básicas
    if (!usuarioInput || !password) {
        showError('Por favor complete todos los campos');
        return;
    }

    // Deshabilitar botón
    setLoading(true);
    hideError();

    try {
        const response = await fetch(`${API_URL}/Auth/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Usuario: usuarioInput,
                Password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Error de autenticación
            if (response.status === 401) {
                showError(data.error || 'Usuario o contraseña incorrectos');
            } else if (response.status === 403) {
                showError(data.error || 'Usuario bloqueado. Contacte al administrador.');
            } else {
                showError('Error al iniciar sesión. Intente nuevamente.');
            }
            return;
        }

        // Login exitoso
        // Manejar tanto PascalCase (C#) como camelCase (JavaScript)
        const success = data.success || data.Success;
        const token = data.token || data.Token;
        const usuario = data.usuario || data.Usuario;
        
        if (success && token) {
            // Guardar sesión
            Session.setToken(token);
            Session.setUser(usuario);

            if (recordar) {
                Session.setRememberMe(true);
            }

            // Mostrar mensaje de éxito
            const nombreCompleto = usuario.nombreCompleto || usuario.NombreCompleto;
            showToast(`✅ Bienvenido ${nombreCompleto}`, 'success');

            // Redirigir al dashboard
            setTimeout(() => {
                const returnUrl = sessionStorage.getItem('returnUrl');
                if (returnUrl) {
                    sessionStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1000);
        }

    } catch (error) {
        console.error('Error en login:', error);
        showError('Error de conexión. Verifique su conexión a internet.');
    } finally {
        setLoading(false);
    }
}

/**
 * Muestra un mensaje de error
 * @param {string} message - Mensaje a mostrar
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.classList.remove('hidden');

        // Auto-ocultar después de 8 segundos
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 8000);
    }
}

/**
 * Oculta el mensaje de error
 */
function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
}

/**
 * Controla el estado de carga del botón
 * @param {boolean} loading - True para mostrar estado de carga
 */
function setLoading(loading) {
    const btn = document.getElementById('btnLogin');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const form = document.getElementById('loginForm');

    if (loading) {
        btn.disabled = true;
        form.querySelectorAll('input').forEach(input => input.disabled = true);
        btnText.textContent = 'Iniciando sesión...';
        btnSpinner.classList.remove('hidden');
    } else {
        btn.disabled = false;
        form.querySelectorAll('input').forEach(input => input.disabled = false);
        btnText.textContent = 'Iniciar Sesión';
        btnSpinner.classList.add('hidden');
    }
}

/**
 * Muestra un toast de notificación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de toast (success, error, info)
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast) return;

    // Configurar icono y color según tipo
    let icon = 'ℹ️';
    let borderColor = 'border-blue-500';
    let title = 'Información';

    if (type === 'success') {
        icon = '✅';
        borderColor = 'border-green-500';
        title = 'Éxito';
    } else if (type === 'error') {
        icon = '❌';
        borderColor = 'border-red-500';
        title = 'Error';
    }

    // Aplicar estilos
    toast.className = `fixed bottom-4 right-4 bg-white shadow-2xl rounded-xl border-l-4 ${borderColor} z-50 min-w-[320px] p-4`;
    toastIcon.textContent = icon;
    toastTitle.textContent = title;
    toastMessage.textContent = message;

    // Mostrar toast
    toast.classList.remove('hidden');

    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

