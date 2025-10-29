using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    /// <summary>
    /// Modelo de request para login de usuario
    /// </summary>
    public class LoginRequest
    {
        /// <summary>
        /// Nombre de usuario o email
        /// </summary>
        [Required(ErrorMessage = "El usuario es requerido")]
        [StringLength(100, ErrorMessage = "El usuario no puede exceder 100 caracteres")]
        public string Usuario { get; set; }

        /// <summary>
        /// Contraseña del usuario
        /// </summary>
        [Required(ErrorMessage = "La contraseña es requerida")]
        [StringLength(255, MinimumLength = 6, ErrorMessage = "La contraseña debe tener entre 6 y 255 caracteres")]
        public string Password { get; set; }
    }

    /// <summary>
    /// Modelo de request para registro de nuevo usuario
    /// </summary>
    public class RegistroRequest
    {
        [Required(ErrorMessage = "El nombre de usuario es requerido")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "El usuario debe tener entre 3 y 50 caracteres")]
        public string Usuario { get; set; }

        [Required(ErrorMessage = "La contraseña es requerida")]
        [StringLength(255, MinimumLength = 8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres")]
        public string Password { get; set; }

        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "El email no tiene un formato válido")]
        [StringLength(100, ErrorMessage = "El email no puede exceder 100 caracteres")]
        public string Email { get; set; }

        [Required(ErrorMessage = "El nombre completo es requerido")]
        [StringLength(150, ErrorMessage = "El nombre completo no puede exceder 150 caracteres")]
        public string NombreCompleto { get; set; }

        [Required(ErrorMessage = "El rol es requerido")]
        public int RolId { get; set; }
    }

    /// <summary>
    /// Modelo de request para cambio de contraseña
    /// </summary>
    public class CambioPasswordRequest
    {
        [Required(ErrorMessage = "La contraseña actual es requerida")]
        public string PasswordActual { get; set; }

        [Required(ErrorMessage = "La nueva contraseña es requerida")]
        [StringLength(255, MinimumLength = 8, ErrorMessage = "La nueva contraseña debe tener al menos 8 caracteres")]
        public string PasswordNueva { get; set; }

        [Required(ErrorMessage = "Debe confirmar la nueva contraseña")]
        [Compare("PasswordNueva", ErrorMessage = "Las contraseñas no coinciden")]
        public string PasswordNuevaConfirmacion { get; set; }
    }

    /// <summary>
    /// Modelo de response para login exitoso
    /// </summary>
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public UsuarioInfo Usuario { get; set; }
        public string Message { get; set; }
    }

    /// <summary>
    /// Información básica del usuario para response
    /// </summary>
    public class UsuarioInfo
    {
        public int Id { get; set; }
        public string Usuario { get; set; }
        public string Email { get; set; }
        public string NombreCompleto { get; set; }
        public string Rol { get; set; }
        public int RolNivel { get; set; }
    }
}

