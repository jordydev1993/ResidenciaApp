# 📊 SLIDES - Presentación Sistema de Gestión de Residencias

---

## SLIDE 1: PORTADA

```
┌─────────────────────────────────────────────┐
│                                             │
│     🏠 SISTEMA DE GESTIÓN DE RESIDENCIAS    │
│         PARA NIÑOS, NIÑAS Y ADOLESCENTES    │
│                                             │
│      Gestión Integral para el Bienestar     │
│              de Menores en Protección       │
│                                             │
│                                             │
│            Presentado por: [TU NOMBRE]      │
│                   Octubre 2025              │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: Presentación + contexto en 1 minuto

---

## SLIDE 2: PROBLEMÁTICA ACTUAL

```
┌─────────────────────────────────────────────┐
│  🚨 DESAFÍOS ACTUALES EN LAS RESIDENCIAS    │
├─────────────────────────────────────────────┤
│                                             │
│  📋 Gestión Manual de Expedientes           │
│     • Archivos en papel                     │
│     • Acceso lento a información            │
│     • Riesgo de pérdida de documentos       │
│                                             │
│  ⏰ Seguimiento Deficiente de Vencimientos  │
│     • Dependencia de memoria humana         │
│     • Anotaciones dispersas                 │
│     • Tareas y plazos omitidos              │
│                                             │
│  🔍 Falta de Visibilidad Centralizada       │
│     • Sin métricas en tiempo real           │
│     • Reportes manuales tardíos             │
│     • Dificultad para priorizar casos       │
│                                             │
│  ⚖️ IMPACTO: Riesgo legal y compromiso      │
│             del bienestar de menores        │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: Enfatizar que estos problemas comprometen directamente el bienestar de los menores

---

## SLIDE 3: NUESTRA SOLUCIÓN

```
┌─────────────────────────────────────────────┐
│         ✅ SISTEMA DE GESTIÓN INTEGRAL       │
├─────────────────────────────────────────────┤
│                                             │
│  🔐 1. AUTENTICACIÓN Y SEGURIDAD            │
│     → Control de acceso basado en roles     │
│     → Auditoría completa de acciones        │
│                                             │
│  📊 2. DASHBOARD CENTRALIZADO               │
│     → Estadísticas en tiempo real           │
│     → Gráficos interactivos                 │
│                                             │
│  📁 3. GESTIÓN DE LEGAJOS DIGITALES         │
│     → Expediente único por menor            │
│     → Búsqueda y filtros avanzados          │
│                                             │
│  🔔 4. SISTEMA DE ALERTAS INTELIGENTE       │
│     → Recordatorios automáticos             │
│     → Priorización visual                   │
│                                             │
│  ⚙️ 5. CONFIGURACIÓN Y REPORTES             │
│     → Administración de catálogos           │
│     → Generación de informes                │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: "Ahora veamos cómo funciona en la práctica..."

---

## SLIDE 4: SEGURIDAD Y CONTROL DE ACCESO

```
┌─────────────────────────────────────────────┐
│         🔐 SEGURIDAD DE NIVEL EMPRESARIAL    │
├─────────────────────────────────────────────┤
│                                             │
│  ✓ Autenticación basada en roles:          │
│    • Administrador (acceso total)           │
│    • Operador (gestión diaria)              │
│    • Consultor (solo lectura)               │
│                                             │
│  ✓ Protección de contraseñas:              │
│    • Hash PBKDF2 (10,000 iteraciones)       │
│    • Salt único por usuario                 │
│    • Nunca se almacenan en texto plano      │
│                                             │
│  ✓ Gestión de sesiones:                    │
│    • Tokens únicos por sesión               │
│    • Expiración automática (30 min)         │
│    • Cierre de sesión seguro                │
│                                             │
│  ✓ Prevención de ataques:                  │
│    • Bloqueo tras 3 intentos fallidos       │
│    • Prevención de SQL Injection            │
│    • Headers de seguridad HTTP              │
│                                             │
│  ✓ Auditoría completa:                     │
│    • Registro de todos los accesos          │
│    • Trazabilidad de cambios                │
│    • Reportes de actividad                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: [DEMO LIVE] Mostrar login → redirige al dashboard

