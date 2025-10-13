import { http, buildQuery } from '../utils/http.js';

const BASE = '/api/Alerta';
const TIPO_ALERTA_BASE = '/api/TipoAlerta';
const PRIORIDAD_BASE = '/api/Prioridad';
const ESTADO_ALERTA_BASE = '/api/EstadoAlerta';

// Alertas principales
export const listAlertas = (params = {}) => http(`${BASE}${buildQuery(params)}`, { method: 'GET' });
export const createAlerta = (data) => http(BASE, { method: 'POST', body: JSON.stringify(data) });
export const statsBy = (groupBy) => http(`${BASE}${buildQuery({ groupBy })}`, { method: 'GET' });
export const filtrosAlertas = (params = {}) => http(`${BASE}/filtros${buildQuery(params)}`, { method: 'GET' });
export const completeAlerta = (id) => http(`${BASE}/${id}/completar`, { method: 'POST' });
export const dashboardAlertas = () => http(`${BASE}/dashboard`, { method: 'GET' });

// Tipo de Alerta
export const listTipoAlertas = (params = {}) => http(`${TIPO_ALERTA_BASE}${buildQuery(params)}`, { method: 'GET' });
export const createTipoAlerta = (data) => http(TIPO_ALERTA_BASE, { method: 'POST', body: JSON.stringify(data) });
export const updateTipoAlerta = (id, data) => http(`${TIPO_ALERTA_BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTipoAlerta = (id) => http(`${TIPO_ALERTA_BASE}/${id}`, { method: 'DELETE' });

// Prioridad
export const listPrioridades = (params = {}) => http(`${PRIORIDAD_BASE}${buildQuery(params)}`, { method: 'GET' });
export const createPrioridad = (data) => http(PRIORIDAD_BASE, { method: 'POST', body: JSON.stringify(data) });
export const updatePrioridad = (id, data) => http(`${PRIORIDAD_BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePrioridad = (id) => http(`${PRIORIDAD_BASE}/${id}`, { method: 'DELETE' });

// Estado de Alerta
export const listEstadoAlertas = (params = {}) => http(`${ESTADO_ALERTA_BASE}${buildQuery(params)}`, { method: 'GET' });
export const createEstadoAlerta = (data) => http(ESTADO_ALERTA_BASE, { method: 'POST', body: JSON.stringify(data) });
export const updateEstadoAlerta = (id, data) => http(`${ESTADO_ALERTA_BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEstadoAlerta = (id) => http(`${ESTADO_ALERTA_BASE}/${id}`, { method: 'DELETE' });


