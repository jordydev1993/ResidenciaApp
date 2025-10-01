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
    }
}


