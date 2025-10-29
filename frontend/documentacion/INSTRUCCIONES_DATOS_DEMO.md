# 📊 Instrucciones para Cargar Datos de Demostración

## 🎯 Objetivo
Cargar datos realistas en la base de datos para la presentación del sistema.

---

## 📋 Datos que se Insertarán

### Cantidad de Registros:
- **5 Tutores** (trabajadores sociales/educadores)
- **10 Niños/Adolescentes** (edades 6-17 años)
- **10 Legajos** (expedientes activos)
- **20 Alertas** distribuidas así:
  - 🔴 **3 Vencidas** (urgentes)
  - 🟠 **2 Vencen hoy** (máxima prioridad)
  - 🟡 **4 Próximas** (1-3 días)
  - 🔵 **3 Futuras** (4-7 días)
  - 🟢 **3 Más adelante** (>1 semana)
  - ✅ **5 Completadas** (historial)

---

## 🚀 Pasos para Ejecutar

### Opción 1: SQL Server Management Studio (SSMS) - Recomendado

1. **Abrir SSMS**
   - Conectar al servidor: `localhost` o `(local)`
   - Autenticación: Windows Authentication

2. **Abrir el Script**
   - File → Open → File...
   - Seleccionar: `ResidenciaApp\db\datos_demo.sql`

3. **Verificar Base de Datos**
   - Asegurarse que la base `ResidenciaDB` existe
   - Si no existe, ejecutar primero `db\bd.sql`

4. **Ejecutar el Script**
   - Clic en **Execute** (F5)
   - Esperar a que termine (5-10 segundos)

5. **Verificar Resultados**
   - Deberías ver mensajes como:
     ```
     🗑️ Limpiando datos existentes...
     👥 Insertando tutores...
        ✓ 5 tutores insertados
     👶 Insertando niños y adolescentes...
        ✓ 10 niños/adolescentes insertados
     📁 Insertando legajos...
        ✓ 10 legajos insertados
     🔔 Insertando alertas...
        ✓ 20 alertas insertadas
     
     📊 RESUMEN DE DATOS INSERTADOS:
     ================================
        👥 Tutores:              5
        👶 Niños/Adolescentes:   10
        📁 Legajos:              10
        🔔 Alertas totales:      20
        
        🔴 Alertas vencidas:     3
        🟡 Alertas próximas:     4-6
        🟢 Alertas completadas:  5
     ```

---

### Opción 2: Visual Studio (Database Tools)

1. **Abrir Visual Studio**
   - Abrir el proyecto `WebApi`

2. **Conectar a SQL Server**
   - View → SQL Server Object Explorer
   - Conectar a `(localdb)\MSSQLLocalDB` o tu instancia

3. **Ejecutar Script**
   - Clic derecho en la base `ResidenciaDB`
   - New Query...
   - Copiar contenido de `datos_demo.sql`
   - Ejecutar (Ctrl+Shift+E)

---

### Opción 3: Línea de Comandos (sqlcmd)

```bash
# Navegar al directorio del proyecto
cd C:\Users\jordy\Desktop\ResidenciaApp

# Ejecutar el script
sqlcmd -S localhost -E -i db\datos_demo.sql
```

---

## ✅ Verificación Post-Ejecución

### 1. Consultas SQL de Verificación

```sql
-- Ver todos los legajos con detalles
SELECT * FROM dbo.VW_LegajoDetalle ORDER BY LegajoId;

-- Ver alertas urgentes (vencidas + próximas)
SELECT 
    AlertaId,
    Nino,
    Tipo,
    Prioridad,
    FechaVencimiento,
    Descripcion
FROM dbo.VW_AlertasDetalle
WHERE FechaVencimiento <= DATEADD(DAY, 3, GETDATE())
  AND Estado = 'Pendiente'
ORDER BY FechaVencimiento;

-- Dashboard: Alertas por estado
SELECT Estado, COUNT(*) AS Total 
FROM dbo.VW_AlertasDetalle 
GROUP BY Estado;

-- Dashboard: Alertas por prioridad
SELECT Prioridad, COUNT(*) AS Total 
FROM dbo.VW_AlertasDetalle 
GROUP BY Prioridad;
```

### 2. Verificación en el Sistema Web

1. **Iniciar el Backend**
   - Abrir Visual Studio
   - F5 para ejecutar `WebApi`

2. **Abrir el Frontend**
   - Navegar a: `http://localhost:5500/frontend/auth.html`
   - O usar Live Server en VS Code

3. **Login**
   ```
   Usuario: admin
   Contraseña: Admin123!
   ```

4. **Verificar Dashboard**
   - Ir al Dashboard
   - Deberías ver:
     - Total Legajos: **10**
     - Alertas Vencidas: **3** (en rojo)
     - Alertas Próximas: **4-6** (en amarillo)
     - Alertas Completadas: **5** (en verde)
   - Gráficos con distribución de alertas

5. **Verificar Módulo de Alertas**
   - Ir a "Alertas" en el menú
   - Deberías ver **20 alertas** listadas
   - Alertas vencidas destacadas en **ROJO**
   - Alertas que vencen hoy con **ANIMACIÓN**
   - Alertas próximas en **AMARILLO**

6. **Verificar Módulo de Legajos**
   - Ir a "Legajos" en el menú
   - Deberías ver **10 legajos**
   - Diferentes tutores asignados
   - Estados variados

---

## 🎭 Datos Específicos para la Demo

