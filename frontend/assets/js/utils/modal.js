import { $, renderHTML } from './dom.js';

class Modal {
    constructor(id, title, content) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.element = null;
        this.isOpen = false;
    }

    create() {
        const modalHTML = `
            <div id="${this.id}" class="fixed inset-0 bg-gray-900 bg-opacity-60 hidden z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
                    <!-- Header limpio y minimalista -->
                    <div class="flex items-center justify-between px-6 py-4 flex-shrink-0">
                        <h3 class="text-lg font-semibold text-gray-900">${this.title}</h3>
                        <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors modal-close">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <!-- Contenido con espaciado moderado -->
                    <div class="px-6 pb-4 flex-1">
                        ${this.content}
                    </div>
                    <!-- Footer para botones -->
                    <div id="${this.id}-footer" class="flex-shrink-0">
                        <!-- Los botones se insertarán aquí -->
                    </div>
                </div>
            </div>
        `;
        
        // Remover modal existente si hay uno
        const existingModal = $(`#${this.id}`);
        if (existingModal) {
            existingModal.remove();
        }
        
        // Agregar modal al body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.element = $(`#${this.id}`);
        
        // Bind eventos
        this.bindEvents();
        
        return this.element;
    }

    bindEvents() {
        if (!this.element) return;
        
        // Cerrar con botón X
        const closeBtn = this.element.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Cerrar con click fuera del modal
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.close();
            }
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        if (this.element) {
            this.element.classList.remove('hidden');
            this.isOpen = true;
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        }
    }

    close() {
        if (this.element) {
            this.element.classList.add('hidden');
            this.isOpen = false;
            document.body.style.overflow = ''; // Restaurar scroll del body
        }
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    // Método estático para crear modales rápidos
    static quick(title, content, onConfirm = null, onCancel = null) {
        const modalId = `modal-${Date.now()}`;
        const modal = new Modal(modalId, title, content);
        modal.create();
        
        if (onConfirm || onCancel) {
            // Agregar botones de acción en el footer como en la imagen
            const buttonsHTML = `
                <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                    ${onCancel ? '<button type="button" class="modal-cancel px-4 py-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50 font-medium transition-colors border border-gray-300">Cancelar</button>' : ''}
                    ${onConfirm ? '<button type="button" class="modal-confirm px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium transition-colors">Crear</button>' : ''}
                </div>
            `;
            
            const footerDiv = modal.element.querySelector(`#${modalId}-footer`);
            footerDiv.innerHTML = buttonsHTML;
            
            if (onCancel) {
                const cancelBtn = modal.element.querySelector('.modal-cancel');
                cancelBtn.addEventListener('click', () => {
                    onCancel();
                    modal.close();
                });
            }
            
            if (onConfirm) {
                const confirmBtn = modal.element.querySelector('.modal-confirm');
                confirmBtn.addEventListener('click', () => {
                    onConfirm();
                    modal.close();
                });
            }
        }
        
        modal.open();
        return modal;
    }
}

export { Modal };
