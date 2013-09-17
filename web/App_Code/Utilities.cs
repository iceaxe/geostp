using Npgsql;
using System;
using System.Collections.Specialized;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Utilities
/// </summary>
public static class Utilities
{
	static Utilities()
	{
	}

    public static LoginParams GetLoginParams()
    {
        var lp = new LoginParams() { ErrorMessage = String.Empty };
        NameValueCollection appSettings = ConfigurationManager.AppSettings;
        if (appSettings.Count == 0)
        {
            lp.ErrorMessage = "No database parameters provided to the application.";
        }

        try
        {
            for (int i = 0; i < appSettings.Count; i++)
            {
                switch (appSettings.GetKey(i))
                {
                    case "pgsServer":
                        lp.PgsServer = appSettings[i];
                        break;
                    case "pgsPort":
                        lp.PgsPort = appSettings[i];
                        break;
                    case "pgsUid":
                        lp.PgsUid = appSettings[i];
                        break;
                    case "pgsPwd":
                        lp.PgsPwd = appSettings[i];
                        break;
                    case "pgsDb":
                        lp.PgsDb = appSettings[i];
                        break;
                    default:
                        break;
                }
            }
        }
        catch (ConfigurationErrorsException ex)
        {
            lp.ErrorMessage = ex.Message;
        }
        return lp;
    }

    public static bool AuthorizeUser(LoginParams lp, string userName, string userPwd)
    {
        var connStr = "Server=" + lp.PgsServer + ";Port=" + lp.PgsPort + ";User Id=" + lp.PgsUid + ";Password=" +
                        lp.PgsPwd + ";Database=" + lp.PgsDb + ";";
        var con = new NpgsqlConnection(connStr);
        string sql = @"SELECT count(1) from public.""user"" where username = '" + userName +
                        "' and password = '" + userPwd + "';";
        var cmd = new NpgsqlCommand(sql, con);
        var da = new NpgsqlDataAdapter(cmd);
        var ds = new DataSet();
        da.Fill(ds);
        con.Close();
        if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && (long) (ds.Tables[0].Rows[0])[0] > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
      

        /*  --- User Table DDL in PostGreSQL
                CREATE TABLE "user"
                (
                  username character varying(16),
                  password character varying(32)
                )
                WITH (
                  OIDS=FALSE
                );
                ALTER TABLE "user"
                  OWNER TO postgres;
            */
        // Download for Npgsql: http://npgsql.projects.pgfoundry.org/
        // Npgsql: version 2.0.12.0 for the .NET F/W v4.0: http://pgfoundry.org/frs/download.php/3356/Npgsql2.0.12.0-bin-ms.net4.0.zip

    }
}