---

## SLIDE 5: DASHBOARD - VISTA GENERAL

```
┌─────────────────────────────────────────────┐
│          📊 DASHBOARD EN TIEMPO REAL         │
├─────────────────────────────────────────────┤
│                                             │
│  📈 KPIs (Indicadores Clave):               │
│  ┌─────────┬─────────┬─────────┬─────────┐ │
│  │ TOTAL   │ ALERTAS │ ALERTAS │ ALERTAS │ │
│  │ LEGAJOS │ VENCIDAS│ PRÓXIMAS│ COMPLET │ │
│  │   ##    │   🔴 ## │   🟡 ## │   🟢 ## │ │
│  └─────────┴─────────┴─────────┴─────────┘ │
│                                             │
│  📊 Gráfico: Alertas por Estado             │
│  ████████ Pendiente     (##)                │
│  ██████ En Proceso    (##)                  │
│  ████ Completada    (##)                    │
│                                             │
│  📊 Gráfico: Alertas por Prioridad          │
│  ████████ Alta          (##)                │
│  ██████ Media        (##)                   │
│  ████ Baja         (##)                     │
│                                             │
│  ✅ Actualización automática desde BD       │
│  ✅ Sin procesamiento manual                │
│  ✅ Visibilidad instantánea                 │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: [DEMO LIVE] "Visión completa en menos de 5 segundos"

---

## SLIDE 6: GESTIÓN DE LEGAJOS

```
┌─────────────────────────────────────────────┐
│        📁 EXPEDIENTES DIGITALES ÚNICOS       │
├─────────────────────────────────────────────┤
│                                             │
│  ✓ Información Centralizada:               │
│    • Datos personales del menor             │
│    • DNI y número de legajo único           │
│    • Estado actual del caso                 │
│    • Tutor asignado                         │
│    • Fechas de ingreso y egreso             │
│    • Observaciones relevantes               │
│                                             │
│  ✓ Búsqueda Avanzada:                      │
│    • Por nombre, apellido                   │
│    • Por DNI                                │
│    • Por número de legajo                   │
│    • Filtros por estado                     │
│                                             │
│  ✓ Gestión Completa:                       │
│    • Crear nuevo legajo                     │
│    • Editar información                     │
│    • Dar de baja (egreso)                   │
│    • Historial de cambios                   │
│                                             │
│  ✓ Trazabilidad Total:                     │
│    • Quién creó el registro                 │
│    • Quién modificó y cuándo                │
│    • Auditoría completa                     │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: [DEMO LIVE] Mostrar lista → filtros → crear nuevo

---

## SLIDE 7: SISTEMA DE ALERTAS

