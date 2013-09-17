<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=7, IE=9, IE=10">
        <!--The viewport meta tag is used to improve the presentation and behavior of the samples 
        on iOS devices-->
        <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no">
        <title>Seattle To Portland Bike Ride</title>
        <link rel="stylesheet" type="text/css" href="http://js.arcgis.com/3.6/js/dojo/dijit/themes/claro/claro.css">
        <!--<link rel="stylesheet" type="text/css" href="css/claro.css">-->
        <link rel="stylesheet" type="text/css" href="http://js.arcgis.com/3.6/js/esri/css/esri.css" />
        <link rel="stylesheet" type="text/css" href="css/layout.css"/>
        <link rel="stylesheet" type="text/css" href="css/chrome.css"/>
        <link rel="stylesheet" type="text/css" href="css/main.css"/>

        <script type="text/javascript">
            var path_location = location.pathname.replace(/\/[^/]+$/, '');
            var dojoConfig = {
                'parseOnLoad': true,
                'packages': [
                    {
                        'name': 'esriTemplate',
                        'location': path_location
                    }, {
                        'name': 'utilities',
                        'location': path_location + '/javascript'
                    },
                    {
                        'name': 'templateConfig',
                        'location': path_location + '/javascript'
                    }
                ]
            };
        </script>
        <script type="text/javascript" src="//js.arcgis.com/3.6/"></script>
        <script type="text/javascript" src="javascript/layout.js"></script>
        <script type="text/javascript">
            
            dojo.require("utilities/app");
            dojo.require("templateConfig/commonConfig");

            var mapvars = {};
            var app = null;

            function initStp() {
                app = new utilities.App(commonConfig);
                app.init();
                mapvars = {
                    'map': app.map,
                    'mapLayers': app.mapLayers,
                    'editableLayers': app.editableLayers,
                    'config': app.config
                };
            }

            dojo.addOnLoad(initStp);

        </script>
    </head>

    <body class="claro">
        <div id="mainWindow" data-dojo-type="dijit.layout.BorderContainer"   data-dojo-props="design:'headline', gutters:false" style="width:100%; height:100%;">

            <!-- Header Section-->
            <div id="header" data-dojo-type="dijit.layout.ContentPane" data-dojo-props='region:"top"'>
                <div id="title">
                </div>
                <div id="subtitle">
                </div>
                <div id='header_flourish'></div>
            </div>

            <!--Sidebar Section-->
            <div data-dojo-type="dijit.layout.ContentPane" id="leftPane" data-dojo-props='region:"left"'>
                <div data-dojo-type="dijit/layout/AccordionContainer">
                     <div data-dojo-type="dijit/layout/ContentPane" title="About This Map">
                        <p>
                            This map is a guide to the route of the Seattle to Portland Bicycle Ride, or STP.  It's meant to illustrate the exact route of the ride,
                            and to allow users to add events, or "incidents", to the map that the riders may want to be aware of.  Users can add and delete "warning"
                            incidents to the map, provide a brief description of the incident and contact information for additional information.
                        </p>
                         <p>
                             If an incident requires re-routing the course, users can edit the course as well by redrawing it to a new location.
                         </p>
                         <p>
                             Additional information is also provided in other map layers, including mile markers, weather, and the temperatures of major cities.
                         </p>
                    </div>
                    <!-- Layer List (hard coded - yuck) -->
                    <div data-dojo-type="dijit/layout/ContentPane" title="Layers">
                        <p>
                            <input id="nwsrw" name="nwsrw" data-dojo-type="dijit/form/CheckBox" onChange="app.toggleLayer('nwsrw', arguments[0])" /> 
                            <label for="nwsrw">NWS Radar Warnings</label>
                        </p>
                        <p>
                            <input id="nwswf" name="nwswf" data-dojo-type="dijit/form/CheckBox" onChange="app.toggleLayer('nwswf', arguments[0])" /> 
                            <label for="nwswf">NWS US City Weather Forecast</label><br />
                            <img src="images/nwstemps.png" alt="NWS US City Weather Forecast Temperatures"/>
                        </p>
                    </div>
                    <div data-dojo-type="dijit/layout/ContentPane" title="Editor Tools" selected="true">
                        <div id="templateDiv"></div>
                        <div id="editorDiv"></div>
                        <h3>Instructions for Editing</h3>
                        <h4>To add a Warning Incident</h4>
                        <ul>
                            <li>Click the "Warnings" icon in the editor template above.</li>
                            <li>Click on the map where you want to add a warning incident.</li>
                            <li>Enter information into the popup window:
                                <ul>
                                    <li>The type of incident, e.g. "Accident", "Contruction", etc.</li>
                                    <li>A brief description of the incident</li>
                                    <li>Where to find additional information (phone numbers, etc.)</li>
                                </ul>
                            </li>
                            <li>Click the close (x) button to save the changes.</li>
                        </ul>
                        <h4>To Edit a Warning Incident</h4>
                        <ul>
                            <li>Click a Warning incident on the map to select it or use the 'New Selection' tool in the bar and drag a box around the feature. 
                                The feature will turn into a red dot and the popup window will be displayed.
                            </li>
                            <li>To edit the attributes, enter values into the fields and click the close (x) button to save them.</li>
                            <li>To move the feature, click and drag the red dot to someplace else on the map.</li>
                            <li>Click elsewhere on the map when done to save changes and restore the Warning icon.</li>
                        </ul>
                        <h4>To Delete a Warning Incident</h4>
                        <ul>
                            <li>Click the Warning incident to open the popup window.</li>
                            <li>Click the 'Delete' button in the popup window.</li>
                        </ul>
                        <h4>To Edit the Route</h4>
                        <ul>
                            <li>If an incident requires a new route, zoom in and double-click the route (i.e. the red line) to dislay the individual points on the line.</li>
                            <li>Click a point and drag it to a new location.  Repeat as necessary until you are satisfied with the new route.</li>
                            <li>Double-clck on the line again to finish editing.</li>
                        </ul>
                   </div>
                </div>
            </div>

            <!-- Map Section -->
            <div id="map" data-dojo-type="dijit.layout.ContentPane"  data-dojo-props='region:"center"' dir="ltr">
            </div>

            <!-- Footer Section-->
            <div id="footer" data-dojo-type="dijit.layout.ContentPane" data-dojo-props='region:"bottom"'>
                <span id='footerText'></span>
                <span id="owner"></span>
            </div>
            
        </div>
    </body>
</html>
