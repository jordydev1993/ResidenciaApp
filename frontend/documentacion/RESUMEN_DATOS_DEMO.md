# 📊 Resumen - Datos de Demostración para Presentación

## ✅ Archivos Creados

### 1. **`db/datos_demo.sql`** - Script Principal
   - **Qué hace**: Inserta todos los datos de demostración
   - **Contenido**:
     - 5 Tutores
     - 10 Niños/Adolescentes (edades 5-17 años)
     - 10 Legajos activos
     - 20 Alertas (vencidas, próximas, futuras, completadas)
   - **Cuándo ejecutar**: Antes de la presentación
   - **Tiempo de ejecución**: ~10 segundos

### 2. **`INSTRUCCIONES_DATOS_DEMO.md`** - Guía Paso a Paso
   - **Qué contiene**: Instrucciones detalladas para ejecutar el script
   - **Incluye**:
     - 3 métodos de ejecución (SSMS, Visual Studio, sqlcmd)
     - Pasos de verificación
     - Lista de datos específicos insertados
     - Troubleshooting
     - Tips para la demo

### 3. **`db/consultas_verificacion_demo.sql`** - Consultas Útiles
   - **Qué hace**: 15 consultas para verificar y analizar los datos
   - **Útil para**:
     - Verificar que los datos se cargaron correctamente
     - Mostrar estadísticas durante la demo
     - Debugging si algo no funciona

---

## 🚀 Guía Rápida de Inicio

### Paso 1: Ejecutar Script de Datos
```sql
-- En SQL Server Management Studio (SSMS):
-- 1. Abrir: db/datos_demo.sql
-- 2. Asegurarse que está conectado a la BD correcta
-- 3. Ejecutar (F5)
```

### Paso 2: Verificar Carga
```sql
-- Ejecutar en SSMS para verificar:
USE ResidenciaDB;

SELECT 'Tutores' AS Tabla, COUNT(*) AS Total FROM dbo.Tutor
UNION ALL
SELECT 'Niños', COUNT(*) FROM dbo.Nino
UNION ALL
SELECT 'Legajos', COUNT(*) FROM dbo.Legajo
UNION ALL
SELECT 'Alertas', COUNT(*) FROM dbo.Alerta;

-- Resultado esperado:
-- Tutores: 5
-- Niños: 10
-- Legajos: 10
-- Alertas: 20
```

### Paso 3: Iniciar Sistema
```bash
# 1. Backend (Visual Studio)
#    - Abrir WebApi.sln
#    - F5 para ejecutar
#    - Verificar que está corriendo en puerto 50948

# 2. Frontend (Live Server en VS Code)
#    - Abrir frontend/auth.html
#    - Alt+L Alt+O (Live Server)
#    - Login: admin / Admin123!
```

### Paso 4: Verificar en el Dashboard
```
✅ Dashboard debe mostrar:
   - Total Legajos: 10
   - Alertas Vencidas: 3 (en rojo)
   - Alertas Próximas: 4-6 (en amarillo)
   - Alertas Completadas: 5 (en verde)
   - Gráficos con datos reales
```

---

## 📋 Datos Específicos Insertados

### Tutores (5):
| ID | Nombre Completo | Email |
|----|-----------------|-------|
| 1 | María Soledad González | mgonzalez@residencia.gob.ar |
| 2 | Carlos Alberto Rodríguez | crodriguez@residencia.gob.ar |
| 3 | Ana Patricia Fernández | afernandez@residencia.gob.ar |
| 4 | Roberto Daniel Martínez | rmartinez@residencia.gob.ar |
| 5 | Laura Beatriz López | llopez@residencia.gob.ar |

### Niños/Adolescentes (10):
| ID | Nombre Completo | DNI | Edad |
|----|-----------------|-----|------|
| 1 | Juancito Pérez | 45123456 | ~6 años |
| 2 | Sofía García | 45234567 | ~7 años |
| 3 | Mateo Romero | 45345678 | ~5 años |
| 4 | Valentina Díaz | 44123789 | ~11 años |
| 5 | Thiago Morales | 44234890 | ~10 años |
| 6 | Catalina Suárez | 44345901 | ~12 años |
| 7 | Santiago Torres | 43123012 | ~14 años |
| 8 | Martina Ramírez | 43234123 | ~15 años |
| 9 | Nicolás Flores | 43345234 | ~16 años |
| 10 | Lucía Castro | 43456345 | ~17 años |

