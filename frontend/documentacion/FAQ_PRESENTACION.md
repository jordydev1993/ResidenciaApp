# ❓ FAQ - Preguntas y Respuestas para la Presentación

## 📚 Guía de Respuestas Preparadas

---

## 🔐 SEGURIDAD Y ACCESO

### P1: ¿Qué pasa si un usuario olvida su contraseña?

**Respuesta:**
```
"Excelente pregunta. El sistema tiene un módulo de recuperación de 
contraseñas que permite a los administradores resetear las credenciales 
de cualquier usuario. Por seguridad, las contraseñas nunca se pueden 
'recuperar' porque están encriptadas - solo se pueden generar nuevas.

Adicionalmente, podemos implementar un sistema de recuperación por 
email con enlaces de restablecimiento temporales si lo requieren."
```

---

### P2: ¿Pueden varios usuarios acceder simultáneamente al sistema?

**Respuesta:**
```
"Sí, absolutamente. El sistema está diseñado para múltiples usuarios 
concurrentes. Varios operadores pueden estar registrando legajos o 
alertas al mismo tiempo sin conflictos.

La base de datos SQL Server maneja automáticamente la concurrencia 
y garantiza la integridad de los datos. Cada acción queda registrada 
con el usuario que la realizó."
```

---

### P3: ¿Qué nivel de seguridad tiene el sistema?

**Respuesta:**
```
"El sistema implementa seguridad de nivel empresarial:

1. Contraseñas encriptadas con PBKDF2 (estándar bancario)
2. Sesiones con tokens únicos que expiran automáticamente
3. Bloqueo de cuenta tras 3 intentos fallidos
4. Prevención de SQL Injection
5. Auditoría completa de todos los accesos
6. Control de acceso basado en roles

Es el mismo nivel de seguridad que usan aplicaciones bancarias 
y sistemas de salud."
```

---

### P4: ¿Quién puede ver la información de los menores?

**Respuesta:**
```
"Solo personal autorizado con credenciales válidas. El sistema tiene 
tres niveles de acceso:

- ADMINISTRADOR: Acceso completo, gestión de usuarios
- OPERADOR: Puede crear, editar y completar legajos y alertas
- CONSULTOR: Solo lectura, para supervisores o auditorías

Cada acceso queda registrado en la auditoría, así sabemos quién 
consultó qué información y cuándo."
```

---

## 📊 FUNCIONALIDAD Y USO

### P5: ¿Cómo sabemos que una alerta está por vencer?

**Respuesta:**
```
"El sistema usa codificación visual automática:

🔴 ROJO: Alerta VENCIDA - requiere atención inmediata
🟡 AMARILLO: Alerta PRÓXIMA (vence en ≤3 días) - planificar
🟢 VERDE: Sin urgencia

Además, las alertas vencidas aparecen destacadas en el dashboard 
principal. Es imposible que pasen desapercibidas."
```

---

### P6: ¿Se puede buscar un legajo específico rápidamente?

**Respuesta:**
```
"Sí, el sistema tiene búsqueda instantánea por:

- Nombre y apellido del menor
- DNI
- Número de legajo
- Estado del caso
- Tutor asignado

Escribes las primeras letras y filtra automáticamente. Es como 
buscar un contacto en tu celular - inmediato."
```

---

### P7: ¿Qué pasa si se elimina algo por error?

**Respuesta:**
```
"El sistema tiene varias protecciones:

1. Confirmación antes de eliminar ("¿Está seguro?")
2. No se elimina físicamente - se marca como inactivo
3. Los administradores pueden recuperar registros
4. Todo queda en la auditoría (quién eliminó y cuándo)

Adicionalmente, se hacen backups automáticos de la base de 
datos diariamente, así que siempre se puede restaurar."
```

---

### P8: ¿Cómo se crean las alertas?

**Respuesta:**
```
"Muy simple - proceso de 4 pasos:

1. Seleccionar el legajo/menor al que corresponde
2. Definir tipo (médica, judicial, documental, etc.)
3. Asignar prioridad (alta, media, baja)
4. Establecer fecha de vencimiento y descripción

El sistema automáticamente la muestra en el dashboard y comienza 
el seguimiento. Lleva menos de 30 segundos crear una alerta."
```

