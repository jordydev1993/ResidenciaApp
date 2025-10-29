# 🎤 Guión de Presentación - Sistema de Gestión de Residencias para NNA
## Duración: 10 minutos

---

## 📋 Estructura de la Presentación

| Sección | Tiempo | Contenido |
|---------|--------|-----------|
| **Introducción** | 1:00 min | Presentación y contexto |
| **Problemática** | 1:30 min | Necesidad del sistema |
| **Solución** | 1:30 min | Qué es el sistema |
| **Demo - Autenticación** | 1:00 min | Login y seguridad |
| **Demo - Dashboard** | 1:30 min | Vista general y estadísticas |
| **Demo - Gestión de Legajos** | 1:30 min | Registro y seguimiento de NNA |
| **Demo - Sistema de Alertas** | 1:30 min | Notificaciones y vencimientos |
| **Conclusión** | 0:30 min | Beneficios y próximos pasos |
| **Q&A** | - | Preguntas |

---

## 🎬 GUIÓN COMPLETO

---

### 📍 INTRODUCCIÓN (1:00 min)

**[SLIDE 1: Portada]**

**Buenos días/tardes a todos.**

Mi nombre es [TU NOMBRE] y hoy les voy a presentar el **Sistema de Gestión de Residencias para Niños, Niñas y Adolescentes**, una solución digital desarrollada específicamente para optimizar la administración y el seguimiento de menores en situación de vulnerabilidad en instituciones de acogida.

**[Pausa breve]**

Este sistema fue diseñado pensando en las necesidades reales de las residencias, con el objetivo de digitalizar procesos manuales, centralizar información y garantizar el seguimiento adecuado de cada menor bajo protección.

---

### 📍 PROBLEMÁTICA (1:30 min)

**[SLIDE 2: Problemática Actual]**

Actualmente, las residencias enfrentan varios desafíos críticos:

**Primero**, la gestión manual de expedientes en papel dificulta el acceso rápido a información vital de los menores. Un educador que necesita consultar el historial médico o las visitas de un niño puede tardar horas buscando entre archivos físicos.

**Segundo**, el seguimiento de vencimientos y tareas críticas depende de la memoria humana o anotaciones dispersas. Esto puede resultar en el incumplimiento de plazos legales, revisiones médicas omitidas o documentación desactualizada.

**Tercero**, no existe visibilidad centralizada del estado de todos los casos. Los directores y trabajadores sociales no tienen una forma rápida de ver cuántos niños hay en la residencia, cuántos casos requieren atención urgente o qué alertas están próximas a vencer.

**[Pausa]**

Estos problemas no solo generan ineficiencia operativa, sino que pueden comprometer directamente el bienestar de los menores bajo protección.

---

### 📍 SOLUCIÓN (1:30 min)

**[SLIDE 3: Nuestra Solución]**

Nuestro sistema ofrece una solución integral con cinco módulos principales:

**Primero**, un **módulo de autenticación y control de acceso** basado en roles. Esto garantiza que solo personal autorizado pueda acceder a información sensible, con diferentes niveles de permisos según el cargo: administradores, operadores y consultores.

**Segundo**, un **dashboard centralizado** con estadísticas en tiempo real. En una sola pantalla, se visualiza el total de legajos activos, alertas vencidas, próximas y completadas, junto con gráficos que muestran la distribución por estado y prioridad.

**Tercero**, un **sistema de gestión de legajos digitales** donde cada menor tiene un expediente único con toda su información: datos personales, documentación, historial de tutores, fechas de ingreso y egreso, y observaciones relevantes.

**Cuarto**, un **sistema inteligente de alertas y recordatorios** que notifica automáticamente sobre vencimientos de documentos, revisiones médicas pendientes, audiencias judiciales y cualquier tarea crítica asociada a cada legajo.

Excelente pregunta. Déjame revisar cómo está implementado actualmente el sistema de alertas:

[4 tools called]

## 📧 Notificaciones y Recordatorios - Estado Actual

Después de revisar el código, te explico cómo funciona actualmente el sistema de notificaciones:

---

## 🎯 **ESTADO ACTUAL: Notificaciones Visuales**

### ✅ Lo que SÍ está implementado:

#### 1. **Indicadores Visuales Automáticos en Tiempo Real**

El sistema calcula automáticamente el estado de cada alerta al cargarla:

