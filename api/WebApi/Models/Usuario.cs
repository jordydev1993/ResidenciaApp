using System;
using System.Data;
using System.Data.SqlClient;

namespace WebApi.Models
{
    /// <summary>
    /// Modelo para gestión de usuarios y autenticación
    /// </summary>
    public class Usuario
    {
        Db db = new Db();

        #region Propiedades

        public int Id { get; set; }
        public string UsuarioNombre { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
        public string NombreCompleto { get; set; }
        public int RolId { get; set; }
        public string RolNombre { get; set; }
        public int RolNivel { get; set; }
        public bool Activo { get; set; }
        public int IntentosLoginFallidos { get; set; }
        public DateTime? UltimoLoginExitoso { get; set; }
        public DateTime? UltimoLoginFallido { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public string UsuarioCreacion { get; set; }
        public string UsuarioModificacion { get; set; }

        #endregion

        #region Métodos de Autenticación

        /// <summary>
        /// Autentica un usuario por nombre de usuario o email
        /// </summary>
        /// <param name="usuario">Nombre de usuario o email</param>
        /// <returns>DataTable con información del usuario</returns>
        public DataTable Autenticar(string usuario)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Usuario_Autenticar", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Usuario", SqlDbType.NVarChar, 50).Value = usuario;

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();

                conn.Open();
                da.Fill(dt);
                conn.Close();

                return dt;
            }
        }