---

## 💻 TÉCNICO E INFRAESTRUCTURA

### P9: ¿Necesitamos internet para que funcione?

**Respuesta:**
```
"Depende de la configuración:

OPCIÓN 1 - Red Local (LAN):
El sistema puede funcionar completamente en red interna sin 
internet. Solo necesitan que las computadoras estén conectadas 
a la misma red local de la residencia.

OPCIÓN 2 - Nube:
Si lo alojan en un servidor web, requiere internet pero permite 
acceso desde cualquier lugar.

Recomendamos empezar con red local por seguridad, y luego 
evaluar acceso remoto si lo necesitan."
```

---

### P10: ¿En qué computadoras funciona?

**Respuesta:**
```
"El sistema es una aplicación web, así que funciona en:

✅ Windows (7, 10, 11)
✅ Mac OS
✅ Linux
✅ Tablets (iPad, Android)

Solo necesitan un navegador moderno (Chrome, Edge, Firefox, Safari).
No hay que instalar nada en cada computadora - todo funciona desde 
el navegador."
```

---

### P11: ¿Qué pasa si se va la luz o se cae el sistema?

**Respuesta:**
```
"Buena pregunta sobre continuidad:

1. Los datos se guardan EN EL MOMENTO en que se envía el formulario
   No se pierde nada una vez guardado
   
2. Si se va la luz ANTES de guardar, se pierde solo ese formulario
   (igual que cualquier sistema)
   
3. Cuando vuelve la luz, el sistema sigue funcionando normalmente
   Todos los datos guardados están intactos
   
4. Hacemos backups automáticos diarios de la base de datos
   
Recomendación: Usar UPS (batería de respaldo) en el servidor 
para mayor seguridad."
```

---

### P12: ¿Cuántos legajos y alertas puede manejar el sistema?

**Respuesta:**
```
"El sistema está optimizado para instituciones grandes:

- Miles de legajos sin problemas de rendimiento
- Decenas de miles de alertas históricas
- Respuestas en menos de 1 segundo

La base de datos SQL Server es la misma tecnología que usan 
bancos y hospitales para millones de registros. Para una 
residencia típica, la capacidad es más que suficiente."
```

---

## 💰 COSTOS E IMPLEMENTACIÓN

### P13: ¿Cuánto cuesta implementar el sistema?

**Respuesta:**
```
"El costo depende de varios factores:

LICENCIAS:
- SQL Server: Puede usar versión Express (gratuita) o Standard
- Windows Server: Si ya lo tienen, no hay costo adicional

IMPLEMENTACIÓN:
- Instalación y configuración inicial
- Capacitación del personal
- Migración de datos existentes

MANTENIMIENTO:
- Soporte técnico (opcional)
- Actualizaciones (incluidas)

Puedo preparar una cotización detallada según sus necesidades 
específicas y el tamaño de la institución."
```

---

### P14: ¿Cuánto tiempo toma implementarlo?

**Respuesta:**
```
"Implementación típica: 4-5 semanas

SEMANA 1-2: Preparación
- Instalación del sistema
- Configuración de usuarios
- Capacitación del personal

SEMANA 3-4: Migración de datos
- Digitalización de legajos existentes
- Carga de información histórica
- Pruebas con datos reales

SEMANA 5: Puesta en marcha
- Inicio de operación
- Soporte intensivo
- Ajustes finales

Si ya tienen datos digitalizados (Excel, Word), puede ser más 
rápido (2-3 semanas)."
```

---

### P15: ¿Necesitamos contratar personal técnico adicional?

