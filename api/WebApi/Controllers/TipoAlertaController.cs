using System;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
	public class TipoAlertaController : ApiController
	{
		// GET: api/TipoAlerta
		public IHttpActionResult Get()
		{
			try
			{
				var model = new TipoAlerta();
				var dt = model.ListarTodos();
				return Ok(dt);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// POST: api/TipoAlerta
		public IHttpActionResult Post([FromBody] TipoAlerta value)
		{
			try
			{
				if (value == null || string.IsNullOrWhiteSpace(value.Nombre)) return BadRequest("Nombre requerido");
				var model = new TipoAlerta { Nombre = value.Nombre, Descripcion = value.Descripcion };
				var id = model.Insertar();
				model.Id = id;
				return Created(Request.RequestUri, model);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// PUT: api/TipoAlerta/{id}
		public IHttpActionResult Put(int id, [FromBody] TipoAlerta value)
		{
			try
			{
				if (value == null || string.IsNullOrWhiteSpace(value.Nombre)) return BadRequest("Nombre requerido");
				var model = new TipoAlerta { Id = id, Nombre = value.Nombre, Descripcion = value.Descripcion };
				var rows = model.Actualizar();
				if (rows == 0) return NotFound();
				return Ok(model);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// DELETE: api/TipoAlerta/{id}
		public IHttpActionResult Delete(int id)
		{
			try
			{
				var model = new TipoAlerta { Id = id };
				var rows = model.Eliminar();
				if (rows == 0) return NotFound();
				return Ok($"TipoAlerta {id} eliminado");
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
	}
}


