import { http } from '../utils/http.js';

const BASE = '/api/Tutor';

export const listTutores = () => http(BASE, { method: 'GET' });
export const createTutor = (data) => http(BASE, { method: 'POST', body: JSON.stringify(data) });
export const updateTutor = (id, data) => http(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTutor = (id) => http(`${BASE}/${id}`, { method: 'DELETE' });


