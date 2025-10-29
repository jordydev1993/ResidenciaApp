using System;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApi.Models;
using WebApi.Helpers;

namespace WebApi.Controllers
{
    /// <summary>
    /// Controlador para gestión de autenticación y sesiones
    /// </summary>
    [RoutePrefix("api/Auth")]
    public class AuthController : ApiController
    {
        #region Endpoints de Autenticación

        /// <summary>
        /// Endpoint para iniciar sesión
        /// POST: api/Auth/Login
        /// </summary>
        /// <param name="request">Datos de login (usuario y contraseña)</param>
        /// <returns>Token de sesión y datos del usuario</returns>
        [HttpPost]
        [Route("Login")]
        public IHttpActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                // Validaciones básicas
                if (request == null || string.IsNullOrWhiteSpace(request.Usuario) || 
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest("Usuario y contraseña son requeridos");
                }

                // Obtener información del cliente
                var ipAddress = GetClientIpAddress();
                var userAgent = Request.Headers.UserAgent?.ToString();

                // Buscar usuario en base de datos
                var usuarioModel = new Usuario();
                var dt = usuarioModel.Autenticar(request.Usuario);

                if (dt.Rows.Count == 0)
                {
                    // Usuario no encontrado - registrar intento fallido
                    usuarioModel.RegistrarLoginFallido(request.Usuario, ipAddress, userAgent);
                    return Content(HttpStatusCode.Unauthorized, new 
                    { 
                        success = false,
                        error = "Usuario o contraseña incorrectos" 
                    });
                }

                // Extraer datos del usuario
                var row = dt.Rows[0];
                var usuarioId = Convert.ToInt32(row["Id"]);
                var passwordHash = row["PasswordHash"].ToString();
                var activo = Convert.ToBoolean(row["Activo"]);
                var intentos = Convert.ToInt32(row["IntentosLoginFallidos"]);

                // Verificar si el usuario está activo
                if (!activo)
                {
                    return Content(HttpStatusCode.Forbidden, new 
                    { 
                        success = false,
                        error = "Usuario bloqueado. Contacte al administrador para desbloquear su cuenta." 
                    });
                }

                // Verificar contraseña
                if (!PasswordHelper.VerifyPassword(request.Password, passwordHash))
                {
                    // Contraseña incorrecta - registrar intento fallido
                    usuarioModel.RegistrarLoginFallido(request.Usuario, ipAddress, userAgent);
                    
                    // Calcular intentos restantes
                    var intentosRestantes = 3 - (intentos + 1);
                    var mensaje = intentosRestantes > 0 
                        ? $"Usuario o contraseña incorrectos. Le quedan {intentosRestantes} intentos."
                        : "Usuario bloqueado por múltiples intentos fallidos.";

                    return Content(HttpStatusCode.Unauthorized, new 
                    { 
                        success = false,
                        error = mensaje 
                    });
                }

                // ✅ Login exitoso - registrar en auditoría
                usuarioModel.RegistrarLoginExitoso(usuarioId, ipAddress, userAgent);

                // Crear token de sesión
                var token = TokenHelper.GenerateToken();
                var sesion = new Sesion
                {
                    UsuarioId = usuarioId,
                    Token = token
                };
                sesion.Crear(ipAddress, userAgent, minutosExpiracion: 30);

                // Preparar respuesta con datos del usuario
                var response = new LoginResponse
                {
                    Success = true,
                    Token = token,
                    Usuario = new UsuarioInfo
                    {
                        Id = usuarioId,
                        Usuario = row["Usuario"].ToString(),
                        Email = row["Email"].ToString(),
                        NombreCompleto = row["NombreCompleto"].ToString(),
                        Rol = row["RolNombre"].ToString(),
                        RolNivel = Convert.ToInt32(row["RolNivel"])
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log del error (en producción usar un sistema de logging)
                System.Diagnostics.Debug.WriteLine($"Error en Login: {ex.Message}");
                return InternalServerError(new Exception("Error al procesar la solicitud de login"));
            }
        }

