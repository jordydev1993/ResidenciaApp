using System;
using System.Data;
using System.Data.SqlClient;

namespace WebApi.Models
{
	public class Tutor
	{
		Db db = new Db();

		public int Id { get; set; }
		public string Nombre { get; set; }
		public string Apellido { get; set; }
		public string Telefono { get; set; }
		public string Email { get; set; }

		public DataTable ListarTodos()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand(@"SELECT Id, Nombre, Apellido, Telefono, Email FROM dbo.Tutor ORDER BY Apellido, Nombre;", conn))
			{
				SqlDataAdapter da = new SqlDataAdapter(cmd);
				DataTable dt = new DataTable();
				conn.Open();
				da.Fill(dt);
				return dt;
			}
		}

		public int Upsert()
		{
			using (SqlConnection conn = db.GetConnection())
			{
				conn.Open();
			if (Id > 0)
			{
				using (SqlCommand update = new SqlCommand(@"
					UPDATE dbo.Tutor
					   SET Nombre = @Nombre,
					       Apellido = @Apellido,
					       Telefono = @Telefono,
					       Email = @Email,
					       FechaModificacion = SYSDATETIME(),
					       UsuarioModificacion = SYSTEM_USER
					 WHERE Id = @Id;", conn))
				{
					update.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
					update.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = Nombre;
					update.Parameters.Add("@Apellido", SqlDbType.NVarChar, 100).Value = (object)Apellido ?? DBNull.Value;
					update.Parameters.Add("@Telefono", SqlDbType.NVarChar, 50).Value = (object)Telefono ?? DBNull.Value;
					update.Parameters.Add("@Email", SqlDbType.NVarChar, 100).Value = (object)Email ?? DBNull.Value;
					update.ExecuteNonQuery();
					return Id;
				}
			}
			else
			{
				using (SqlCommand insert = new SqlCommand(@"
					INSERT INTO dbo.Tutor (Nombre, Apellido, Telefono, Email, UsuarioCreacion)
					VALUES (@Nombre, @Apellido, @Telefono, @Email, SYSTEM_USER);
					SELECT CAST(SCOPE_IDENTITY() AS INT);", conn))
				{
					insert.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = Nombre;
					insert.Parameters.Add("@Apellido", SqlDbType.NVarChar, 100).Value = (object)Apellido ?? DBNull.Value;
					insert.Parameters.Add("@Telefono", SqlDbType.NVarChar, 50).Value = (object)Telefono ?? DBNull.Value;
					insert.Parameters.Add("@Email", SqlDbType.NVarChar, 100).Value = (object)Email ?? DBNull.Value;
					var idObj = insert.ExecuteScalar();
					Id = Convert.ToInt32(idObj);
					return Id;
				}
			}
			}
		}

		public int Eliminar()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand("DELETE FROM dbo.Tutor WHERE Id = @Id", conn))
			{
				cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
				conn.Open();
				return cmd.ExecuteNonQuery();
			}
		}
	}
}


