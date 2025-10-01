# Sistema de Gestión de Residencias (Frontend)

Frontend modular en HTML, CSS y JavaScript (vanilla) con Bootstrap 5 y Chart.js. Consume un backend externo (.NET/Visual Studio) y base de datos SQL Server vía endpoints `/api/Legajo` y `/api/Alerta`.

## 🚀 Páginas

- `index.html`: portada con navegación
- `legajos.html`: gestión y listado de legajos NNA
- `alertas.html`: gestión y listado de alertas + métricas básicas
- `dashboard.html`: gráficos (Chart.js) de alertas por estado y prioridad

## 🧱 Estructura

```
crudResidenciaMvp/
├─ index.html
├─ legajos.html
├─ alertas.html
├─ dashboard.html
├─ styles.css                 # estilos existentes del proyecto
├─ assets/
│  ├─ css/
│  │  └─ main.css            # estilos base adicionales
│  └─ js/
│     ├─ utils/
│     │  ├─ http.js          # wrapper fetch + manejo de errores
│     │  └─ dom.js           # helpers DOM y toast
│     ├─ api/
│     │  ├─ legajosApi.js    # cliente API legajos
│     │  └─ alertasApi.js    # cliente API alertas
│     ├─ legajos/
│     │  ├─ form.js          # envío y validación
│     │  ├─ table.js         # render tabla
│     │  └─ page.js          # orquestación de la página
│     ├─ alertas/
│     │  ├─ form.js
│     │  ├─ table.js
│     │  └─ page.js
│     └─ dashboard/
│        ├─ charts.js        # helpers Chart.js
│        └─ page.js          # inicialización de gráficos
└─ README.md
```

## 🛠️ Tecnologías

- HTML5, CSS3, JavaScript ES Modules
- Bootstrap 5 + Bootstrap Icons (CDN)
- Chart.js (CDN)

## 🔌 Integración con API (externa)

La app consume estos endpoints desde tu backend en Visual Studio:

- Legajos
  - `GET /api/Legajo` → lista (admite `?q=` opcional)
  - `POST /api/Legajo` → crea un legajo
- Alertas
  - `GET /api/Alerta` → lista (admite filtros)
  - `POST /api/Alerta` → crea alerta
  - `GET /api/Alerta?groupBy=estado` → [{ label, value }]
  - `GET /api/Alerta?groupBy=prioridad` → [{ label, value }]

Si los paths o la forma de respuesta difieren, ajusta `assets/js/api/*.js`.

## ▶️ Ejecución local

Por CORS, se recomienda servir archivos con un servidor estático:

1) PowerShell (Windows) con Python instalado:
```
py -m http.server 5500
```
Abre `http://localhost:5500/legajos.html` (o `index.html`).

2) Node (opcional):
```
npx serve -l 5500
```

Asegúrate de habilitar CORS en el backend para el origen `http://localhost:5500`.

## 🧰 Configuración rápida del backend (referencia)

- Habilitar CORS (ej. ASP.NET Core): permitir origin del frontend, métodos GET/POST, headers `Content-Type`.
- Respuestas JSON para errores con `{ message: string }` (el frontend las muestra en toasts).

## 🧪 Validación y UX

- Validaciones mínimas en cliente (DNI, campos requeridos). Puedes ampliar desde `form.js`.
- Feedback con toasts (Bootstrap) y estados vacíos en tablas.

## 🔐 Seguridad (frontend)

- Sanitiza/escapa datos al renderizar si el backend devuelve HTML.
- No incluir secretos/tokens en el cliente. Si usas tokens, configúralos desde el backend (cookies/httpOnly) o variables de entorno del servidor que sirve la API.

## 📈 Roadmap sugerido

- Paginación y filtros avanzados server-side
- Edición/Eliminar legajos y alertas
- Estados y transiciones de alertas
- Exportaciones (CSV/Excel)

## 📄 Licencia

MIT

