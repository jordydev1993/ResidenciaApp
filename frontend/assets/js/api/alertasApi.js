import { http, buildQuery } from '../utils/http.js';

const BASE = '/api/Alerta';

export const listAlertas = (params = {}) => http(`${BASE}${buildQuery(params)}`, { method: 'GET' });
export const createAlerta = (data) => http(BASE, { method: 'POST', body: JSON.stringify(data) });
export const statsBy = (groupBy) => http(`${BASE}${buildQuery({ groupBy })}`, { method: 'GET' });
export const filtrosAlertas = (params = {}) => http(`${BASE}/filtros${buildQuery(params)}`, { method: 'GET' });
export const completeAlerta = (id) => http(`${BASE}/${id}/completar`, { method: 'POST' });
export const dashboardAlertas = () => http(`${BASE}/dashboard`, { method: 'GET' });


