using System;
using System.Data;
using System.Data.SqlClient;

namespace WebApi.Models
{
	public class Nino
	{
		Db db = new Db();

		public int Id { get; set; }
		public string DNI { get; set; }
		public string Nombre { get; set; }
		public string Apellido { get; set; }
		public DateTime FechaNacimiento { get; set; }
		public DateTime? FechaModificacion { get; set; }

		// Inserta o actualiza. Crea nuevo si Id==0 y el DNI no existe; si el DNI existe lanza error.
		public void Upsert()
		{
			using (SqlConnection conn = db.GetConnection())
			{
				conn.Open();

			if (Id > 0)
			{
				// Actualizar por Id - verificar que el DNI no esté usado por otro registro
				using (SqlCommand check = new SqlCommand("SELECT Id FROM dbo.Nino WHERE Dni = @Dni AND Id != @Id", conn))
				{
					check.Parameters.Add("@Dni", SqlDbType.VarChar, 20).Value = DNI;
					check.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
					var existing = check.ExecuteScalar();
					if (existing != null && existing != DBNull.Value)
						throw new InvalidOperationException("DNI ya registrado por otro niño");
				}

				using (SqlCommand updateById = new SqlCommand(@"
					UPDATE dbo.Nino
					   SET Dni = @Dni,
					       Nombre = @Nombre,
					       Apellido = @Apellido,
					       FechaNacimiento = @FechaNacimiento,
					       FechaModificacion = SYSDATETIME(),
					       UsuarioModificacion = SYSTEM_USER
					 WHERE Id = @Id;", conn))
				{
					updateById.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
					updateById.Parameters.Add("@Dni", SqlDbType.VarChar, 20).Value = DNI;
					updateById.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = Nombre;
					updateById.Parameters.Add("@Apellido", SqlDbType.NVarChar, 100).Value = (object)Apellido ?? DBNull.Value;
					updateById.Parameters.Add("@FechaNacimiento", SqlDbType.Date).Value = FechaNacimiento;
					int rows = updateById.ExecuteNonQuery();
					if (rows == 0)
						throw new InvalidOperationException("Niño no encontrado para actualizar");
				}
			}
				else
				{
					// Alta: si el DNI ya existe, rechazar
					using (SqlCommand check = new SqlCommand("SELECT Id FROM dbo.Nino WHERE Dni = @Dni", conn))
					{
						check.Parameters.Add("@Dni", SqlDbType.VarChar, 20).Value = DNI;
						var existing = check.ExecuteScalar();
						if (existing != null && existing != DBNull.Value)
							throw new InvalidOperationException("DNI ya registrado");
					}

					using (SqlCommand insert = new SqlCommand(@"
						INSERT INTO dbo.Nino (Dni, Apellido, Nombre, FechaNacimiento, UsuarioCreacion)
						VALUES (@Dni, @Apellido, @Nombre, @FechaNacimiento, SYSTEM_USER);
						SELECT CAST(SCOPE_IDENTITY() AS INT);", conn))
					{
						insert.Parameters.Add("@Dni", SqlDbType.VarChar, 20).Value = DNI;
						insert.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = Nombre;
						insert.Parameters.Add("@Apellido", SqlDbType.NVarChar, 100).Value = (object)Apellido ?? DBNull.Value;
						insert.Parameters.Add("@FechaNacimiento", SqlDbType.Date).Value = FechaNacimiento;
						var newIdObj = insert.ExecuteScalar();
						Id = Convert.ToInt32(newIdObj);
					}
				}
			}
		}

	public DataTable ListarTodos()
	{
		using (SqlConnection conn = db.GetConnection())
		using (SqlCommand cmd = new SqlCommand(@"
			SELECT 
				N.Id, 
				N.Dni, 
				N.Apellido, 
				N.Nombre, 
				N.FechaNacimiento, 
				N.FechaCreacion, 
				N.FechaModificacion,
				E.Nombre AS Estado,
				L.Id AS LegajoId
			FROM dbo.Nino N
			LEFT JOIN dbo.Legajo L ON L.NinoId = N.Id
			LEFT JOIN dbo.Estado E ON E.Id = L.EstadoId
			ORDER BY N.Apellido, N.Nombre;", conn))
		{
			SqlDataAdapter da = new SqlDataAdapter(cmd);
			DataTable dt = new DataTable();
			conn.Open();
			da.Fill(dt);
			return dt;
		}
	}

		public DataTable ObtenerPorDni(string dni)
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand(@"SELECT TOP 1 Id, Dni, Apellido, Nombre, FechaNacimiento FROM dbo.Nino WHERE Dni = @Dni;", conn))
			{
				cmd.Parameters.Add("@Dni", SqlDbType.VarChar, 20).Value = dni;
				SqlDataAdapter da = new SqlDataAdapter(cmd);
				DataTable dt = new DataTable();
				conn.Open();
				da.Fill(dt);
				return dt;
			}
		}

		public int Eliminar()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand("DELETE FROM dbo.Nino WHERE Dni = @Dni", conn))
			{
				cmd.Parameters.Add("@Dni", SqlDbType.VarChar, 20).Value = DNI;
				conn.Open();
				return cmd.ExecuteNonQuery();
			}
		}
	}
}
