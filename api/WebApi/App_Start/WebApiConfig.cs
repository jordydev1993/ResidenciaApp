using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
// using WebApi.Handlers; // ⚠️ Comentado temporalmente - Descomentar cuando se agregue SecurityHeadersHandler al proyecto

namespace WebApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // ===============================
            // CONFIGURACIÓN DE SEGURIDAD
            // ===============================
            
            // 1. CORS Restrictivo
            // ⚠️ IMPORTANTE: Configurar con los orígenes permitidos específicos
            // En producción, reemplazar con el dominio real de la aplicación
            var allowedOrigins = new List<string>
            {
                "http://localhost:5500",      // Desarrollo local
                "http://localhost:8000",      // Alternativo desarrollo
                "http://localhost:3000",      // React dev server
                "http://127.0.0.1:5500",      // IP local
                "http://127.0.0.1:8000",      // IP local alternativo
                // TODO: Agregar dominio de producción cuando esté disponible
                // "https://residencias.tu-dominio.com"
            };

            var corsPolicy = new EnableCorsAttribute(
                origins: string.Join(",", allowedOrigins),
                headers: "Content-Type,Authorization,X-Requested-With",
                methods: "GET,POST,PUT,DELETE,OPTIONS"
            )
            {
                SupportsCredentials = true  // Permitir cookies/credenciales si es necesario
            };

            config.EnableCors(corsPolicy);

            // 2. Agregar handler de headers de seguridad
            // ⚠️ NOTA: Comentado temporalmente hasta agregar SecurityHeadersHandler.cs al proyecto de Visual Studio
            // Para habilitar: Clic derecho en proyecto → Agregar → Archivo existente → Seleccionar Handlers/SecurityHeadersHandler.cs
            // config.MessageHandlers.Add(new SecurityHeadersHandler());

            // ===============================
            // CONFIGURACIÓN DE RUTAS
            // ===============================
            
            // Habilitar attribute routing
            config.MapHttpAttributeRoutes();

            // Ruta por defecto
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // ===============================
            // FORMATTERS Y SERIALIZACIÓN
            // ===============================
            
            // Configurar JSON como formato por defecto
            var jsonFormatter = config.Formatters.JsonFormatter;
            jsonFormatter.SerializerSettings.ReferenceLoopHandling = 
                Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            jsonFormatter.SerializerSettings.PreserveReferencesHandling = 
                Newtonsoft.Json.PreserveReferencesHandling.None;
            
            // Remover XML formatter (opcional, solo si no se necesita XML)
            config.Formatters.Remove(config.Formatters.XmlFormatter);
        }
    }
}
