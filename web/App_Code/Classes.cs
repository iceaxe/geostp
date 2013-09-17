using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for LoginParams
/// </summary>
public class LoginParams
{
    public string PgsServer { get; set; }
    public string PgsPort { get; set; }
    public string PgsUid { get; set; }
    public string PgsPwd { get; set; }
    public string PgsDb { get; set; }
    public string ErrorMessage { get; set; }
}