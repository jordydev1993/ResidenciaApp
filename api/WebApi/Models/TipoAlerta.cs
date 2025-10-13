using System;
using System.Data;
using System.Data.SqlClient;

namespace WebApi.Models
{
	public class TipoAlerta
	{
		Db db = new Db();

		public int Id { get; set; }
		public string Nombre { get; set; }
		public string Descripcion { get; set; }

		public DataTable ListarTodos()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand("SELECT Id, Nombre, Descripcion FROM dbo.TipoAlerta ORDER BY Nombre;", conn))
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
			using (SqlCommand cmd = new SqlCommand(@"INSERT INTO dbo.TipoAlerta (Nombre, Descripcion) VALUES (@Nombre, @Descripcion); SELECT CAST(SCOPE_IDENTITY() AS INT);", conn))
			{
				cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 50).Value = Nombre;
				cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 100).Value = (object)Descripcion ?? DBNull.Value;
				conn.Open();
				return (int)cmd.ExecuteScalar();
			}
		}

		public int Actualizar()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand(@"UPDATE dbo.TipoAlerta SET Nombre=@Nombre, Descripcion=@Descripcion WHERE Id=@Id;", conn))
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
			using (SqlCommand cmd = new SqlCommand("DELETE FROM dbo.TipoAlerta WHERE Id=@Id", conn))
			{
				cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
				conn.Open();
				return cmd.ExecuteNonQuery();
			}
		}
	}
}


