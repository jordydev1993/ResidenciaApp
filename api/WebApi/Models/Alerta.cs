using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;


namespace WebApi.Models
{
    public class Alerta
    {
        private readonly string connectionString =
    ConfigurationManager.ConnectionStrings["ResidenciaDB"]?.ConnectionString
    ?? throw new InvalidOperationException("Connection string 'ResidenciaDB' no configurada.");
        Db db = new Db();

        #region Propiedades
        public int Id { get; set; }
        public int TipoId { get; set; }
        public int LegajoId { get; set; }
        public string Descripcion { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public int? PrioridadId { get; set; }
        public int EstadoId { get; set; }
        #endregion

        #region Métodos

        // 1. Listar todas las alertas
        public DataTable ListarTodos()
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Alerta_GetAll", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();

                conn.Open();
                da.Fill(dt);
                conn.Close();

                return dt;
            }
        }

        // 2. Guardar nueva alerta
        public int Guardar()
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Alerta_Insert", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@TipoId", SqlDbType.Int).Value = TipoId;
                cmd.Parameters.Add("@PrioridadId", SqlDbType.Int).Value = PrioridadId.HasValue ? (object)PrioridadId.Value : DBNull.Value;
                cmd.Parameters.Add("@EstadoId", SqlDbType.Int).Value = EstadoId;
                cmd.Parameters.Add("@LegajoId", SqlDbType.Int).Value = LegajoId;
                cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 500).Value = (object)Descripcion ?? DBNull.Value;
                cmd.Parameters.Add("@FechaVencimiento", SqlDbType.DateTime2).Value = FechaVencimiento.HasValue ? (object)FechaVencimiento.Value : DBNull.Value;

                conn.Open();
                var result = cmd.ExecuteScalar();
                conn.Close();
                Id = Convert.ToInt32(result);
                return Id;
            }
        }

        // 3. Actualizar alerta
        public int Actualizar()
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Alerta_Update", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
                cmd.Parameters.Add("@EstadoId", SqlDbType.Int).Value = EstadoId;
                cmd.Parameters.Add("@PrioridadId", SqlDbType.Int).Value = PrioridadId.HasValue ? (object)PrioridadId.Value : DBNull.Value;
                cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 500).Value = (object)Descripcion ?? DBNull.Value;
                cmd.Parameters.Add("@FechaVencimiento", SqlDbType.DateTime2).Value = FechaVencimiento.HasValue ? (object)FechaVencimiento.Value : DBNull.Value;

                conn.Open();
                var rows = cmd.ExecuteNonQuery();
                conn.Close();
                return rows;
            }
        }

        // 4. Eliminar alerta
        public void Eliminar()
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Alerta_Delete", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Id;

                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }

        #endregion
    }
}