# 📚 Guía de Scripts SQL - Sistema de Residencias

## 🎯 Scripts Unificados (Nuevos)

### 🆕 **INSTALACION_COMPLETA.sql** - Script Maestro

**Qué hace:**
- Crea la base de datos desde cero
- Crea todas las tablas (Niño, Tutor, Legajo, Alerta, Usuario, etc.)
- Crea vistas y stored procedures
- Crea índices para rendimiento
- Inserta catálogos iniciales (Estados, Tipos, Prioridades, Roles)
- Crea usuario administrador (admin / Admin123!)

**Cuándo usar:**
- ✅ Primera instalación del sistema
- ✅ Instalación en producción (sin datos de prueba)
- ✅ Resetear la BD a estado inicial limpio

**Resultado:**
- Base de datos completa y funcional
- **SIN** datos de demostración (niños, legajos, alertas)
- Solo usuario admin disponible

---

### 🆕 **INSTALACION_COMPLETA_CON_DATOS.sql** - Con Datos de Demo

**Qué hace:**
- TODO lo que hace `INSTALACION_COMPLETA.sql` +
- Inserta 5 tutores de ejemplo
- Inserta 10 niños/adolescentes
- Inserta 10 legajos activos
- Inserta 20 alertas (vencidas, próximas, completadas)

**Cuándo usar:**
- ✅ **Presentaciones y demos**
- ✅ Capacitación de usuarios
- ✅ Pruebas de funcionalidades
- ✅ Desarrollo y testing

**Resultado:**
- Base de datos completa con datos realistas
- Dashboard muestra estadísticas inmediatamente
- Listo para demostrar el sistema

---

## 📋 Scripts Originales (Mantener como Referencia)

### Scripts por Categoría:

#### 🏗️ Estructura de BD:
| Script | Descripción | Usar Si... |
|--------|-------------|------------|
| `bd.sql` | Crea estructura completa | Ya no es necesario (usar INSTALACION_COMPLETA.sql) |
| `indices.sql` | Solo índices adicionales | Ya incluidos en scripts maestros |

#### 💾 Datos:
| Script | Descripción | Usar Si... |
|--------|-------------|------------|
| `datos_demo.sql` | Solo datos de demo | Quieres agregar datos a una BD existente |
| `consultas_verificacion_demo.sql` | Consultas de verificación | Verificar datos después de cargar |

#### 🔐 Autenticación:
| Script | Descripción | Usar Si... |
|--------|-------------|------------|
| `VERIFICAR_LOGIN.sql` | Verifica tablas de login | Diagnosticar problemas de autenticación |
| `CREAR_USUARIO_ADMIN.sql` | Crea admin | Ya incluido en scripts maestros |
| `RESETEAR_ADMIN.sql` | Resetea intentos de login | Troubleshooting (admin bloqueado) |
| `ACTUALIZAR_ADMIN_FINAL.sql` | Actualiza password admin | Troubleshooting (olvidó contraseña) |

#### ⚡ Rendimiento:
| Script | Descripción | Usar Si... |
|--------|-------------|------------|
| `diagnostico-rendimiento.sql` | Diagnóstico de performance | Sistema lento, necesitas analizar |
| `optimizacion-alertas.sql` | Optimiza queries de alertas | Problemas específicos de alertas |

---

## 🚀 Casos de Uso

### Caso 1: **Primera Instalación** (Entorno Limpio)

```
USAR: INSTALACION_COMPLETA_CON_DATOS.sql

PASOS:
1. Abrir SQL Server Management Studio
2. Conectar a localhost o (local)
3. Abrir: INSTALACION_COMPLETA_CON_DATOS.sql
4. Ejecutar (F5)
5. Esperar ~30 segundos
6. ¡Listo! Base completa con datos de demo

RESULTADO:
✅ BD completa
✅ Usuario admin creado
✅ 10 legajos
✅ 20 alertas
✅ Dashboard funcional
```

---

### Caso 2: **Instalación en Producción** (Sin Datos de Prueba)

```
USAR: INSTALACION_COMPLETA.sql

PASOS:
1. Abrir SSMS
2. Ejecutar: INSTALACION_COMPLETA.sql
3. Sistema listo con BD vacía
4. Cargar datos reales manualmente

RESULTADO:
✅ BD completa
✅ Usuario admin creado
❌ Sin datos de ejemplo
→ Usuario carga datos reales de la residencia
```

---

