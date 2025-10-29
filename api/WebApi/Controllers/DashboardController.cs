using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
    /// <summary>
    /// Controlador para estadísticas del dashboard
    /// </summary>
    [RoutePrefix("api/Dashboard")]
    public class DashboardController : ApiController
    {
        Db db = new Db();

        /// <summary>
        /// Obtiene todas las estadísticas del dashboard en una sola llamada
        /// GET: api/Dashboard/Stats
        /// </summary>
        [HttpGet]
        [Route("Stats")]
        public IHttpActionResult GetStats()
        {
            try
            {
                using (SqlConnection conn = db.GetConnection())
                {
                    conn.Open();

                    // Total de legajos
                    SqlCommand cmdLegajos = new SqlCommand(
                        "SELECT COUNT(*) FROM dbo.Legajo", conn);
                    int totalLegajos = (int)cmdLegajos.ExecuteScalar();

                    // Total de alertas
                    SqlCommand cmdAlertas = new SqlCommand(
                        "SELECT COUNT(*) FROM dbo.Alerta", conn);
                    int totalAlertas = (int)cmdAlertas.ExecuteScalar();

                    // Alertas vencidas (fecha vencimiento < hoy y estado != completada)
                    SqlCommand cmdVencidas = new SqlCommand(@"
                        SELECT COUNT(*) 
                        FROM dbo.Alerta A
                        INNER JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId
                        WHERE A.FechaVencimiento < CAST(GETDATE() AS DATE)
                          AND EA.Nombre NOT IN ('Completada', 'Finalizada')", conn);
                    int alertasVencidas = (int)cmdVencidas.ExecuteScalar();

                    // Alertas próximas (próximos 3 días)
                    SqlCommand cmdProximas = new SqlCommand(@"
                        SELECT COUNT(*) 
                        FROM dbo.Alerta A
                        INNER JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId
                        WHERE A.FechaVencimiento BETWEEN CAST(GETDATE() AS DATE) 
                          AND DATEADD(DAY, 3, CAST(GETDATE() AS DATE))
                          AND EA.Nombre NOT IN ('Completada', 'Finalizada')", conn);
                    int alertasProximas = (int)cmdProximas.ExecuteScalar();

                    // Alertas completadas
                    SqlCommand cmdCompletadas = new SqlCommand(@"
                        SELECT COUNT(*) 
                        FROM dbo.Alerta A
                        INNER JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId
                        WHERE EA.Nombre IN ('Completada', 'Finalizada')", conn);
                    int alertasCompletadas = (int)cmdCompletadas.ExecuteScalar();

                    // Alertas por estado (para gráfico)
                    SqlCommand cmdPorEstado = new SqlCommand(@"
                        SELECT EA.Nombre AS Estado, COUNT(*) AS Total
                        FROM dbo.Alerta A
                        INNER JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId
                        GROUP BY EA.Nombre
                        ORDER BY Total DESC", conn);
                    SqlDataAdapter daPorEstado = new SqlDataAdapter(cmdPorEstado);
                    DataTable dtPorEstado = new DataTable();
                    daPorEstado.Fill(dtPorEstado);

                    // Alertas por prioridad (para gráfico)
                    SqlCommand cmdPorPrioridad = new SqlCommand(@"
                        SELECT P.Nombre AS Prioridad, COUNT(*) AS Total
                        FROM dbo.Alerta A
                        INNER JOIN dbo.Prioridad P ON P.Id = A.PrioridadId
                        GROUP BY P.Nombre
                        ORDER BY Total DESC", conn);
                    SqlDataAdapter daPorPrioridad = new SqlDataAdapter(cmdPorPrioridad);
                    DataTable dtPorPrioridad = new DataTable();
                    daPorPrioridad.Fill(dtPorPrioridad);

                    conn.Close();

                    // Construir respuesta
                    var response = new
                    {
                        success = true,
                        kpis = new
                        {
                            totalLegajos = totalLegajos,
                            totalAlertas = totalAlertas,
                            alertasVencidas = alertasVencidas,
                            alertasProximas = alertasProximas,
                            alertasCompletadas = alertasCompletadas
                        },
                        charts = new
                        {
                            porEstado = ConvertDataTableToArray(dtPorEstado),
                            porPrioridad = ConvertDataTableToArray(dtPorPrioridad)
                        }
                    };

                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error en GetStats: {ex.Message}");
                return InternalServerError(new Exception("Error al obtener estadísticas"));
            }
        }

        /// <summary>
        /// Convierte un DataTable a un array de objetos
        /// </summary>
        private object[] ConvertDataTableToArray(DataTable dt)
        {
            var list = new object[dt.Rows.Count];
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                var row = dt.Rows[i];
                var obj = new
                {
                    label = row[0].ToString(),
                    value = Convert.ToInt32(row[1])
                };
                list[i] = obj;
            }
            return list;
        }
    }
}

