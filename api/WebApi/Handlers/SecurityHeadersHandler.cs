using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace WebApi.Handlers
{
    /// <summary>
    /// Handler que agrega headers de seguridad a todas las respuestas HTTP
    /// Implementa las mejores prácticas de seguridad OWASP
    /// </summary>
    public class SecurityHeadersHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            var response = await base.SendAsync(request, cancellationToken);

            // X-Content-Type-Options
            // Previene MIME type sniffing
            if (!response.Headers.Contains("X-Content-Type-Options"))
            {
                response.Headers.Add("X-Content-Type-Options", "nosniff");
            }

            // X-Frame-Options
            // Previene clickjacking
            if (!response.Headers.Contains("X-Frame-Options"))
            {
                response.Headers.Add("X-Frame-Options", "DENY");
            }

            // X-XSS-Protection
            // Habilita filtro XSS del navegador
            if (!response.Headers.Contains("X-XSS-Protection"))
            {
                response.Headers.Add("X-XSS-Protection", "1; mode=block");
            }

            // Strict-Transport-Security (HSTS)
            // Fuerza HTTPS (solo en HTTPS)
            if (request.RequestUri.Scheme == "https")
            {
                if (!response.Headers.Contains("Strict-Transport-Security"))
                {
                    response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
                }
            }

            // Content-Security-Policy
            // Previene XSS y data injection
            if (!response.Headers.Contains("Content-Security-Policy"))
            {
                response.Headers.Add("Content-Security-Policy",
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.tailwindcss.com cdn.jsdelivr.net; " +
                    "style-src 'self' 'unsafe-inline' cdn.tailwindcss.com cdn.jsdelivr.net; " +
                    "img-src 'self' data: https:; " +
                    "font-src 'self' cdn.jsdelivr.net; " +
                    "connect-src 'self' http://localhost:* https://localhost:*");
            }

            // Referrer-Policy
            // Controla información de referrer
            if (!response.Headers.Contains("Referrer-Policy"))
            {
                response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
            }

            // Permissions-Policy (antes Feature-Policy)
            // Controla features del navegador
            if (!response.Headers.Contains("Permissions-Policy"))
            {
                response.Headers.Add("Permissions-Policy",
                    "geolocation=(), " +
                    "microphone=(), " +
                    "camera=()");
            }

            // X-Permitted-Cross-Domain-Policies
            // Controla políticas cross-domain
            if (!response.Headers.Contains("X-Permitted-Cross-Domain-Policies"))
            {
                response.Headers.Add("X-Permitted-Cross-Domain-Policies", "none");
            }

            return response;
        }
    }
}