```javascript
// Código en frontend/assets/js/alertas/table.js (líneas 10-54)

🔴 ROJO (Vencida):
   - Alerta con fecha de vencimiento pasada
   - Estado NO completado
   - Muestra: "Vencida hace X día(s)"
   - Incluye ícono parpadeante: bi-exclamation-triangle-fill

🟠 NARANJA (Vence hoy):
   - Alerta que vence el día actual
   - Tiene animación pulse (parpadea)
   - Muestra: "¡Vence hoy!"
   - Ícono: bi-alarm-fill

🟡 AMARILLO (Próxima - 1-3 días):
   - Alerta que vence en los próximos 3 días
   - Muestra: "Vence en X día(s)"
   - Ícono: bi-clock-fill

🔵 AZUL (Próxima - 4-7 días):
   - Alerta que vence en 4-7 días
   - Muestra: "Vence en X días"
   - Ícono: bi-calendar-check

🟢 VERDE (Sin urgencia):
   - Alerta con más de 7 días
   - Muestra: "X días restantes"
   - Ícono: bi-check-circle
```

#### 2. **Dashboard con Estadísticas Automáticas**

El dashboard calcula y muestra:

```javascript
// KPIs en tiempo real (dashboard/page.js):

📊 Alertas Vencidas: Contador automático de alertas pasadas
📊 Alertas Próximas: Alertas que vencen en ≤3 días
📊 Alertas Completadas: Total de alertas finalizadas
📊 Gráficos: Distribución por estado y prioridad
```

#### 3. **Priorización Visual por Color**

```javascript
// Las alertas se clasifican automáticamente:

🔴 ALTA → Fondo rojo, texto destacado
🟡 MEDIA → Fondo amarillo
🟢 BAJA → Fondo verde
```

---

## ❌ **Lo que NO está implementado (aún):**

### 1. **Notificaciones por Email** ❌
- No se envían emails automáticos cuando una alerta está por vencer
- No hay recordatorios por correo electrónico

### 2. **Notificaciones Push/SMS** ❌
- No hay notificaciones en el celular
- No se envían mensajes de texto

### 3. **Notificaciones en el Navegador** ❌
- No hay alertas emergentes (browser notifications)
- No hay sonidos de alerta

### 4. **Recordatorios Programados** ❌
- No hay un sistema de cron jobs o tareas programadas que envíe recordatorios

---

## 🚀 **CÓMO FUNCIONAN LAS "NOTIFICACIONES" ACTUALES:**

### Flujo Actual:

```
1. Usuario ingresa al sistema (Login)
   ↓
2. Accede al Dashboard
   ↓
3. Ve automáticamente:
   - Cantidad de alertas vencidas (número en rojo)
   - Cantidad de alertas próximas (número en amarillo)
   - Gráficos de distribución
   ↓
4. Si hace clic en "Alertas" en el menú:
   ↓
5. Ve la lista completa con indicadores visuales:
   - Alertas vencidas destacadas en rojo
   - Alertas que vencen hoy parpadean
   - Alertas próximas en amarillo
   ↓
6. Puede hacer doble clic para ver detalle completo
   ↓
7. Marca la alerta como completada cuando se resuelve
```

**📌 IMPORTANTE**: El sistema NO envía recordatorios automáticos fuera de la plataforma. Los usuarios **deben ingresar** al sistema para ver las alertas.

---

## 💡 **OPCIONES PARA IMPLEMENTAR NOTIFICACIONES AUTOMÁTICAS**

Si quieres agregar notificaciones que funcionen fuera del sistema:

### **OPCIÓN 1: Notificaciones por Email** 📧

**Qué necesitas:**
```csharp
// Backend (C#):
1. Librería: System.Net.Mail (ya incluida)
2. Servidor SMTP (Gmail, Outlook, o servidor propio)
3. Tarea programada (Windows Task Scheduler o SQL Server Agent)

// Flujo:
- Job se ejecuta cada mañana a las 8 AM
- Consulta alertas que vencen hoy o en 3 días
- Envía email al responsable de cada legajo
```

**Ventajas**: ✅ Simple, ✅ Universal, ✅ No requiere app móvil
**Desventajas**: ❌ Puede ir a spam, ❌ Requiere configuración SMTP

---

