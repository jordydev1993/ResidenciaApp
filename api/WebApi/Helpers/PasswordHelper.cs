using System;
using System.Security.Cryptography;
using System.Text;

namespace WebApi.Helpers
{
    /// <summary>
    /// Helper para gestión segura de contraseñas
    /// NOTA: Esta implementación usa SHA256. Para mayor seguridad, instalar BCrypt.Net-Next desde NuGet
    /// </summary>
    public static class PasswordHelper
    {
        // Configuración del hash
        private const int SaltSize = 32; // 256 bits
        private const int HashSize = 32; // 256 bits
        private const int Iterations = 10000; // Iteraciones PBKDF2

        /// <summary>
        /// Genera un hash seguro de la contraseña usando PBKDF2
        /// </summary>
        /// <param name="password">Contraseña en texto plano</param>
        /// <returns>Hash en formato: salt.hash (Base64)</returns>
        public static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                throw new ArgumentNullException(nameof(password));

            // Generar salt aleatorio
            byte[] salt;
            using (var rng = new RNGCryptoServiceProvider())
            {
                salt = new byte[SaltSize];
                rng.GetBytes(salt);
            }

            // Generar hash con PBKDF2
            byte[] hash;
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations))
            {
                hash = pbkdf2.GetBytes(HashSize);
            }

            // Retornar salt.hash en Base64
            return Convert.ToBase64String(salt) + "." + Convert.ToBase64String(hash);
        }

        /// <summary>
        /// Verifica si una contraseña coincide con un hash
        /// </summary>
        /// <param name="password">Contraseña en texto plano</param>
        /// <param name="hashedPassword">Hash almacenado (formato: salt.hash)</param>
        /// <returns>True si coincide, False si no</returns>
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            if (string.IsNullOrEmpty(password))
                throw new ArgumentNullException(nameof(password));

            if (string.IsNullOrEmpty(hashedPassword))
                throw new ArgumentNullException(nameof(hashedPassword));

            try
            {
                // Separar salt y hash
                var parts = hashedPassword.Split('.');
                if (parts.Length != 2)
                    return false;

                var salt = Convert.FromBase64String(parts[0]);
                var hash = Convert.FromBase64String(parts[1]);

                // Generar hash de la contraseña proporcionada con el mismo salt
                byte[] testHash;
                using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations))
                {
                    testHash = pbkdf2.GetBytes(HashSize);
                }

                // Comparar hashes usando comparación de tiempo constante
                return SlowEquals(hash, testHash);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Comparación de arrays en tiempo constante para prevenir timing attacks
        /// </summary>
        private static bool SlowEquals(byte[] a, byte[] b)
        {
            uint diff = (uint)a.Length ^ (uint)b.Length;
            for (int i = 0; i < a.Length && i < b.Length; i++)
            {
                diff |= (uint)(a[i] ^ b[i]);
            }
            return diff == 0;
        }

        /// <summary>
        /// Genera un salt aleatorio (uso opcional)
        /// </summary>
        public static string GenerateSalt()
        {
            var bytes = new byte[SaltSize];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(bytes);
            }
            return Convert.ToBase64String(bytes);
        }

        /// <summary>
        /// Valida la complejidad de una contraseña
        /// </summary>
        /// <param name="password">Contraseña a validar</param>
        /// <returns>True si cumple requisitos, False si no</returns>
        public static bool ValidatePasswordStrength(string password)
        {
            if (string.IsNullOrEmpty(password))
                return false;

            // Requisitos mínimos:
            // - Al menos 8 caracteres
            // - Al menos una mayúscula
            // - Al menos una minúscula
            // - Al menos un número

            if (password.Length < 8)
                return false;

            bool hasUpper = false;
            bool hasLower = false;
            bool hasDigit = false;

            foreach (char c in password)
            {
                if (char.IsUpper(c)) hasUpper = true;
                if (char.IsLower(c)) hasLower = true;
                if (char.IsDigit(c)) hasDigit = true;
            }

            return hasUpper && hasLower && hasDigit;
        }

        #region Métodos Alternativos (para compatibilidad con sistemas legacy)

        /// <summary>
        /// Hash SHA256 simple (menos seguro, solo para compatibilidad)
        /// NO USAR PARA NUEVOS DESARROLLOS
        /// </summary>
        [Obsolete("Usar HashPassword() en su lugar para mayor seguridad")]
        public static string HashPasswordSHA256(string password, string salt)
        {
            using (var sha256 = SHA256.Create())
            {
                var saltedPassword = password + salt;
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
                return Convert.ToBase64String(bytes);
            }
        }

        #endregion
    }
}

