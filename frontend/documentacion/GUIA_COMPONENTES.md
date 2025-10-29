# 🎨 Guía Rápida de Componentes - Copy & Paste

> Componentes listos para usar. Simplemente copia y pega en tu página.

---

## 🔔 Toast Mejorado

### HTML del Toast
```html
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
```

### JavaScript del Toast
```javascript
let toastTimeout = null;
let toastProgressInterval = null;

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
    iconEl.className = `bi ${icon} ${textClass} text-xl`;
    iconEl.parentElement.className = `w-10 h-10 ${bgClass} rounded-full flex items-center justify-center`;
    toast.className = `fixed bottom-4 right-4 bg-white shadow-2xl rounded-xl border-l-4 ${colorClass} z-50 min-w-[320px] max-w-md animate-slide-in`;
    progress.className = `h-full ${progressClass} transition-all ease-linear`;
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
```

### CSS del Toast
```html
<style>
    @keyframes slide-in {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in { animation: slide-in 0.3s ease-out; }
</style>
```

---

## 🎯 Tooltips

### Vincular CSS
```html
<link rel="stylesheet" href="assets/css/tooltips.css">
```

### Uso
```html
<!-- Básico -->
<button data-tooltip="Información útil">Hover</button>

<!-- Con posición -->
<button data-tooltip="Info" data-tooltip-position="bottom">Hover</button>
<button data-tooltip="Info" data-tooltip-position="left">Hover</button>
<button data-tooltip="Info" data-tooltip-position="right">Hover</button>

<!-- Con tipo/color -->
<button data-tooltip="¡Correcto!" data-tooltip-type="success">✓</button>
<button data-tooltip="¡Cuidado!" data-tooltip-type="warning">⚠</button>
<button data-tooltip="Error" data-tooltip-type="error">✗</button>
<button data-tooltip="Información" data-tooltip-type="info">ℹ</button>

<!-- Icono de ayuda -->
<span class="tooltip-icon" data-tooltip="Ayuda contextual" data-tooltip-type="info">?</span>
```

---

## 📊 KPI Card

```html
<!-- KPI Azul (General) -->
<div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div class="flex items-center justify-between">
        <div>
            <p class="text-blue-100 text-sm font-medium mb-1">Título</p>
            <h3 class="text-4xl font-bold" id="miKPI">0</h3>
        </div>
        <div class="bg-blue-400 bg-opacity-30 rounded-full p-4">
            <i class="bi bi-icon text-4xl"></i>
        </div>
    </div>
</div>

<!-- KPI Rojo (Alertas/Urgente) -->
<div class="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div class="flex items-center justify-between">
        <div>
            <p class="text-red-100 text-sm font-medium mb-1">Urgente</p>
            <h3 class="text-4xl font-bold" id="urgente">0</h3>
        </div>
        <div class="bg-red-400 bg-opacity-30 rounded-full p-4">
            <i class="bi bi-exclamation-triangle-fill text-4xl"></i>
        </div>
    </div>
</div>

<!-- KPI Verde (Completadas/Éxito) -->
<div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div class="flex items-center justify-between">
        <div>
            <p class="text-green-100 text-sm font-medium mb-1">Completadas</p>
            <h3 class="text-4xl font-bold" id="completadas">0</h3>
        </div>
        <div class="bg-green-400 bg-opacity-30 rounded-full p-4">
            <i class="bi bi-check-circle-fill text-4xl"></i>
        </div>
    </div>
</div>

<!-- KPI Amarillo (Advertencias) -->
<div class="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div class="flex items-center justify-between">
        <div>
            <p class="text-yellow-100 text-sm font-medium mb-1">Pendientes</p>
            <h3 class="text-4xl font-bold" id="pendientes">0</h3>
        </div>
        <div class="bg-yellow-400 bg-opacity-30 rounded-full p-4">
            <i class="bi bi-clock-fill text-4xl"></i>
        </div>
    </div>
</div>
```

---

## 🔘 Botones

```html
<!-- Primario (azul) -->
<button class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all">
    <i class="bi bi-check-circle-fill mr-2"></i>Aceptar
</button>

<!-- Success (verde) -->
<button class="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 shadow-lg transition-all">
    <i class="bi bi-save-fill mr-2"></i>Guardar
</button>

<!-- Danger (rojo) -->
<button class="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 shadow-lg transition-all">
    <i class="bi bi-trash-fill mr-2"></i>Eliminar
</button>

<!-- Secondary (gris) -->
<button class="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all">
    <i class="bi bi-x-circle mr-2"></i>Cancelar
</button>

<!-- Outline -->
<button class="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all">
    <i class="bi bi-funnel-fill mr-2"></i>Filtrar
</button>
```

---

## 📝 Campos de Formulario