### Tutores (5):
| ID | Nombre | Email |
|----|--------|-------|
| 1 | María Soledad González | mgonzalez@residencia.gob.ar |
| 2 | Carlos Alberto Rodríguez | crodriguez@residencia.gob.ar |
| 3 | Ana Patricia Fernández | afernandez@residencia.gob.ar |
| 4 | Roberto Daniel Martínez | rmartinez@residencia.gob.ar |
| 5 | Laura Beatriz López | llopez@residencia.gob.ar |

### Niños (10):
| ID | Nombre | DNI | Edad Aprox. |
|----|--------|-----|-------------|
| 1 | Juancito Pérez | 45123456 | 6 años |
| 2 | Sofía García | 45234567 | 7 años |
| 3 | Mateo Romero | 45345678 | 5 años |
| 4 | Valentina Díaz | 44123789 | 11 años |
| 5 | Thiago Morales | 44234890 | 10 años |
| 6 | Catalina Suárez | 44345901 | 12 años |
| 7 | Santiago Torres | 43123012 | 14 años |
| 8 | Martina Ramírez | 43234123 | 15 años |
| 9 | Nicolás Flores | 43345234 | 16 años |
| 10 | Lucía Castro | 43456345 | 17 años |

### Ejemplos de Alertas Destacadas:

#### 🔴 VENCIDAS (urgentes para la demo):
1. **Legajo #1 (Juancito Pérez)**
   - Control pediátrico vencido hace 5 días
   - Prioridad: ALTA
   - Tipo: Médica

2. **Legajo #6 (Catalina Suárez)**
   - Audiencia judicial vencida hace 2 días
   - Prioridad: ALTA
   - Tipo: Judicial

3. **Legajo #9 (Nicolás Flores)**
   - Reunión escolar vencida hace 3 días
   - Prioridad: MEDIA
   - Tipo: Educativa

#### 🟠 VENCEN HOY (máxima urgencia):
1. **Legajo #3 (Mateo Romero)**
   - Control neurológico HOY 10:00 hs
   - Prioridad: ALTA

2. **Legajo #7 (Santiago Torres)**
   - Renovación DNI HOY 14:00 hs
   - Prioridad: ALTA

---

## 🔄 Re-ejecutar el Script

Si necesitas volver a cargar los datos (por ejemplo, después de pruebas):

1. El script **limpia automáticamente** datos existentes
2. Reinicia los contadores de identidad
3. Vuelve a insertar todo desde cero

**NOTA**: Esto **elimina** todos los niños, tutores, legajos y alertas existentes. Si tienes datos reales, haz backup primero.

---

## 🛠️ Troubleshooting

### Error: "Cannot insert duplicate key"
**Solución**: 
```sql
-- Limpiar manualmente y reiniciar
DELETE FROM dbo.Alerta;
DELETE FROM dbo.Legajo;
DELETE FROM dbo.Nino;
DELETE FROM dbo.Tutor;
DBCC CHECKIDENT ('dbo.Alerta', RESEED, 0);
DBCC CHECKIDENT ('dbo.Legajo', RESEED, 0);
DBCC CHECKIDENT ('dbo.Nino', RESEED, 0);
DBCC CHECKIDENT ('dbo.Tutor', RESEED, 0);
```

### Error: "Foreign key constraint"
**Causa**: Intentando eliminar en orden incorrecto  
**Solución**: El script ya maneja el orden correcto (Alerta → Legajo → Nino/Tutor)

### Error: "Database ResidenciaDB does not exist"
**Solución**: Ejecutar primero `db\bd.sql` para crear la base de datos

---

## 📝 Personalizar Datos

Si quieres modificar los datos de demostración:

1. **Cambiar fechas de alertas**:
   ```sql
   -- Para que una alerta venza mañana:
   DATEADD(DAY, 1, CAST(GETDATE() AS DATE))
   
   -- Para que venza en 5 días:
   DATEADD(DAY, 5, CAST(GETDATE() AS DATE))
   
   -- Para que esté vencida hace 3 días:
   DATEADD(DAY, -3, CAST(GETDATE() AS DATE))
   ```

2. **Agregar más niños**:
   ```sql
   INSERT INTO dbo.Nino (Dni, Apellido, Nombre, FechaNacimiento, UsuarioCreacion) 
   VALUES ('45999888', 'Nuevo', 'NiñoDemo', '2015-01-01', 'admin');
   ```

3. **Cambiar descripciones de alertas**:
   - Editar directamente en el script `datos_demo.sql`
   - Re-ejecutar el script completo

---

## ✅ Checklist Pre-Presentación

- [ ] Script ejecutado sin errores
- [ ] Dashboard muestra estadísticas correctas
- [ ] Alertas visuales funcionando (colores, badges)
- [ ] Legajos listados correctamente
- [ ] Sistema de login funcionando
- [ ] Filtros de alertas operativos
- [ ] Gráficos del dashboard visibles

---

## 🎤 Tips para la Demo

1. **Mostrar Dashboard primero**
   - Las estadísticas impresionan
   - Números reales de la BD

2. **Ir a Alertas**
   - Destacar las vencidas en ROJO
   - Señalar las que parpadean (vencen hoy)
   - Mostrar filtros funcionando

3. **Abrir detalle de una alerta**
   - Doble clic en una alerta vencida
   - Mostrar información completa

4. **Navegar a Legajos**
   - Buscar por nombre
   - Mostrar información del niño

5. **Destacar beneficios**
   - "Antes: buscar en archivos físicos"
   - "Ahora: búsqueda instantánea"
   - "Sistema me avisa qué es urgente"

---

**¡Listo para la presentación! 🎉**

**Última actualización**: Octubre 2025  
**Versión**: 1.0

