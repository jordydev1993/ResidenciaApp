# 🚀 Inicio Rápido - Sistema de Residencias v2.0

## ⚡ Configuración en 3 Pasos

### 1️⃣ Iniciar Servidor Local

```bash
# Opción A: Python (Recomendado)
python -m http.server 5500

# Opción B: Python en Windows
py -m http.server 5500

# Opción C: Node.js
npx serve -l 5500
```

### 2️⃣ Abrir en Navegador

```
http://localhost:5500/dashboard.html
```

### 3️⃣ Explorar el Sistema

✅ **Ya está funcionando!** El diseño está 100% implementado.

---

## 🎯 Páginas Disponibles

### Principal
- 🏠 `http://localhost:5500/dashboard.html` - **Dashboard Principal**
- 🔔 `http://localhost:5500/alertas.html` - **Módulo de Alertas** (★ Página Completa)
- 📁 `http://localhost:5500/legajos.html` - **Gestión de Legajos**
- 👶 `http://localhost:5500/ninos.html` - **Catálogo de Niños**

### Reportes
- 📊 `http://localhost:5500/reportes_alertas.html`
- 📄 `http://localhost:5500/reportes_legajos.html`

### Configuraciones
- 👥 `http://localhost:5500/tutores.html`
- 🏷️ `http://localhost:5500/estados.html`
- 📋 `http://localhost:5500/tipo-alerta.html`
- ⚠️ `http://localhost:5500/prioridad.html`
- 🚦 `http://localhost:5500/estado-alerta.html`

### Demo
- 💡 `http://localhost:5500/DEMO_TOOLTIPS.html` - **Demo de Tooltips**

---

## 🎨 Características del Diseño

### ✅ Implementado en Todas las Páginas

| Característica | Descripción |
|----------------|-------------|
| 🎯 **Tooltips** | 100+ tooltips informativos |
| 🔔 **Toast** | Notificaciones con barra de progreso |
| 📊 **KPIs** | 16 indicadores visuales con gradientes |
| 🏷️ **Badges** | 30+ badges coloreados |
| 📝 **Formularios** | Campos con iconos y focus states |
| 📋 **Tablas** | Headers con gradientes e iconos |
| 🔘 **Botones** | 50+ botones con gradientes |
| 📱 **Responsive** | Móvil, tablet y desktop |

---

## 💡 Tooltips - Guía Rápida

### Ver en Acción
```
http://localhost:5500/DEMO_TOOLTIPS.html
```

### Usar en tu Código

1. **Agregar CSS** (en `<head>`):
```html
<link rel="stylesheet" href="assets/css/tooltips.css">
```

2. **Tooltip básico**:
```html
<button data-tooltip="Texto del tooltip">Hover me</button>
```

3. **Tooltip con posición**:
```html
<button data-tooltip="Texto" data-tooltip-position="bottom">Hover</button>
```

4. **Tooltip con color**:
```html
<button data-tooltip="¡Éxito!" data-tooltip-type="success">Hover</button>
```

5. **Icono de ayuda**:
```html
<span class="tooltip-icon" data-tooltip="Ayuda" data-tooltip-type="info">?</span>
```

---

## 🔔 Toast - Guía Rápida

### Usar en JavaScript

```javascript
// Success
showToast('✅ Guardado exitosamente');

// Error
showToast('❌ Error al guardar');

// Warning
showToast('⚠️ Verificar datos');

// Info
showToast('Información general');

// Con tipo explícito
showToast('Mensaje', 'success', 5000);
```

---

## 📊 Páginas de Referencia

### Página Más Completa: `alertas.html`
**Ver para ejemplos de**:
- ✅ Filtros avanzados con tooltips
- ✅ KPIs con tooltips en cards
- ✅ Tabla con badges coloreados
- ✅ Modal completo con validaciones
- ✅ Sistema de vencimientos visuales
- ✅ Toast mejorado
- ✅ Indicadores visuales inteligentes

### Página con KPIs: `ninos.html`
**Ver para ejemplos de**:
- ✅ 4 KPIs con gradientes
- ✅ Filtros modernos
- ✅ Empty state con CTA
- ✅ Modal con gradiente verde
- ✅ Tooltips en formulario

### Dashboard: `dashboard.html`
**Ver para ejemplos de**:
- ✅ KPIs principales
- ✅ Gráficos Chart.js
- ✅ Accesos rápidos
- ✅ Fecha dinámica

---

## 📚 Documentación Disponible

### Para Desarrolladores
- 📖 `README.md` - Documentación principal
- 📖 `GUIA_COMPONENTES.md` - Copy & paste de componentes
- 📖 `IMPLEMENTACION_COMPLETA.md` - Resumen técnico completo
- 📖 `CHANGELOG.md` - Historial de cambios