```html
<!-- Input de texto -->
<div>
    <label class="block text-sm font-semibold text-gray-700 mb-2">
        <i class="bi bi-person-fill text-blue-600 mr-1"></i>Nombre *
        <span class="tooltip-icon ml-1" data-tooltip="Ayuda adicional" data-tooltip-type="info">?</span>
    </label>
    <input type="text" 
           class="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
           placeholder="Ingrese el nombre"
           required>
</div>

<!-- Select -->
<div>
    <label class="block text-sm font-semibold text-gray-700 mb-2">
        <i class="bi bi-tag-fill text-purple-600 mr-1"></i>Categoría *
    </label>
    <select class="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
        <option value="">Seleccionar...</option>
        <option value="1">Opción 1</option>
        <option value="2">Opción 2</option>
    </select>
</div>

<!-- Textarea -->
<div>
    <label class="block text-sm font-semibold text-gray-700 mb-2">
        <i class="bi bi-file-text text-green-600 mr-1"></i>Descripción
    </label>
    <textarea class="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              rows="4" 
              placeholder="Ingrese descripción"></textarea>
</div>

<!-- Date Input -->
<div>
    <label class="block text-sm font-semibold text-gray-700 mb-2">
        <i class="bi bi-calendar-event text-orange-600 mr-1"></i>Fecha *
    </label>
    <input type="date" 
           class="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
</div>

<!-- Color Picker -->
<div>
    <label class="block text-sm font-semibold text-gray-700 mb-2">
        <i class="bi bi-palette text-pink-600 mr-1"></i>Color
    </label>
    <input type="color" 
           class="w-full border-2 border-gray-300 rounded-lg px-2 py-2 h-[50px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
           value="#3B82F6">
</div>
```

---

## 📊 Tabla Mejorada

```html
<div class="bg-white shadow-lg rounded-xl overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">
                <i class="bi bi-table mr-2 text-gray-600"></i>Título de la Tabla
            </h2>
            <span class="text-sm text-gray-600">
                Total: <span id="totalRegistros" class="font-semibold text-blue-600">0</span>
            </span>
        </div>
    </div>
    
    <!-- Tabla -->
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <i class="bi bi-hash mr-1"></i>ID
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <i class="bi bi-person mr-1"></i>Nombre
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <i class="bi bi-gear mr-1"></i>Acciones
                    </th>
                </tr>
            </thead>
            <tbody id="miTabla" class="bg-white divide-y divide-gray-200">
                <!-- Loading State -->
                <tr>
                    <td colspan="3" class="px-6 py-12 text-center text-gray-500">
                        <div class="flex flex-col items-center justify-center">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p class="text-sm">Cargando datos...</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```

### Empty State para Tabla
```html
<div id="emptyState" class="hidden p-12 text-center">
    <div class="flex flex-col items-center justify-center text-gray-500">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i class="bi bi-inbox text-4xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No hay datos</h3>
        <p class="text-sm text-gray-600">Los registros aparecerán aquí</p>
    </div>
</div>
```

---

## 🎭 Modal Moderno

```html
<div id="miModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header con Gradiente -->
        <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="bg-white bg-opacity-20 rounded-lg p-2">
                        <i class="bi bi-plus-circle-fill text-2xl"></i>
                    </div>
                    <div>
                        <h5 class="text-xl font-bold">Título del Modal</h5>
                        <p class="text-blue-100 text-sm">Subtítulo descriptivo</p>
                    </div>
                </div>
                <button type="button" class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors" onclick="toggleModal('miModal')">
                    <i class="bi bi-x-lg text-2xl"></i>
                </button>
            </div>
        </div>
        
        <!-- Contenido -->
        <div class="p-6">
            <form id="miForm" class="space-y-5">
                <!-- Campos del formulario -->
            </form>
        </div>
        
        <!-- Footer con Botones -->
        <div class="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
            <button type="button" class="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors" onclick="toggleModal('miModal')">
                <i class="bi bi-x-circle mr-2"></i>Cancelar
            </button>
            <button type="submit" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all">
                <i class="bi bi-check-circle-fill mr-2"></i>Guardar
            </button>
        </div>
    </div>
</div>
```

### JavaScript para Modal
```javascript
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

// Cerrar al hacer click fuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('miModal');
    if (modal && !modal.classList.contains('hidden')) {
        if (e.target === modal) {
            toggleModal('miModal');
        }
    }
});
```

---

## 🏷️ Badges

