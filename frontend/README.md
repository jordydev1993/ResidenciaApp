# 🏥 Sistema de Gestión de Residencias - Frontend

> **Frontend moderno y profesional** en HTML5, CSS3 y JavaScript vanilla con Tailwind CSS, Bootstrap Icons y Chart.js. Consume backend .NET/SQL Server vía API REST.

![Versión](https://img.shields.io/badge/versi%C3%B3n-2.0-blue)
![Estado](https://img.shields.io/badge/estado-producci%C3%B3n-green)
![Diseño](https://img.shields.io/badge/dise%C3%B1o-moderno-purple)

---

## ✨ Características Destacadas (v2.0)

### 🎨 Diseño Moderno Completo
- ✅ **Tooltips informativos** en toda la interfaz
- ✅ **Toast mejorado** con barra de progreso y tipos automáticos
- ✅ **16 KPIs visuales** con gradientes y animaciones
- ✅ **Modales modernos** con headers con gradiente
- ✅ **Tablas optimizadas** con iconos y scrollbar personalizada
- ✅ **Badges coloreados** para prioridades y estados
- ✅ **Sistema de vencimientos** con alertas visuales inteligentes
- ✅ **100% Responsive** (móvil, tablet, desktop)

### 🚀 Funcionalidades Principales
- **Gestión de Legajos**: Registro completo de niños y adolescentes
- **Sistema de Alertas**: Control de vencimientos con indicadores visuales
- **Dashboard Analytics**: Gráficos en tiempo real con Chart.js
- **Reportes Exportables**: PDF y Excel con filtros avanzados
- **Catálogos Configurables**: Estados, tipos, prioridades personalizables
- **Auditoría Completa**: Trazabilidad de usuarios y fechas

---

## 📂 Páginas del Sistema

### 🔷 Páginas Principales
| Página | Descripción | Estado |
|--------|-------------|--------|
| `dashboard.html` | Dashboard con KPIs y gráficos | ✅ |
| `alertas.html` | Gestión completa de alertas | ✅ |
| `legajos.html` | Administración de legajos | ✅ |
| `ninos.html` | Catálogo de NNA | ✅ |

### 🔷 Reportes y Exportación
| Página | Descripción | Estado |
|--------|-------------|--------|
| `reportes_alertas.html` | Reportes y gráficos de alertas | ✅ |
| `reportes_legajos.html` | Reportes de legajos | ✅ |

### 🔷 Configuraciones
| Página | Descripción | Estado |
|--------|-------------|--------|
| `tutores.html` | Catálogo de tutores | ✅ |
| `estados.html` | Catálogo de estados | ✅ |
| `tipo-alerta.html` | Tipos de alertas | ✅ |
| `prioridad.html` | Niveles de prioridad | ✅ |
| `estado-alerta.html` | Estados de alertas | ✅ |

---

## 🧱 Estructura del Proyecto

```
frontend/
├── index.html                      # Página principal
├── dashboard.html                  # Dashboard con analytics
├── alertas.html                    # Módulo de alertas
├── legajos.html                    # Módulo de legajos
├── ninos.html                      # Catálogo de niños
├── tutores.html                    # Catálogo de tutores
├── reportes_alertas.html           # Reportes de alertas
├── reportes_legajos.html           # Reportes de legajos
├── estados.html                    # Catálogo de estados
├── tipo-alerta.html                # Catálogo de tipos
├── prioridad.html                  # Catálogo de prioridades
├── estado-alerta.html              # Catálogo de estados de alerta
├── auth.html                       # Login/Registro
├── styles.css                      # Estilos base del proyecto
│
├── assets/
│   ├── css/
│   │   ├── main.css               # Estilos principales
│   │   └── tooltips.css           # 🆕 Sistema de tooltips moderno
│   │
│   └── js/
│       ├── utils/
│       │   ├── http.js            # Cliente HTTP con manejo de errores
│       │   ├── dom.js             # Helpers DOM y utilities
│       │   ├── modal.js           # Gestión de modales
│       │   └── common-ui.js       # 🆕 Componentes UI reutilizables
│       │
│       ├── api/
│       │   ├── legajosApi.js      # Endpoints de legajos
│       │   ├── alertasApi.js      # Endpoints de alertas
│       │   ├── ninoApi.js         # Endpoints de niños
│       │   ├── tutorApi.js        # Endpoints de tutores
│       │   └── authApi.js         # Autenticación
│       │
│       ├── alertas/
│       │   ├── page.js            # 🆕 Filtros y estadísticas
│       │   ├── table.js           # 🆕 Renderizado con badges
│       │   └── form.js            # 🆕 Validaciones y catálogos
│       │
│       ├── legajos/
│       │   ├── page.js            # Lógica de página
│       │   ├── table.js           # Renderizado de tabla
│       │   ├── form.js            # Formulario y validaciones
│       │   └── form-catalogos.js  # Modales de catálogos
│       │
│       ├── ninos/
│       │   └── page.js            # Gestión de niños
│       │
│       ├── tutores/
│       │   └── page.js            # Gestión de tutores
│       │
│       ├── dashboard/
│       │   ├── page.js            # 🆕 KPIs y estadísticas
│       │   └── charts.js          # Helpers de Chart.js
│       │
│       ├── reportes/
│       │   ├── alertasPage.js     # Reportes de alertas
│       │   └── legajosPage.js     # Reportes de legajos
│       │
│       └── [otros módulos]/
│
└── docs/
    ├── MODULO_ALERTAS_IMPLEMENTACION.md    # 🆕 Documentación módulo alertas
    └── IMPLEMENTACION_COMPLETA.md          # 🆕 Resumen completo del diseño

🆕 = Archivos nuevos o modificados en v2.0
```

---

## 🛠️ Tecnologías y Dependencias

### Core
- **HTML5** - Estructura semántica
- **CSS3** - Estilos avanzados (Grid, Flexbox, Animations)
- **JavaScript ES6+** - Módulos, async/await, arrow functions

### Frameworks y Librerías (CDN)
- **Tailwind CSS 3.x** - Framework de utilidades
- **Bootstrap Icons 1.10** - Iconografía completa
- **Chart.js** - Gráficos interactivos
- **jsPDF** - Exportación a PDF
- **xlsx** - Exportación a Excel

### Backend
- **.NET Core / ASP.NET** (API REST)
- **SQL Server** (Base de datos)

---

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
/* KPIs y Estados */
Vencidas:    gradient red-500 → red-600
Próximas:    gradient yellow-500 → yellow-600
Pendientes:  gradient blue-500 → blue-600
Completadas: gradient green-500 → green-600

/* Badges de Prioridad */
Alta:  bg-red-100 text-red-800 border-red-300
Media: bg-yellow-100 text-yellow-800 border-yellow-300
Baja:  bg-green-100 text-green-800 border-green-300

/* Botones */
Primario:   gradient blue-600 → blue-700
Success:    gradient green-600 → green-700
Danger:     gradient red-600 → red-700
Secondary:  bg-gray-500
```

### Componentes Principales

#### 1. Toast Mejorado ✨
- Barra de progreso visual
- 4 tipos automáticos (info, success, error, warning)
- Detección inteligente de emojis
- Animación slide-in

#### 2. Sistema de Tooltips ✨ NUEVO
- 4 posiciones (top, bottom, left, right)
- 4 tipos con colores
- Animaciones suaves
- Responsive

**Uso**:
```html
<button data-tooltip="Información útil" data-tooltip-position="bottom">
    Hover
</button>

<span class="tooltip-icon" data-tooltip="Ayuda" data-tooltip-type="info">?</span>
```

#### 3. Modales Modernos
- Header con gradiente azul/verde/rojo
- Iconos con fondo semi-transparente
- Formularios con espaciado consistente
- Botones con gradientes

#### 4. Tablas Optimizadas
- Header con gradiente
- Iconos en columnas
- Loading states animados
- Empty states visuales
- Scrollbar personalizada

---

## 🔌 Integración con API Backend

### Endpoints Principales

#### Alertas
```javascript
GET  /api/Alerta                    // Listar (filtros opcionales)
POST /api/Alerta                    // Crear nueva
POST /api/Alerta/{id}/completar     // Marcar completada
GET  /api/TipoAlerta                // Tipos de alerta
GET  /api/Prioridad                 // Prioridades
GET  /api/EstadoAlerta              // Estados
```

#### Legajos
```javascript
GET  /api/Legajo                    // Listar legajos
POST /api/Legajo                    // Crear legajo
GET  /api/Nino                      // Niños registrados
GET  /api/Tutor                     // Tutores
GET  /api/Estado                    // Estados de legajo
```

### Configuración de CORS

El backend debe permitir:
```csharp
// En Program.cs o Startup.cs
builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", builder => {
        builder.WithOrigins("http://localhost:5500")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

app.UseCors("AllowFrontend");
```

---

## ▶️ Ejecución Local

### Opción 1: Python (Recomendado)
```bash
# Navegar a la carpeta del proyecto
cd frontend

# Iniciar servidor
python -m http.server 5500
# o en Windows
py -m http.server 5500
```

Abre `http://localhost:5500` en tu navegador.

### Opción 2: Node.js
```bash
npx serve -l 5500
```

### Opción 3: Visual Studio Code
1. Instalar extensión "Live Server"
2. Click derecho en `index.html` → "Open with Live Server"

---

## 🎯 Módulo de Alertas - Alcances Implementados

### ⚙️ Propósito
- Registrar y controlar alertas por niño/legajo
- Clasificar por tipo, prioridad y estado
- Notificar vencimientos automáticamente
- Generar reportes y estadísticas
- Trazabilidad completa de acciones

### 🔔 Tipos de Alertas Soportadas
- **Médicas**: Turnos, tratamientos, vacunas
- **Judiciales**: Audiencias, vencimientos legales
- **Educativas**: Inscripciones, reuniones escolares
- **Psicológicas**: Sesiones terapéuticas
- **Familiares**: Visitas supervisadas
- **Generales**: Otros eventos importantes

### 📊 Indicadores Visuales de Vencimiento
- 🔴 **Vencida**: Fecha pasada, muestra días transcurridos
- 🟠 **Vence hoy**: Con animación pulse
- 🟡 **Próxima (1-3 días)**: Alerta temprana
- 🔵 **Semana (4-7 días)**: Información
- 🟢 **Vigente (>7 días)**: Estado normal

### 🔒 Seguridad y Auditoría
Cada alerta registra:
- Usuario creador y fecha de creación
- Usuario modificador y fecha de modificación
- Visible en modal de detalle
- Preparado para exportación en reportes

---

## 📊 Dashboard - KPIs Implementados

### Indicadores Generales
- **Legajos Activos**: Total de niños en residencia
- **Alertas Vencidas**: Requieren atención inmediata (rojo)
- **Próximas (3 días)**: Alerta temprana (amarillo)
- **Completadas**: Alertas resueltas (verde)

### Gráficos
- **Pie Chart**: Alertas por estado
- **Bar Chart**: Alertas por prioridad
- Colores dinámicos según datos
- Interactivos con Chart.js

### Accesos Rápidos
- Nuevo Legajo → `legajos.html`
- Nueva Alerta → `alertas.html`
- Ver Reportes → `reportes_legajos.html`

---

## 🎨 Guía de Uso de Tooltips

### Tooltips Básicos
```html
<!-- Tooltip simple -->
<button data-tooltip="Guardar cambios">Guardar</button>

<!-- Con posición específica -->
<button data-tooltip="Exportar a PDF" data-tooltip-position="bottom">PDF</button>

<!-- Con tipo/color -->
<button data-tooltip="¡Éxito!" data-tooltip-type="success">OK</button>
<button data-tooltip="Advertencia" data-tooltip-type="warning">!</button>
<button data-tooltip="Error" data-tooltip-type="error">X</button>
```

### Icono de Ayuda
```html
<label>
    Nombre del Campo
    <span class="tooltip-icon" data-tooltip="Información adicional" data-tooltip-type="info">?</span>
</label>
```

### Tooltips Multilínea
```html
<button data-tooltip="Primera línea&#10;Segunda línea" data-tooltip-multiline>
    Info
</button>
```

---

## 🧩 Componentes Reutilizables

### 1. Toast Mejorado
```javascript
// Uso en JavaScript
showToast('Operación exitosa', 'success');
showToast('Error al procesar', 'error');
showToast('Advertencia importante', 'warning');
showToast('Información general', 'info');

// Detección automática con emojis
showToast('✅ Guardado exitosamente');  // → tipo success
showToast('❌ Error al guardar');        // → tipo error
showToast('⚠️ Verificar datos');         // → tipo warning
```

### 2. Badges de Estado
```html
<!-- Alta prioridad -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
    <i class="bi bi-exclamation-circle-fill mr-1"></i>Alta
</span>

<!-- Media prioridad -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300">
    <i class="bi bi-exclamation-circle-fill mr-1"></i>Media
</span>

<!-- Baja prioridad -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
    <i class="bi bi-exclamation-circle-fill mr-1"></i>Baja
</span>
```

### 3. KPI Card
```html
<div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div class="flex items-center justify-between">
        <div>
            <p class="text-blue-100 text-sm font-medium mb-1">Total</p>
            <h3 class="text-4xl font-bold" id="totalKPI">0</h3>
        </div>
        <div class="bg-blue-400 bg-opacity-30 rounded-full p-4">
            <i class="bi bi-icon text-4xl"></i>
        </div>
    </div>
</div>
```

---

## 🔧 Configuración Rápida

### 1. Clonar o Descargar el Proyecto
```bash
git clone <repo-url>
cd frontend
```

### 2. Iniciar Servidor Local
```bash
# Con Python
python -m http.server 5500

# Con Node
npx serve -l 5500
```

### 3. Configurar Backend
Ver documentación en: `BACKEND_SETUP.md`

### 4. Acceder al Sistema
```
http://localhost:5500/dashboard.html
```

---

## 📖 Documentación Técnica

### Documentos Disponibles
- **`MODULO_ALERTAS_IMPLEMENTACION.md`** - Documentación completa del módulo de alertas
- **`IMPLEMENTACION_COMPLETA.md`** - Resumen ejecutivo del diseño moderno
- **`BACKEND_SETUP.md`** - Configuración del backend
- **`INFORME_ALCANCES_FUNCIONALES.md`** - Alcances funcionales del sistema
- **`BD.sql`** - Script de base de datos

### Ejemplos de Código
Todos los componentes están documentados con ejemplos de uso en:
- `IMPLEMENTACION_COMPLETA.md` (sección "Componentes")
- Código fuente de las páginas principales (comentarios inline)

---

## 🧪 Testing y Validación

### Navegadores Soportados
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Dispositivos
- ✅ Desktop (1920x1080, 1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667, 414x896)

### Características Responsive
- Grid adaptativo (1, 2, 4 columnas según viewport)
- Sidebar colapsable
- Modales con scroll interno
- Tablas con scroll horizontal
- Tooltips se ocultan en móvil

---

## 🚀 Roadmap y Mejoras Futuras

### En Desarrollo
- [ ] Edición de alertas existentes
- [ ] Eliminación de alertas con confirmación
- [ ] Historial de cambios por alerta
- [ ] Notificaciones push para vencimientos
- [ ] Adjuntos de archivos por alerta

### Planificado
- [ ] Dashboard avanzado con más gráficos
- [ ] Exportación masiva de datos
- [ ] Integración con calendario externo
- [ ] Sistema de comentarios en alertas
- [ ] Asignación de responsables
- [ ] Modo oscuro (dark mode)

---

## 🐛 Solución de Problemas

### CORS Error
Si aparece error de CORS:
1. Verificar que el backend tenga CORS habilitado
2. Confirmar que el origin coincida (`http://localhost:5500`)
3. Verificar headers permitidos

### Datos no se Cargan
1. Verificar que el backend esté ejecutándose
2. Abrir DevTools → Network para ver requests
3. Verificar que las rutas de API coincidan
4. Revisar console para errores

### Estilos no se Aplican
1. Verificar que Tailwind CSS esté cargando (CDN)
2. Limpiar caché del navegador
3. Verificar que `assets/css/tooltips.css` esté vinculado

---

## 👥 Contribución

### Estructura de Commits
```
feat: Nueva funcionalidad
fix: Corrección de bug
style: Cambios de estilo (CSS)
docs: Documentación
refactor: Refactorización de código
```

### Estándares de Código
- **Indentación**: 4 espacios
- **Nomenclatura**: camelCase para JS, kebab-case para IDs HTML
- **Comentarios**: JSDoc para funciones
- **Idioma**: Español para UI, código en español/inglés mixto

---

## 📄 Licencia

MIT License - Ver LICENSE para más detalles

---

## 📞 Soporte

Para dudas o consultas:
- Revisar documentación en `/docs`
- Consultar código de páginas de referencia: `alertas.html`, `ninos.html`
- Ver ejemplos en `IMPLEMENTACION_COMPLETA.md`

---

## ✅ Estado del Proyecto

**Versión Actual**: 2.0 (Diseño Moderno Completo)  
**Estado**: ✅ Listo para Producción  
**Cobertura**: 100% de páginas modernizadas  
**Última Actualización**: 2025-10-09

---

**Desarrollado con ❤️ para mejorar la gestión de residencias infantiles**
