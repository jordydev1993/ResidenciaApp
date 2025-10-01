using System;
using System.Data;
using System.Data.SqlClient;

namespace WebApi.Models
{
    public class Nino
    {
        Db db = new Db();

        public string DNI { get; set; }
        public string NombreCompleto { get; set; }
        public DateTime FechaNacimiento { get; set; }

        public void Upsert()
        {
            using (SqlConnection conn = db.GetConnection())
            using (SqlCommand cmd = new SqlCommand("SP_Nino_Upsert", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@DNI", SqlDbType.VarChar, 20).Value = DNI;
                cmd.Parameters.Add("@NombreCompleto", SqlDbType.NVarChar, 100).Value = NombreCompleto;
                cmd.Parameters.Add("@FechaNacimiento", SqlDbType.Date).Value = FechaNacimiento;

                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}