```html
<!-- Prioridad Alta -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
    <i class="bi bi-exclamation-circle-fill mr-1"></i>Alta
</span>

<!-- Prioridad Media -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300">
    <i class="bi bi-exclamation-circle-fill mr-1"></i>Media
</span>

<!-- Prioridad Baja -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
    <i class="bi bi-exclamation-circle-fill mr-1"></i>Baja
</span>

<!-- Estado Completado -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
    <i class="bi bi-check-circle-fill mr-1"></i>Completada
</span>

<!-- Estado Pendiente -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
    <i class="bi bi-hourglass-split mr-1"></i>Pendiente
</span>

<!-- Estado En Proceso -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
    <i class="bi bi-arrow-repeat mr-1"></i>En Proceso
</span>
```

---

## 🔍 Filtros

```html
<div class="bg-white shadow-lg rounded-xl p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
            <i class="bi bi-funnel mr-2 text-gray-600"></i>Filtros
        </h3>
        <button id="btnLimpiar" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            <i class="bi bi-x-circle mr-1"></i>Limpiar filtros
        </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="bi bi-search text-blue-600 mr-1"></i>Búsqueda
            </label>
            <input type="text" 
                   id="filtroBusqueda" 
                   class="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                   placeholder="Buscar...">
        </div>
        <!-- Más filtros... -->
    </div>
</div>
```

---

## 📦 Info Box

```html
<!-- Info (azul) -->
<div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
    <div class="flex items-start">
        <i class="bi bi-info-circle-fill text-blue-500 mt-0.5 mr-2"></i>
        <div class="text-sm text-blue-700">
            <strong>Importante:</strong> Mensaje informativo aquí.
        </div>
    </div>
</div>

<!-- Success (verde) -->
<div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
    <div class="flex items-start">
        <i class="bi bi-check-circle-fill text-green-500 mt-0.5 mr-2"></i>
        <div class="text-sm text-green-700">
            <strong>Éxito:</strong> Operación completada.
        </div>
    </div>
</div>

<!-- Warning (amarillo) -->
<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
    <div class="flex items-start">
        <i class="bi bi-exclamation-triangle-fill text-yellow-500 mt-0.5 mr-2"></i>
        <div class="text-sm text-yellow-700">
            <strong>Advertencia:</strong> Verificar información.
        </div>
    </div>
</div>

<!-- Error (rojo) -->
<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
    <div class="flex items-start">
        <i class="bi bi-x-circle-fill text-red-500 mt-0.5 mr-2"></i>
        <div class="text-sm text-red-700">
            <strong>Error:</strong> Algo salió mal.
        </div>
    </div>
</div>
```

---

## 👤 Avatar con Iniciales

```html
<div class="flex items-center gap-2">
    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
        JP
    </div>
    <div>
        <div class="text-sm font-medium text-gray-900">Juan Pérez</div>
        <div class="text-xs text-gray-500">Legajo #123</div>
    </div>
</div>

<!-- Avatar grande -->
<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
    AP
</div>
```

---

## 🎯 Botones de Acción en Tabla

```html
<div class="flex items-center gap-2">
    <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
            data-tooltip="Ver detalle" 
            data-action="view">
        <i class="bi bi-eye-fill"></i>
    </button>
    <button class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
            data-tooltip="Editar" 
            data-action="edit">
        <i class="bi bi-pencil-fill"></i>
    </button>
    <button class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
            data-tooltip="Eliminar" 
            data-action="delete">
        <i class="bi bi-trash-fill"></i>
    </button>
</div>
```

---

## 📑 Títulos de Página

```html
<!-- Título principal -->
<div class="flex items-center justify-between mb-6">
    <div>
        <h1 class="text-3xl font-bold text-gray-900">
            <i class="bi bi-icon mr-2 text-blue-600"></i>Título de la Página
        </h1>
        <p class="text-sm text-gray-600 mt-1">Descripción de la página</p>
    </div>
    <button class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all">
        <i class="bi bi-plus-circle-fill mr-2"></i>Nueva Acción
    </button>
</div>

<!-- Título de sección -->
<h2 class="text-lg font-semibold text-gray-900 mb-4">
    <i class="bi bi-icon mr-2 text-blue-600"></i>Título de Sección
</h2>
```

---

## 🎨 Scrollbar Personalizada (CSS)

```html
<style>
    .overflow-x-auto {
        scrollbar-width: thin;
        scrollbar-color: #CBD5E0 #EDF2F7;
    }
    
    .overflow-x-auto::-webkit-scrollbar {
        height: 8px;
    }
    
    .overflow-x-auto::-webkit-scrollbar-track {
        background: #EDF2F7;
        border-radius: 4px;
    }
    
    .overflow-x-auto::-webkit-scrollbar-thumb {
        background: #CBD5E0;
        border-radius: 4px;
    }
    
    .overflow-x-auto::-webkit-scrollbar-thumb:hover {
        background: #A0AEC0;
    }
</style>
```

---

## 📱 Grid Responsive