        /// <summary>
        /// Endpoint para cerrar sesión
        /// POST: api/Auth/Logout
        /// </summary>
        /// <returns>Confirmación de cierre de sesión</returns>
        [HttpPost]
        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            try
            {
                var token = GetTokenFromHeader();
                
                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest("Token no proporcionado");
                }

                // Cerrar la sesión
                var sesion = new Sesion();
                sesion.Cerrar(token);

                return Ok(new 
                { 
                    success = true, 
                    message = "Sesión cerrada correctamente" 
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error en Logout: {ex.Message}");
                return InternalServerError(new Exception("Error al cerrar sesión"));
            }
        }

        /// <summary>
        /// Endpoint para validar un token de sesión
        /// GET: api/Auth/ValidateToken
        /// </summary>
        /// <returns>Información del usuario si el token es válido</returns>
        [HttpGet]
        [Route("ValidateToken")]
        public IHttpActionResult ValidateToken()
        {
            try
            {
                var token = GetTokenFromHeader();
                
                if (string.IsNullOrEmpty(token))
                {
                    return Content(HttpStatusCode.Unauthorized, new 
                    { 
                        valid = false, 
                        error = "Token no proporcionado" 
                    });
                }

                // Validar token en base de datos
                var sesion = new Sesion();
                var dt = sesion.Validar(token);

                if (dt.Rows.Count == 0)
                {
                    return Content(HttpStatusCode.Unauthorized, new 
                    { 
                        valid = false, 
                        error = "Token inválido o expirado" 
                    });
                }

                // Token válido - retornar información del usuario
                var row = dt.Rows[0];
                return Ok(new
                {
                    valid = true,
                    usuario = new
                    {
                        id = Convert.ToInt32(row["UsuarioId"]),
                        usuario = row["Usuario"].ToString(),
                        nombreCompleto = row["NombreCompleto"].ToString(),
                        email = row["Email"].ToString(),
                        rol = row["RolNombre"].ToString(),
                        rolNivel = Convert.ToInt32(row["RolNivel"])
                    }
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error en ValidateToken: {ex.Message}");
                return InternalServerError(new Exception("Error al validar token"));
            }
        }

        /// <summary>
        /// Endpoint para renovar una sesión
        /// POST: api/Auth/RenewToken
        /// </summary>
        /// <returns>Confirmación de renovación</returns>
        [HttpPost]
        [Route("RenewToken")]
        public IHttpActionResult RenewToken()
        {
            try
            {
                var token = GetTokenFromHeader();
                
                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest("Token no proporcionado");
                }

                // Renovar sesión
                var sesion = new Sesion();
                var renovado = sesion.Renovar(token, minutosAdicionales: 30);

                if (!renovado)
                {
                    return Content(HttpStatusCode.Unauthorized, new 
                    { 
                        success = false, 
                        error = "No se pudo renovar la sesión" 
                    });
                }

                return Ok(new 
                { 
                    success = true, 
                    message = "Sesión renovada correctamente",
                    nuevaExpiracion = DateTime.Now.AddMinutes(30)
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error en RenewToken: {ex.Message}");
                return InternalServerError(new Exception("Error al renovar token"));
            }
        }

        #endregion

        #region Endpoints de Gestión de Usuarios

        /// <summary>
        /// Endpoint para registrar un nuevo usuario
        /// POST: api/Auth/Register
        /// </summary>
        /// <param name="request">Datos del nuevo usuario</param>
        /// <returns>ID del usuario creado</returns>
        [HttpPost]
        [Route("Register")]
        public IHttpActionResult Register([FromBody] RegistroRequest request)
        {
            try
            {
                // Validaciones
                if (request == null)
                {
                    return BadRequest("Datos de registro requeridos");
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage));
                    return BadRequest(string.Join(", ", errors));
                }

                // Validar fortaleza de contraseña
                if (!PasswordHelper.ValidatePasswordStrength(request.Password))
                {
                    return BadRequest("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
                }

                // Hashear contraseña
                var passwordHash = PasswordHelper.HashPassword(request.Password);

                // Crear usuario
                var usuario = new Usuario
                {
                    UsuarioNombre = request.Usuario,
                    PasswordHash = passwordHash,
                    Email = request.Email,
                    NombreCompleto = request.NombreCompleto,
                    RolId = request.RolId,
                    Activo = true
                };

                var nuevoId = usuario.Crear();

                return Ok(new 
                { 
                    success = true, 
                    id = nuevoId, 
                    message = "Usuario registrado correctamente" 
                });
            }
            catch (SqlException sqlEx) when (sqlEx.Number == 50001)
            {
                // Error: Usuario duplicado
                return Content(HttpStatusCode.Conflict, new { error = "El nombre de usuario ya existe" });
            }
            catch (SqlException sqlEx) when (sqlEx.Number == 50002)
            {
                // Error: Email duplicado
                return Content(HttpStatusCode.Conflict, new { error = "El email ya está registrado" });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error en Register: {ex.Message}");
                return InternalServerError(new Exception("Error al registrar usuario"));
            }
        }

        /// <summary>
        /// Endpoint para cambiar contraseña
        /// POST: api/Auth/ChangePassword
        /// </summary>
        /// <param name="request">Contraseña actual y nueva contraseña</param>
        /// <returns>Confirmación de cambio</returns>
        [HttpPost]
        [Route("ChangePassword")]
        public IHttpActionResult ChangePassword([FromBody] CambioPasswordRequest request)
        {
            try
            {
                // Validar token
                var token = GetTokenFromHeader();
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized();
                }

                // Obtener usuario de la sesión
                var sesion = new Sesion();
                var dtSesion = sesion.Validar(token);

                if (dtSesion.Rows.Count == 0)
                {
                    return Unauthorized();
                }

                var usuarioId = Convert.ToInt32(dtSesion.Rows[0]["UsuarioId"]);

                // Obtener usuario completo
                var usuarioModel = new Usuario();
                var dtUsuario = usuarioModel.ObtenerPorId(usuarioId);

                if (dtUsuario.Rows.Count == 0)
                {
                    return NotFound();
                }

                var passwordHashActual = dtUsuario.Rows[0]["PasswordHash"].ToString();

                // Verificar contraseña actual
                if (!PasswordHelper.VerifyPassword(request.PasswordActual, passwordHashActual))
                {
                    return BadRequest("La contraseña actual es incorrecta");
                }

                // Validar nueva contraseña
                if (!PasswordHelper.ValidatePasswordStrength(request.PasswordNueva))
                {
                    return BadRequest("La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
                }

                // Hashear nueva contraseña
                var nuevoPasswordHash = PasswordHelper.HashPassword(request.PasswordNueva);

                // Actualizar contraseña
                usuarioModel.CambiarPassword(usuarioId, nuevoPasswordHash);

                return Ok(new 
                { 
                    success = true, 
                    message = "Contraseña cambiada correctamente" 
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error en ChangePassword: {ex.Message}");
                return InternalServerError(new Exception("Error al cambiar contraseña"));
            }
        }

        #endregion

        #region Métodos Auxiliares

        /// <summary>
        /// Extrae el token del header Authorization
        /// </summary>
        /// <returns>Token o null si no existe</returns>
        private string GetTokenFromHeader()
        {
            var authHeader = Request.Headers.Authorization;
            if (authHeader != null && authHeader.Scheme == "Bearer")
            {
                return authHeader.Parameter;
            }
            return null;
        }

        /// <summary>
        /// Obtiene la dirección IP del cliente
        /// </summary>
        /// <returns>Dirección IP</returns>
        private string GetClientIpAddress()
        {
            try
            {
                if (Request.Properties.ContainsKey("MS_HttpContext"))
                {
                    var context = ((HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request;
                    
                    // Verificar si está detrás de un proxy
                    var forwarded = context.ServerVariables["HTTP_X_FORWARDED_FOR"];
                    if (!string.IsNullOrEmpty(forwarded))
                    {
                        // Tomar la primera IP si hay múltiples
                        return forwarded.Split(',')[0].Trim();
                    }
                    
                    return context.UserHostAddress;
                }
                return "Unknown";
            }
            catch
            {
                return "Unknown";
            }
        }

        #endregion
    }
}

