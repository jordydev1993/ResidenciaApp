export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export function setText(el, text) {
    if (!el) return;
    el.textContent = text;
}

export function renderHTML(el, html) {
    if (!el) return;
    el.innerHTML = html;
}

export function serializeForm(form) {
    const fd = new FormData(form);
    return Object.fromEntries(fd.entries());
}

export function showToast(message, type = 'info') {
    // Intentar usar Bootstrap si está disponible
    const toastEl = $('#toastNotificacion');
    const toastMsg = $('#toastMensaje');
    
    if (toastEl && toastMsg && typeof bootstrap !== 'undefined') {
        toastMsg.textContent = message;
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    } else {
        // Fallback simple sin Bootstrap
        createSimpleToast(message, type);
    }
}

function createSimpleToast(message, type) {
    // Crear toast simple
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 bg-white shadow-lg rounded-lg border p-4 z-50 max-w-sm`;
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'transform 0.3s ease';
    
    // Icono según tipo
    const iconClass = type === 'error' ? 'bi-exclamation-circle-fill text-red-500' : 
                     type === 'success' ? 'bi-check-circle-fill text-green-500' : 
                     'bi-info-circle-fill text-blue-500';
    
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="bi ${iconClass} mr-2"></i>
            <div class="flex-1">
                <div class="text-sm font-medium text-gray-900">${message}</div>
            </div>
            <button type="button" class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}