```
┌─────────────────────────────────────────────┐
│      🔔 SISTEMA DE ALERTAS INTELIGENTE       │
├─────────────────────────────────────────────┤
│                                             │
│  ✓ Tipos de Alertas:                       │
│    • Médicas (vacunas, controles)           │
│    • Judiciales (audiencias, informes)      │
│    • Documentales (renovaciones)            │
│    • Visitas familiares                     │
│    • Escolares                              │
│                                             │
│  ✓ Priorización Visual:                    │
│    • 🔴 ALTA → Atención inmediata           │
│    • 🟡 MEDIA → Planificar                  │
│    • 🟢 BAJA → Sin urgencia                 │
│                                             │
│  ✓ Estados de Seguimiento:                 │
│    • Pendiente → Aún no iniciada            │
│    • En Proceso → En atención               │
│    • Completada → Finalizada                │
│                                             │
│  ✓ Indicadores Automáticos:                │
│    • ROJO → Vencida (requiere acción YA)    │
│    • AMARILLO → Próxima (≤3 días)           │
│    • VERDE → Sin urgencia                   │
│                                             │
│  ✓ Filtros Avanzados:                      │
│    • Por tipo, prioridad, estado            │
│    • Por rango de fechas                    │
│    • Por legajo específico                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: [DEMO LIVE] "Visual management - el sistema hace obvio lo urgente"

---

## SLIDE 8: BENEFICIOS CLAVE

```
┌─────────────────────────────────────────────┐
│           🎯 BENEFICIOS DEL SISTEMA          │
├─────────────────────────────────────────────┤
│                                             │
│  ✅ CENTRALIZACIÓN DE INFORMACIÓN           │
│     → Todo en un solo lugar                 │
│     → Acceso en segundos vs horas           │
│     → Eliminación de archivos físicos       │
│                                             │
│  ✅ SEGUIMIENTO AUTOMÁTICO                  │
│     → El sistema recuerda por ti            │
│     → Alertas proactivas vs reactivas       │
│     → Reducción de tareas omitidas          │
│                                             │
│  ✅ VISIBILIDAD EN TIEMPO REAL              │
│     → Estadísticas actualizadas             │
│     → Sin reportes manuales                 │
│     → Toma de decisiones informada          │
│                                             │
│  ✅ SEGURIDAD Y AUDITORÍA                   │
│     → Control de acceso por roles           │
│     → Trazabilidad completa                 │
│     → Cumplimiento normativo                │
│                                             │
│  ✅ EFICIENCIA OPERATIVA                    │
│     → Menos tiempo administrativo           │
│     → Más tiempo de atención a menores      │
│     → Reducción de errores humanos          │
│                                             │
│  🎯 LO MÁS IMPORTANTE:                      │
│     Garantizar el bienestar de cada         │
│     niño, niña y adolescente bajo           │
│     protección institucional                │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: Enfatizar el beneficio principal - bienestar de los menores

---

## SLIDE 9: ARQUITECTURA TÉCNICA (Opcional - Solo para audiencia técnica)

```
┌─────────────────────────────────────────────┐
│          🔧 ARQUITECTURA DEL SISTEMA         │
├─────────────────────────────────────────────┤
│                                             │
│  FRONTEND                                   │
│  ├─ HTML5 + Tailwind CSS                    │
│  ├─ JavaScript ES6+ (módulos)               │
│  ├─ Chart.js para visualizaciones           │
│  └─ SPA con routing dinámico                │
│                                             │
│  BACKEND                                    │
│  ├─ ASP.NET Web API (C#)                    │
│  ├─ .NET Framework 4.7.2                    │
│  ├─ RESTful API                             │
│  └─ Stored Procedures optimizados           │
│                                             │
│  BASE DE DATOS                              │
│  ├─ SQL Server 2019+                        │
│  ├─ Índices optimizados                     │
│  ├─ Vistas para consultas complejas         │
│  └─ Backup automático                       │
│                                             │
│  SEGURIDAD                                  │
│  ├─ PBKDF2 (10K iteraciones)                │
│  ├─ Tokens JWT                              │
│  ├─ CORS configurado                        │
│  └─ SQL Injection prevención                │
│                                             │
│  RENDIMIENTO                                │
│  ├─ Caché en cliente (5 min)                │
│  ├─ Queries indexadas                       │
│  ├─ Lazy loading                            │
│  └─ Paginación de resultados                │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: Solo mostrar a audiencia TI

---

## SLIDE 10: CASOS DE USO REALES

```
┌─────────────────────────────────────────────┐
│          💡 CASOS DE USO EN EL DÍA A DÍA     │
├─────────────────────────────────────────────┤
│                                             │
│  CASO 1: Revisión Médica Pendiente          │
│  • Sistema alerta 3 días antes              │
│  • Trabajador social coordina cita          │
│  • Marca alerta como completada             │
│  • Registro queda en historial              │
│                                             │
│  CASO 2: Audiencia Judicial                 │
│  • Alerta de alta prioridad creada          │
│  • Aparece en dashboard en rojo             │
│  • Abogado prepara documentación            │
│  • Sistema rastrea hasta completado         │
│                                             │
│  CASO 3: Ingreso de Nuevo Menor             │
│  • Operador crea legajo digital             │
│  • Asigna tutor responsable                 │
│  • Carga alertas iniciales (médicas, etc.)  │
│  • Todo queda centralizado y accesible      │
│                                             │
│  CASO 4: Reporte para Autoridades           │
│  • Director accede al dashboard             │
│  • Exporta estadísticas en tiempo real      │
│  • Presenta métricas objetivas              │
│  • Sin procesamiento manual previo          │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: Estos ejemplos hacen el sistema tangible

