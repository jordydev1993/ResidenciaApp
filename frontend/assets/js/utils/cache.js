/**
 * Sistema de caché con TTL (Time To Live)
 * Almacena datos en localStorage con expiración automática
 * 
 * @module cache
 */

/**
 * Configuración por defecto del caché
 */
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos en milisegundos
const CACHE_PREFIX = 'cache_residencia_';
const CACHE_METADATA_KEY = 'cache_metadata';

/**
 * Clase principal del sistema de caché
 */
export class CacheManager {
    /**
     * Constructor
     * @param {string} namespace - Namespace para evitar colisiones
     */
    constructor(namespace = 'default') {
        this.namespace = namespace;
        this.prefix = `${CACHE_PREFIX}${namespace}_`;
    }

    /**
     * Obtiene un valor del caché o lo obtiene de la fuente si no existe/expiró
     * 
     * @param {string} key - Clave del caché
     * @param {Function} fetcher - Función que obtiene los datos si no están en caché
     * @param {number} ttl - Tiempo de vida en milisegundos
     * @returns {Promise<any>} Los datos cacheados o frescos
     * 
     * @example
     * const estados = await cache.get('estados', () => listEstados(), 300000);
     */
    async get(key, fetcher, ttl = DEFAULT_TTL) {
        const cacheKey = this._buildKey(key);
        
        try {
            // Intentar obtener del caché
            const cached = this._getFromStorage(cacheKey);
            
            if (cached !== null) {
                const { data, timestamp, ttl: cachedTTL } = cached;
                const age = Date.now() - timestamp;
                
                // Verificar si no ha expirado
                if (age < cachedTTL) {
                    console.log(`[Cache HIT] ${key} (age: ${Math.round(age / 1000)}s)`);
                    return data;
                }
                
                console.log(`[Cache EXPIRED] ${key} (age: ${Math.round(age / 1000)}s)`);
            } else {
                console.log(`[Cache MISS] ${key}`);
            }
        } catch (error) {
            console.warn('[Cache] Error reading cache:', error);
        }
        
        // Obtener datos frescos
        try {
            const freshData = await fetcher();
            
            // Guardar en caché
            this._saveToStorage(cacheKey, freshData, ttl);
            
            return freshData;
        } catch (error) {
            console.error('[Cache] Error fetching fresh data:', error);
            
            // Si falla, intentar devolver datos expirados como fallback
            const expired = this._getFromStorage(cacheKey);
            if (expired !== null) {
                console.warn('[Cache] Returning expired data as fallback');
                return expired.data;
            }
            
            throw error;
        }
    }

    /**
     * Guarda un valor directamente en el caché
     * 
     * @param {string} key - Clave del caché
     * @param {any} data - Datos a cachear
     * @param {number} ttl - Tiempo de vida en milisegundos
     */
    set(key, data, ttl = DEFAULT_TTL) {
        const cacheKey = this._buildKey(key);
        this._saveToStorage(cacheKey, data, ttl);
    }

    /**
     * Invalida (elimina) una entrada del caché
     * 
     * @param {string} key - Clave a invalidar
     */
    invalidate(key) {
        const cacheKey = this._buildKey(key);
        try {
            localStorage.removeItem(cacheKey);
            this._updateMetadata(cacheKey, 'remove');
            console.log(`[Cache] Invalidated: ${key}`);
        } catch (error) {
            console.error('[Cache] Error invalidating:', error);
        }
    }

    /**
     * Invalida todas las entradas del namespace actual
     */
    invalidateAll() {
        try {
            const metadata = this._getMetadata();
            const keys = metadata[this.namespace] || [];
            
            keys.forEach(key => {
                localStorage.removeItem(key);
            });
            
            delete metadata[this.namespace];
            localStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
            
            console.log(`[Cache] Invalidated all in namespace: ${this.namespace}`);
        } catch (error) {
            console.error('[Cache] Error invalidating all:', error);
        }
    }

    /**
     * Limpia entradas expiradas de todo el caché
     * 
     * @returns {number} Número de entradas limpiadas
     */
    static cleanup() {
        let cleaned = 0;
        
        try {
            const metadata = JSON.parse(localStorage.getItem(CACHE_METADATA_KEY) || '{}');
            const now = Date.now();
            
            for (const namespace in metadata) {
                const keys = metadata[namespace] || [];
                metadata[namespace] = keys.filter(key => {
                    try {
                        const item = JSON.parse(localStorage.getItem(key) || 'null');
                        if (!item) return false;
                        
                        const age = now - item.timestamp;
                        if (age >= item.ttl) {
                            localStorage.removeItem(key);
                            cleaned++;
                            return false;
                        }
                        return true;
                    } catch {
                        localStorage.removeItem(key);
                        cleaned++;
                        return false;
                    }
                });
            }
            
            localStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
            
            if (cleaned > 0) {
                console.log(`[Cache] Cleaned ${cleaned} expired entries`);
            }
        } catch (error) {
            console.error('[Cache] Error during cleanup:', error);
        }
        
        return cleaned;
    }

