using System;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class EstadoController : ApiController
    {
        // GET: api/Estado
        public IHttpActionResult Get()
        {
            try
            {
                var estado = new Estado();
                var dt = estado.ListarTodos();
                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // POST: api/Estado
        public IHttpActionResult Post([FromBody] Estado value)
        {
            try
            {
                if (value == null || string.IsNullOrWhiteSpace(value.Nombre))
                    return BadRequest("Nombre requerido");
                var estado = new Estado
                {
                    Nombre = value.Nombre,
                    Descripcion = value.Descripcion
                };
                var id = estado.Insertar();
                estado.Id = id;
                return Created(Request.RequestUri, estado);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // PUT: api/Estado/{id}
        public IHttpActionResult Put(int id, [FromBody] Estado value)
        {
            try
            {
                if (value == null || string.IsNullOrWhiteSpace(value.Nombre))
                    return BadRequest("Nombre requerido");
                var estado = new Estado
                {
                    Id = id,
                    Nombre = value.Nombre,
                    Descripcion = value.Descripcion
                };
                var rows = estado.Actualizar();
                if (rows == 0) return NotFound();
                return Ok(estado);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // DELETE: api/Estado/{id}
        public IHttpActionResult Delete(int id)
        {
            try
            {
                var estado = new Estado { Id = id };
                var rows = estado.Eliminar();
                if (rows == 0) return NotFound();
                return Ok($"Estado {id} eliminado");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}


