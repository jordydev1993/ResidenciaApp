using System;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class TutorController : ApiController
    {
        // GET: api/Tutor
        public IHttpActionResult Get()
        {
            try
            {
                var tutor = new Tutor();
                var dt = tutor.ListarTodos();
                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // POST: api/Tutor
        public IHttpActionResult Post([FromBody] Tutor value)
        {
            try
            {
                if (value == null || string.IsNullOrWhiteSpace(value.Nombre))
                    return BadRequest("Nombre requerido");
                var tutor = new Tutor
                {
                    Nombre = value.Nombre,
                    Apellido = value.Apellido,
                    Telefono = value.Telefono,
                    Email = value.Email
                };
                var id = tutor.Upsert();
                tutor.Id = id;
                return Created(Request.RequestUri, tutor);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // PUT: api/Tutor/{id}
        public IHttpActionResult Put(int id, [FromBody] Tutor value)
        {
            try
            {
                if (value == null || string.IsNullOrWhiteSpace(value.Nombre))
                    return BadRequest("Nombre requerido");
                var tutor = new Tutor
                {
                    Id = id,
                    Nombre = value.Nombre,
                    Apellido = value.Apellido,
                    Telefono = value.Telefono,
                    Email = value.Email
                };
                var newId = tutor.Upsert();
                tutor.Id = id;
                return Ok(tutor);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // DELETE: api/Tutor/{id}
        public IHttpActionResult Delete(int id)
        {
            try
            {
                var tutor = new Tutor { Id = id };
                var rows = tutor.Eliminar();
                if (rows == 0) return NotFound();
                return Ok($"Tutor {id} eliminado");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}


