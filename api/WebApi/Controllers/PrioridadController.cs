using System;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
	//este codigo sirve para la gestion de prioridades de las alertas
	public class PrioridadController : ApiController
	{
		// GET: api/Prioridad
		public IHttpActionResult Get()
		{
			try
			{
				var model = new Prioridad();
				var dt = model.ListarTodos();
				return Ok(dt);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// POST: api/Prioridad
		public IHttpActionResult Post([FromBody] Prioridad value)
		{
			try
			{
				if (value == null || string.IsNullOrWhiteSpace(value.Nombre)) return BadRequest("Nombre requerido");
				var model = new Prioridad { Nombre = value.Nombre, Color = value.Color, Orden = value.Orden };
				var id = model.Insertar();
				model.Id = id;
				return Created(Request.RequestUri, model);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// PUT: api/Prioridad/{id}
		public IHttpActionResult Put(int id, [FromBody] Prioridad value)
		{
			try
			{
				if (value == null || string.IsNullOrWhiteSpace(value.Nombre)) return BadRequest("Nombre requerido");
				var model = new Prioridad { Id = id, Nombre = value.Nombre, Color = value.Color, Orden = value.Orden };
				var rows = model.Actualizar();
				if (rows == 0) return NotFound();
				return Ok(model);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		// DELETE: api/Prioridad/{id}
		public IHttpActionResult Delete(int id)
		{
			try
			{
				var model = new Prioridad { Id = id };
				var rows = model.Eliminar();
				if (rows == 0) return NotFound();
				return Ok($"Prioridad {id} eliminada");
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
	}
}


