import { http } from '../utils/http.js';

const BASE = '/api/Nino';

export const upsertNino = (data) => http(BASE, { method: 'POST', body: JSON.stringify(data) });


