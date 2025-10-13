/**
 * Componentes UI Comunes para el Sistema de Residencias
 * Contiene funciones reutilizables para mantener consistencia visual
 */

/**
 * Genera el HTML del sidebar común para todas las páginas
 * @param {string} activePage - Nombre de la página activa ('dashboard', 'legajos', 'alertas', etc.)
 * @returns {string} HTML del sidebar
 */
export function generarSidebar(activePage = '') {
    const isActive = (page) => activePage === page ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700';
    const isSubmenuActive = (pages) => pages.includes(activePage) ? '' : 'hidden';
    const submenuChevron = (pages) => pages.includes(activePage) ? 'rotated' : '';
    
    return `
        <aside id="appSidebar" class="w-64 bg-white border-r rounded-lg mr-8 p-3 h-[100vh] sticky top-0 overflow-y-auto transition-all">
            <div class="mb-6 pb-4 border-b border-gray-200">
                <a href="./index.html" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <i class="bi bi-house-heart text-white text-xl"></i>
                    </div>
                    <div class="menu-text">
                        <div class="text-lg font-bold text-gray-900">Sistema</div>
                        <div class="text-xs text-gray-500">Residencias</div>
                    </div>
                </a>
            </div>
            <div class="flex items-center justify-between mb-3 px-2">
                <span class="text-xs font-semibold text-gray-400 tracking-wider menu-text">MENÚ</span>
                <button class="text-gray-500 hover:text-gray-700" title="Colapsar" onclick="toggleSidebar()">
                    <i class="bi bi-layout-sidebar-inset"></i>
                </button>
            </div>
            <nav class="space-y-1">
                <a href="./dashboard.html" class="flex items-center gap-3 px-3 py-2 rounded-md ${isActive('dashboard')}">
                    <i class="bi bi-speedometer2 text-xl"></i>
                    <span class="menu-text">Dashboard</span>
                </a>
                <a href="./legajos.html" class="flex items-center gap-3 px-3 py-2 rounded-md ${isActive('legajos')}">
                    <i class="bi bi-person-lines-fill text-xl"></i>
                    <span class="menu-text">Legajos</span>
                </a>
                <a href="./alertas.html" class="flex items-center gap-3 px-3 py-2 rounded-md ${isActive('alertas')}">
                    <i class="bi bi-bell-fill text-xl"></i>
                    <span class="menu-text">Alertas</span>
                </a>
                <button type="button" class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onclick="toggleSubmenu('submenuReportes', this)">
                    <span class="flex items-center gap-3">
                        <i class="bi bi-bar-chart-line text-xl"></i>
                        <span class="menu-text">Reportes</span>
                    </span>
                    <i class="bi bi-chevron-right chevron ${submenuChevron(['reportes_legajos', 'reportes_alertas'])}"></i>
                </button>
                <div id="submenuReportes" class="submenu pl-11 space-y-1 ${isSubmenuActive(['reportes_legajos', 'reportes_alertas'])}">
                    <a href="./reportes_legajos.html" class="block px-3 py-2 rounded-md ${isActive('reportes_legajos')}">Reportes de Legajos</a>
                    <a href="./reportes_alertas.html" class="block px-3 py-2 rounded-md ${isActive('reportes_alertas')}">Reportes de Alertas</a>
                </div>
                <button type="button" class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onclick="toggleSubmenu('submenuAcceso', this)">
                    <span class="flex items-center gap-3">
                        <i class="bi bi-person-circle text-xl"></i>
                        <span class="menu-text">Acceso</span>
                    </span>
                    <i class="bi bi-chevron-right chevron"></i>
                </button>
                <div id="submenuAcceso" class="submenu pl-11 space-y-1 hidden">
                    <a href="./auth.html" class="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">Login/Registro</a>
                </div>
                <button type="button" class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onclick="toggleSubmenu('submenuCatalogos', this)">
                    <span class="flex items-center gap-3">
                        <i class="bi bi-collection text-xl"></i>
                        <span class="menu-text">Configuraciones</span>
                    </span>
                    <i class="bi bi-chevron-right chevron ${submenuChevron(['ninos', 'estados', 'tutores', 'tipo-alerta', 'prioridad', 'estado-alerta'])}"></i>
                </button>
                <div id="submenuCatalogos" class="submenu pl-11 space-y-1 ${isSubmenuActive(['ninos', 'estados', 'tutores', 'tipo-alerta', 'prioridad', 'estado-alerta'])}">
                    <a href="./ninos.html" class="block px-3 py-2 rounded-md ${isActive('ninos')}">Niños</a>
                    <a href="./estados.html" class="block px-3 py-2 rounded-md ${isActive('estados')}">Estados</a>
                    <a href="./tutores.html" class="block px-3 py-2 rounded-md ${isActive('tutores')}">Tutores</a>
                    <a href="./tipo-alerta.html" class="block px-3 py-2 rounded-md ${isActive('tipo-alerta')}">Tipo Alerta</a>
                    <a href="./prioridad.html" class="block px-3 py-2 rounded-md ${isActive('prioridad')}">Prioridad</a>
                    <a href="./estado-alerta.html" class="block px-3 py-2 rounded-md ${isActive('estado-alerta')}">Estado Alerta</a>
                </div>
            </nav>
            <div class="mt-6 px-2">
                <span class="text-xs font-semibold text-gray-400 tracking-wider menu-text">OTROS</span>
            </div>
            <nav class="mt-2 space-y-1">
                <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                    <i class="bi bi-gear"></i>
                    <span class="menu-text">Ajustes</span>
                </a>
            </nav>
        </aside>
    `;
}