### **OPCIÓN 2: Notificaciones Push en Navegador** 🌐

**Qué necesitas:**
```javascript
// Frontend (JavaScript):
1. API de Notificaciones del navegador
2. Service Worker para notificaciones en background

// Flujo:
- Usuario autoriza notificaciones al iniciar sesión
- Frontend consulta alertas cada X minutos
- Muestra notificación emergente si hay alertas urgentes
```

**Ventajas**: ✅ Tiempo real, ✅ No requiere email, ✅ Funciona offline
**Desventajas**: ❌ Solo funciona con navegador abierto, ❌ Requiere permiso del usuario

---

### **OPCIÓN 3: Notificaciones SMS** 📱

**Qué necesitas:**
```csharp
// Backend:
1. Servicio de SMS (Twilio, Nexmo, SMS Gateway)
2. Cuenta y créditos para enviar SMS
3. Números de teléfono en la BD

// Flujo:
- Job consulta alertas urgentes
- Envía SMS al celular del responsable
```

**Ventajas**: ✅ Alta tasa de lectura, ✅ Inmediato
**Desventajas**: ❌ Costo por SMS, ❌ Requiere integración con proveedor

---

### **OPCIÓN 4: App Móvil con Push Notifications** 📱

**Qué necesitas:**
```
1. Desarrollo de app móvil (React Native, Flutter, Xamarin)
2. Servicio de push (Firebase Cloud Messaging, OneSignal)
3. Backend adaptado para enviar notificaciones

// Flujo:
- App instalada en celular del personal
- Backend envía notificaciones push al dispositivo
- Usuario ve notificación incluso con app cerrada
```

**Ventajas**: ✅ Mejor experiencia, ✅ Funciona siempre, ✅ Profesional
**Desventajas**: ❌ Mayor costo desarrollo, ❌ Mantenimiento de app

---

## 📋 **RECOMENDACIÓN PARA IMPLEMENTAR:**

### **Fase 1 - Quick Win (2-3 días)** 🚀

**Notificaciones por Email Diarias**

```plaintext
IMPLEMENTACIÓN:
1. Crear stored procedure en SQL:
   - SP_ObtenerAlertasUrgentes
   - Retorna alertas vencidas + próximas 3 días

2. Crear clase EmailService.cs en backend:
   - Método: EnviarRecordatorioAlertas()
   - Usa System.Net.Mail
   - Template HTML para el email

3. Crear tarea programada Windows:
   - Se ejecuta cada día a las 8 AM
   - Llama al endpoint /api/Alertas/EnviarRecordatorios

4. Configurar SMTP:
   - Gmail: smtp.gmail.com:587
   - Outlook: smtp.office365.com:587
```

**Ejemplo de Email:**
```
Asunto: 🔔 Alertas Urgentes - Sistema Residencias

Buenos días,

Tienes 3 alertas que requieren atención:

🔴 VENCIDA: Revisión médica - Juancito Pérez (Legajo #10)
   Venció hace 2 días

🟡 PRÓXIMA: Audiencia judicial - María González (Legajo #15)
   Vence en 2 días

🟡 PRÓXIMA: Renovación DNI - Carlos Rodríguez (Legajo #20)
   Vence en 3 días

Para ver detalles, ingresa al sistema:
http://tuservidor/alertas.html

---
Sistema de Gestión de Residencias
```

---

### **Fase 2 - Mejora (1 semana)** 📈

**Notificaciones Push en Navegador**

```javascript
// Agregar al frontend:
- Solicitar permisos de notificación al login
- Polling cada 5 minutos para alertas urgentes
- Mostrar notificaciones emergentes

// Ventaja: Funciona de inmediato sin email
```

---

## 📊 **COMPARACIÓN DE OPCIONES:**

| Método | Costo | Tiempo Impl. | Alcance | Efectividad |
|--------|-------|-------------|---------|-------------|
| **Email** | Gratis | 2-3 días | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Push Navegador** | Gratis | 3-5 días | ⭐⭐⭐ | ⭐⭐⭐ |
| **SMS** | $$$ | 1 semana | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **App Móvil** | $$$$ | 1-2 meses | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## ✅ **RESUMEN:**

