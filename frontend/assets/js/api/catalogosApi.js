import { http } from '../utils/http.js';

// ESTADO
export const listEstados = () => http('/api/Estado', { method: 'GET' });
export const createEstado = (data) => http('/api/Estado', { method: 'POST', body: JSON.stringify(data) });
export const updateEstado = (id, data) => http(`/api/Estado/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEstado = (id) => http(`/api/Estado/${id}`, { method: 'DELETE' });

// TUTOR
export const listTutores = () => http('/api/Tutor', { method: 'GET' });
export const createTutor = (data) => http('/api/Tutor', { method: 'POST', body: JSON.stringify(data) });
export const updateTutor = (id, data) => http(`/api/Tutor/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTutor = (id) => http(`/api/Tutor/${id}`, { method: 'DELETE' });

// TIPO ALERTA
export const listTipoAlertas = () => http('/api/TipoAlerta', { method: 'GET' });
export const createTipoAlerta = (data) => http('/api/TipoAlerta', { method: 'POST', body: JSON.stringify(data) });
export const updateTipoAlerta = (id, data) => http(`/api/TipoAlerta/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTipoAlerta = (id) => http(`/api/TipoAlerta/${id}`, { method: 'DELETE' });

// PRIORIDAD
export const listPrioridades = () => http('/api/Prioridad', { method: 'GET' });
export const createPrioridad = (data) => http('/api/Prioridad', { method: 'POST', body: JSON.stringify(data) });
export const updatePrioridad = (id, data) => http(`/api/Prioridad/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePrioridad = (id) => http(`/api/Prioridad/${id}`, { method: 'DELETE' });

// ESTADO ALERTA
export const listEstadoAlertas = () => http('/api/EstadoAlerta', { method: 'GET' });
export const createEstadoAlerta = (data) => http('/api/EstadoAlerta', { method: 'POST', body: JSON.stringify(data) });
export const updateEstadoAlerta = (id, data) => http(`/api/EstadoAlerta/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEstadoAlerta = (id) => http(`/api/EstadoAlerta/${id}`, { method: 'DELETE' });

