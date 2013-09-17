define(
    [],
    function() {
        var config = {
            'helperServices': {
                'geometry': { 'url': location.protocol + "//tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer" },
                'printTask': { 'url': location.protocol + "//utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task" },
                'geocode': { 'url': location.protocol + "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" },
                'proxyurl': location.protocol + "//localhost/esri_proxy/proxy.ashx"
            },
            'title': "Seattle to Portland Bike Ride Trip Planner",
            'subtitle': "An exercise in ArcGIS Server JavaScript Development",
            'layers': [
                {
                    'name': 'NOAA Weather Warnings',
                    'type': 'map',
                    'url': "http://gis.srh.noaa.gov/ArcGIS/rest/services/Radar_warnings/MapServer",
                    'visible': false
                },
                {
                    'name': 'US City Weather Forecast',
                    'type': 'map',
                    'url': "http://atlas.resources.ca.gov/ArcGIS/rest/services/Atmosphere_Climate/USCityWeatherForecast/MapServer",
                    'visible': false
                },
                {
                    'name': 'Route',
                    'type': 'feature',
                    'url': "http://services1.arcgis.com/oT3OjHCCvOXqXJCQ/arcgis/rest/services/STP/FeatureServer/2",
                    'editable': true,
                    'addToEditorTemplate': false,
                    'visible': true
                },
                {
                    'name': 'Warnings',
                    'type': 'feature',
                    'url': "http://services1.arcgis.com/oT3OjHCCvOXqXJCQ/arcgis/rest/services/STP/FeatureServer/1",
                    'editable': true,
                    'addToEditorTemplate': true,
                    'visible': true
                },
                //{
                //    'name': 'Bike Shops (Small)',
                //    'type': 'feature',
                //    'url': "http://services1.arcgis.com/vjz4kpwp0tkWMGfM/ArcGIS/rest/services/STP_RO/FeatureServer/1",
                //    'editable': false,
                //    'addToEditorTemplate': false,
                //    'infoTemplate' : {
                //        'title': "${Name}",
                //        'lines': [
                //            {
                //                'label': "Address",
                //                'line': "${Address} ${City} ${State} ${Zip}"
                //            },
                //            {
                //                'label': "Phone Number",
                //                'line': "${Phone}"
                //            },
                //            {
                //                'label': "Web Site",
                //                'line': "${WebUrl}"
                //            }
                //        ]
                //    }
                //},
                //{
                //    'name': 'Bike Shops',
                //    'type': 'feature',
                //    'url': "http://services1.arcgis.com/vjz4kpwp0tkWMGfM/arcgis/rest/services/STP_RO/FeatureServer/0",
                //    'editable': false,
                //    'addToEditorTemplate': false,
                //    'infoTemplate': {
                //        'title': "${Name}",
                //        'lines': [
                //            {
                //                'label': "Address",
                //                'line': "${Address} ${City} ${State} ${Zip}"
                //            },
                //            {
                //                'label': "Phone Number",
                //                'line': "${Phone}"
                //            },
                //            {
                //                'label': "Web Site",
                //                'line': "${WebUrl}"
                //            }
                //        ]
                //    }
                //},
                {
                    'name': 'Mile Markers',
                    'type': 'feature',
                    'url': "http://services1.arcgis.com/oT3OjHCCvOXqXJCQ/arcgis/rest/services/STP/FeatureServer/0",
                    'editable': false,
                    'addToEditorTemplate': false,
                    'visible': true
                }
            ]
        };
        
    commonConfig = config;
    return config;  
});
