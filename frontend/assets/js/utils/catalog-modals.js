import { Modal } from './modal.js';
import { $, serializeForm, showToast } from './dom.js';
import { upsertNino } from '../api/ninoApi.js';
import { createTutor } from '../api/tutorApi.js';
import { createEstado } from '../api/legajosApi.js';
import { createTipoAlerta, createPrioridad, createEstadoAlerta } from '../api/alertasApi.js';

class CatalogModals {
    static async mostrarModalNino(onCreated = null) {
        const content = `
            <form id="modalNinoForm" novalidate>
                <div class="space-y-4">
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-900">DNI *</label>
                        <input type="text" name="dni" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                               placeholder="12345678" required maxlength="8" pattern="[0-9]{7,8}">
                        <p class="text-xs text-gray-500">7 u 8 dígitos numéricos</p>
                    </div>
                    
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-900">Nombre Completo *</label>
                        <input type="text" name="nombre" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                               placeholder="Juan Pérez" required>
                    </div>
                    
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-900">Fecha de Nacimiento *</label>
                        <input type="date" name="fechaNacimiento" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required>
                    </div>
                </div>
            </form>
        `;

        const modal = Modal.quick('Nuevo Niño', content, null, null);
        
        // Agregar botones personalizados en el footer
        const modalId = modal.element.id;
        const footerDiv = modal.element.querySelector(`#${modalId}-footer`);
        const buttonsHTML = `
            <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button type="button" class="modal-cancel px-4 py-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50 font-medium transition-colors border border-gray-300">
                    Cancelar
                </button>
                <button type="button" class="modal-confirm px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium transition-colors">
                    Crear Niño
                </button>
            </div>
        `;
        footerDiv.innerHTML = buttonsHTML;

        // Bind eventos
        const cancelBtn = modal.element.querySelector('.modal-cancel');
        const confirmBtn = modal.element.querySelector('.modal-confirm');
        const form = modal.element.querySelector('#modalNinoForm');

        cancelBtn.addEventListener('click', () => modal.close());

        confirmBtn.addEventListener('click', async () => {
            const payload = serializeForm(form);
            
            // Validaciones
            if (!payload.dni || !/^\d{7,8}$/.test(payload.dni)) {
                showToast('DNI inválido. Debe tener 7 u 8 dígitos.');
                return;
            }
            if (!payload.nombre?.trim()) {
                showToast('Nombre requerido');
                return;
            }
            if (!payload.fechaNacimiento) {
                showToast('Fecha de nacimiento requerida');
                return;
            }

            try {
                await upsertNino({
                    DNI: payload.dni,
                    Nombre: payload.nombre.trim(),
                    FechaNacimiento: payload.fechaNacimiento
                });
                
                showToast('Niño creado correctamente');
                modal.close();
                
                if (onCreated) {
                    onCreated(payload);
                }
            } catch (err) {
                console.error('Error al crear niño:', err);
                showToast(`Error al crear niño: ${err.message}`, 'error');
            }
        });

        return modal;
    }

