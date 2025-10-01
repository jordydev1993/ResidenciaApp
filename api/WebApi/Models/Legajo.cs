using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Web;

namespace WebApi.Models
{
    public class Legajo
    {
        Db db = new Db();

        #region Propiedades
        public int Id { get; set; }
        public string DNI { get; set; }
        public DateTime FechaIngreso { get; set; }
        public int EstadoId { get; set; }
        public string TutorAsignado { get; set; }
        public string Observaciones { get; set; }
        #endregion

        #region Métodos

        // 1. Listar todos los legajos
        public DataTable ListarTodos()
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Legajo_GetAll", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();

                conn.Open();
                da.Fill(dt);
                conn.Close();

                return dt;
            }
        }

        // 2. Obtener legajo por Id
        public DataTable ObtenerPorId(int id)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Legajo_GetById", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();

                conn.Open();
                da.Fill(dt);
                conn.Close();

                return dt;
            }
        }

        // 3. Guardar nuevo legajo
        public int Guardar()
        {
            using (SqlConnection conn = db.GetConnection())
            using (SqlCommand cmd = new SqlCommand("SP_Legajo_Insert", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@DNI", SqlDbType.VarChar, 20).Value = DNI;
                cmd.Parameters.Add("@FechaIngreso", SqlDbType.Date).Value = FechaIngreso;
                cmd.Parameters.Add("@EstadoId", SqlDbType.Int).Value = EstadoId;
                cmd.Parameters.Add("@TutorAsignado", SqlDbType.NVarChar, 100).Value =
                    string.IsNullOrWhiteSpace(TutorAsignado) ? (object)DBNull.Value : TutorAsignado;
                cmd.Parameters.Add("@Observaciones", SqlDbType.NVarChar, 500).Value =
                    string.IsNullOrWhiteSpace(Observaciones) ? (object)DBNull.Value : Observaciones;

                conn.Open();
                var result = cmd.ExecuteScalar();           // SELECT SCOPE_IDENTITY()
                var nuevoId = Convert.ToInt32(result);
                this.Id = nuevoId;
                return nuevoId;
            }
        }

        // 4. Actualizar legajo
        public int Actualizar()
        {
            using (SqlConnection conn = db.GetConnection())
            using (SqlCommand cmd = new SqlCommand("SP_Legajo_Update", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
                cmd.Parameters.Add("@EstadoId", SqlDbType.Int).Value = EstadoId;
                cmd.Parameters.Add("@TutorAsignado", SqlDbType.NVarChar, 100).Value =
                    string.IsNullOrWhiteSpace(TutorAsignado) ? (object)DBNull.Value : TutorAsignado;
                cmd.Parameters.Add("@Observaciones", SqlDbType.NVarChar, 500).Value =
                    string.IsNullOrWhiteSpace(Observaciones) ? (object)DBNull.Value : Observaciones;

                conn.Open();
                return cmd.ExecuteNonQuery();
            }
        }

        // 5. Eliminar legajo
        public void Eliminar()
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Legajo_Delete", conn);
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