### Distribución de Alertas (20):
- 🔴 **3 Vencidas** (hace 2-5 días) - URGENTES
- 🟠 **2 Vencen hoy** - MÁXIMA PRIORIDAD
- 🟡 **4 Próximas** (1-3 días)
- 🔵 **3 Futuras** (4-7 días)
- 🟢 **3 Más adelante** (>1 semana)
- ✅ **5 Completadas** (historial)

---

## 🎯 Alertas Destacadas para Mostrar en la Demo

### 🔴 VENCIDAS (para mostrar urgencia):
1. **Legajo #1 (Juancito Pérez)**
   ```
   Control pediátrico trimestral
   Vacunación pendiente contra HPV
   Vencida hace 5 días
   Prioridad: ALTA
   ```

2. **Legajo #6 (Catalina Suárez)**
   ```
   Audiencia judicial con Defensoría
   Presentar informe actualizado
   Vencida hace 2 días
   Prioridad: ALTA
   ```

3. **Legajo #9 (Nicolás Flores)**
   ```
   Reunión con docente por bajo rendimiento
   Coordinar apoyo escolar
   Vencida hace 3 días
   Prioridad: MEDIA
   ```

### 🟠 VENCEN HOY (máxima urgencia):
1. **Legajo #3 (Mateo Romero)**
   ```
   ¡URGENTE! Toma de medicación programada
   Control neurológico a las 10:00 hs
   Vence: HOY
   Prioridad: ALTA
   ```

2. **Legajo #7 (Santiago Torres)**
   ```
   Renovación de DNI
   Turno en Registro Civil 14:00 hs
   Vence: HOY
   Prioridad: ALTA
   ```

---

## 🎤 Script para Mostrar Durante la Demo

### Momento 1: Dashboard
```
"Como pueden ver, el dashboard muestra estadísticas en tiempo real:
 - 10 legajos activos en la residencia
 - 3 alertas vencidas que requieren atención INMEDIATA
 - 4-6 alertas próximas que debemos planificar
 - Los gráficos muestran la distribución por estado y prioridad"
```

### Momento 2: Lista de Alertas
```
"Aquí vemos todas las alertas con codificación visual:
 - Las ROJAS están vencidas - son urgentes
 - Las que parpadean vencen HOY - máxima prioridad
 - Las AMARILLAS vencen en los próximos días
 - El sistema hace obvio qué requiere atención"
```

### Momento 3: Detalle de Alerta (doble clic)
```
"Con doble clic veo el detalle completo:
 - Tipo de alerta, prioridad
 - Niño asociado y su legajo
 - Descripción detallada
 - Fecha de vencimiento
 - Auditoría: quién la creó y cuándo"
```

### Momento 4: Legajos
```
"Cada menor tiene un expediente digital único:
 - Datos personales, DNI
 - Tutor asignado
 - Estado del caso
 - Fechas de ingreso
 - Búsqueda instantánea"
```

---

## 🔧 Comandos Útiles

### Re-cargar Datos desde Cero
```sql
-- Si necesitas volver a cargar los datos:
-- El script limpia automáticamente y vuelve a insertar todo
USE ResidenciaDB;
-- Ejecutar: db/datos_demo.sql
```

### Limpiar Datos Manualmente
```sql
USE ResidenciaDB;
DELETE FROM dbo.Alerta;
DELETE FROM dbo.Legajo;
DELETE FROM dbo.Nino;
DELETE FROM dbo.Tutor;
DBCC CHECKIDENT ('dbo.Alerta', RESEED, 0);
DBCC CHECKIDENT ('dbo.Legajo', RESEED, 0);
DBCC CHECKIDENT ('dbo.Nino', RESEED, 0);
DBCC CHECKIDENT ('dbo.Tutor', RESEED, 0);
```