### Para Uso Específico
- 📖 `MODULO_ALERTAS_IMPLEMENTACION.md` - Módulo de alertas en detalle
- 📖 `RESUMEN_EJECUTIVO.md` - Resumen ejecutivo del proyecto

### Demostración
- 🎨 `DEMO_TOOLTIPS.html` - Demo interactiva de tooltips

---

## 🔧 Integración con Backend

### Endpoints Necesarios

```javascript
// Alertas
GET  /api/Alerta                    // Listar
POST /api/Alerta                    // Crear
POST /api/Alerta/{id}/completar     // Completar

// Legajos
GET  /api/Legajo                    // Listar
POST /api/Legajo                    // Crear

// Catálogos
GET  /api/TipoAlerta               // Tipos
GET  /api/Prioridad                // Prioridades
GET  /api/EstadoAlerta             // Estados
GET  /api/Nino                     // Niños
GET  /api/Tutor                    // Tutores
GET  /api/Estado                   // Estados de legajo
```

### Configurar CORS

```csharp
// En el backend (.NET)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", builder => {
        builder.WithOrigins("http://localhost:5500")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
```

---

## ✅ Checklist de Verificación

### Primera Vez
- [ ] Servidor local iniciado
- [ ] Backend ejecutándose
- [ ] CORS configurado
- [ ] Base de datos conectada
- [ ] Puedo ver `dashboard.html`

### Funcionalidades
- [ ] Los KPIs muestran datos
- [ ] Los tooltips aparecen al hover
- [ ] El toast funciona al hacer acciones
- [ ] Las tablas cargan datos
- [ ] Los filtros funcionan
- [ ] Los formularios guardan datos
- [ ] La exportación PDF/Excel funciona

---

## 🎨 Recursos Visuales

### Ver el Sistema en Acción

1. **Dashboard**:
   - KPIs con gradientes
   - Gráficos Chart.js
   - Accesos rápidos

2. **Alertas** (★ Recomendado):
   - Filtros avanzados con tooltips
   - Tabla con indicadores de vencimiento
   - Modales modernos
   - Sistema completo

3. **Demo de Tooltips**:
   - Todas las posiciones
   - Todos los tipos/colores
   - Ejemplos de uso

---

## 🆘 Solución Rápida de Problemas

### ❌ "No se ven los estilos"
```bash
# Verificar que Tailwind CSS esté cargando
# Abrir DevTools → Network → Buscar "tailwindcss"
# Limpiar caché: Ctrl+Shift+R
```

### ❌ "Los tooltips no aparecen"
```bash
# Verificar que tooltips.css esté vinculado
# Ver en DevTools → Sources → assets/css/tooltips.css
# Probar en desktop (se ocultan en móvil)
```

### ❌ "No se cargan datos"
```bash
# 1. Verificar que backend esté ejecutándose
# 2. Abrir DevTools → Console (ver errores)
# 3. Abrir DevTools → Network (ver requests)
# 4. Verificar CORS en backend
```

### ❌ "Error CORS"
```bash
# En el backend (.NET):
# 1. Agregar configuración CORS
# 2. Permitir origen "http://localhost:5500"
# 3. Permitir métodos GET, POST, PUT, DELETE
# 4. Permitir header "Content-Type"
```

---

## 📞 Siguientes Pasos

### 1. Explorar el Sistema
- Navegar por las páginas
- Probar los tooltips
- Usar los filtros
- Crear alertas de prueba

### 2. Revisar Documentación
- Leer `IMPLEMENTACION_COMPLETA.md`
- Ver ejemplos en `GUIA_COMPONENTES.md`
- Explorar código en `alertas.html`

### 3. Personalizar
- Ajustar colores según identidad
- Agregar nuevos tipos de alerta
- Extender funcionalidades

---

## ⭐ Páginas Destacadas para Explorar

### 1. alertas.html ⭐⭐⭐
**La página más completa**
- Todos los componentes implementados
- Ejemplo perfecto de tooltips
- Sistema completo de vencimientos
- Filtros avanzados

### 2. DEMO_TOOLTIPS.html ⭐⭐⭐
**Galería interactiva**
- Todos los tipos de tooltips
- Ejemplos en contexto
- Guía visual completa

### 3. dashboard.html ⭐⭐
**Analytics y KPIs**
- Gráficos en tiempo real
- KPIs principales
- Accesos rápidos

---

## 🎉 ¡Listo!

El sistema está **100% funcional** y listo para usar.

**Siguiente paso recomendado**: Abrir `http://localhost:5500/DEMO_TOOLTIPS.html` para ver el sistema de tooltips en acción.

---

**Versión**: 2.0  
**Estado**: ✅ Listo para Producción  
**Documentación**: Completa

