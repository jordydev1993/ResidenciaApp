using System;
using System.Data;
using System.Data.SqlClient;

namespace WebApi.Models
{
	public class Estado
	{
		Db db = new Db();

		public int Id { get; set; }
		public string Nombre { get; set; }
		public string Descripcion { get; set; }

		public DataTable ListarTodos()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand(@"SELECT Id, Nombre, Descripcion FROM dbo.Estado ORDER BY Nombre;", conn))
			{
				SqlDataAdapter da = new SqlDataAdapter(cmd);
				DataTable dt = new DataTable();
				conn.Open();
				da.Fill(dt);
				return dt;
			}
		}

		public int Insertar()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand(@"
				INSERT INTO dbo.Estado (Nombre, Descripcion)
				VALUES (@Nombre, @Descripcion);
				SELECT CAST(SCOPE_IDENTITY() AS INT);", conn))
			{
				cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 50).Value = Nombre;
				cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 100).Value = (object)Descripcion ?? DBNull.Value;
				conn.Open();
				var result = cmd.ExecuteScalar();
				return Convert.ToInt32(result);
			}
		}

		public int Actualizar()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand(@"
				UPDATE dbo.Estado
				   SET Nombre = @Nombre,
				       Descripcion = @Descripcion
				 WHERE Id = @Id;", conn))
			{
				cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
				cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 50).Value = Nombre;
				cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 100).Value = (object)Descripcion ?? DBNull.Value;
				conn.Open();
				return cmd.ExecuteNonQuery();
			}
		}

		public int Eliminar()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand("DELETE FROM dbo.Estado WHERE Id = @Id", conn))
			{
				cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
				conn.Open();
				return cmd.ExecuteNonQuery();
			}
		}
	}
}


