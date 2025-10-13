using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApi.Models
{
    public class Db
    {
        private readonly string connectionString =
            ConfigurationManager.ConnectionStrings["ResidenciaDB"]?.ConnectionString
            ?? @"Data Source=JORDYPC\SQLEXPRESS;Initial Catalog=ResidenciaDB;Integrated Security=True;MultipleActiveResultSets=True";

        public SqlConnection GetConnection()
        {
            return new SqlConnection(connectionString);
        }
    }
}