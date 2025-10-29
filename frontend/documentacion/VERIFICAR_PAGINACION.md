# ✅ Verificar Paginación - Guía Rápida

## 🚀 Inicio Rápido (2 minutos)

### 1️⃣ Ejecutar el Script de Datos Demo (Si aún no lo hiciste)

**En SQL Server Management Studio (SSMS):**
```sql
-- Abrir archivo: db/datos_demo.sql
-- F5 para ejecutar
-- Esperar mensaje: ✅ ¡DATOS DE DEMOSTRACIÓN CARGADOS EXITOSAMENTE!
```

Esto insertará **20 alertas** y **10 legajos** para probar la paginación.

---

### 2️⃣ Iniciar el Sistema

**Backend:**
```
1. Abrir Visual Studio
2. F5 para ejecutar WebApi
3. Verificar que está corriendo en puerto 50948
```

**Frontend:**
```
1. Abrir VS Code
2. Clic derecho en frontend/auth.html
3. "Open with Live Server"
```

---

### 3️⃣ Verificar Paginación en Alertas

1. **Login** con: `admin` / `Admin123!`

2. **Ir a "Alertas"** en el menú

3. **Verificar** que aparece en el footer de la tabla:
   ```
   Mostrando 1 - 10 de 20 registros   Por página: [10 ▼]
   
   [<<] [<] [1] [2] [>] [>>]
   ```

4. **Probar navegación:**
   - Clic en **[2]** → Debe mostrar alertas 11-20
   - Clic en **[<]** → Debe volver a alertas 1-10
   - Clic en **[>>]** → Debe ir a última página (2)
   - Clic en **[<<]** → Debe volver a primera página (1)

5. **Probar cambio de items:**
   - Cambiar a **25 por página**
   - Ahora debe mostrar todas las 20 alertas en 1 página
   - Controles de navegación deshabilitados (solo 1 página)

6. **Probar con filtros:**
   - Aplicar filtro: **Estado = Pendiente**
   - Paginación debe actualizarse con resultados filtrados
   - Limpiar filtros → Vuelve a mostrar todas paginadas

---

### 4️⃣ Verificar Paginación en Legajos

1. **Ir a "Legajos"** en el menú

2. **Verificar** que aparece en el footer:
   ```
   Mostrando 1 - 10 de 10 registros   Por página: [10 ▼]
   
   Controles ocultos (no necesarios con solo 10 items)
   ```

3. **Agregar más legajos** (opcional):
   - Si agregas 5 legajos más (total 15)
   - Debe aparecer paginación: Página 1 (10) y Página 2 (5)

---

## ✅ Checklist de Verificación

### Controles Visuales:
- [ ] Footer con paginación aparece debajo de la tabla
- [ ] Muestra "Mostrando X - Y de Z registros"
- [ ] Botones de navegación visibles
- [ ] Selector "Por página" con opciones (10, 25, 50, 100)
- [ ] Diseño responsive (se adapta a pantalla)

### Funcionalidad:
- [ ] Botón "Siguiente" cambia a página 2
- [ ] Botón "Anterior" vuelve a página 1
- [ ] Clic en número de página funciona
- [ ] Botones "Primera" y "Última" funcionan
- [ ] Cambiar items por página funciona
- [ ] Filtros + paginación funcionan juntos
- [ ] Búsqueda + paginación funcionan juntos

### Estados de Botones:
- [ ] Botones deshabilitados en primera página: **[<<]** y **[<]**
- [ ] Botones deshabilitados en última página: **[>]** y **[>>]**
- [ ] Botón de página actual destacado en azul
- [ ] Hover effect en botones habilitados

### Edge Cases:
- [ ] Con 0 resultados → Paginación oculta
- [ ] Con 1-10 resultados → Paginación oculta o solo 1 página
- [ ] Con >10 resultados → Paginación visible
- [ ] Al filtrar y quedar <10 → Paginación se oculta

---

## 🐛 Troubleshooting

### Problema 1: No aparece la paginación

**Causa**: Puede que no haya suficientes datos
**Solución**:
```
1. Verificar que ejecutaste: db/datos_demo.sql
2. Verificar en SQL:
   SELECT COUNT(*) FROM dbo.Alerta;  -- Debe ser >= 20
   SELECT COUNT(*) FROM dbo.Legajo;  -- Debe ser >= 10
3. Recargar página (Ctrl+F5)
```

---

### Problema 2: Error en consola (F12)

**Error posible**: `Cannot read property 'setData' of null`
**Causa**: Paginación no inicializada
**Solución**:
```javascript
// Verificar que en page.js existe:
pagination = new Pagination({ ... });

// Asegurarse que load() o DOMContentLoaded crea la instancia
```

---

### Problema 3: Números de página no son clickeables

**Causa**: Event listeners no adjuntados
**Solución**:
```
1. Abrir consola del navegador (F12)
2. Verificar errores JavaScript
3. Recargar página (Ctrl+F5)
4. Si persiste, verificar que pagination.render() se llama
```

---

### Problema 4: Contador muestra números incorrectos

**Ejemplo**: "Mostrando 1 - 10 de 0 registros"
**Causa**: `filteredData` está vacío
**Solución**:
```
1. Verificar que hay datos en la BD
2. Verificar que la API responde correctamente
3. Verificar en consola:
   console.log('Datos:', alertasData.length);
   console.log('Filtrados:', filteredData.length);
```

---

## 📱 Verificación en Diferentes Pantallas

### Desktop (>768px):
```
✓ Muestra números de página completos: [1] [2] [3] ... [10]
✓ Info de registros a la izquierda
✓ Controles a la derecha
✓ Todo en una línea
```

### Mobile (<768px):
```
✓ Info de registros arriba
✓ Controles abajo
✓ Muestra "3/10" en lugar de números
✓ Botones [<] [>] visibles
✓ Layout vertical (columna)
```

---

## 🔍 Debug Mode

### Consola del Navegador (F12):

Al navegar entre páginas, deberías ver:
```
📄 Cambio a página 2
📄 Cambio a página 1
📋 Items por página cambiados a: 25
```

Al aplicar filtros:
```
📊 Aplicando filtros: { busqueda: "García" }
✅ Total alertas después de filtrar: 5
```

---

## 💡 Tips para la Demo

1. **Prepara datos abundantes**:
   - Mínimo 20 alertas para ver paginación
   - Mínimo 15 legajos para ver efecto

2. **Demuestra la flexibilidad**:
   ```
   "Puedo ver 10, 25, 50 o incluso 100 a la vez según necesite"
   [Cambiar selector de items por página]
   ```

3. **Muestra la combinación con filtros**:
   ```
   "Si filtro por 'Prioridad Alta', la paginación se ajusta 
   automáticamente a los resultados filtrados"
   [Aplicar filtro, mostrar cómo cambia la paginación]
   ```

4. **Destaca el rendimiento**:
   ```
   "El sistema mantiene velocidad constante incluso con 
   cientos de registros porque solo renderiza 10-25 a la vez"
   ```

---

## ✅ Resumen

**Implementado**:
- ✅ Paginación en alertas.html
- ✅ Paginación en legajos.html
- ✅ Controles de navegación completos
- ✅ Selector de items por página
- ✅ Compatibilidad con filtros y búsqueda
- ✅ Diseño responsive
- ✅ Sin errores de sintaxis

**Estado**: 🟢 **LISTO PARA USAR**

---

**Fecha**: Octubre 2025  
**Versión**: 1.0  
**Documentación**: PAGINACION_IMPLEMENTADA.md

