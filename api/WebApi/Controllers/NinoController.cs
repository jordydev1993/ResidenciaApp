using System;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class NinoController : ApiController
    {
        // POST: api/Nino
        public IHttpActionResult Post([FromBody] Nino value)
        {
            try
            {
                if (value == null || string.IsNullOrWhiteSpace(value.DNI))
                    return BadRequest("DNI requerido");

                if (string.IsNullOrWhiteSpace(value.NombreCompleto))
                    return BadRequest("NombreCompleto requerido");

                if (value.FechaNacimiento == default(DateTime))
                    return BadRequest("FechaNacimiento requerida");

                var nino = new Nino
                {
                    DNI = value.DNI,
                    NombreCompleto = value.NombreCompleto,
                    FechaNacimiento = value.FechaNacimiento
                };

                nino.Upsert();

                return Ok(nino);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}


