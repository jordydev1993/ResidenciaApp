using System;
using System.Security.Cryptography;
using System.Text;

namespace WebApi.Helpers
{
    /// <summary>
    /// Helper para generación de tokens seguros
    /// </summary>
    public static class TokenHelper
    {
        /// <summary>
        /// Genera un token aleatorio seguro de 512 bits
        /// </summary>
        /// <returns>Token en formato Base64</returns>
        public static string GenerateToken()
        {
            var bytes = new byte[64]; // 512 bits
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(bytes);
            }
            return Convert.ToBase64String(bytes);
        }

        /// <summary>
        /// Genera un token con timestamp para trazabilidad
        /// </summary>
        /// <returns>Token en formato: timestamp-randomToken</returns>
        public static string GenerateTokenWithTimestamp()
        {
            var timestamp = DateTime.UtcNow.Ticks.ToString();
            var random = GenerateToken();
            return $"{timestamp}-{random}";
        }

        /// <summary>
        /// Genera un token corto para códigos de verificación (6 dígitos)
        /// </summary>
        /// <returns>Código numérico de 6 dígitos</returns>
        public static string GenerateVerificationCode()
        {
            using (var rng = new RNGCryptoServiceProvider())
            {
                var bytes = new byte[4];
                rng.GetBytes(bytes);
                var randomNumber = BitConverter.ToUInt32(bytes, 0);
                return (randomNumber % 1000000).ToString("D6");
            }
        }

        /// <summary>
        /// Genera un token alfanumérico corto
        /// </summary>
        /// <param name="length">Longitud del token (por defecto 32)</param>
        /// <returns>Token alfanumérico</returns>
        public static string GenerateAlphanumericToken(int length = 32)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var bytes = new byte[length];
            var result = new StringBuilder(length);

            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(bytes);
            }

            foreach (var b in bytes)
            {
                result.Append(chars[b % chars.Length]);
            }

            return result.ToString();
        }

        /// <summary>
        /// Valida el formato de un token
        /// </summary>
        /// <param name="token">Token a validar</param>
        /// <returns>True si el formato es válido</returns>
        public static bool IsValidTokenFormat(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return false;

            // Validar longitud mínima
            if (token.Length < 20)
                return false;

            // Validar que sea Base64 válido
            try
            {
                Convert.FromBase64String(token);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}

