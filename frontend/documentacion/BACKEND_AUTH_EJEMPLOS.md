# 🧪 Ejemplos de Uso - API de Autenticación

## 📋 Tabla de Contenidos

1. [Ejemplos con cURL](#ejemplos-con-curl)
2. [Ejemplos con JavaScript/Fetch](#ejemplos-con-javascriptfetch)
3. [Ejemplos con Postman](#ejemplos-con-postman)
4. [Casos de Uso Completos](#casos-de-uso-completos)

---

## 🖥️ Ejemplos con cURL

### 1️⃣ Login

```bash
curl -X POST http://localhost:56906/api/Auth/Login \
  -H "Content-Type: application/json" \
  -d '{
    "Usuario": "admin",
    "Password": "Admin123!"
  }'
```

**Response (exitoso):**
```json
{
  "success": true,
  "token": "Rp8B7KJ3vN2...",
  "usuario": {
    "id": 1,
    "usuario": "admin",
    "email": "admin@residencias.com",
    "nombreCompleto": "Administrador del Sistema",
    "rol": "Administrador",
    "rolNivel": 2
  }
}
```

### 2️⃣ Validar Token

```bash
TOKEN="Rp8B7KJ3vN2..."

curl -X GET http://localhost:56906/api/Auth/ValidateToken \
  -H "Authorization: Bearer $TOKEN"
```

### 3️⃣ Logout

```bash
curl -X POST http://localhost:56906/api/Auth/Logout \
  -H "Authorization: Bearer $TOKEN"
```

### 4️⃣ Registrar Usuario

```bash
curl -X POST http://localhost:56906/api/Auth/Register \
  -H "Content-Type: application/json" \
  -d '{
    "Usuario": "operador1",
    "Password": "Operador123!",
    "Email": "operador1@residencias.com",
    "NombreCompleto": "Juan Operador",
    "RolId": 2
  }'
```

### 5️⃣ Cambiar Contraseña

```bash
curl -X POST http://localhost:56906/api/Auth/ChangePassword \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "PasswordActual": "Admin123!",
    "PasswordNueva": "NewAdmin456!",
    "PasswordNuevaConfirmacion": "NewAdmin456!"
  }'
```

---

## 🌐 Ejemplos con JavaScript/Fetch

### 1️⃣ Login

```javascript
async function login(usuario, password) {
  try {
    const response = await fetch('http://localhost:56906/api/Auth/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Usuario: usuario,
        Password: password
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en login');
    }

    const data = await response.json();
    
    // Guardar token en localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.usuario));
    
    console.log('Login exitoso:', data.usuario);
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

// Uso
login('admin', 'Admin123!')
  .then(data => console.log('Usuario:', data.usuario))
  .catch(err => console.error('Error:', err.message));
```

### 2️⃣ Validar Token

```javascript
async function validateToken() {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    console.error('No hay token');
    return false;
  }

  try {
    const response = await fetch('http://localhost:56906/api/Auth/ValidateToken', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // Token inválido o expirado
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      return false;
    }

    const data = await response.json();
    console.log('Token válido:', data.usuario);
    return true;
  } catch (error) {
    console.error('Error al validar token:', error);
    return false;
  }
}

// Uso
validateToken()
  .then(valid => {
    if (valid) {
      console.log('Usuario autenticado');
    } else {
      console.log('Redirigir a login');
      window.location.href = '/auth.html';
    }
  });
```

### 3️⃣ Interceptor de Fetch (agregar token automáticamente)

```javascript
// Guardar el fetch original
const originalFetch = window.fetch;

// Sobrescribir fetch para agregar token
window.fetch = function(...args) {
  const token = localStorage.getItem('auth_token');
  
  // Si hay token, agregarlo al header
  if (token && args[1]) {
    args[1].headers = {
      ...args[1].headers,
      'Authorization': `Bearer ${token}`
    };
  } else if (token) {
    args[1] = {
      ...args[1],
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  // Llamar al fetch original
  return originalFetch.apply(this, args)
    .then(response => {
      // Si retorna 401, cerrar sesión
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/auth.html';
      }
      return response;
    });
};
```

### 4️⃣ Logout

```javascript
async function logout() {
  const token = localStorage.getItem('auth_token');
  
  try {
    await fetch('http://localhost:56906/api/Auth/Logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error en logout:', error);
  } finally {
    // Limpiar storage siempre
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/auth.html';
  }
}

// Uso
document.getElementById('btnLogout').addEventListener('click', logout);
```

### 5️⃣ Proteger Páginas

```javascript
// auth-guard.js
function requireAuth() {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    // Guardar página de destino
    sessionStorage.setItem('returnUrl', window.location.href);
    window.location.href = '/auth.html';
    return false;
  }
  
  // Validar token
  validateToken().then(valid => {
    if (!valid) {
      sessionStorage.setItem('returnUrl', window.location.href);
      window.location.href = '/auth.html';
    }
  });
  
  return true;
}

// En cada página protegida
if (!requireAuth()) {
  // La página no se cargará si no está autenticado
}
```

---

## 📮 Ejemplos con Postman

### Colección Postman

Importar esta colección JSON:

```json
{
  "info": {
    "name": "ResidenciaApp - Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"Usuario\": \"admin\",\n  \"Password\": \"Admin123!\"\n}"
        },
        "url": {
          "raw": "http://localhost:56906/api/Auth/Login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "56906",
          "path": ["api", "Auth", "Login"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "if (pm.response.code === 200) {",
              "    var jsonData = pm.response.json();",
              "    pm.environment.set('auth_token', jsonData.token);",
              "    pm.environment.set('user_id', jsonData.usuario.id);",
              "}"
            ]
          }
        }
      ]
    },
    {
      "name": "Validate Token",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{auth_token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:56906/api/Auth/ValidateToken",
          "protocol": "http",
          "host": ["localhost"],
          "port": "56906",
          "path": ["api", "Auth", "ValidateToken"]
        }
      }
    },
    {
      "name": "Logout",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{auth_token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:56906/api/Auth/Logout",
          "protocol": "http",
          "host": ["localhost"],
          "port": "56906",
          "path": ["api", "Auth", "Logout"]
        }
      }
    }
  ]
}
```

### Variables de Entorno Postman

Crear un environment con estas variables:

| Variable | Valor Inicial | Descripción |
|----------|---------------|-------------|
| `base_url` | `http://localhost:56906` | URL base del API |
| `auth_token` | (vacío) | Se llena automáticamente en login |
| `user_id` | (vacío) | Se llena automáticamente en login |

---

## 🎯 Casos de Uso Completos

### Caso 1: Flujo de Login Completo

```javascript
// 1. Login
const loginData = await fetch('http://localhost:56906/api/Auth/Login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    Usuario: 'admin',
    Password: 'Admin123!'
  })
}).then(r => r.json());

// 2. Guardar token
const token = loginData.token;
localStorage.setItem('auth_token', token);

// 3. Hacer petición autenticada
const alertas = await fetch('http://localhost:56906/api/Alerta', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.json());

console.log('Alertas:', alertas);

// 4. Logout
await fetch('http://localhost:56906/api/Auth/Logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

localStorage.removeItem('auth_token');
```

### Caso 2: Renovación Automática de Sesión

```javascript
// Renovar sesión cada 25 minutos (antes de expirar a los 30)
setInterval(async () => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) return;
  
  try {
    const response = await fetch('http://localhost:56906/api/Auth/RenewToken', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Sesión renovada automáticamente');
    } else {
      console.warn('⚠️ No se pudo renovar la sesión');
      // Redirigir a login
      window.location.href = '/auth.html';
    }
  } catch (error) {
    console.error('Error al renovar sesión:', error);
  }
}, 25 * 60 * 1000); // 25 minutos
```

### Caso 3: Manejo de Múltiples Intentos Fallidos

```javascript
async function loginConReintentos(usuario, password, maxIntentos = 3) {
  let intentos = 0;
  
  while (intentos < maxIntentos) {
    try {
      const response = await fetch('http://localhost:56906/api/Auth/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Usuario: usuario, Password: password })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login exitoso');
        return data;
      }
      
      const error = await response.json();
      intentos++;
      
      if (response.status === 403) {
        // Usuario bloqueado
        throw new Error('Usuario bloqueado. Contacte al administrador.');
      }
      
      console.warn(`⚠️ Intento ${intentos}/${maxIntentos} fallido: ${error.error}`);
      
      if (intentos >= maxIntentos) {
        throw new Error('Máximo de intentos alcanzado');
      }
      
      // Esperar antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      if (intentos >= maxIntentos) {
        throw error;
      }
    }
  }
}

// Uso
loginConReintentos('admin', 'Admin123!')
  .then(data => console.log('Login exitoso:', data))
  .catch(err => console.error('Error:', err.message));
```

### Caso 4: Verificación de Permisos por Rol

```javascript
function requireRole(roleName) {
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  
  if (userData.rol !== roleName) {
    alert('No tiene permisos para acceder a esta función');
    return false;
  }
  
  return true;
}

function requireMinLevel(level) {
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  
  if (userData.rolNivel < level) {
    alert('No tiene permisos suficientes para esta acción');
    return false;
  }
  
  return true;
}

// Uso en botones
document.getElementById('btnEliminar').addEventListener('click', () => {
  if (!requireMinLevel(2)) { // Solo administradores
    return;
  }
  
  // Ejecutar eliminación
  eliminarRegistro();
});
```

### Caso 5: Sistema de Notificaciones de Sesión

```javascript
class SessionManager {
  constructor() {
    this.token = null;
    this.expirationTime = null;
    this.warningShown = false;
  }
  
  async login(usuario, password) {
    const response = await fetch('http://localhost:56906/api/Auth/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Usuario: usuario, Password: password })
    });
    
    if (!response.ok) {
      throw new Error('Login fallido');
    }
    
    const data = await response.json();
    this.token = data.token;
    this.expirationTime = Date.now() + (30 * 60 * 1000); // 30 minutos
    
    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('user_data', JSON.stringify(data.usuario));
    
    this.startExpirationMonitor();
    
    return data;
  }
  
  startExpirationMonitor() {
    // Verificar cada minuto
    this.intervalId = setInterval(() => {
      const timeLeft = this.expirationTime - Date.now();
      const minutesLeft = Math.floor(timeLeft / 60000);
      
      // Advertir 5 minutos antes de expirar
      if (minutesLeft <= 5 && !this.warningShown) {
        this.showExpirationWarning(minutesLeft);
        this.warningShown = true;
      }
      
      // Sesión expirada
      if (timeLeft <= 0) {
        this.handleExpiration();
      }
    }, 60000); // Cada minuto
  }
  
  showExpirationWarning(minutesLeft) {
    const extendSession = confirm(
      `Su sesión expirará en ${minutesLeft} minutos.\n¿Desea extender la sesión?`
    );
    
    if (extendSession) {
      this.renewSession();
    }
  }
  
  async renewSession() {
    try {
      const response = await fetch('http://localhost:56906/api/Auth/RenewToken', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      
      if (response.ok) {
        this.expirationTime = Date.now() + (30 * 60 * 1000);
        this.warningShown = false;
        console.log('✅ Sesión renovada');
      }
    } catch (error) {
      console.error('Error al renovar sesión:', error);
    }
  }
  
  handleExpiration() {
    clearInterval(this.intervalId);
    localStorage.clear();
    alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
    window.location.href = '/auth.html';
  }
  
  async logout() {
    clearInterval(this.intervalId);
    
    try {
      await fetch('http://localhost:56906/api/Auth/Logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
    } catch (error) {
      console.error('Error en logout:', error);
    }
    
    localStorage.clear();
    window.location.href = '/auth.html';
  }
}

// Uso
const session = new SessionManager();

// En login
session.login('admin', 'Admin123!')
  .then(data => console.log('Bienvenido:', data.usuario.nombreCompleto))
  .catch(err => console.error('Error:', err));

// En botón de logout
document.getElementById('btnLogout').addEventListener('click', () => {
  session.logout();
});
```

---

## 🔧 Debugging Tips

### Ver Token Decodificado (solo para debugging)

```javascript
function decodeToken(token) {
  try {
    // Nota: tokens de este sistema son aleatorios, no JWT
    // Pero puedes verlos en Base64
    const decoded = atob(token);
    console.log('Token (decoded):', decoded);
  } catch (error) {
    console.log('Token:', token);
  }
}
```

### Logs de Red en Console

```javascript
// Activar logs detallados
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 Request:', args[0], args[1]);
  return originalFetch.apply(this, args).then(response => {
    console.log('📥 Response:', response.status, response.statusText);
    return response;
  });
};
```

---

## 📚 Recursos

- [Fetch API MDN](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)
- [Authorization Header](https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Authorization)
- [HTTP Status Codes](https://developer.mozilla.org/es/docs/Web/HTTP/Status)

---

**Fecha**: Octubre 2025  
**Versión**: 1.0