/**
 * Genera el HTML del toast mejorado
 * @returns {string} HTML del toast
 */
export function generarToast() {
    return `
        <div id="toastNotificacion" class="fixed bottom-4 right-4 bg-white shadow-2xl rounded-xl border-l-4 border-blue-500 hidden z-50 min-w-[320px] max-w-md animate-slide-in">
            <div class="flex items-start p-4">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i id="toastIcon" class="bi bi-info-circle-fill text-blue-600 text-xl"></i>
                    </div>
                </div>
                <div class="flex-1 ml-3">
                    <div class="font-bold text-gray-900" id="toastTitulo">Notificación</div>
                    <div id="toastMensaje" class="text-sm text-gray-600 mt-1"></div>
                </div>
                <button type="button" class="ml-4 text-gray-400 hover:text-gray-600 transition-colors" onclick="hideToast()">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="h-1 bg-gray-200 rounded-b-xl overflow-hidden">
                <div id="toastProgress" class="h-full bg-blue-500 transition-all duration-5000 ease-linear" style="width: 100%"></div>
            </div>
        </div>
    `;
}

/**
 * Genera estilos CSS comunes
 * @returns {string} CSS
 */
export function generarEstilosComunes() {
    return `
        <style>
            /* Sidebar */
            #appSidebar.collapsed { width: 64px; }
            #appSidebar.collapsed .menu-text { display: none; }
            #appSidebar.collapsed .submenu { display: none !important; }
            #appSidebar .chevron { transition: transform 0.2s ease; }
            #appSidebar .chevron.rotated { transform: rotate(90deg); }
            
            /* Animaciones */
            @keyframes slide-in {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .animate-slide-in { animation: slide-in 0.3s ease-out; }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .8; }
            }
            .badge-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            
            /* Scrollbar personalizada */
            .overflow-x-auto { scrollbar-width: thin; scrollbar-color: #CBD5E0 #EDF2F7; }
            .overflow-x-auto::-webkit-scrollbar { height: 8px; }
            .overflow-x-auto::-webkit-scrollbar-track { background: #EDF2F7; border-radius: 4px; }
            .overflow-x-auto::-webkit-scrollbar-thumb { background: #CBD5E0; border-radius: 4px; }
            .overflow-x-auto::-webkit-scrollbar-thumb:hover { background: #A0AEC0; }
            
            /* Modales */
            .modal-backdrop { backdrop-filter: blur(4px); }
        </style>
    `;
}

/**
 * Genera scripts comunes para todas las páginas
 * @returns {string} JavaScript
 */
