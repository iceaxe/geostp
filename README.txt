Overview
========
This project is for the SmartMine Developer Challenge.  It is a guide to the route of the Seattle to Portland Bicycle Ride, or STP.  It's meant to illustrate the exact route of the ride, and to allow users to add events to the map, or "incidents", that the riders may want to be aware of.  Users can add and delete "warning" incidents to the map, provide a brief description of the incident and contact information for additional information.


Setting up the application
==========================
Take the following steps to deploy and configure the application.

PostGreSQL Database
===================
- Use or create a pgSQL db instance
- Do one of the following:
   1. Create a table named "user" using the following DDL:

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

      * Populate the database with usernames and passwords

   2. Use the PGSQL database dump file 'stp.dump' in the 'data' folder and import the 'stp' database into your PGSQL instance, and use any of the following user IDs when logging in:
      * user: crb, password: geocrb
      * user: scot, password: mcqueen
      * user: blair, password: deaver
      * user: stprider, stprider

- Enter the following connection parameters into the Web.config of the 'stp' Web application:
   o pgsServer: the IP of the server on which the database is running, or 'localhost' if appropriate
   o pgsPort: the port on which the db is running, '5432' by default
   o pgsUid: a database user that has privs to connect and read from your database
   o pgsPwd: the db user's password
   o pgsDb: the name of the database


Deploy the Web application to IIS
=================================
- Publish the contents of the web folder to a Web site in IIS 7.x.  Default ASP settings should be sufficient (app uses v4.5 of the .NET Framework)
- Make sure the Web site has a default document of 'Default.aspx' enabled


Install and publish the ArcGIS proxy handler to IIS
===================================================
- The proxy.ashx and associated proxy.config file are in the web subfolder, but can be deployed to any desired Web site.  Default ASP settings should be sufficient (minimum of v2.0 required)
- Make sure there are two files:
   o proxy.ashx
   o proxy.config
- Make sure the proxy.config has the following serverUrls configured with 'matchAll="true"':
   o http://sampleserver1.arcgisonline.com/arcgis/rest/services/
   o http://sampleserver2.arcgisonline.com/arcgis/rest/services/
   o http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/
   o http://server.arcgisonline.com/arcgis/rest/services/
   o http://services1.arcgis.com/
- Make sure the STP config file commonConfig.js in the javascript folder has the following parameter set, pointing to your local
	  location of the proxy.ashx and using either a relative or fully-qualified URL:
   o config.helperservices.proxyurl