    static async mostrarModalTutor(onCreated = null) {
        const content = `
            <form id="modalTutorForm" novalidate>
                <div class="space-y-4">
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-900">Nombre Completo *</label>
                        <input type="text" name="nombre" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                               placeholder="María González" required>
                    </div>
                    
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-900">Teléfono</label>
                        <input type="tel" name="telefono" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                               placeholder="011-1234-5678">
                        <p class="text-xs text-gray-500">Opcional - Para contacto</p>
                    </div>
                    
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-900">Email</label>
                        <input type="email" name="email" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                               placeholder="tutor@email.com">
                        <p class="text-xs text-gray-500">Opcional - Para notificaciones</p>
                    </div>
                </div>
            </form>
        `;

        const modal = Modal.quick('Nuevo Tutor', content, null, null);
        
        // Agregar botones personalizados
        const modalId = modal.element.id;
        const footerDiv = modal.element.querySelector(`#${modalId}-footer`);
        const buttonsHTML = `
            <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button type="button" class="modal-cancel px-4 py-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50 font-medium transition-colors border border-gray-300">
                    Cancelar
                </button>
                <button type="button" class="modal-confirm px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium transition-colors">Crear Tutor
                </button>
            </div>
        `;
        footerDiv.innerHTML = buttonsHTML;

        // Bind eventos
        const cancelBtn = modal.element.querySelector('.modal-cancel');
        const confirmBtn = modal.element.querySelector('.modal-confirm');
        const form = modal.element.querySelector('#modalTutorForm');

        cancelBtn.addEventListener('click', () => modal.close());

        confirmBtn.addEventListener('click', async () => {
            const payload = serializeForm(form);
            
            if (!payload.nombre?.trim()) {
                showToast('Nombre requerido');
                return;
            }

            try {
                await createTutor({
                    Nombre: payload.nombre.trim(),
                    Contacto: payload.telefono?.trim() || null
                });
                
                showToast('Tutor creado correctamente');
                modal.close();
                
                if (onCreated) {
                    onCreated(payload);
                }
            } catch (err) {
                showToast(`Error al crear tutor: ${err.message}`);
            }
        });

        return modal;
    }

    static async mostrarModalEstado(onCreated = null) {
        const content = `
            <form id="modalEstadoForm" novalidate>
                <div class="space-y-4">
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-900">Nombre *</label>
                        <input type="text" name="nombre" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                               placeholder="Activo" required>
                    </div>
                    
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-900">Descripción</label>
                        <textarea name="descripcion" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none" 
                                  rows="3" placeholder="Descripción del estado..."></textarea>
                        <p class="text-xs text-gray-500">Opcional - Para mayor claridad</p>
                    </div>
                </div>
            </form>
        `;

        const modal = Modal.quick('Nuevo Estado', content, null, null);
        
        // Agregar botones personalizados
        const modalId = modal.element.id;
        const footerDiv = modal.element.querySelector(`#${modalId}-footer`);
        const buttonsHTML = `
            <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button type="button" class="modal-cancel px-4 py-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50 font-medium transition-colors border border-gray-300">
                    Cancelar
                </button>
                <button type="button" class="modal-confirm px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium transition-colors">Crear Estado
                </button>
            </div>
        `;
        footerDiv.innerHTML = buttonsHTML;

        // Bind eventos
        const cancelBtn = modal.element.querySelector('.modal-cancel');
        const confirmBtn = modal.element.querySelector('.modal-confirm');
        const form = modal.element.querySelector('#modalEstadoForm');

        cancelBtn.addEventListener('click', () => modal.close());

        confirmBtn.addEventListener('click', async () => {
            const payload = serializeForm(form);
            
            if (!payload.nombre?.trim()) {
                showToast('Nombre requerido');
                return;
            }

            try {
                await createEstado({
                    Nombre: payload.nombre.trim(),
                    Descripcion: payload.descripcion?.trim() || null
                });
                
                showToast('Estado creado correctamente');
                modal.close();
                
                if (onCreated) {
                    onCreated(payload);
                }
            } catch (err) {
                showToast(`Error al crear estado: ${err.message}`);
            }
        });

        return modal;
    }

