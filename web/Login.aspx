<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta charset="utf-8" />
        <title>STP Web Map Login</title>
        <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
        <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
        <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
        <link rel="stylesheet" href="http://jqueryui.com/resources/demos/style.css" />
        <style>
            body { font-size: 62.5%; }
            label, input { display:block; }
            input.text { margin-bottom:12px; width:95%; padding: .4em; }
            fieldset { padding:0; border:0; margin-top:25px; }
            h1 { font-size: 1.2em; margin: .6em 0; }
            .ui-dialog .ui-state-error { padding: .3em; }
            .errorMessage { border: 1px solid transparent; padding: 0.3em; color: red;}
        </style>
        <script>
            $(document).ready(function() {

                // Set up the AJAX call to the login service 
                $.ajaxSetup({            
                    type: 'GET',
                    url: 'LoginService.aspx',
                    cache: false,
                    timeout: 300000,
                    success: processSuccess,
                    error: onAjaxError
                });
              
                var name = $("#name"),
                    password = $("#password"),
                    allFields = $([]).add(name).add(password),
                    tips = $(".errorMessage");

                $('#errorText').hide();


                // Make the call.  (Unencrypted -- yikes!)
                $("#dialog-form").dialog({
                    autoOpen: false,
                    height: 300,
                    width: 350,
                    modal: true,
                    buttons: {
                        "Login": function () {
                            if (!$('#errorText').css('display') == 'block') {
                                $('#errorText').hide();
                            }
                            var bValid = true;
                            allFields.removeClass("ui-state-error");

                            $.ajax({
                                data:
                                {
                                    'username': name.val(),
                                    'pwd': password.val()
                                }
                            });
                        }
                    },
                    close: function () {
                        allFields.val("").removeClass("ui-state-error");
                    }
                });
              
                $("#dialog-form").dialog("open");
              
                function updateTips(t) {
                    tips
                        .text(t)
                        .addClass("ui-state-highlight");
                    setTimeout(function () {
                    tips.removeClass("ui-state-highlight", 1500);
                }, 500);
                    if (!$('#errorText').css('display') != 'block') {
                        $('#errorText').show();
                    }
                }

                function processSuccess(json, status) {
                    if (json) {
                        if (json == "success") {
                            $("#dialog-form").dialog("close");
                            window.location.href = 'Default.aspx';
                        } else {
                            updateTips(json);
                        }                      
                    }
                }

                function onAjaxError(x, e) {
                    updateTips('Error: ' + e + '<br />Status: ' + x.status + '<br />Status Description: ' + x.statusText);
                }
              
          });

      </script>
  </head>
<body>
 
    <div id="dialog-form" title="Login">
      <form>
      <fieldset>
        <label for="name">Name</label>
        <input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" />
        <label for="password">Password</label>
        <input type="password" name="password" id="password" value="" class="text ui-widget-content ui-corner-all" />
      </fieldset>
      </form>
      <div id="errorText"><p class="errorMessage"></p></div>
    </div>

 </body>
</html>
