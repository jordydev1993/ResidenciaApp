using System;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
	public class EstadoAlertaController : ApiController
	{
		// GET: api/EstadoAlerta
		public IHttpActionResult Get()
		{
			try
			{
				var model = new EstadoAlerta();
				var dt = model.ListarTodos();
				return Ok(dt);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// POST: api/EstadoAlerta
		public IHttpActionResult Post([FromBody] EstadoAlerta value)
		{
			try
			{
				if (value == null || string.IsNullOrWhiteSpace(value.Nombre)) return BadRequest("Nombre requerido");
				var model = new EstadoAlerta { Nombre = value.Nombre, Descripcion = value.Descripcion };
				var id = model.Insertar();
				model.Id = id;
				return Created(Request.RequestUri, model);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// PUT: api/EstadoAlerta/{id}
		public IHttpActionResult Put(int id, [FromBody] EstadoAlerta value)
		{
			try
			{
				if (value == null || string.IsNullOrWhiteSpace(value.Nombre)) return BadRequest("Nombre requerido");
				var model = new EstadoAlerta { Id = id, Nombre = value.Nombre, Descripcion = value.Descripcion };
				var rows = model.Actualizar();
				if (rows == 0) return NotFound();
				return Ok(model);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// DELETE: api/EstadoAlerta/{id}
		public IHttpActionResult Delete(int id)
		{
			try
			{
				var model = new EstadoAlerta { Id = id };
				var rows = model.Eliminar();
				if (rows == 0) return NotFound();
				return Ok($"EstadoAlerta {id} eliminado");
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
	}
}


