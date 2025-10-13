using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class LegajoController : ApiController
    {
        // GET: api/Legajo
        public DataTable Get()
        {
            Legajo oLegajo = new Legajo();
            return oLegajo.ListarTodos();
        }

        // GET: api/Legajo/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                Legajo oLegajo = new Legajo();
                DataTable dt = oLegajo.ObtenerPorId(id); // necesitas implementar este método con SP_Legajo_GetById

                if (dt.Rows.Count == 0)
                    return NotFound();

                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // POST: api/Legajo
        public IHttpActionResult Post([FromBody] Legajo value)
        {
            try
            {
                if (value == null)
                    return BadRequest("Payload requerido");
                if (value.NinoId <= 0)
                    return BadRequest("NinoId requerido");
                if (value.EstadoId <= 0)
                    return BadRequest("EstadoId requerido");
                if (value.FechaIngreso == default(DateTime))
                    return BadRequest("FechaIngreso requerida");

                Legajo oLegajo = new Legajo
                {
                    NinoId = value.NinoId,
                    FechaIngreso = value.FechaIngreso,
                    EstadoId = value.EstadoId,
                    TutorId = value.TutorId,
                    Observaciones = value.Observaciones
                };

                oLegajo.Guardar();

                // 👇 devolvemos el objeto creado en formato JSON
                return Created(Request.RequestUri, oLegajo);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // PUT: api/Legajo/5
        public IHttpActionResult Put(int id, [FromBody] Legajo value)
        {
            try
            {
                Legajo oLegajo = new Legajo
                {
                    Id = id,
                    EstadoId = value.EstadoId,
                    TutorId = value.TutorId,
                    Observaciones = value.Observaciones
                };

                oLegajo.Actualizar();

                // 👇 devolvemos el objeto actualizado
                return Ok(oLegajo);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // DELETE: api/Legajo/5
        public IHttpActionResult Delete(int id)
        {
            try
            {
                Legajo oLegajo = new Legajo { Id = id };
                oLegajo.Eliminar();

                return Ok(new { message = $"Legajo con Id={id} eliminado correctamente" });
            }
            catch (Exception ex)
            {
                // Devolver error en formato JSON con mensaje legible
                return Content(System.Net.HttpStatusCode.BadRequest, new { error = ex.Message });
            }
        }
    }
    }