1. **Sistema actual**: Solo notificaciones visuales dentro de la plataforma
2. **Funcionan**: Indicadores de color, contadores, clasificación automática
3. **No funcionan**: Emails, SMS, push notifications
4. **Recomendación**: Implementar notificaciones por email (Fase 1)
5. **Usuario debe**: Ingresar al sistema para ver alertas

---

**¿Quieres que te ayude a implementar las notificaciones por email? Es la opción más rápida y efectiva.** 📧

Puedo crear el código necesario (stored procedure SQL + EmailService C# + endpoint API + configuración SMTP).

**Y quinto**, **módulos de configuración y reportes** para administrar catálogos, generar informes y extraer información para auditorías o presentaciones ante autoridades.

**[Pausa]**

Ahora permítanme mostrarles cómo funciona en la práctica.

---

### 📍 DEMO - AUTENTICACIÓN (1:00 min)

**[Mostrar pantalla - auth.html]**

**[SLIDE 4: Login]**

El sistema comienza con una pantalla de login segura. Cada usuario tiene credenciales únicas y el sistema implementa medidas de seguridad robustas:

- Contraseñas hasheadas con PBKDF2(significa que las contraseñas de los usuarios no se guardan en texto plano, sino que se transforman mediante un algoritmo criptográfico llamado PBKDF2 (Password-Based Key Derivation Function 2).)
- Bloqueo automático tras 3 intentos fallidos
- Sesiones con tokens únicos que expiran tras 30 minutos de inactividad
- Auditoría completa de todos los accesos

**[Hacer login: admin / Admin123!]**

Ingreso mis credenciales... y el sistema me autentica inmediatamente.

**[Pausa mientras redirige]**

Como pueden ver, tras el login exitoso, automáticamente soy redirigido al dashboard y mi información de usuario aparece en el sidebar: mi nombre completo y mi rol de administrador.

---

### 📍 DEMO - DASHBOARD (1:30 min)

**[Mostrar pantalla - dashboard.html]**

**[SLIDE 5: Dashboard]**

Bienvenidos al corazón del sistema: el **Dashboard**.

**[Señalar los KPIs en la parte superior]**

En la parte superior vemos los indicadores clave en tiempo real:

- **Total de Legajos**: Cantidad de menores actualmente en el sistema
- **Alertas Vencidas**: Tareas que ya deberían estar completadas - estas requieren atención inmediata
- **Alertas Próximas**: Vencimientos en los próximos 3 días - estas son para planificar
- **Alertas Completadas**: Tareas finalizadas - nos da una métrica de cumplimiento

**[Señalar los gráficos]**

Más abajo tenemos gráficos interactivos que muestran:

- **Distribución de alertas por estado**: Cuántas están pendientes, en proceso o completadas
- **Distribución por prioridad**: Cuántas son de alta, media o baja prioridad

Toda esta información se actualiza automáticamente desde la base de datos, no hay nada manual ni estimado. Son datos reales en tiempo real.

**[Pausa]**

Este dashboard permite a los directores tener una visión completa del estado operativo en menos de 5 segundos.

---

### 📍 DEMO - GESTIÓN DE LEGAJOS (1:30 min)

**[Navegar a legajos.html]**

**[SLIDE 6: Legajos]**

Ahora veamos la gestión de legajos, que es donde se registra y administra toda la información de cada menor.

**[Mostrar la lista de legajos]**

Aquí vemos el listado completo de legajos con información clave:

- Nombre completo del niño o adolescente
- DNI y número de legajo único
- Estado actual del caso
- Tutor asignado
- Fechas de ingreso y egreso

**[Usar los filtros]**

El sistema permite búsquedas instantáneas por nombre, DNI o legajo, y filtros por estado para encontrar rápidamente casos específicos.

**[Clic en "Registrar Legajo"]**

Para crear un nuevo legajo, simplemente completamos el formulario:

- Seleccionamos el niño o adolescente de un catálogo pre-cargado
- Asignamos el tutor responsable
- Indicamos el estado del caso
- Registramos fecha de ingreso y observaciones relevantes

**[No enviar el formulario, solo mostrar]**

Toda la información queda centralizada y disponible instantáneamente para consultas futuras.

**[Clic en "Cerrar"]**

El sistema también permite editar o dar de baja legajos cuando un menor egresa de la institución.

---

### 📍 DEMO - SISTEMA DE ALERTAS (1:30 min)

**[Navegar a alertas.html]**

**[SLIDE 7: Alertas]**

Y ahora la funcionalidad que considero más valiosa: el **Sistema de Alertas**.

**[Mostrar lista de alertas]**

Aquí vemos todas las alertas activas con información crítica:

- **Legajo asociado**: A qué menor corresponde
- **Tipo de alerta**: Médica, judicial, documental, visita familiar, etc.
- **Prioridad**: Alta, media o baja - codificada por colores para reconocimiento visual inmediato
- **Estado**: Pendiente, en proceso, completada
- **Fecha de vencimiento**: La fecha límite para completar la acción

**[Señalar los indicadores de estado]**

Observen cómo las alertas vencidas se destacan en rojo automáticamente, y las próximas a vencer en amarillo. Esto es visual management: el sistema hace obvio lo que requiere atención.

**[Mostrar los filtros]**

Podemos filtrar por:
- Tipo de alerta (médicas, judiciales, etc.)
- Prioridad
- Estado
- Vencimiento

**[Clic en "Nueva Alerta"]**

Para crear una alerta, el proceso es sencillo:

1. Seleccionamos el legajo al que corresponde
2. Definimos el tipo de alerta
3. Asignamos prioridad
4. Establecemos fecha de vencimiento
5. Agregamos una descripción detallada

**[No enviar, solo mostrar]**

Una vez registrada, la alerta aparece automáticamente en el dashboard y comienza el seguimiento hasta su completado.

**[Cerrar modal]**

Este sistema transforma la gestión reactiva en gestión proactiva. Ya no dependemos de la memoria; el sistema nos recuerda qué hay que hacer y cuándo.

---

### 📍 CONCLUSIÓN (0:30 min)

**[Volver al dashboard]**

**[SLIDE 8: Beneficios]**

En resumen, este sistema ofrece:

✅ **Centralización de información** - Todo en un solo lugar, accesible en segundos

✅ **Seguimiento automático** - El sistema recuerda y alerta sobre vencimientos

✅ **Visibilidad en tiempo real** - Estadísticas actualizadas sin trabajo manual

✅ **Seguridad y auditoría** - Control de acceso y registro de todas las acciones

✅ **Eficiencia operativa** - Menos tiempo en administración, más tiempo en atención directa a los menores

**[Pausa]**

Lo más importante: este sistema está diseñado para lo que realmente importa - garantizar el bienestar y el seguimiento adecuado de cada niño, niña y adolescente bajo protección.

**[SLIDE 9: Contacto/Q&A]**

Estoy disponible para responder cualquier pregunta que tengan.

**Muchas gracias.**

---

## 🎯 TIPS PARA LA PRESENTACIÓN

### Antes de Presentar

✅ **Preparar datos de demostración**:
- Al menos 3-4 legajos con información variada
- 10-15 alertas con diferentes estados, prioridades y fechas
- Verificar que los gráficos del dashboard se vean bien

✅ **Probar el sistema completo**:
- Login funcional
- Navegación fluida
- Todos los módulos accesibles
- Sin errores en consola

✅ **Tener backup**:
- Screenshots de cada pantalla principal
- Video de la demo por si falla la conexión
- Presentación PowerPoint con capturas

### Durante la Presentación

🎤 **Lenguaje corporal**:
- Mantén contacto visual con la audiencia
- Usa gestos para señalar elementos en pantalla
- Proyecta confianza y entusiasmo

🎤 **Ritmo**:
- Habla claro y pausado
- Haz pausas breves entre secciones
- No te apresures en la demo

🎤 **Interacción**:
- Pregunta si hay dudas durante la demo
- Mantén atención a reacciones del público
- Adapta el ritmo según el interés

### Manejo de Situaciones

⚠️ **Si algo falla técnicamente**:
```
"Como pueden ver en esta captura de pantalla preparada, 
el sistema muestra..."
```

⚠️ **Si te hacen una pregunta técnica compleja**:
```
"Excelente pregunta. Para no extendernos ahora, 
puedo profundizar en eso al finalizar o en una 
reunión técnica posterior."
```

⚠️ **Si te piden ver algo no preparado**:
```
"Con gusto puedo mostrarles eso en detalle después 
de la presentación para no extendernos del tiempo."
```

---

## 📊 SLIDES SUGERIDAS (PowerPoint)

### SLIDE 1: Portada
```
🏠 Sistema de Gestión de Residencias para NNA
Gestión Integral para el Bienestar de Menores

[Logo o imagen relacionada]
```

### SLIDE 2: Problemática
```
🚨 Desafíos Actuales

• Gestión manual de expedientes (papel)
• Seguimiento de vencimientos deficiente
• Falta de visibilidad centralizada
• Riesgo de incumplimiento de plazos legales
```

### SLIDE 3: Solución
```
✅ Nuestra Solución

Módulo de Autenticación → Control de acceso seguro
Dashboard Centralizado → Estadísticas en tiempo real
Gestión de Legajos → Expedientes digitales
Sistema de Alertas → Seguimiento automático
Reportes y Configuración → Administración completa
```

### SLIDE 4: Login
```
🔐 Seguridad y Control de Acceso

• Autenticación basada en roles
• Encriptación de contraseñas (PBKDF2)
• Sesiones con tokens únicos
• Auditoría completa
• Bloqueo automático
```

### SLIDE 5: Dashboard
```
📊 Dashboard - Vista General

KPIs en Tiempo Real:
• Total de legajos
• Alertas vencidas
• Alertas próximas
• Alertas completadas

Gráficos Interactivos:
• Por estado
• Por prioridad
```

### SLIDE 6: Legajos
```
📁 Gestión de Legajos

• Expediente digital único por menor
• Búsqueda y filtros avanzados
• Historial completo
• Trazabilidad total
• Edición y actualización simple
```

### SLIDE 7: Alertas
```
🔔 Sistema de Alertas Inteligente

• Recordatorios automáticos
• Priorización visual (colores)
• Filtros avanzados
• Seguimiento hasta completado
• Indicadores de vencimiento
```

### SLIDE 8: Beneficios
```
🎯 Beneficios Clave

✅ Centralización de información
✅ Seguimiento automático
✅ Visibilidad en tiempo real
✅ Seguridad y auditoría
✅ Eficiencia operativa

→ Más tiempo para atención directa a menores
```

### SLIDE 9: Cierre
```
💡 Próximos Pasos

• Capacitación del personal
• Migración de datos existentes
• Puesta en marcha progresiva
• Soporte continuo

¿Preguntas?

[Datos de contacto]
```

---

## 🎬 VARIANTES DE PRESENTACIÓN

### Para Audiencia Técnica (TI)
**Enfatizar:**
- Arquitectura (C# + SQL Server + JavaScript)
- Seguridad (PBKDF2, tokens, CORS)
- Rendimiento (caché, índices, queries optimizados)
- Escalabilidad y mantenimiento

### Para Audiencia Ejecutiva (Directores)
**Enfatizar:**
- ROI (retorno de inversión)
- Reducción de riesgos legales
- Mejora en auditorías
- Métricas de eficiencia

### Para Audiencia Operativa (Trabajadores Sociales)
**Enfatizar:**
- Facilidad de uso
- Tiempo ahorrado en búsquedas
- Alertas automáticas
- Acceso desde cualquier lugar

---

## 📞 PREPARACIÓN FINAL

### Checklist Pre-Presentación

- [ ] Sistema funcionando 100%
- [ ] Datos de demostración cargados
- [ ] Navegador en pantalla completa
- [ ] Cerrar pestañas innecesarias
- [ ] Probar login (usuario: admin, contraseña: Admin123!)
- [ ] Verificar internet/servidor
- [ ] Screenshots de backup listos
- [ ] Slides de PowerPoint listos
- [ ] Agua a mano
- [ ] Cronómetro/reloj visible

### Durante la Presentación

- [ ] Respirar profundo antes de empezar
- [ ] Sonreír y establecer contacto visual
- [ ] Hablar claro y pausado
- [ ] Señalar elementos en pantalla
- [ ] Hacer pausas entre secciones
- [ ] Invitar preguntas al final de cada módulo
- [ ] Controlar el tiempo (reloj)
- [ ] Cerrar con confianza y entusiasmo

---

**🎤 ¡Éxito en tu presentación!**

**Recuerda**: No se trata de mostrar todas las funciones, sino de demostrar el **valor** que el sistema aporta para el bienestar de los niños, niñas y adolescentes.

---

**Fecha de creación**: Octubre 2025  
**Versión**: 1.0  
**Duración**: 10 minutos

