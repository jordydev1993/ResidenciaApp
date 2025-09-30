export async function http(url, options = {}) {
    const response = await fetch(url, {
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