### Caso 3: **Agregar Datos de Demo a BD Existente**

```
USAR: datos_demo.sql

PREREQUISITO:
- La BD ya existe
- Las tablas ya están creadas

PASOS:
1. Abrir SSMS
2. Ejecutar: datos_demo.sql
3. ADVERTENCIA: Elimina datos existentes de Niño, Tutor, Legajo, Alerta

RESULTADO:
✅ 5 tutores
✅ 10 niños
✅ 10 legajos
✅ 20 alertas
```

---

### Caso 4: **Resetear TODO desde Cero** (Desarrollo)

```
USAR: INSTALACION_COMPLETA_CON_DATOS.sql

PASOS:
1. Ejecutar script completo
2. Elimina BD anterior
3. Crea todo desde cero
4. Inserta datos de demo

RESULTADO:
✅ BD nueva y limpia
✅ Datos de demo frescos
✅ Fechas dinámicas (relativas a HOY)
```

---

### Caso 5: **Problemas con Login**

```
USAR (en orden):
1. VERIFICAR_LOGIN.sql      → Diagnosticar
2. RESETEAR_ADMIN.sql       → Si está bloqueado
3. ACTUALIZAR_ADMIN_FINAL.sql → Si olvidó contraseña

PASOS:
1. Ejecutar VERIFICAR_LOGIN.sql
2. Ver qué falta o está mal
3. Ejecutar script de corrección apropiado
```

---

### Caso 6: **Sistema Lento** (Performance)

```
USAR (en orden):
1. diagnostico-rendimiento.sql    → Identificar problema
2. optimizacion-alertas.sql       → Aplicar mejoras

PASOS:
1. Ejecutar diagnóstico
2. Analizar resultados
3. Ejecutar optimizaciones
4. Verificar mejora de velocidad
```

---

## 📊 Comparación de Scripts

| Característica | INSTALACION_COMPLETA | INSTALACION_COMPLETA_CON_DATOS | bd.sql + datos_demo.sql |
|----------------|---------------------|-------------------------------|-------------------------|
| Crea BD | ✅ | ✅ | ✅ |
| Crea tablas | ✅ | ✅ | ✅ |
| Crea vistas | ✅ | ✅ | ✅ |
| Crea índices | ✅ | ✅ | Parcial |
| Tablas de login | ✅ | ✅ | ❌ |
| Usuario admin | ✅ | ✅ | ❌ |
| Datos de demo | ❌ | ✅ | ✅ |
| Ejecuciones | 1 script | 1 script | 2+ scripts |
| Tiempo | ~20 seg | ~30 seg | ~40 seg |

**Recomendación**: Usar scripts unificados (más fáciles y completos)

---

## 🎯 Recomendaciones por Escenario

### Para DESARROLLO:
```
✅ USAR: INSTALACION_COMPLETA_CON_DATOS.sql
   Reinstalar frecuentemente para tener datos frescos
```

### Para CAPACITACIÓN/DEMO:
```
✅ USAR: INSTALACION_COMPLETA_CON_DATOS.sql
   Datos realistas para mostrar funcionalidades
```

### Para PRODUCCIÓN:
```
✅ USAR: INSTALACION_COMPLETA.sql
   Luego cargar datos reales de la residencia
```

### Para TESTING:
```
✅ USAR: INSTALACION_COMPLETA_CON_DATOS.sql
   Datos conocidos para probar funcionalidades
```

---

## ⚠️ Advertencias Importantes

### ⚠️ **INSTALACION_COMPLETA.sql**:
```
ELIMINA LA BASE DE DATOS EXISTENTE

Si ejecutas este script:
❌ Se pierden TODOS los datos existentes
❌ No se puede deshacer
✅ Haz BACKUP antes si tienes datos importantes
```

### ⚠️ **datos_demo.sql**:
```
ELIMINA datos de Niño, Tutor, Legajo, Alerta

NO elimina:
✓ Usuarios
✓ Sesiones
✓ Catálogos

Pero SÍ elimina:
❌ Todos los niños
❌ Todos los tutores
❌ Todos los legajos
❌ Todas las alertas
```

---

## 🔍 Verificación Post-Instalación

### Después de ejecutar cualquier script:

