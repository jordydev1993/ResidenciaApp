# Configuración del Backend para Catálogo de Niños

## Estado Actual
La aplicación está configurada para funcionar con datos de prueba cuando el backend no está disponible.

## Configuración del Backend

### Endpoint Requerido
```
POST /api/Nino          - Crear/Actualizar niño
GET /api/Nino           - Listar niños
DELETE /api/Nino/{dni}  - Eliminar niño por DNI
```

### Estructura de Datos Esperada

#### Niño (Request/Response)
```json
{
  "Id": 1,
  "DNI": "12345678",
  "Nombre": "Juan",
  "Apellido": "Pérez", 
  "FechaNacimiento": "2010-05-15",
  "Estado": "activo",
  "LegajoId": "LEG001"
}
```

#### Lista de Niños (GET Response)
```json
[
  {
    "Id": 1,
    "DNI": "12345678",
    "Nombre": "Juan",
    "Apellido": "Pérez",
    "FechaNacimiento": "2010-05-15",
    "Estado": "activo",
    "LegajoId": "LEG001"
  }
]
```

### Headers Requeridos
```
Content-Type: application/json
```

### Códigos de Respuesta
- `200` - Operación exitosa
- `201` - Recurso creado exitosamente
- `400` - Datos inválidos
- `404` - Recurso no encontrado
- `500` - Error interno del servidor

## Activación del Backend

Cuando el backend esté disponible:

1. **Eliminar datos de prueba**: Comentar o eliminar el código de fallback en `assets/js/api/ninoApi.js`
2. **Configurar URL base**: Actualizar la constante `BASE` si es necesario
3. **Verificar CORS**: Asegurar que el backend permita requests desde el frontend

## Datos de Prueba Actuales
- Juan Pérez (DNI: 12345678) - Activo
- María García (DNI: 87654321) - Activo  
- Carlos López (DNI: 11223344) - Egresado

## Notas de Desarrollo
- Los datos de prueba se resetean al recargar la página
- El indicador "Modo Demo" aparece automáticamente cuando se detectan datos de prueba
- Los delays simulados (200-300ms) imitan la latencia de red real



