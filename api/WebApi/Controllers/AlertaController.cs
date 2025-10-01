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
            Alerta alerta = new Alerta
            {
                TipoId = value.TipoId,
                Descripcion = value.Descripcion,
                FechaVencimiento = value.FechaVencimiento,
                PrioridadId = value.PrioridadId,
                EstadoId = value.EstadoId
            };

            alerta.Guardar();
            return Ok("Alerta registrada correctamente");
        }

        // PUT: api/Alerta/5
        public IHttpActionResult Put(int id, [FromBody] Alerta value)
        {
            Alerta alerta = new Alerta
            {
                Id = id,
                EstadoId = value.EstadoId
            };

            alerta.Actualizar();
            return Ok("Alerta actualizada correctamente");
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
