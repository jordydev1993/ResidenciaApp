/**
 * Módulo de paginación reutilizable
 * Proporciona funcionalidad de paginación para tablas y listados
 */

/**
 * Clase Pagination para manejar paginación de datos
 */
export class Pagination {
    constructor(options = {}) {
        this.data = options.data || [];
        this.itemsPerPage = options.itemsPerPage || 10;
        this.currentPage = options.currentPage || 1;
        this.containerId = options.containerId || 'paginationControls';
        this.onPageChange = options.onPageChange || (() => {});
        this.onItemsPerPageChange = options.onItemsPerPageChange || (() => {});
    }

    /**
     * Establece los datos a paginar
     */
    setData(data) {
        this.data = data || [];
        this.currentPage = 1; // Reset a primera página
        return this;
    }

    /**
     * Obtiene el total de páginas
     */
    getTotalPages() {
        return Math.ceil(this.data.length / this.itemsPerPage);
    }

    /**
     * Obtiene los datos de la página actual
     */
    getCurrentPageData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.data.slice(start, end);
    }

    /**
     * Cambia a una página específica
     */
    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        
        this.currentPage = page;
        this.onPageChange(page, this.getCurrentPageData());
        this.render();
        return this;
    }

    /**
     * Va a la página siguiente
     */
    nextPage() {
        return this.goToPage(this.currentPage + 1);
    }

    /**
     * Va a la página anterior
     */
    prevPage() {
        return this.goToPage(this.currentPage - 1);
    }

    /**
     * Va a la primera página
     */
    firstPage() {
        return this.goToPage(1);
    }

    /**
     * Va a la última página
     */
    lastPage() {
        return this.goToPage(this.getTotalPages());
    }

    /**
     * Cambia la cantidad de items por página
     */
    setItemsPerPage(items) {
        this.itemsPerPage = parseInt(items) || 10;
        this.currentPage = 1; // Reset a primera página
        this.onItemsPerPageChange(this.itemsPerPage);
        this.onPageChange(this.currentPage, this.getCurrentPageData());
        this.render();
        return this;
    }

    /**
     * Obtiene información de paginación
     */
    getInfo() {
        const totalPages = this.getTotalPages();
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.data.length);
        
        return {
            currentPage: this.currentPage,
            totalPages: totalPages,
            itemsPerPage: this.itemsPerPage,
            totalItems: this.data.length,
            startItem: start,
            endItem: end,
            hasNext: this.currentPage < totalPages,
            hasPrev: this.currentPage > 1
        };
    }

    /**
     * Renderiza los controles de paginación
     */
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const info = this.getInfo();
        
        // Si no hay datos, ocultar controles
        if (info.totalItems === 0) {
            container.innerHTML = '';
            container.classList.add('hidden');
            return;
        }
        
        container.classList.remove('hidden');

        // Generar números de página visibles (máximo 7)
        const pageNumbers = this.generatePageNumbers(info.currentPage, info.totalPages);

        container.innerHTML = `
            <div class="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <!-- Info de registros -->
                <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-700">
                        Mostrando <span class="font-semibold text-gray-900">${info.startItem}</span> - 
                        <span class="font-semibold text-gray-900">${info.endItem}</span> de 
                        <span class="font-semibold text-gray-900">${info.totalItems}</span> registros
                    </span>
                    
                    <!-- Selector de items por página -->
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600">Por página:</label>
                        <select id="${this.containerId}_itemsPerPage" 
                                class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                            <option value="10" ${this.itemsPerPage === 10 ? 'selected' : ''}>10</option>
                            <option value="25" ${this.itemsPerPage === 25 ? 'selected' : ''}>25</option>
                            <option value="50" ${this.itemsPerPage === 50 ? 'selected' : ''}>50</option>
                            <option value="100" ${this.itemsPerPage === 100 ? 'selected' : ''}>100</option>
                        </select>
                    </div>
                </div>

                <!-- Controles de navegación -->
                <div class="flex items-center gap-2">
                    <!-- Primera página -->
                    <button ${!info.hasPrev ? 'disabled' : ''} 
                            class="pagination-btn px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            data-page="first"
                            title="Primera página">
                        <i class="bi bi-chevron-double-left"></i>
                    </button>

                    <!-- Página anterior -->
                    <button ${!info.hasPrev ? 'disabled' : ''} 
                            class="pagination-btn px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            data-page="prev"
                            title="Página anterior">
                        <i class="bi bi-chevron-left"></i>
                    </button>

                    <!-- Números de página -->
                    <div class="hidden md:flex items-center gap-1">
                        ${pageNumbers.map(page => {
                            if (page === '...') {
                                return `<span class="px-3 py-2 text-gray-500">...</span>`;
                            }
                            return `
                                <button class="pagination-btn px-3 py-2 border rounded-lg transition-colors ${
                                    page === info.currentPage 
                                        ? 'bg-blue-600 text-white border-blue-600 font-semibold' 
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }"
                                        data-page="${page}">
                                    ${page}
                                </button>
                            `;
                        }).join('')}
                    </div>

                    <!-- Info de página en móvil -->
                    <span class="md:hidden px-3 py-2 text-sm font-semibold text-gray-700">
                        ${info.currentPage} / ${info.totalPages}
                    </span>

                    <!-- Página siguiente -->
                    <button ${!info.hasNext ? 'disabled' : ''} 
                            class="pagination-btn px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            data-page="next"
                            title="Página siguiente">
                        <i class="bi bi-chevron-right"></i>
                    </button>

                    <!-- Última página -->
                    <button ${!info.hasNext ? 'disabled' : ''} 
                            class="pagination-btn px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            data-page="last"
                            title="Última página">
                        <i class="bi bi-chevron-double-right"></i>
                    </button>
                </div>
            </div>
        `;

        // Attach event listeners
        this.attachEventListeners();
    }

    /**
     * Genera array de números de página para mostrar
     * Ej: [1, 2, 3, "...", 10, 11, 12] para página actual 11 de 50
     */
    generatePageNumbers(current, total) {
        const pages = [];
        
        if (total <= 7) {
            // Mostrar todas las páginas si son 7 o menos
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            // Siempre mostrar primera página
            pages.push(1);
            
            if (current > 3) {
                pages.push('...');
            }
            
            // Páginas alrededor de la actual
            const start = Math.max(2, current - 1);
            const end = Math.min(total - 1, current + 1);
            
            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }
            
            if (current < total - 2) {
                pages.push('...');
            }
            
            // Siempre mostrar última página
            if (!pages.includes(total)) {
                pages.push(total);
            }
        }
        
        return pages;
    }

    /**
     * Adjunta event listeners a los controles
     */
    attachEventListeners() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Event listeners para botones de página
        const buttons = container.querySelectorAll('.pagination-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                
                if (page === 'first') {
                    this.firstPage();
                } else if (page === 'prev') {
                    this.prevPage();
                } else if (page === 'next') {
                    this.nextPage();
                } else if (page === 'last') {
                    this.lastPage();
                } else {
                    this.goToPage(parseInt(page));
                }
            });
        });

        // Event listener para selector de items por página
        const selector = container.querySelector(`#${this.containerId}_itemsPerPage`);
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.setItemsPerPage(e.target.value);
            });
        }
    }
}

/**
 * Helper para crear una instancia de paginación rápidamente
 */
export function createPagination(options) {
    return new Pagination(options);
}

/**
 * Exportación por defecto
 */
export default Pagination;

