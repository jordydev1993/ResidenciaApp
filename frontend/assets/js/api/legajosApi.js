import { http, buildQuery } from '../utils/http.js';

const BASE = '/api/Legajo';

export const listLegajos = (params = {}) => http(`${BASE}${buildQuery(params)}`, { method: 'GET' });
export const createLegajo = (data) => http(BASE, { method: 'POST', body: JSON.stringify(data) });
// Extensible: update, delete si se agregan
export const searchLegajos = (q) => http(`${BASE}/search${buildQuery({ q })}`, { method: 'GET' });
export const reportesLegajos = (params = {}) => http(`${BASE}/reportes${buildQuery(params)}`, { method: 'GET' });

export const listEstados = () => http('/api/Estado', { method: 'GET' });