    /**
     * Obtiene estadísticas del caché
     * 
     * @returns {Object} Estadísticas
     */
    static getStats() {
        try {
            const metadata = JSON.parse(localStorage.getItem(CACHE_METADATA_KEY) || '{}');
            const now = Date.now();
            
            let totalEntries = 0;
            let totalSize = 0;
            let validEntries = 0;
            let expiredEntries = 0;
            
            for (const namespace in metadata) {
                const keys = metadata[namespace] || [];
                totalEntries += keys.length;
                
                keys.forEach(key => {
                    try {
                        const itemStr = localStorage.getItem(key) || '';
                        totalSize += itemStr.length;
                        
                        const item = JSON.parse(itemStr);
                        const age = now - item.timestamp;
                        
                        if (age < item.ttl) {
                            validEntries++;
                        } else {
                            expiredEntries++;
                        }
                    } catch {
                        expiredEntries++;
                    }
                });
            }
            
            return {
                totalEntries,
                validEntries,
                expiredEntries,
                totalSize,
                totalSizeKB: Math.round(totalSize / 1024),
                namespaces: Object.keys(metadata).length
            };
        } catch (error) {
            console.error('[Cache] Error getting stats:', error);
            return null;
        }
    }

    /**
     * Construye la clave completa del caché
     * @private
     */
    _buildKey(key) {
        return `${this.prefix}${key}`;
    }

    /**
     * Obtiene un valor del localStorage
     * @private
     */
    _getFromStorage(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            
            return JSON.parse(item);
        } catch (error) {
            console.error('[Cache] Error parsing cached data:', error);
            localStorage.removeItem(key);
            return null;
        }
    }

    /**
     * Guarda un valor en localStorage
     * @private
     */
    _saveToStorage(key, data, ttl) {
        try {
            const item = {
                data,
                timestamp: Date.now(),
                ttl
            };
            
            localStorage.setItem(key, JSON.stringify(item));
            this._updateMetadata(key, 'add');
            
            console.log(`[Cache] Saved: ${key} (TTL: ${ttl / 1000}s)`);
        } catch (error) {
            // Manejar cuota excedida
            if (error.name === 'QuotaExceededError') {
                console.warn('[Cache] Storage quota exceeded, cleaning up...');
                CacheManager.cleanup();
                
                // Intentar de nuevo
                try {
                    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now(), ttl }));
                    this._updateMetadata(key, 'add');
                } catch (retryError) {
                    console.error('[Cache] Still failed after cleanup:', retryError);
                }
            } else {
                console.error('[Cache] Error saving to cache:', error);
            }
        }
    }

    /**
     * Actualiza metadatos del caché
     * @private
     */
    _updateMetadata(key, action) {
        try {
            const metadata = this._getMetadata();
            
            if (!metadata[this.namespace]) {
                metadata[this.namespace] = [];
            }
            
            if (action === 'add' && !metadata[this.namespace].includes(key)) {
                metadata[this.namespace].push(key);
            } else if (action === 'remove') {
                metadata[this.namespace] = metadata[this.namespace].filter(k => k !== key);
            }
            
            localStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
        } catch (error) {
            console.error('[Cache] Error updating metadata:', error);
        }
    }

    /**
     * Obtiene metadatos del caché
     * @private
     */
    _getMetadata() {
        try {
            return JSON.parse(localStorage.getItem(CACHE_METADATA_KEY) || '{}');
        } catch {
            return {};
        }
    }
}

/**
 * Instancia global del caché para catálogos
 */
export const catalogCache = new CacheManager('catalogos');

/**
 * Instancia global del caché para datos principales
 */
export const dataCache = new CacheManager('data');

/**
 * Ejecutar limpieza automática al cargar
 */
if (typeof window !== 'undefined') {
    // Limpiar al cargar la página
    CacheManager.cleanup();
    
    // Limpiar cada 10 minutos
    setInterval(() => {
        CacheManager.cleanup();
    }, 10 * 60 * 1000);
}

// Exponer para debugging en consola
if (typeof window !== 'undefined') {
    window.CacheManager = CacheManager;
    window.catalogCache = catalogCache;
    window.dataCache = dataCache;
}