export function generarScriptsComunes() {
    return `
        <script>
            let toastTimeout = null;
            let toastProgressInterval = null;

            function toggleModal(modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.toggle('hidden');
                    if (modal.classList.contains('hidden')) {
                        const form = modal.querySelector('form');
                        if (form) form.reset();
                    }
                }
            }

            function hideToast() {
                const toast = document.getElementById('toastNotificacion');
                if (toast) {
                    toast.classList.add('hidden');
                    if (toastTimeout) clearTimeout(toastTimeout);
                    if (toastProgressInterval) clearInterval(toastProgressInterval);
                }
            }

            function showToast(message, type = 'info', duration = 5000) {
                const toast = document.getElementById('toastNotificacion');
                const messageEl = document.getElementById('toastMensaje');
                const titleEl = document.getElementById('toastTitulo');
                const iconEl = document.getElementById('toastIcon');
                const progress = document.getElementById('toastProgress');
                
                if (!toast || !messageEl) return;
                
                if (toastTimeout) clearTimeout(toastTimeout);
                if (toastProgressInterval) clearInterval(toastProgressInterval);
                
                let icon = 'bi-info-circle-fill', title = 'Información';
                let colorClass = 'border-blue-500', bgClass = 'bg-blue-100';
                let textClass = 'text-blue-600', progressClass = 'bg-blue-500';
                
                if (type === 'success' || message.includes('✅')) {
                    icon = 'bi-check-circle-fill'; title = 'Éxito';
                    colorClass = 'border-green-500'; bgClass = 'bg-green-100';
                    textClass = 'text-green-600'; progressClass = 'bg-green-500';
                } else if (type === 'error' || message.includes('❌')) {
                    icon = 'bi-x-circle-fill'; title = 'Error';
                    colorClass = 'border-red-500'; bgClass = 'bg-red-100';
                    textClass = 'text-red-600'; progressClass = 'bg-red-500';
                } else if (type === 'warning' || message.includes('⚠️')) {
                    icon = 'bi-exclamation-triangle-fill'; title = 'Advertencia';
                    colorClass = 'border-yellow-500'; bgClass = 'bg-yellow-100';
                    textClass = 'text-yellow-600'; progressClass = 'bg-yellow-500';
                }
                
                const cleanMessage = message.replace(/[✅❌⚠️]/g, '').trim();
                messageEl.textContent = cleanMessage;
                titleEl.textContent = title;
                iconEl.className = \`bi \${icon} \${textClass} text-xl\`;
                iconEl.parentElement.className = \`w-10 h-10 \${bgClass} rounded-full flex items-center justify-center\`;
                toast.className = \`fixed bottom-4 right-4 bg-white shadow-2xl rounded-xl border-l-4 \${colorClass} z-50 min-w-[320px] max-w-md animate-slide-in\`;
                progress.className = \`h-full \${progressClass} transition-all ease-linear\`;
                progress.style.width = '100%';
                
                toast.classList.remove('hidden');
                
                let width = 100;
                const step = 100 / (duration / 50);
                toastProgressInterval = setInterval(() => {
                    width -= step;
                    if (width <= 0) clearInterval(toastProgressInterval);
                    progress.style.width = width + '%';
                }, 50);
                
                toastTimeout = setTimeout(() => hideToast(), duration);
            }

            function toggleSidebar() {
                document.getElementById('appSidebar').classList.toggle('collapsed');
            }

            function toggleSubmenu(id, btn) {
                const el = document.getElementById(id);
                if (!el) return;
                el.classList.toggle('hidden');
                const icon = btn && btn.querySelector('.chevron');
                if (icon) icon.classList.toggle('rotated');
            }

            // Cerrar modales al hacer clic fuera
            document.addEventListener('click', (e) => {
                const modals = document.querySelectorAll('[id^="modal"]');
                modals.forEach(modal => {
                    if (modal && !modal.classList.contains('hidden')) {
                        if (e.target === modal) {
                            toggleModal(modal.id);
                        }
                    }
                });
            });
        </script>
    `;
}

/**
 * Genera una tarjeta KPI moderna
 * @param {object} config - Configuración del KPI
 * @returns {string} HTML de la tarjeta
 */
export function generarKPI(config) {
    const { id, titulo, valor = 0, icono, colorFrom, colorTo, colorBg, colorIcon } = config;
    return `
        <div class="bg-gradient-to-br from-${colorFrom}-500 to-${colorTo}-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-${colorFrom}-100 text-sm font-medium mb-1">${titulo}</p>
                    <h3 class="text-4xl font-bold" id="${id}">${valor}</h3>
                </div>
                <div class="bg-${colorBg}-400 bg-opacity-30 rounded-full p-4">
                    <i class="bi ${icono} text-4xl"></i>
                </div>
            </div>
        </div>
    `;
}