        /// <summary>
        /// Registra un login exitoso y actualiza estadísticas del usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <param name="ipAddress">Dirección IP del cliente</param>
        /// <param name="userAgent">User-Agent del navegador</param>
        public void RegistrarLoginExitoso(int usuarioId, string ipAddress, string userAgent)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Usuario_LoginExitoso", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@UsuarioId", SqlDbType.Int).Value = usuarioId;
                cmd.Parameters.Add("@IpAddress", SqlDbType.NVarChar, 50).Value = 
                    string.IsNullOrEmpty(ipAddress) ? (object)DBNull.Value : ipAddress;
                cmd.Parameters.Add("@UserAgent", SqlDbType.NVarChar, 500).Value = 
                    string.IsNullOrEmpty(userAgent) ? (object)DBNull.Value : userAgent;

                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }

        /// <summary>
        /// Registra un intento de login fallido
        /// </summary>
        /// <param name="usuario">Nombre de usuario o email</param>
        /// <param name="ipAddress">Dirección IP del cliente</param>
        /// <param name="userAgent">User-Agent del navegador</param>
        public void RegistrarLoginFallido(string usuario, string ipAddress, string userAgent)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Usuario_LoginFallido", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Usuario", SqlDbType.NVarChar, 50).Value = usuario;
                cmd.Parameters.Add("@IpAddress", SqlDbType.NVarChar, 50).Value = 
                    string.IsNullOrEmpty(ipAddress) ? (object)DBNull.Value : ipAddress;
                cmd.Parameters.Add("@UserAgent", SqlDbType.NVarChar, 500).Value = 
                    string.IsNullOrEmpty(userAgent) ? (object)DBNull.Value : userAgent;

                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }

        #endregion

        #region Métodos CRUD

        /// <summary>
        /// Crea un nuevo usuario en la base de datos
        /// </summary>
        /// <returns>ID del usuario creado</returns>
        public int Crear()
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("SP_Usuario_Insert", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Usuario", SqlDbType.NVarChar, 50).Value = UsuarioNombre;
                cmd.Parameters.Add("@PasswordHash", SqlDbType.NVarChar, 255).Value = PasswordHash;
                cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 100).Value = Email;
                cmd.Parameters.Add("@NombreCompleto", SqlDbType.NVarChar, 150).Value = NombreCompleto;
                cmd.Parameters.Add("@RolId", SqlDbType.Int).Value = RolId;

                conn.Open();
                var result = cmd.ExecuteScalar();
                var nuevoId = Convert.ToInt32(result);
                this.Id = nuevoId;
                return nuevoId;
            }
        }

        /// <summary>
        /// Obtiene un usuario por ID
        /// </summary>
        /// <param name="id">ID del usuario</param>
        /// <returns>DataTable con información del usuario</returns>
        public DataTable ObtenerPorId(int id)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand(
                    @"SELECT u.Id, u.Usuario, u.Email, u.NombreCompleto, u.RolId, 
                             r.Nombre AS RolNombre, r.Nivel AS RolNivel, u.Activo,
                             u.IntentosLoginFallidos, u.UltimoLoginExitoso, u.UltimoLoginFallido,
                             u.FechaCreacion, u.FechaModificacion
                      FROM dbo.Usuario u
                      INNER JOIN dbo.Rol r ON r.Id = u.RolId
                      WHERE u.Id = @Id", conn);
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();

                conn.Open();
                da.Fill(dt);
                conn.Close();

                return dt;
            }
        }

        /// <summary>
        /// Lista todos los usuarios activos
        /// </summary>
        /// <returns>DataTable con lista de usuarios</returns>
        public DataTable Listar()
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand(
                    @"SELECT u.Id, u.Usuario, u.Email, u.NombreCompleto, 
                             r.Nombre AS RolNombre, r.Nivel AS RolNivel, 
                             u.Activo, u.UltimoLoginExitoso, u.FechaCreacion
                      FROM dbo.Usuario u
                      INNER JOIN dbo.Rol r ON r.Id = u.RolId
                      ORDER BY u.FechaCreacion DESC", conn);

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();

                conn.Open();
                da.Fill(dt);
                conn.Close();

                return dt;
            }
        }

        /// <summary>
        /// Actualiza la información de un usuario
        /// </summary>
        /// <returns>True si se actualizó correctamente</returns>
        public bool Actualizar()
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand(
                    @"UPDATE dbo.Usuario 
                      SET Email = @Email,
                          NombreCompleto = @NombreCompleto,
                          RolId = @RolId,
                          Activo = @Activo,
                          UsuarioModificacion = @UsuarioModificacion,
                          FechaModificacion = GETDATE()
                      WHERE Id = @Id", conn);

                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
                cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 100).Value = Email;
                cmd.Parameters.Add("@NombreCompleto", SqlDbType.NVarChar, 150).Value = NombreCompleto;
                cmd.Parameters.Add("@RolId", SqlDbType.Int).Value = RolId;
                cmd.Parameters.Add("@Activo", SqlDbType.Bit).Value = Activo;
                cmd.Parameters.Add("@UsuarioModificacion", SqlDbType.NVarChar, 100).Value = 
                    string.IsNullOrEmpty(UsuarioModificacion) ? (object)DBNull.Value : UsuarioModificacion;

                conn.Open();
                int filasAfectadas = cmd.ExecuteNonQuery();
                conn.Close();

                return filasAfectadas > 0;
            }
        }

        /// <summary>
        /// Cambia la contraseña de un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <param name="nuevoPasswordHash">Nuevo hash de contraseña</param>
        /// <returns>True si se cambió correctamente</returns>
        public bool CambiarPassword(int usuarioId, string nuevoPasswordHash)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand(
                    @"UPDATE dbo.Usuario 
                      SET PasswordHash = @PasswordHash,
                          FechaModificacion = GETDATE()
                      WHERE Id = @Id", conn);

                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = usuarioId;
                cmd.Parameters.Add("@PasswordHash", SqlDbType.NVarChar, 255).Value = nuevoPasswordHash;

                conn.Open();
                int filasAfectadas = cmd.ExecuteNonQuery();
                conn.Close();

                return filasAfectadas > 0;
            }
        }

        /// <summary>
        /// Desbloquea un usuario (resetea intentos fallidos)
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>True si se desbloqueó correctamente</returns>
        public bool Desbloquear(int usuarioId)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand(
                    @"UPDATE dbo.Usuario 
                      SET IntentosLoginFallidos = 0,
                          Activo = 1,
                          FechaModificacion = GETDATE()
                      WHERE Id = @Id", conn);

                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = usuarioId;

                conn.Open();
                int filasAfectadas = cmd.ExecuteNonQuery();
                conn.Close();

                return filasAfectadas > 0;
            }
        }

        /// <summary>
        /// Elimina (desactiva) un usuario
        /// </summary>
        /// <param name="id">ID del usuario</param>
        /// <returns>True si se eliminó correctamente</returns>
        public bool Eliminar(int id)
        {
            using (SqlConnection conn = db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand(
                    @"UPDATE dbo.Usuario 
                      SET Activo = 0,
                          FechaModificacion = GETDATE()
                      WHERE Id = @Id", conn);

                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;

                conn.Open();
                int filasAfectadas = cmd.ExecuteNonQuery();
                conn.Close();

                return filasAfectadas > 0;
            }
        }

        #endregion
    }
}