```html
<!-- 1 columna en móvil, 2 en tablet, 4 en desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- KPIs o Cards -->
</div>

<!-- 1 columna en móvil, 3 en tablet, 5 en desktop -->
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
    <!-- Filtros -->
</div>

<!-- 1 columna en móvil, 2 en desktop -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Gráficos -->
</div>
```

---

## 🎨 Iconos Bootstrap más Usados

```html
<!-- Alertas y Estados -->
<i class="bi bi-bell-fill"></i>                 <!-- Alertas -->
<i class="bi bi-exclamation-triangle-fill"></i> <!-- Vencida/Urgente -->
<i class="bi bi-clock-fill"></i>                <!-- Próxima -->
<i class="bi bi-check-circle-fill"></i>         <!-- Completada -->
<i class="bi bi-hourglass-split"></i>           <!-- Pendiente -->

<!-- Personas -->
<i class="bi bi-person-fill"></i>               <!-- Persona -->
<i class="bi bi-people-fill"></i>               <!-- Grupo -->
<i class="bi bi-person-badge"></i>              <!-- Tutor -->
<i class="bi bi-person-lines-fill"></i>         <!-- Legajo -->

<!-- Acciones -->
<i class="bi bi-save-fill"></i>                 <!-- Guardar -->
<i class="bi bi-trash-fill"></i>                <!-- Eliminar -->
<i class="bi bi-pencil-fill"></i>               <!-- Editar -->
<i class="bi bi-eye-fill"></i>                  <!-- Ver -->
<i class="bi bi-plus-circle-fill"></i>          <!-- Agregar -->

<!-- Sistema -->
<i class="bi bi-table"></i>                     <!-- Tabla -->
<i class="bi bi-funnel"></i>                    <!-- Filtro -->
<i class="bi bi-search"></i>                    <!-- Buscar -->
<i class="bi bi-gear"></i>                      <!-- Configuración -->
<i class="bi bi-speedometer2"></i>              <!-- Dashboard -->

<!-- Archivos -->
<i class="bi bi-filetype-pdf"></i>              <!-- PDF -->
<i class="bi bi-filetype-xlsx"></i>             <!-- Excel -->
<i class="bi bi-file-earmark-text"></i>         <!-- Documento -->

<!-- Otros -->
<i class="bi bi-calendar-event"></i>            <!-- Fecha -->
<i class="bi bi-flag-fill"></i>                 <!-- Estado -->
<i class="bi bi-tag-fill"></i>                  <!-- Tipo -->
<i class="bi bi-palette"></i>                   <!-- Color -->
```

---

## 📝 Scripts Comunes

### Sidebar Colapsable
```javascript
function toggleSidebar() {
    document.getElementById('appSidebar').classList.toggle('collapsed');
}
```

### Submenú
```javascript
function toggleSubmenu(id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('hidden');
    const icon = btn && btn.querySelector('.chevron');
    if (icon) icon.classList.toggle('rotated');
}
```

---

## 🎓 Mejores Prácticas

### Consistencia Visual
- Usar siempre `rounded-xl` para contenedores grandes
- Usar `rounded-lg` para botones y campos
- Usar `rounded-full` para badges y avatares
- Mantener padding de `p-6` en cards
- Usar `gap-4` o `gap-6` en grids

### Animaciones
- Agregar `transition-all` a elementos interactivos
- Usar `hover:shadow-xl` en cards
- Agregar `animate-spin` en loading states
- Usar `cubic-bezier` para animaciones suaves

### Accesibilidad
- Siempre agregar tooltips informativos
- Usar iconos descriptivos
- Labels claros y concisos
- Focus states visibles (`focus:ring-2`)
- Colores con contraste adecuado

### Performance
- Debounce en búsquedas (500ms)
- Lazy loading para tablas grandes
- Event delegation para eventos de tabla
- CSS optimizado (Tailwind purge en producción)

---

## 📚 Referencias Rápidas

### Archivos de Referencia
- **Toast completo**: Ver `ninos.html` líneas 399-521
- **Modal moderno**: Ver `ninos.html` líneas 275-368
- **Tabla mejorada**: Ver `alertas.html` líneas 211-266
- **KPIs**: Ver `dashboard.html` líneas 117-163
- **Tooltips CSS**: Ver `assets/css/tooltips.css`

### Colores Tailwind Usados
```
blue:   50, 100, 500, 600, 700
green:  50, 100, 500, 600, 700
red:    50, 100, 500, 600, 700
yellow: 50, 100, 500, 600, 700
purple: 50, 100, 500, 600, 700
gray:   50, 100, 300, 400, 500, 600, 700, 900
```

---

**Versión**: 2.0 - Diseño Moderno Completo  
**Última Actualización**: 2025-10-09  
**Estado**: ✅ 100% Funcional

