using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApi.Models
{
    public class Db
    {
        private readonly string connectionString =
            @"Data Source=JORDYPC\SQLEXPRESS;Initial Catalog=ResidenciaDB;Integrated Security=True;";

        public SqlConnection GetConnection()
        {
            return new SqlConnection(connectionString);
        }
    }
}