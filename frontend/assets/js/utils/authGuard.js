import { Session } from '../auth/session.js';

const API_URL = 'http://localhost:50948/api';

/**
 * Protege páginas que requieren autenticación
 * Redirige a login si no hay sesión válida
 * @returns {boolean} True si está autenticado, false si no
 */
export function requireAuth() {
    if (!Session.isAuthenticated()) {
        // Guardar página de destino para redirigir después del login
        sessionStorage.setItem('returnUrl', window.location.href);
        window.location.href = 'auth.html';
        return false;
    }
    
    // Validar token en background
    validateTokenAsync();
    
    return true;
}

/**
 * Verifica permisos por rol específico
 * @param {string} roleName - Nombre del rol requerido
 * @returns {boolean} True si tiene el rol, false si no
 */
export function requireRole(roleName) {
    if (!requireAuth()) return false;

    if (!Session.hasRole(roleName)) {
        alert('No tiene permisos para acceder a esta página');
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

/**
 * Verifica permisos por nivel de rol mínimo
 * @param {number} level - Nivel mínimo requerido (0=Consultor, 1=Operador, 2=Administrador)
 * @returns {boolean} True si cumple el nivel, false si no
 */
export function requireMinLevel(level) {
    if (!requireAuth()) return false;

    if (!Session.hasMinLevel(level)) {
        alert('No tiene permisos suficientes para acceder a esta página');
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

/**
 * Valida el token con el servidor de forma asíncrona
 * Si el token es inválido, cierra la sesión y redirige a login
 */
async function validateTokenAsync() {
    const token = Session.getToken();
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/Auth/ValidateToken`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Token inválido o expirado
            console.warn('Sesión expirada');
            Session.logout();
            window.location.href = 'auth.html';
        }
    } catch (error) {
        console.error('Error al validar token:', error);
        // No hacer nada si falla la validación (puede ser problema de red)
    }
}

/**
 * Interceptor para agregar token a todas las peticiones fetch
 * También maneja respuestas 401 (no autorizado)
 */
export function setupAuthInterceptor() {
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        const token = Session.getToken();
        
        // Si hay token, agregarlo al header Authorization
        if (token && args[0] && args[0].includes('/api/')) {
            if (args[1]) {
                args[1].headers = args[1].headers || {};
                args[1].headers['Authorization'] = `Bearer ${token}`;
            } else {
                args[1] = {
                    ...args[1],
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
            }
        }

        // Llamar al fetch original
        return originalFetch.apply(this, args).then(response => {
            // Si retorna 401 Unauthorized, cerrar sesión
            if (response.status === 401 && args[0].includes('/api/')) {
                console.warn('Sesión expirada (401)');
                Session.logout();
                
                // Guardar URL actual para redirigir después del login
                sessionStorage.setItem('returnUrl', window.location.href);
                window.location.href = 'auth.html';
            }
            return response;
        }).catch(error => {
            // Re-lanzar el error para que se maneje normalmente
            throw error;
        });
    };
}

/**
 * Inicializa el sistema de autenticación en una página
 * Configura el interceptor y valida la sesión
 */
export function initAuth() {
    setupAuthInterceptor();
    
    // Si no está autenticado, redirigir a login
    if (!requireAuth()) {
        return false;
    }
    
    // Mostrar información del usuario en la UI
    updateUserInfo();
    
    return true;
}

/**
 * Actualiza la información del usuario en la interfaz
 */
function updateUserInfo() {
    const userName = Session.getUserName();
    const userRole = Session.getUserRole();
    
    // Buscar elementos donde mostrar el nombre del usuario
    const userNameElements = document.querySelectorAll('[data-user-name]');
    userNameElements.forEach(el => {
        el.textContent = userName || 'Usuario';
    });
    
    // Buscar elementos donde mostrar el rol
    const userRoleElements = document.querySelectorAll('[data-user-role]');
    userRoleElements.forEach(el => {
        el.textContent = userRole || 'Rol';
    });
}

/**
 * Maneja el logout del usuario
 */
export async function handleLogout() {
    const token = Session.getToken();
    
    // Confirmar logout
    if (!confirm('¿Está seguro que desea cerrar sesión?')) {
        return;
    }
    
    try {
        // Intentar cerrar sesión en el servidor
        if (token) {
            await fetch(`${API_URL}/Auth/Logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
    } catch (error) {
        console.error('Error en logout:', error);
    } finally {
        // Limpiar sesión local siempre
        Session.logout();
        window.location.href = 'auth.html';
    }
}

// Inicializar interceptor automáticamente si no estamos en la página de login
if (typeof window !== 'undefined' && !window.location.href.includes('auth.html')) {
    setupAuthInterceptor();
}

