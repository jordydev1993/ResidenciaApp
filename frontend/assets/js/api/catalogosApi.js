import { http } from '../utils/http.js';
import { catalogCache } from '../utils/cache.js';

// Configuración de TTL para catálogos (5 minutos)
const CATALOG_TTL = 5 * 60 * 1000;

// ===============================
// ESTADO
// ===============================
export const listEstados = () => 
    catalogCache.get('estados', () => http('/api/Estado', { method: 'GET' }), CATALOG_TTL);

export const createEstado = async (data) => {
    const result = await http('/api/Estado', { method: 'POST', body: JSON.stringify(data) });
    catalogCache.invalidate('estados'); // Invalidar caché al crear
    return result;
};

export const updateEstado = async (id, data) => {
    const result = await http(`/api/Estado/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    catalogCache.invalidate('estados'); // Invalidar caché al actualizar
    return result;
};

export const deleteEstado = async (id) => {
    const result = await http(`/api/Estado/${id}`, { method: 'DELETE' });
    catalogCache.invalidate('estados'); // Invalidar caché al eliminar
    return result;
};

// ===============================
// TUTOR
// ===============================
export const listTutores = () => 
    catalogCache.get('tutores', () => http('/api/Tutor', { method: 'GET' }), CATALOG_TTL);

export const createTutor = async (data) => {
    const result = await http('/api/Tutor', { method: 'POST', body: JSON.stringify(data) });
    catalogCache.invalidate('tutores');
    return result;
};

export const updateTutor = async (id, data) => {
    const result = await http(`/api/Tutor/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    catalogCache.invalidate('tutores');
    return result;
};

export const deleteTutor = async (id) => {
    const result = await http(`/api/Tutor/${id}`, { method: 'DELETE' });
    catalogCache.invalidate('tutores');
    return result;
};

// ===============================
// TIPO ALERTA
// ===============================
export const listTipoAlertas = () => 
    catalogCache.get('tipoAlertas', () => http('/api/TipoAlerta', { method: 'GET' }), CATALOG_TTL);

export const createTipoAlerta = async (data) => {
    const result = await http('/api/TipoAlerta', { method: 'POST', body: JSON.stringify(data) });
    catalogCache.invalidate('tipoAlertas');
    return result;
};

export const updateTipoAlerta = async (id, data) => {
    const result = await http(`/api/TipoAlerta/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    catalogCache.invalidate('tipoAlertas');
    return result;
};

export const deleteTipoAlerta = async (id) => {
    const result = await http(`/api/TipoAlerta/${id}`, { method: 'DELETE' });
    catalogCache.invalidate('tipoAlertas');
    return result;
};

// ===============================
// PRIORIDAD
// ===============================
export const listPrioridades = () => 
    catalogCache.get('prioridades', () => http('/api/Prioridad', { method: 'GET' }), CATALOG_TTL);

export const createPrioridad = async (data) => {
    const result = await http('/api/Prioridad', { method: 'POST', body: JSON.stringify(data) });
    catalogCache.invalidate('prioridades');
    return result;
};

export const updatePrioridad = async (id, data) => {
    const result = await http(`/api/Prioridad/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    catalogCache.invalidate('prioridades');
    return result;
};

export const deletePrioridad = async (id) => {
    const result = await http(`/api/Prioridad/${id}`, { method: 'DELETE' });
    catalogCache.invalidate('prioridades');
    return result;
};

// ===============================
// ESTADO ALERTA
// ===============================
export const listEstadoAlertas = () => 
    catalogCache.get('estadoAlertas', () => http('/api/EstadoAlerta', { method: 'GET' }), CATALOG_TTL);

export const createEstadoAlerta = async (data) => {
    const result = await http('/api/EstadoAlerta', { method: 'POST', body: JSON.stringify(data) });
    catalogCache.invalidate('estadoAlertas');
    return result;
};

export const updateEstadoAlerta = async (id, data) => {
    const result = await http(`/api/EstadoAlerta/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    catalogCache.invalidate('estadoAlertas');
    return result;
};

export const deleteEstadoAlerta = async (id) => {
    const result = await http(`/api/EstadoAlerta/${id}`, { method: 'DELETE' });
    catalogCache.invalidate('estadoAlertas');
    return result;
};

