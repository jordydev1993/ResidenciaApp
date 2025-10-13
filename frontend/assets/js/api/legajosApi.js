import { http, buildQuery } from '../utils/http.js';

const BASE = '/api/Legajo';

export const listLegajos = (params = {}) => http(`${BASE}${buildQuery(params)}`, { method: 'GET' });
export const createLegajo = (data) => http(BASE, { method: 'POST', body: JSON.stringify(data) });
export const updateLegajo = (id, data) => http(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteLegajo = (id) => http(`${BASE}/${id}`, { method: 'DELETE' });
export const searchLegajos = (q) => http(`${BASE}/search${buildQuery({ q })}`, { method: 'GET' });
export const reportesLegajos = (params = {}) => http(`${BASE}/reportes${buildQuery(params)}`, { method: 'GET' });

export const listEstados = () => http('/api/Estado', { method: 'GET' });
export const createEstado = (data) => http('/api/Estado', { method: 'POST', body: JSON.stringify(data) });
export const updateEstado = (id, data) => http(`/api/Estado/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEstado = (id) => http(`/api/Estado/${id}`, { method: 'DELETE' });
export const listTutores = () => http('/api/Tutor', { method: 'GET' });


