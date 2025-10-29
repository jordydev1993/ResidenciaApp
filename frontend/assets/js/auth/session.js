/**
 * Clase para gestionar la sesión del usuario
 * Maneja tokens, datos de usuario y persistencia
 */
export class Session {
    static TOKEN_KEY = 'auth_token';
    static USER_KEY = 'user_data';
    static REMEMBER_KEY = 'remember_me';

    /**
     * Guarda el token de sesión
     * @param {string} token - Token de autenticación
     */
    static setToken(token) {
        const storage = this.getStorage();
        storage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Obtiene el token de sesión
     * @returns {string|null} Token o null si no existe
     */
    static getToken() {
        const sessionToken = sessionStorage.getItem(this.TOKEN_KEY);
        const localToken = localStorage.getItem(this.TOKEN_KEY);
        return sessionToken || localToken;
    }

    /**
     * Guarda los datos del usuario
     * @param {Object} userData - Datos del usuario
     */
    static setUser(userData) {
        const storage = this.getStorage();
        storage.setItem(this.USER_KEY, JSON.stringify(userData));
    }

    /**
     * Obtiene los datos del usuario
     * @returns {Object|null} Datos del usuario o null
     */
    static getUser() {
        const sessionData = sessionStorage.getItem(this.USER_KEY);
        const localData = localStorage.getItem(this.USER_KEY);
        const data = sessionData || localData;
        return data ? JSON.parse(data) : null;
    }

    /**
     * Configura si se debe recordar la sesión
     * @param {boolean} remember - True para recordar sesión
     */
    static setRememberMe(remember) {
        if (remember) {
            localStorage.setItem(this.REMEMBER_KEY, 'true');
            // Mover datos de sessionStorage a localStorage
            const token = sessionStorage.getItem(this.TOKEN_KEY);
            const user = sessionStorage.getItem(this.USER_KEY);
            if (token) localStorage.setItem(this.TOKEN_KEY, token);
            if (user) localStorage.setItem(this.USER_KEY, user);
            sessionStorage.clear();
        }
    }

    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} True si está autenticado
     */
    static isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Cierra la sesión y limpia todos los datos
     */
    static logout() {
        sessionStorage.clear();
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.REMEMBER_KEY);
    }

    /**
     * Obtiene el storage a usar (session o local)
     * @returns {Storage} sessionStorage o localStorage
     */
    static getStorage() {
        const remember = localStorage.getItem(this.REMEMBER_KEY);
        return remember === 'true' ? localStorage : sessionStorage;
    }

    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string} roleName - Nombre del rol
     * @returns {boolean} True si tiene el rol
     */
    static hasRole(roleName) {
        const user = this.getUser();
        const rol = user ? (user.rol || user.Rol) : null;
        return user && rol === roleName;
    }

    /**
     * Verifica si el usuario tiene un nivel de rol mínimo
     * @param {number} level - Nivel mínimo requerido (0=Consultor, 1=Operador, 2=Administrador)
     * @returns {boolean} True si cumple el nivel
     */
    static hasMinLevel(level) {
        const user = this.getUser();
        const rolNivel = user ? (user.rolNivel || user.RolNivel) : 0;
        return user && rolNivel >= level;
    }

    /**
     * Obtiene el nombre completo del usuario actual
     * @returns {string|null} Nombre completo o null
     */
    static getUserName() {
        const user = this.getUser();
        return user ? (user.nombreCompleto || user.NombreCompleto) : null;
    }

    /**
     * Obtiene el rol del usuario actual
     * @returns {string|null} Nombre del rol o null
     */
    static getUserRole() {
        const user = this.getUser();
        return user ? (user.rol || user.Rol) : null;
    }
}