**Respuesta:**
```
"No necesariamente. El sistema está diseñado para ser usado por 
personal no técnico (trabajadores sociales, educadores, etc.).

SÍ RECOMENDAMOS:
- Un administrador del sistema (puede ser alguien existente)
- Capacitación inicial de 2-3 días para el equipo
- Soporte remoto disponible (por teléfono/email)

El mantenimiento técnico (actualizaciones, backups) puede ser:
- Interno: Si tienen IT en la institución
- Externo: Mediante contrato de soporte mensual

La mayoría de las instituciones no contrata personal adicional."
```

---

## 📈 REPORTES Y DATOS

### P16: ¿Podemos exportar datos para presentar a autoridades?

**Respuesta:**
```
"Sí, el sistema permite exportar información en varios formatos:

- PDF: Para reportes oficiales
- Excel: Para análisis y gráficos adicionales
- Impresión directa desde el navegador

Los reportes incluyen:
- Listado de legajos con filtros
- Estadísticas del dashboard
- Alertas por período
- Historial de un menor específico

Todo con fecha/hora y usuario que generó el reporte 
(trazabilidad)."
```

---

### P17: ¿Se pueden ver estadísticas históricas (meses/años anteriores)?

**Respuesta:**
```
"Actualmente el dashboard muestra estadísticas en tiempo real 
del estado actual.

Sin embargo, el sistema almacena TODO el historial:
- Legajos creados/dados de baja
- Alertas completadas con fechas
- Auditoría completa de acciones

Podemos agregar un módulo de 'Reportes Históricos' que permita:
- Ver estadísticas por mes/año
- Gráficos de tendencias
- Comparativas entre períodos
- Métricas de cumplimiento

Esto sería parte de una fase 2 de mejoras."
```

---

## 🔄 MEJORAS Y FUTURO

### P18: ¿Se puede agregar nuevas funcionalidades después?

**Respuesta:**
```
"Absolutamente. El sistema está diseñado para crecer:

FUNCIONALIDADES POTENCIALES:
- Notificaciones por email/SMS
- App móvil para alertas
- Gestión de documentos (escaneos, fotos)
- Módulo de visitas familiares
- Seguimiento escolar
- Historial médico detallado
- Reportes avanzados
- Integración con otros sistemas

Podemos priorizar según sus necesidades y presupuesto.
El código es modular y escalable."
```

---

### P19: ¿Funcionaría para varias residencias (multi-sede)?

**Respuesta:**
```
"Sí, el sistema puede adaptarse para multi-sede:

OPCIÓN A - Base de datos compartida:
Todas las sedes en una misma BD, con filtro por ubicación

OPCIÓN B - Instancias separadas:
Cada sede con su propia instalación

OPCIÓN C - Sede central + sedes remotas:
Dashboard centralizado que consolida datos de todas las sedes

Esto requiere análisis de arquitectura adicional, pero es 
totalmente factible. Hay organizaciones que manejan 10+ 
residencias con un sistema similar."
```

---

## 🛠️ SOPORTE Y CAPACITACIÓN

### P20: ¿Qué soporte recibimos después de la implementación?

**Respuesta:**
```
"Ofrecemos varios niveles de soporte:

INCLUIDO EN IMPLEMENTACIÓN:
- Capacitación inicial (2-3 días)
- Manual de usuario
- Soporte intensivo las primeras 2 semanas
- Garantía de corrección de errores

OPCIONES DE SOPORTE CONTINUO:
- Básico: Email (respuesta en 48 hrs)
- Estándar: Email + teléfono (respuesta en 24 hrs)
- Premium: Remoto inmediato + visitas mensuales

También ofrecemos:
- Capacitación de nuevos usuarios
- Actualizaciones del sistema
- Backups remotos automáticos"
```

---

### P21: ¿Es difícil de aprender a usar?

**Respuesta:**
```
"No, el sistema está diseñado para ser intuitivo:

CAPACITACIÓN TÍPICA:
- Día 1: Navegación básica, login, dashboard
- Día 2: Gestión de legajos y alertas
- Día 3: Funciones avanzadas y reportes

La mayoría del personal opera con soltura después de 1-2 días.
Si ya usan computadoras y navegadores, la curva de aprendizaje 
es muy suave.

El diseño es moderno e intuitivo - similar a redes sociales 
o aplicaciones que ya conocen."
```

