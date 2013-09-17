using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class LoginService : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Session["IsAuthenticated"] = false;
        if (!Page.IsPostBack)
        {
            if (!String.IsNullOrEmpty(Request["username"]) && !String.IsNullOrEmpty(Request["pwd"]))
            {
                Response.ContentType = "text/plain";
                try
                {
                    var dbParams = Utilities.GetLoginParams();

                    if (dbParams.ErrorMessage == String.Empty)
                    {
                        if (Utilities.AuthorizeUser(dbParams, Request["username"], Request["pwd"]))
                        {
                            Session["IsAuthenticated"] = true;
                            Response.ClearContent();
                            Response.Write("success");
                        }
                        else
                        {
                            Session["IsAuthenticated"] = false;
                            WriteError(Response, "Invalid credentials");
                        }
                    }
                    else
                    {
                        Session["IsAuthenticated"] = false;
                        WriteError(Response, dbParams.ErrorMessage);
                    }
                }
                catch (Exception ex)
                {
                    Session["IsAuthenticated"] = false;
                    WriteError(Response, ex.Message);
                }
            }
            else
            {
                Session["IsAuthenticated"] = false;
                WriteError(Response, "Empty parameters passed to login logic.");
            }
        }
        Response.End();
    }

    private static void WriteError(HttpResponse response, string error)
    {
        response.ClearContent();
        response.Write(error);
    }
}