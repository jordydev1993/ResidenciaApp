const API_BASE = (typeof window !== 'undefined' && (window.API_BASE || localStorage.getItem('API_BASE'))) || 'http://localhost:50948';

function resolveUrl(url) {
    if (typeof url !== 'string') return url;
    // Prefijar base cuando se usa ruta absoluta ("/api/...") desde un origen distinto
    if (url.startsWith('/')) {
        const base = API_BASE.replace(/\/$/, '');
        return `${base}${url}`;
    }
    return url;
}

export async function http(url, options = {}) {
    const response = await fetch(resolveUrl(url), {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    });
    let body = null;
    try { body = await response.json(); } catch { body = null; }
    if (!response.ok) {
        const message = (body && (body.message || body.error)) || `HTTP ${response.status}`;
        throw new Error(message);
    }
    return body;
}

export function buildQuery(params = {}) {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
    return entries.length ? `?${new URLSearchParams(entries).toString()}` : '';
}


