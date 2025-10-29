using System;
using System.Web.Http;
using WebApi.Helpers;

namespace WebApi.Controllers
{
    /// <summary>
    /// Controlador temporal para generar hash de contraseñas
    /// ELIMINAR EN PRODUCCIÓN
    /// </summary>
    [RoutePrefix("api/Test")]
    public class TestController : ApiController
    {
        /// <summary>
        /// Genera un hash de contraseña para insertar en la BD
        /// GET: api/Test/HashPassword?password=Admin123!
        /// </summary>
        [HttpGet]
        [Route("HashPassword")]
        public IHttpActionResult HashPassword(string password)
        {
            try
            {
                if (string.IsNullOrEmpty(password))
                {
                    return BadRequest("Contraseña requerida");
                }

                var hash = PasswordHelper.HashPassword(password);

                return Ok(new
                {
                    success = true,
                    password = password,
                    hash = hash,
                    sql = $"UPDATE dbo.Usuario SET PasswordHash = '{hash}' WHERE Usuario = 'admin';"
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        /// Verifica si una contraseña coincide con un hash
        /// POST: api/Test/VerifyPassword
        /// Body: { "password": "Admin123!", "hash": "..." }
        /// </summary>
        [HttpPost]
        [Route("VerifyPassword")]
        public IHttpActionResult VerifyPassword([FromBody] VerifyPasswordRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.Hash))
                {
                    return BadRequest("Password y Hash requeridos");
                }

                var isValid = PasswordHelper.VerifyPassword(request.Password, request.Hash);

                return Ok(new
                {
                    success = true,
                    isValid = isValid,
                    message = isValid ? "Contraseña correcta" : "Contraseña incorrecta"
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }

    public class VerifyPasswordRequest
    {
        public string Password { get; set; }
        public string Hash { get; set; }
    }
}