---

## 🎯 RESPUESTAS A OBJECIONES COMUNES

### "Ya tenemos Excel, ¿por qué necesitamos esto?"

**Respuesta:**
```
"Excel es excelente para tablas, pero tiene limitaciones:

EXCEL:
❌ No tiene alertas automáticas
❌ Difícil de buscar en archivos múltiples
❌ Sin control de versiones (sobreescritura)
❌ No tiene roles de usuario
❌ Sin auditoría (no sabes quién cambió qué)
❌ Riesgo de borrado accidental

ESTE SISTEMA:
✅ Alertas visuales automáticas
✅ Búsqueda instantánea
✅ Historial completo de cambios
✅ Acceso controlado por roles
✅ Auditoría completa
✅ Protección contra pérdida de datos

Excel es como un cuaderno digital. Este es un sistema de gestión 
profesional diseñado específicamente para residencias."
```

---

### "Nuestro personal no es muy técnico"

**Respuesta:**
```
"Precisamente por eso diseñamos el sistema para ser FÁCIL:

- Si saben usar WhatsApp, pueden usar esto
- Si saben navegar en internet, pueden usar esto
- Si saben escribir en Word, pueden usar esto

Características pensadas para usuarios no técnicos:
✅ Íconos visuales claros
✅ Colores que indican urgencia
✅ Formularios simples paso a paso
✅ Mensajes de error en lenguaje claro
✅ Ayuda contextual en cada pantalla

Además, damos capacitación práctica con sus propios datos.
No se requiere ser 'experto en computadoras'."
```

---

### "¿Y si el sistema deja de funcionar un día?"

**Respuesta:**
```
"Entiendo la preocupación. Tenemos varios niveles de protección:

1. BACKUPS AUTOMÁTICOS DIARIOS
   Si algo falla, restauramos a ayer

2. BASE DE DATOS ROBUSTA
   SQL Server es ultra confiable (99.9% uptime)

3. SOPORTE TÉCNICO
   Respuesta rápida ante cualquier problema

4. PLAN DE CONTINGENCIA
   Pueden exportar datos a Excel/PDF en cualquier momento
   Nunca quedan "atrapados"

5. CÓDIGO DOCUMENTADO
   Otro desarrollador puede dar soporte si es necesario

Comparación: Es más probable que se pierda un archivo 
Excel o papel que falle este sistema."
```

---

## 📋 CHECKLIST PARA Q&A

Durante la sesión de preguntas:

✅ **Escuchar completamente** la pregunta antes de responder
✅ **Reformular** la pregunta si no es clara
✅ **Responder conciso** y al punto
✅ **Usar ejemplos** concretos cuando sea posible
✅ **Admitir** si no sabes algo ("Verificaré y le respondo")
✅ **No inventar** respuestas técnicas
✅ **Redirigir** preguntas muy técnicas a reunión posterior
✅ **Anotar** preguntas para seguimiento

---

## 🎯 FRASES ÚTILES

### Para ganar tiempo y pensar
- "Excelente pregunta..."
- "Me alegra que pregunten eso..."
- "Es un punto muy importante..."

### Para admitir desconocimiento
- "No tengo esa información ahora, pero puedo verificar y responderle mañana"
- "Sería irresponsable especular. Permítame consultarlo con el equipo técnico"

### Para redirigir
- "Eso requiere un análisis más profundo. ¿Podemos agendarlo para una reunión técnica?"
- "Para no extendernos, propongo profundizar en eso después de la presentación"

### Para cerrar Q&A
- "¿Alguna pregunta más antes de cerrar?"
- "Quedo a su disposición para cualquier consulta adicional"
- "Gracias por su atención y sus excelentes preguntas"

---

**✅ PREPARACIÓN COMPLETADA**

Con este documento, el guión principal, el cheat sheet y las slides, 
estás completamente preparado para una presentación profesional y 
responder cualquier pregunta con confianza.

**¡ÉXITO EN TU PRESENTACIÓN! 🎤**