---

## SLIDE 11: PRÓXIMOS PASOS

```
┌─────────────────────────────────────────────┐
│            🚀 IMPLEMENTACIÓN                 │
├─────────────────────────────────────────────┤
│                                             │
│  FASE 1: PREPARACIÓN (Semana 1-2)           │
│  ├─ Capacitación del personal               │
│  ├─ Configuración de usuarios y roles       │
│  ├─ Carga de catálogos (estados, tipos)     │
│  └─ Pruebas con datos de ejemplo            │
│                                             │
│  FASE 2: MIGRACIÓN (Semana 3-4)             │
│  ├─ Digitalización de legajos existentes    │
│  ├─ Carga de información histórica          │
│  ├─ Creación de alertas activas             │
│  └─ Validación de datos                     │
│                                             │
│  FASE 3: PUESTA EN MARCHA (Semana 5)        │
│  ├─ Inicio de operación en producción       │
│  ├─ Monitoreo diario de uso                 │
│  ├─ Ajustes según feedback                  │
│  └─ Soporte continuo                        │
│                                             │
│  SOPORTE POST-IMPLEMENTACIÓN                │
│  ├─ Mesa de ayuda técnica                   │
│  ├─ Actualizaciones periódicas              │
│  ├─ Capacitación de nuevos usuarios         │
│  └─ Mejoras continuas según necesidad       │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: Plan realista y alcanzable

---

## SLIDE 12: CONTACTO Y PREGUNTAS

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│              💬 ¿PREGUNTAS?                 │
│                                             │
│                                             │
│        Estoy disponible para resolver       │
│        cualquier duda que tengan            │
│                                             │
│                                             │
│         📧 Contacto: [email]                │
│         📱 Teléfono: [número]               │
│         💼 LinkedIn: [perfil]               │
│                                             │
│                                             │
│              ¡MUCHAS GRACIAS!               │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

**Notas del presentador**: Sonreír, mantener contacto visual, agradecer

---

## 📌 NOTAS ADICIONALES

### Colores Sugeridos para Slides

- **Títulos**: Azul oscuro (#1e40af)
- **Subtítulos**: Gris oscuro (#374151)
- **Alertas/Urgente**: Rojo (#dc2626)
- **Advertencias**: Amarillo/Naranja (#f59e0b)
- **Éxito/Completado**: Verde (#10b981)
- **Fondo**: Blanco (#ffffff)
- **Texto**: Negro/Gris (#111827)

### Íconos Recomendados

- 🏠 Residencias
- 👶 Niños/NNA
- 📊 Dashboard/Estadísticas
- 📁 Legajos/Expedientes
- 🔔 Alertas/Notificaciones
- 🔐 Seguridad/Login
- ✅ Completado/Éxito
- 🔴 Urgente/Vencido
- 🟡 Advertencia/Próximo
- 🟢 Normal/OK
- 🎯 Objetivo/Meta
- 🚀 Implementación/Launch

### Tipografía Sugerida

- **Títulos**: Arial Bold / Montserrat Bold (28-36 pt)
- **Subtítulos**: Arial / Montserrat (20-24 pt)
- **Texto**: Arial / Open Sans (16-18 pt)
- **Notas**: Arial / Open Sans (14 pt)

---

**Herramientas para crear las slides:**
- PowerPoint (Microsoft)
- Google Slides (gratuito)
- Canva (templates modernos)
- Keynote (Mac)

**Exportar en**: PDF + PPTX para máxima compatibilidad