```sql
-- En SSMS, ejecutar:
USE ResidenciaDB;

-- Ver tablas creadas
SELECT name FROM sys.tables WHERE schema_id = SCHEMA_ID('dbo') ORDER BY name;

-- Ver datos cargados
SELECT 'Tutores' AS Tabla, COUNT(*) AS Total FROM dbo.Tutor
UNION ALL SELECT 'Niños', COUNT(*) FROM dbo.Nino
UNION ALL SELECT 'Legajos', COUNT(*) FROM dbo.Legajo
UNION ALL SELECT 'Alertas', COUNT(*) FROM dbo.Alerta
UNION ALL SELECT 'Usuarios', COUNT(*) FROM dbo.Usuario;

-- Verificar usuario admin
SELECT * FROM dbo.Usuario WHERE Usuario = 'admin';

-- Verificar alertas urgentes
SELECT * FROM dbo.VW_AlertasDetalle
WHERE FechaVencimiento <= DATEADD(DAY, 3, GETDATE())
ORDER BY FechaVencimiento;
```

**Resultado esperado (con datos de demo):**
```
Tutores:   5
Niños:     10
Legajos:   10
Alertas:   20
Usuarios:  1
```

---

## 🗂️ Organización de Scripts

### Estructura Actual:

```
ResidenciaApp/
└── db/
    ├── 🆕 INSTALACION_COMPLETA.sql              ← USAR PARA PRODUCCIÓN
    ├── 🆕 INSTALACION_COMPLETA_CON_DATOS.sql   ← USAR PARA DEMO/DEV
    ├── 🆕 GUIA_SCRIPTS_SQL.md                  ← ESTE DOCUMENTO
    │
    ├── 📦 ORIGINALES (Referencia):
    │   ├── bd.sql                              (estructura)
    │   ├── indices.sql                         (índices adicionales)
    │   ├── datos_demo.sql                      (solo datos)
    │   └── consultas_verificacion_demo.sql     (verificación)
    │
    ├── 🔐 AUTENTICACIÓN (Troubleshooting):
    │   ├── VERIFICAR_LOGIN.sql
    │   ├── CREAR_USUARIO_ADMIN.sql
    │   ├── RESETEAR_ADMIN.sql
    │   └── ACTUALIZAR_ADMIN_FINAL.sql
    │
    └── ⚡ RENDIMIENTO (Opcional):
        ├── diagnostico-rendimiento.sql
        └── optimizacion-alertas.sql
```

---

## 📝 Orden de Ejecución Recomendado

### Para Instalar TODO (Primera Vez):

```
✅ OPCIÓN A - Un Solo Script (Recomendado):
   1. INSTALACION_COMPLETA_CON_DATOS.sql
   
   ¡Listo! Sistema completo en 30 segundos.
```

```
✅ OPCIÓN B - Scripts Separados (Método Antiguo):
   1. bd.sql                        (estructura)
   2. indices.sql                   (rendimiento)
   3. datos_demo.sql                (datos)
   
   Más trabajo, mismo resultado.
```

---

## 🎤 Para la Presentación

### **Ejecutar el Día de la Presentación:**

```sql
-- Script recomendado:
INSTALACION_COMPLETA_CON_DATOS.sql

-- Por qué:
✅ Fechas dinámicas (relativas a HOY)
✅ Alertas "vencidas" realmente vencidas
✅ Alertas "que vencen hoy" vencen HOY
✅ Dashboard muestra datos correctos
```

**⚠️ IMPORTANTE**: Ejecutar el MISMO DÍA de la presentación para que las fechas sean correctas.

---

## 🔄 Re-ejecutar Scripts

### Puedes Re-ejecutar Cuantas Veces Quieras:

**INSTALACION_COMPLETA_CON_DATOS.sql:**
```
✅ Elimina BD anterior
✅ Crea todo desde cero
✅ Sin conflictos
✅ Datos siempre frescos
```

**datos_demo.sql:**
```
✅ Limpia solo datos de demo
✅ Mantiene usuarios y configuraciones
✅ Re-inserta datos frescos
```

---

## 📊 Tiempo de Ejecución

| Script | Tiempo | Complejidad |
|--------|--------|-------------|
| INSTALACION_COMPLETA.sql | ~20 seg | Baja |
| INSTALACION_COMPLETA_CON_DATOS.sql | ~30 seg | Baja |
| bd.sql | ~15 seg | Baja |
| datos_demo.sql | ~10 seg | Baja |
| indices.sql | ~5 seg | Baja |
| consultas_verificacion_demo.sql | ~2 min | Baja |
| diagnostico-rendimiento.sql | ~30 seg | Media |
| optimizacion-alertas.sql | ~10 seg | Baja |

