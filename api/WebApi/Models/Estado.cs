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
            using (SqlCommand cmd = new SqlCommand("SP_Estado_GetAll", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                conn.Open();
                da.Fill(dt);
                return dt;
            }
        }
    }
}


