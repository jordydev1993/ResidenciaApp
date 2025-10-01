import { http } from '../utils/http.js';

const BASE = '/api/Auth';

export const login = (credentials) => http(`${BASE}/Login`, { method: 'POST', body: JSON.stringify(credentials) });
export const registerUser = (data) => http(`${BASE}/Register`, { method: 'POST', body: JSON.stringify(data) });