### Verificar Dashboard Stats
```sql
USE ResidenciaDB;

-- Total legajos
SELECT COUNT(*) FROM dbo.Legajo 
WHERE EstadoId = (SELECT Id FROM dbo.Estado WHERE Nombre = 'Activo');

-- Alertas vencidas
SELECT COUNT(*) FROM dbo.Alerta 
WHERE FechaVencimiento < CAST(GETDATE() AS DATE)
  AND EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente');

-- Alertas próximas (≤3 días)
SELECT COUNT(*) FROM dbo.Alerta 
WHERE FechaVencimiento BETWEEN CAST(GETDATE() AS DATE) 
      AND DATEADD(DAY, 3, CAST(GETDATE() AS DATE))
  AND EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente');

-- Alertas completadas
SELECT COUNT(*) FROM dbo.Alerta 
WHERE EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Completada');
```

---

## ✅ Checklist Pre-Presentación

### Datos:
- [ ] Script `datos_demo.sql` ejecutado sin errores
- [ ] Verificación SQL muestra cantidades correctas:
  - [ ] 5 tutores
  - [ ] 10 niños
  - [ ] 10 legajos
  - [ ] 20 alertas
- [ ] Script `consultas_verificacion_demo.sql` ejecutado correctamente

### Sistema:
- [ ] Backend corriendo (Visual Studio F5)
- [ ] Frontend accesible (Live Server)
- [ ] Login funciona (admin / Admin123!)
- [ ] Dashboard muestra datos reales
- [ ] Alertas visuales funcionando (colores, badges)
- [ ] Gráficos del dashboard visibles
- [ ] Filtros de alertas operativos
- [ ] Búsqueda de legajos funciona
- [ ] Doble clic abre modal de detalle

### Navegador:
- [ ] Consola del navegador sin errores (F12)
- [ ] Cache limpiado (Ctrl+Shift+Delete)
- [ ] Pantalla completa (F11)
- [ ] Pestañas innecesarias cerradas

---

## 📝 Notas Importantes

### ⚠️ Advertencias:
1. El script **elimina todos los datos existentes** antes de insertar
2. Las fechas de las alertas son **dinámicas** (relativas a HOY)
3. Si ejecutas el script en días diferentes, las "vencidas" y "próximas" cambiarán

### 💡 Tips:
1. Ejecuta el script **el mismo día de la presentación** para que las fechas sean correctas
2. Si la demo es a las 14:00, ejecuta el script a las 13:30 como máximo
3. Verifica el dashboard **justo antes** de empezar la presentación
4. Ten abierta la pestaña de SSMS con `consultas_verificacion_demo.sql` por si necesitas mostrar algo en SQL

---

## 🎯 Resumen de lo Creado

```
📁 ResidenciaApp/
│
├── 📁 db/
│   ├── 📄 datos_demo.sql                     ← SCRIPT PRINCIPAL (ejecutar)
│   └── 📄 consultas_verificacion_demo.sql    ← VERIFICACIONES
│
├── 📄 INSTRUCCIONES_DATOS_DEMO.md            ← GUÍA COMPLETA
└── 📄 RESUMEN_DATOS_DEMO.md                  ← ESTE ARCHIVO
```

---

## 🚀 Inicio Rápido (5 minutos)

```bash
# 1. Ejecutar script SQL (SSMS)
#    Abrir: db/datos_demo.sql
#    F5 para ejecutar

# 2. Verificar (SSMS)
#    SELECT * FROM dbo.VW_LegajoDetalle;
#    SELECT * FROM dbo.VW_AlertasDetalle;

# 3. Iniciar backend (Visual Studio)
#    F5 en WebApi.sln

# 4. Iniciar frontend (VS Code)
#    Live Server en frontend/auth.html

# 5. Login
#    Usuario: admin
#    Contraseña: Admin123!

# 6. Verificar Dashboard
#    ✓ Números correctos
#    ✓ Gráficos visibles
#    ✓ Sin errores en consola (F12)
```

---

**✅ ¡Todo listo para la presentación!**

**Última actualización**: Octubre 2025  
**Versión**: 1.0  
**Estado**: ✅ COMPLETO

