using System;
using System.Data;
using System.Data.SqlClient;

namespace WebApi.Models
{
    /// <summary>
    /// Modelo para gestión de sesiones de usuario
    /// </summary>
    public class Sesion
    {
        Db db = new Db();

        #region Propiedades

        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string Token { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaExpiracion { get; set; }
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
        public bool Activa { get; set; }

        #endregion

        #region Métodos de Sesión

        /// <summary>
        /// Crea una nueva sesión para el usuario
        /// </summary>
        /// <param name="ipAddress">Dirección IP del cliente</param>
        /// <param name="userAgent">User-Agent del navegador</param>
        /// <param name="minutosExpiracion">Minutos hasta la expiración (por defecto 30)</param>
        /// <returns>ID de la sesión creada</returns>
        public int Crear(string ipAddress, string userAgent, int minutosExpiracion = 30)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Sesion_Crear", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@UsuarioId", SqlDbType.Int).Value = UsuarioId;
                cmd.Parameters.Add("@Token", SqlDbType.NVarChar, 500).Value = Token;
                cmd.Parameters.Add("@MinutosExpiracion", SqlDbType.Int).Value = minutosExpiracion;
                cmd.Parameters.Add("@IpAddress", SqlDbType.NVarChar, 50).Value = 
                    string.IsNullOrEmpty(ipAddress) ? (object)DBNull.Value : ipAddress;
                cmd.Parameters.Add("@UserAgent", SqlDbType.NVarChar, 500).Value = 
                    string.IsNullOrEmpty(userAgent) ? (object)DBNull.Value : userAgent;

                conn.Open();
                var result = cmd.ExecuteScalar();
                var sesionId = Convert.ToInt32(result);
                this.Id = sesionId;
                conn.Close();

                return sesionId;
            }
        }

        /// <summary>
        /// Valida si un token de sesión es válido
        /// </summary>
        /// <param name="token">Token a validar</param>
        /// <returns>DataTable con información de la sesión y usuario</returns>
        public DataTable Validar(string token)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Sesion_Validar", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Token", SqlDbType.NVarChar, 500).Value = token;

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();

                conn.Open();
                da.Fill(dt);
                conn.Close();

                return dt;
            }
        }

        /// <summary>
        /// Cierra una sesión (la marca como inactiva)
        /// </summary>
        /// <param name="token">Token de la sesión a cerrar</param>
        public void Cerrar(string token)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Sesion_Cerrar", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Token", SqlDbType.NVarChar, 500).Value = token;

                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }

        /// <summary>
        /// Renueva la expiración de una sesión
        /// </summary>
        /// <param name="token">Token de la sesión</param>
        /// <param name="minutosAdicionales">Minutos adicionales (por defecto 30)</param>
        /// <returns>True si se renovó correctamente</returns>
        public bool Renovar(string token, int minutosAdicionales = 30)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand(
                    @"UPDATE dbo.Sesion 
                      SET FechaExpiracion = DATEADD(MINUTE, @Minutos, GETDATE())
                      WHERE Token = @Token AND Activa = 1", conn);

                cmd.Parameters.Add("@Token", SqlDbType.NVarChar, 500).Value = token;
                cmd.Parameters.Add("@Minutos", SqlDbType.Int).Value = minutosAdicionales;

                conn.Open();
                int filasAfectadas = cmd.ExecuteNonQuery();
                conn.Close();

                return filasAfectadas > 0;
            }
        }

        /// <summary>
        /// Obtiene las sesiones activas de un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>DataTable con sesiones activas</returns>
        public DataTable ObtenerSesionesActivas(int usuarioId)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand(
                    @"SELECT Id, Token, FechaInicio, FechaExpiracion, IpAddress, UserAgent
                      FROM dbo.Sesion
                      WHERE UsuarioId = @UsuarioId 
                        AND Activa = 1 
                        AND FechaExpiracion > GETDATE()
                      ORDER BY FechaInicio DESC", conn);

                cmd.Parameters.Add("@UsuarioId", SqlDbType.Int).Value = usuarioId;

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();

                conn.Open();
                da.Fill(dt);
                conn.Close();

                return dt;
            }
        }

        /// <summary>
        /// Cierra todas las sesiones de un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>True si se cerraron sesiones</returns>
        public bool CerrarTodasLasSesiones(int usuarioId)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand(
                    @"UPDATE dbo.Sesion 
                      SET Activa = 0 
                      WHERE UsuarioId = @UsuarioId", conn);

                cmd.Parameters.Add("@UsuarioId", SqlDbType.Int).Value = usuarioId;

                conn.Open();
                int filasAfectadas = cmd.ExecuteNonQuery();
                conn.Close();

                return filasAfectadas > 0;
            }
        }

        /// <summary>
        /// Limpia sesiones expiradas (mantenimiento)
        /// </summary>
        /// <returns>Número de sesiones eliminadas</returns>
        public int LimpiarSesionesExpiradas()
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand(
                    @"DELETE FROM dbo.Sesion 
                      WHERE FechaExpiracion < GETDATE() OR Activa = 0", conn);

                conn.Open();
                int filasEliminadas = cmd.ExecuteNonQuery();
                conn.Close();

                return filasEliminadas;
            }
        }

        #endregion
    }
}