    static async mostrarModalTipoAlerta(onCreated = null) {
        const content = `
            <form id="modalTipoAlertaForm" novalidate>
                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-800">Nombre *</label>
                        <input type="text" name="nombre" class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                               placeholder="Médica" required>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-800">Descripción</label>
                        <textarea name="descripcion" class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none" 
                                  rows="3" placeholder="Descripción del tipo de alerta..."></textarea>
                        <p class="text-xs text-gray-500 flex items-center">
                            <i class="bi bi-info-circle mr-1"></i>
                            Opcional - Para mayor claridad
                        </p>
                    </div>
                </div>
            </form>
        `;

        const modal = Modal.quick('Nuevo Tipo de Alerta', content, null, null);
        
        // Agregar botones personalizados
        const modalId = modal.element.id;
        const footerDiv = modal.element.querySelector(`#${modalId}-footer`);
        const buttonsHTML = `
            <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button type="button" class="modal-cancel px-4 py-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50 font-medium transition-colors border border-gray-300">
                    Cancelar
                </button>
                <button type="button" class="modal-confirm px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium transition-colors">Crear Tipo
                </button>
            </div>
        `;
        footerDiv.innerHTML = buttonsHTML;

        // Bind eventos
        const cancelBtn = modal.element.querySelector('.modal-cancel');
        const confirmBtn = modal.element.querySelector('.modal-confirm');
        const form = modal.element.querySelector('#modalTipoAlertaForm');

        cancelBtn.addEventListener('click', () => modal.close());

        confirmBtn.addEventListener('click', async () => {
            const payload = serializeForm(form);
            
            if (!payload.nombre?.trim()) {
                showToast('Nombre requerido');
                return;
            }

            try {
                await createTipoAlerta({
                    Nombre: payload.nombre.trim(),
                    Descripcion: payload.descripcion?.trim() || null
                });
                
                showToast('Tipo de alerta creado correctamente');
                modal.close();
                
                if (onCreated) {
                    onCreated(payload);
                }
            } catch (err) {
                showToast(`Error al crear tipo de alerta: ${err.message}`);
            }
        });

        return modal;
    }

    static async mostrarModalPrioridad(onCreated = null) {
        const content = `
            <form id="modalPrioridadForm" novalidate>
                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-800">Nombre *</label>
                        <input type="text" name="nombre" class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                               placeholder="Alta" required>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-800">Color *</label>
                        <div class="flex items-center gap-4">
                            <input type="color" name="color" class="w-16 h-12 border-2 border-gray-200 rounded-lg cursor-pointer" 
                                   value="#dc3545" required>
                            <input type="text" name="colorHex" class="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                                   placeholder="#dc3545" pattern="^#[0-9A-Fa-f]{6}$" required>
                        </div>
                        <p class="text-xs text-gray-500 flex items-center">
                            <i class="bi bi-palette mr-1"></i>
                            Selecciona un color para identificar la prioridad
                        </p>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-800">Orden *</label>
                        <select name="orden" class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" required>
                            <option value="">Seleccionar orden</option>
                            <option value="1">1 - Alta prioridad</option>
                            <option value="2">2 - Media prioridad</option>
                            <option value="3">3 - Baja prioridad</option>
                        </select>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-800">Descripción</label>
                        <textarea name="descripcion" class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none" 
                                  rows="3" placeholder="Descripción de la prioridad..."></textarea>
                        <p class="text-xs text-gray-500 flex items-center">
                            <i class="bi bi-info-circle mr-1"></i>
                            Opcional - Para mayor claridad
                        </p>
                    </div>
                </div>
            </form>
        `;

        const modal = Modal.quick('Nueva Prioridad', content, null, null);
        
        // Agregar botones personalizados
        const modalId = modal.element.id;
        const footerDiv = modal.element.querySelector(`#${modalId}-footer`);
        const buttonsHTML = `
            <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button type="button" class="modal-cancel px-4 py-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50 font-medium transition-colors border border-gray-300">
                    Cancelar
                </button>
                <button type="button" class="modal-confirm px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium transition-colors">Crear Prioridad
                </button>
            </div>
        `;
        footerDiv.innerHTML = buttonsHTML;

        // Bind eventos
        const cancelBtn = modal.element.querySelector('.modal-cancel');
        const confirmBtn = modal.element.querySelector('.modal-confirm');
        const form = modal.element.querySelector('#modalPrioridadForm');

        // Sincronizar color picker con input de texto
        const colorPicker = form.querySelector('input[type="color"]');
        const colorHex = form.querySelector('input[name="colorHex"]');
        
        colorPicker.addEventListener('input', () => {
            colorHex.value = colorPicker.value;
        });
        
        colorHex.addEventListener('input', () => {
            if (/^#[0-9A-Fa-f]{6}$/.test(colorHex.value)) {
                colorPicker.value = colorHex.value;
            }
        });

        cancelBtn.addEventListener('click', () => modal.close());

        confirmBtn.addEventListener('click', async () => {
            const payload = serializeForm(form);
            
            if (!payload.nombre?.trim()) {
                showToast('Nombre requerido');
                return;
            }
            if (!payload.color) {
                showToast('Color requerido');
                return;
            }
            if (!payload.orden) {
                showToast('Orden requerido');
                return;
            }

            try {
                await createPrioridad({
                    Nombre: payload.nombre.trim(),
                    Nivel: parseInt(payload.orden),
                    Descripcion: payload.descripcion?.trim() || null
                });
                
                showToast('Prioridad creada correctamente');
                modal.close();
                
                if (onCreated) {
                    onCreated(payload);
                }
            } catch (err) {
                showToast(`Error al crear prioridad: ${err.message}`);
            }
        });

        return modal;
    }

