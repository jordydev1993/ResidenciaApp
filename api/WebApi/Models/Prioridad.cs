using System;
using System.Data;
using System.Data.SqlClient;

namespace WebApi.Models
{
	public class Prioridad
	{
		Db db = new Db();

		public int Id { get; set; }
		public string Nombre { get; set; }
		public string Color { get; set; }
		public int? Orden { get; set; }

		public DataTable ListarTodos()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand("SELECT Id, Nombre, Color, Orden FROM dbo.Prioridad ORDER BY Orden, Nombre;", conn))
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
			using (SqlCommand cmd = new SqlCommand(@"INSERT INTO dbo.Prioridad (Nombre, Color, Orden) VALUES (@Nombre, @Color, @Orden); SELECT CAST(SCOPE_IDENTITY() AS INT);", conn))
			{
				cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 50).Value = Nombre;
				cmd.Parameters.Add("@Color", SqlDbType.VarChar, 7).Value = (object)Color ?? DBNull.Value;
				cmd.Parameters.Add("@Orden", SqlDbType.Int).Value = (object)Orden ?? DBNull.Value;
				conn.Open();
				return (int)cmd.ExecuteScalar();
			}
		}

		public int Actualizar()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand(@"UPDATE dbo.Prioridad SET Nombre=@Nombre, Color=@Color, Orden=@Orden WHERE Id=@Id;", conn))
			{
				cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
				cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 50).Value = Nombre;
				cmd.Parameters.Add("@Color", SqlDbType.VarChar, 7).Value = (object)Color ?? DBNull.Value;
				cmd.Parameters.Add("@Orden", SqlDbType.Int).Value = (object)Orden ?? DBNull.Value;
				conn.Open();
				return cmd.ExecuteNonQuery();
			}
		}

		public int Eliminar()
		{
			using (SqlConnection conn = db.GetConnection())
			using (SqlCommand cmd = new SqlCommand("DELETE FROM dbo.Prioridad WHERE Id=@Id", conn))
			{
				cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
				conn.Open();
				return cmd.ExecuteNonQuery();
			}
		}
	}
}


