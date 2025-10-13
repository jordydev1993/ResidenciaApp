import { http } from '../utils/http.js';

const BASE = '/api/Nino';

// Datos de prueba para desarrollo (eliminar cuando el backend esté disponible)
const mockData = [
    {
        Id: 1,
        DNI: '12345678',
        Nombre: 'Juan',
        Apellido: 'Pérez',
        FechaNacimiento: '2010-05-15',
        Estado: 'activo',
        LegajoId: 'LEG001'
    },
    {
        Id: 2,
        DNI: '87654321',
        Nombre: 'María',
        Apellido: 'García',
        FechaNacimiento: '2012-08-22',
        Estado: 'activo',
        LegajoId: ''
    },
    {
        Id: 3,
        DNI: '11223344',
        Nombre: 'Carlos',
        Apellido: 'López',
        FechaNacimiento: '2009-12-03',
        Estado: 'egresado',
        LegajoId: 'LEG003'
    }
];

let localData = [...mockData];

// Función para simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const upsertNino = async (data) => {
    try {
        // Intentar conectar con el backend real
        return await http(BASE, { method: 'POST', body: JSON.stringify(data) });
    } catch (error) {
        // Si falla, usar datos locales
        console.warn('Backend no disponible, usando datos locales:', error.message);
        await delay(300); // Simular delay de red
        
        if (data.Id) {
            // Actualizar existente
            const index = localData.findIndex(n => n.Id === data.Id);
            if (index !== -1) {
                localData[index] = { ...localData[index], ...data };
                return localData[index];
            }
        } else {
            // Crear nuevo
            const newNino = {
                Id: Math.max(...localData.map(n => n.Id)) + 1,
                ...data
            };
            localData.push(newNino);
            return newNino;
        }
        throw new Error('Error al guardar niño');
    }
};

export const listNinos = async () => {
    try {
        // Intentar conectar con el backend real
        return await http(BASE, { method: 'GET' });
    } catch (error) {
        // Si falla, usar datos locales
        console.warn('Backend no disponible, usando datos locales:', error.message);
        await delay(200); // Simular delay de red
        return localData;
    }
};

export const deleteNino = async (dni) => {
    try {
        // Intentar conectar con el backend real
        return await http(`${BASE}/${encodeURIComponent(dni)}`, { method: 'DELETE' });
    } catch (error) {
        // Si falla, usar datos locales
        console.warn('Backend no disponible, usando datos locales:', error.message);
        await delay(200); // Simular delay de red
        
        const index = localData.findIndex(n => n.DNI === dni);
        if (index !== -1) {
            localData.splice(index, 1);
            return { success: true };
        }
        throw new Error('Niño no encontrado');
    }
};

// Verifica si existe un NNA por DNI consultando al backend
export const existsDni = async (dni) => {
    try {
        await http(`${BASE}/${encodeURIComponent(dni)}`, { method: 'GET' });
        return true; // encontrado
    } catch (err) {
        if ((err.message || '').includes('404')) return false; // no encontrado
        // fallback a listado si el backend devuelve otra forma
        const data = await listNinos();
        const items = Array.isArray(data) ? data : (data?.items || data || []);
        return items.some(n => String(n.DNI ?? n["DNI"] ?? n[0] ?? '').trim() === String(dni).trim());
    }
};