---

## ✅ Checklist Pre-Ejecución

### Antes de Ejecutar Cualquier Script:

```
□ SQL Server está corriendo
□ Tienes permisos de administrador en SQL Server
□ Has hecho BACKUP de datos importantes (si los hay)
□ Sabes que esto ELIMINARÁ la BD existente
□ Estás conectado a la instancia correcta (localhost, no producción)
```

---

## 🆘 Troubleshooting

### Error: "Database is currently in use"

**Solución:**
```sql
USE master;
ALTER DATABASE ResidenciaDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP DATABASE ResidenciaDB;
-- Luego ejecutar el script nuevamente
```

---

### Error: "Cannot find the object '...'"

**Solución:**
```
1. Verificar que estás ejecutando el script COMPLETO
2. No ejecutar líneas sueltas
3. Ejecutar todo con F5
```

---

### Error: "Duplicate key" al insertar datos

**Solución:**
```sql
-- Limpiar datos manualmente
USE ResidenciaDB;
DELETE FROM dbo.Alerta;
DELETE FROM dbo.Legajo;
DELETE FROM dbo.Nino;
DELETE FROM dbo.Tutor;
DBCC CHECKIDENT ('Alerta', RESEED, 0);
DBCC CHECKIDENT ('Legajo', RESEED, 0);
DBCC CHECKIDENT ('Nino', RESEED, 0);
DBCC CHECKIDENT ('Tutor', RESEED, 0);

-- Luego ejecutar datos_demo.sql
```

---

## 📚 Resumen - ¿Qué Script Usar?

### Diagrama de Decisión:

```
¿Primera instalación del sistema?
├─ Sí
│  ├─ ¿Es para demo/desarrollo/capacitación?
│  │  ├─ Sí  → INSTALACION_COMPLETA_CON_DATOS.sql ✅
│  │  └─ No  → ¿Es para producción?
│  │     └─ Sí  → INSTALACION_COMPLETA.sql ✅
│  │
│  └─ No (ya tengo la BD)
│     ├─ ¿Solo quiero datos de demo?
│     │  └─ Sí  → datos_demo.sql
│     │
│     ├─ ¿Problemas con login?
│     │  └─ Sí  → VERIFICAR_LOGIN.sql + RESETEAR_ADMIN.sql
│     │
│     └─ ¿Sistema lento?
│        └─ Sí  → diagnostico-rendimiento.sql
```

---

## 🎯 Recomendación Final

### **Para la Mayoría de Casos:**

```
🏆 USAR: INSTALACION_COMPLETA_CON_DATOS.sql

Es el script más completo:
✅ Una sola ejecución
✅ TODO incluido
✅ Datos listos para demostrar
✅ Sin pasos adicionales

Tiempo: 30 segundos
Complejidad: BAJA
Resultado: Sistema 100% funcional
```

---

## 📞 Script Rápido de Verificación

### Copiar y Pegar en SSMS Después de Instalar:

```sql
USE ResidenciaDB;

PRINT ''
PRINT '🔍 VERIFICACIÓN DEL SISTEMA'
PRINT '==========================='
PRINT ''

-- Tablas
PRINT '📋 Tablas:'
SELECT '   ✓ ' + name FROM sys.tables WHERE schema_id = SCHEMA_ID('dbo') ORDER BY name;

PRINT ''
PRINT '📊 Datos:'
PRINT '   Tutores: ' + CAST((SELECT COUNT(*) FROM dbo.Tutor) AS VARCHAR)
PRINT '   Niños: ' + CAST((SELECT COUNT(*) FROM dbo.Nino) AS VARCHAR)
PRINT '   Legajos: ' + CAST((SELECT COUNT(*) FROM dbo.Legajo) AS VARCHAR)
PRINT '   Alertas: ' + CAST((SELECT COUNT(*) FROM dbo.Alerta) AS VARCHAR)
PRINT '   Usuarios: ' + CAST((SELECT COUNT(*) FROM dbo.Usuario) AS VARCHAR)

PRINT ''
PRINT '👤 Usuario Admin:'
SELECT Usuario, Email, NombreCompleto, Activo FROM dbo.Usuario WHERE Usuario = 'admin';

PRINT ''
PRINT '✅ Verificación completada'
```

---

**🎉 ¡Scripts SQL Unificados y Listos para Usar!**

**Fecha**: Octubre 2025  
**Versión**: 1.0  
**Estado**: ✅ COMPLETO

