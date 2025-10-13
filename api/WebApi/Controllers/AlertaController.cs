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
    public class AlertaController : ApiController
    {
        // GET: api/Alerta
        public DataTable Get()
        {
            Alerta alerta = new Alerta();
            return alerta.ListarTodos();
        }

        // GET: api/Alerta/5
        public string Get(int id)
        {
            return "Implementar SP_Alerta_GetById si es necesario";
        }

        // POST: api/Alerta
        public IHttpActionResult Post([FromBody] Alerta value)
        {
            if (value == null) return BadRequest("Payload requerido");
            if (value.TipoId <= 0) return BadRequest("TipoId requerido");
            if (value.LegajoId <= 0) return BadRequest("LegajoId requerido");
            if (value.EstadoId <= 0) return BadRequest("EstadoId requerido");

            Alerta alerta = new Alerta
            {
                TipoId = value.TipoId,
                LegajoId = value.LegajoId,
                Descripcion = value.Descripcion,
                FechaVencimiento = value.FechaVencimiento,
                PrioridadId = value.PrioridadId,
                EstadoId = value.EstadoId
            };

            var id = alerta.Guardar();
            return Created(Request.RequestUri, new { Id = id });
        }

        // PUT: api/Alerta/5
        public IHttpActionResult Put(int id, [FromBody] Alerta value)
        {
            if (value == null) return BadRequest("Payload requerido");
            if (id <= 0) return BadRequest("Id inválido");
            if (value.EstadoId <= 0) return BadRequest("EstadoId requerido");

            Alerta alerta = new Alerta
            {
                Id = id,
                EstadoId = value.EstadoId,
                PrioridadId = value.PrioridadId,
                Descripcion = value.Descripcion,
                FechaVencimiento = value.FechaVencimiento
            };

            var rows = alerta.Actualizar();
            if (rows == 0) return NotFound();
            return Ok(new { Id = id });
        }

        // POST: api/Alerta/{id}/completar
        [HttpPost]
        [Route("api/Alerta/{id}/completar")]
        public IHttpActionResult Completar(int id)
        {
            if (id <= 0) return BadRequest("Id inválido");
            var alerta = new Alerta { Id = id, EstadoId = 2 /* Completada */ };
            var rows = alerta.Actualizar();
            if (rows == 0) return NotFound();
            return Ok(new { Id = id, EstadoId = 2 });
        }

        // DELETE: api/Alerta/5
        public IHttpActionResult Delete(int id)
        {
            Alerta alerta = new Alerta { Id = id };
            alerta.Eliminar();
            return Ok("Alerta eliminada correctamente");
        }
    }
}
