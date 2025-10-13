using System;
using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class NinoController : ApiController
    {
        // GET: api/Nino
        public IHttpActionResult Get()
        {
            try
            {
                var nino = new Nino();
                var dt = nino.ListarTodos();
                return Ok(dt);
            }
            catch (InvalidOperationException inv)
            {
                // Conflicto de negocio (e.g., DNI duplicado)
                return Content(System.Net.HttpStatusCode.Conflict, new { Message = inv.Message });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // GET: api/Nino/{dni}
        public IHttpActionResult Get(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return BadRequest("DNI requerido");
                var nino = new Nino();
                var dt = nino.ObtenerPorDni(id);
                if (dt.Rows.Count == 0) return NotFound();
                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // POST: api/Nino
        public IHttpActionResult Post([FromBody] Nino value)
        {
            try
            {
                if (value == null || string.IsNullOrWhiteSpace(value.DNI))
                    return BadRequest("DNI requerido");

                if (string.IsNullOrWhiteSpace(value.Nombre))
                    return BadRequest("Nombre requerido");

                if (value.FechaNacimiento == default(DateTime))
                    return BadRequest("FechaNacimiento requerida");

                var nino = new Nino
                {
                    Id = value.Id, // ¡IMPORTANTE! Incluir el Id para que actualice en lugar de crear nuevo
                    DNI = value.DNI,
                    Nombre = value.Nombre,
                    Apellido = value.Apellido,
                    FechaNacimiento = value.FechaNacimiento
                };

                nino.Upsert();

                return Ok(nino);
            }
            catch (InvalidOperationException ex) // Catch specific exception for DNI already registered
            {
                return Content(HttpStatusCode.Conflict, new { message = ex.Message }); // Return 409 Conflict
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // DELETE: api/Nino/{dni}
        public IHttpActionResult Delete(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return BadRequest("DNI requerido");
                var nino = new Nino { DNI = id };
                var rows = nino.Eliminar();
                if (rows == 0) return NotFound();
                return Ok($"Nino {id} eliminado");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}


