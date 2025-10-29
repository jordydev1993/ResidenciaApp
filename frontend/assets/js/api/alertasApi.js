import { http, buildQuery } from '../utils/http.js';
import { catalogCache, dataCache } from '../utils/cache.js';

const BASE = '/api/Alerta';
const TIPO_ALERTA_BASE = '/api/TipoAlerta';
const PRIORIDAD_BASE = '/api/Prioridad';
const ESTADO_ALERTA_BASE = '/api/EstadoAlerta';

// TTL Configuración
const CATALOG_TTL = 5 * 60 * 1000; // 5 minutos para catálogos
const DATA_TTL = 2 * 60 * 1000; // 2 minutos para datos

// ===============================
// ALERTAS PRINCIPALES
// ===============================
// Usar caché corto (1 minuto) para alertas sin filtros
export const listAlertas = (params = {}) => {
    // Si tiene filtros, no usar caché
    if (Object.keys(params).length > 0) {
        return http(`${BASE}${buildQuery(params)}`, { method: 'GET' });
    }
    // Sin filtros: usar caché de 1 minuto
    return dataCache.get('alertas-list', () => http(BASE, { method: 'GET' }), 60 * 1000);
};

export const createAlerta = async (data) => {
    const result = await http(BASE, { method: 'POST', body: JSON.stringify(data) });
    // Invalidar cachés relacionados
    dataCache.invalidate('dashboard-alertas');
    dataCache.invalidate('alertas-list');
    return result;
};

export const statsBy = (groupBy) => http(`${BASE}${buildQuery({ groupBy })}`, { method: 'GET' });

export const filtrosAlertas = (params = {}) => http(`${BASE}/filtros${buildQuery(params)}`, { method: 'GET' });

export const updateAlerta = async (id, data) => {
    const result = await http(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    dataCache.invalidate('dashboard-alertas');
    dataCache.invalidate('alertas-list');
    return result;
};

export const deleteAlerta = async (id) => {
    const result = await http(`${BASE}/${id}`, { method: 'DELETE' });
    dataCache.invalidate('dashboard-alertas');
    dataCache.invalidate('alertas-list');
    return result;
};

export const completeAlerta = async (id) => {
    const result = await http(`${BASE}/${id}/completar`, { method: 'POST' });
    dataCache.invalidate('dashboard-alertas');
    dataCache.invalidate('alertas-list');
    return result;
};

// Dashboard con caché corto (2 minutos)
export const dashboardAlertas = () => 
    dataCache.get('dashboard-alertas', () => http(`${BASE}/dashboard`, { method: 'GET' }), DATA_TTL);

// ===============================
// TIPO DE ALERTA (con caché)
// ===============================
export const listTipoAlertas = (params = {}) => {
    // Si tiene parámetros, no usar caché
    if (Object.keys(params).length > 0) {
        return http(`${TIPO_ALERTA_BASE}${buildQuery(params)}`, { method: 'GET' });
    }
    return catalogCache.get('tipoAlertas', () => http(TIPO_ALERTA_BASE, { method: 'GET' }), CATALOG_TTL);
};

export const createTipoAlerta = async (data) => {
    const result = await http(TIPO_ALERTA_BASE, { method: 'POST', body: JSON.stringify(data) });
    catalogCache.invalidate('tipoAlertas');
    return result;
};

export const updateTipoAlerta = async (id, data) => {
    const result = await http(`${TIPO_ALERTA_BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    catalogCache.invalidate('tipoAlertas');
    return result;
};

export const deleteTipoAlerta = async (id) => {
    const result = await http(`${TIPO_ALERTA_BASE}/${id}`, { method: 'DELETE' });
    catalogCache.invalidate('tipoAlertas');
    return result;
};

// ===============================
// PRIORIDAD (con caché)
// ===============================
export const listPrioridades = (params = {}) => {
    if (Object.keys(params).length > 0) {
        return http(`${PRIORIDAD_BASE}${buildQuery(params)}`, { method: 'GET' });
    }
    return catalogCache.get('prioridades', () => http(PRIORIDAD_BASE, { method: 'GET' }), CATALOG_TTL);
};

export const createPrioridad = async (data) => {
    const result = await http(PRIORIDAD_BASE, { method: 'POST', body: JSON.stringify(data) });
    catalogCache.invalidate('prioridades');
    return result;
};

export const updatePrioridad = async (id, data) => {
    const result = await http(`${PRIORIDAD_BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    catalogCache.invalidate('prioridades');
    return result;
};

export const deletePrioridad = async (id) => {
    const result = await http(`${PRIORIDAD_BASE}/${id}`, { method: 'DELETE' });
    catalogCache.invalidate('prioridades');
    return result;
};

// ===============================
// ESTADO DE ALERTA (con caché)
// ===============================
export const listEstadoAlertas = (params = {}) => {
    if (Object.keys(params).length > 0) {
        return http(`${ESTADO_ALERTA_BASE}${buildQuery(params)}`, { method: 'GET' });
    }
    return catalogCache.get('estadoAlertas', () => http(ESTADO_ALERTA_BASE, { method: 'GET' }), CATALOG_TTL);
};

export const createEstadoAlerta = async (data) => {
    const result = await http(ESTADO_ALERTA_BASE, { method: 'POST', body: JSON.stringify(data) });
    catalogCache.invalidate('estadoAlertas');
    return result;
};

export const updateEstadoAlerta = async (id, data) => {
    const result = await http(`${ESTADO_ALERTA_BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    catalogCache.invalidate('estadoAlertas');
    return result;
};

export const deleteEstadoAlerta = async (id) => {
    const result = await http(`${ESTADO_ALERTA_BASE}/${id}`, { method: 'DELETE' });
    catalogCache.invalidate('estadoAlertas');
    return result;
};


