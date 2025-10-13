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
        public int NinoId { get; set; }
        public DateTime FechaIngreso { get; set; }
        public int EstadoId { get; set; }
        public int? TutorId { get; set; }
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

                cmd.Parameters.Add("@NinoId", SqlDbType.Int).Value = NinoId;
                cmd.Parameters.Add("@FechaIngreso", SqlDbType.Date).Value = FechaIngreso;
                cmd.Parameters.Add("@EstadoId", SqlDbType.Int).Value = EstadoId;
                cmd.Parameters.Add("@TutorId", SqlDbType.Int).Value = (object)TutorId ?? DBNull.Value;
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
                cmd.Parameters.Add("@TutorId", SqlDbType.Int).Value = (object)TutorId ?? DBNull.Value;
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

                try
                {
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    conn.Close();
                }
                catch (SqlException ex)
                {
                    // Si el SP lanza RAISERROR, capturarlo y relanzar con mensaje amigable
                    if (ex.Message.Contains("alertas asociadas"))
                    {
                        throw new Exception("No se puede eliminar el legajo porque tiene alertas asociadas. Elimine primero las alertas.");
                    }
                    throw;
                }
            }
        }

        #endregion
    }

}