    static async mostrarModalEstadoAlerta(onCreated = null) {
        const content = `
            <form id="modalEstadoAlertaForm" novalidate>
                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-800">Nombre *</label>
                        <input type="text" name="nombre" class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                               placeholder="Pendiente" required>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-800">Color</label>
                        <div class="flex items-center gap-4">
                            <input type="color" name="color" class="w-16 h-12 border-2 border-gray-200 rounded-lg cursor-pointer" value="#3B82F6">
                            <div class="flex-1">
                                <p class="text-xs text-gray-500 flex items-center">
                                    <i class="bi bi-palette mr-1"></i>
                                    Color para identificar el estado visualmente
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-800">Descripción</label>
                        <textarea name="descripcion" class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none" 
                                  rows="3" placeholder="Descripción del estado de alerta..."></textarea>
                        <p class="text-xs text-gray-500 flex items-center">
                            <i class="bi bi-info-circle mr-1"></i>
                            Opcional - Para mayor claridad
                        </p>
                    </div>
                </div>
            </form>
        `;

        const modal = Modal.quick('Nuevo Estado de Alerta', content, null, null);
        
        // Agregar botones personalizados
        const modalId = modal.element.id;
        const footerDiv = modal.element.querySelector(`#${modalId}-footer`);
        const buttonsHTML = `
            <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button type="button" class="modal-cancel px-4 py-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50 font-medium transition-colors border border-gray-300">
                    Cancelar
                </button>
                <button type="button" class="modal-confirm px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium transition-colors">Crear Estado
                </button>
            </div>
        `;
        footerDiv.innerHTML = buttonsHTML;

        // Bind eventos
        const cancelBtn = modal.element.querySelector('.modal-cancel');
        const confirmBtn = modal.element.querySelector('.modal-confirm');
        const form = modal.element.querySelector('#modalEstadoAlertaForm');

        cancelBtn.addEventListener('click', () => modal.close());

        confirmBtn.addEventListener('click', async () => {
            const payload = serializeForm(form);
            
            if (!payload.nombre?.trim()) {
                showToast('Nombre requerido');
                return;
            }

            try {
                await createEstadoAlerta({
                    Nombre: payload.nombre.trim(),
                    Color: payload.color || '#3B82F6',
                    Descripcion: payload.descripcion?.trim() || null
                });
                
                showToast('Estado de alerta creado correctamente');
                modal.close();
                
                if (onCreated) {
                    onCreated(payload);
                }
            } catch (err) {
                showToast(`Error al crear estado de alerta: ${err.message}`);
            }
        });

        return modal;
    }
}

export { CatalogModals };
