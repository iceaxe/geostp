define(
    [
        "esri/InfoTemplate",
        "esri/map",
        "esri/toolbars/draw",
        "esri/toolbars/edit",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/dijit/InfoWindowLite",
        "esri/dijit/editing/Editor",
        "esri/dijit/editing/TemplatePicker",
        "esri/config",
        "esri/graphic",
        "dojo/i18n!esri/nls/jsapi",
        "dojo/_base/array",
        "dojo/_base/Color",
        "dojo/_base/declare",
        "dojo/_base/event",
        "dojo/_base/kernel",
        "dojo/_base/lang",
        "dojo/keys",
        "dijit/registry",
        "dojo/dom-construct",
        "dijit/form/CheckBox",
        "dijit/layout/AccordionContainer",
        "dijit/layout/BorderContainer", 
        "dijit/layout/ContentPane",
        "dijit/form/Button",
        "dojo/domReady!"
    ], function (
        InfoTemplate,
        Map,
        Draw,
        Edit, 
        ArcGISTiledMapServiceLayer,
        ArcGISDynamicMapServiceLayer,
        FeatureLayer,
        SimpleMarkerSymbol, 
        SimpleLineSymbol,
        SimpleFillSymbol,
        InfoWindow,
        Editor, 
        TemplatePicker,
        esriConfig,
        Graphic,
        jsapiBundle,
        arrayUtils,
        Color,
        declare,
        event,
        kernel,
        lang,
        keys,
        registry,
        domConstruct,
        CheckBox
    ){
        var App =  declare("utilities.App",null,{
            'config': {},
            'map': null,
            'editableLayers': [],
            'mapLayers': [],
            
            constructor: function(defaults){
                // Specify class defaults 
                this.config = defaults || {};
                dojo.byId("title").innerHTML = this.config.title;
                dojo.byId("subtitle").innerHTML = this.config.subtitle;
            },
            
            init: function(){
                esriConfig.defaults.io.proxyUrl = this.config.helperServices.proxyurl || "proxy.ashx";    
                esriConfig.defaults.geometryService = new esri.tasks.GeometryService(this.config.helperServices.geometry);
				
                this.map = new esri.Map('map', {
                    'basemap': 'topo',
                    'center': [-122.7, 46.5],
                    'nav': false,
                    'zoom': 8,
                    'slider': true
                });

                this.map.on("layers-add-result", this.initEditor);
                this.map.on("layers-add-result", this.createTOC);
                
				//resize the map when the browser resizes
                dojo.connect(dijit.byId('map'), 'resize', this.map, this.map.resize);
                
                // Load layers from layer config objects
                var layers = new Array();
                
                for (var i = 0; i < this.config.layers.length; i++) {
                    var layer = this.config.layers[i];
                    switch (layer.type) 
                    {
                        case 'feature':
                            {
                                // Create a new FeatureLayer from the current layer config
                                layers.push(new FeatureLayer(layer.url, {
                                    'mode': FeatureLayer.MODE_SNAPSHOT,
                                    'outFields': ["*"],
                                    'visible': layer.visible
                                }));
                                if (layer.editable && layer.editable === true)
                                    this.editableLayers.push(layer);
                                break;
                            }
                        case 'map':
                            {
                                // Create a new MapServer from the current layer config
                                layers.push(new ArcGISDynamicMapServiceLayer(layer.url, {
                                    'visible': layer.visible
                                }));
                                break;
                            }
                        default:
                            alert("Unknown layer type: " + layer.type);
                    }
                }

                this.map.addLayers(layers);
                this.mapLayers = layers;
            },
            
            initEditor: function (evt) {
                try {
                    // Add the editable layers to the array of layers to be edited outside of the edit toolbar, 
                    // and those that should be in the template picker/toolbar to the list of template layers
                    var templateLayers = new Array();
                    var editLayers = new Array();
                    for (var i = 0; i < evt.layers.length; i++) {
                        for (var j = 0; j < mapvars.editableLayers.length; j++) {
                            if (evt.layers[i].layer.name === mapvars.editableLayers[j].name) {
                                if (mapvars.editableLayers[j].editable === true) {
                                    if (mapvars.editableLayers[j].addToEditorTemplate === true) {
                                        templateLayers.push(evt.layers[i].layer);
                                    } else {
                                        editLayers.push(evt.layers[i].layer);
                                    }
                                }
                                break;
                            }
                        }
                    }

                    // Set up the editor for editing existing features outside the toolbar, i.e. by double-clicking it
                    var currentLayer = null;
                    var editToolbar = new Edit(mapvars.map);
                    editToolbar.on("deactivate", function(evt) {
                        currentLayer.applyEdits(null, [evt.graphic], null);
                    });

                    // When double-clicking on a multi-point feature, enable editing vertices (if not enabled already)
                    arrayUtils.forEach(editLayers, function(layer) {
                        var editingEnabled = false;
                        layer.on("dbl-click", function(evt) {
                            event.stop(evt);
                            if (editingEnabled === false) {
                                editingEnabled = true;
                                editToolbar.activate(Edit.EDIT_VERTICES, evt.graphic);
                            } else {
                                currentLayer = this;
                                editToolbar.deactivate();
                                editingEnabled = false;
                            }
                        });
                    });

                    // Set up drawing toolbar for drawing new features, template picker first
                    var templatePicker = new TemplatePicker({
                        'featureLayers': templateLayers,
                        'grouping': true,
                        'rows': "auto",
                        'columns': 1
                    }, "templateDiv");
                    templatePicker.startup();

                    var layers = arrayUtils.map(templateLayers, function(result) {
                        return { 'featureLayer': result };
                    });

                    // Set up the drawing toolbar
                    var settings = {
                        'map': mapvars.map,
                        'templatePicker': templatePicker,
                        'layerInfos': layers,
                        'toolbarVisible': true,
                        'createOptions': {
                            'polylineDrawTools': [Editor.CREATE_TOOL_FREEHAND_POLYLINE]
                        },
                        'toolbarOptions': {
                            'reshapeVisible': false,
                            'mergeVisible': false,
                            'cutVisible': false
                        }
                    };

                    var params = { 'settings': settings };
                    var myEditor = new Editor(params, 'editorDiv');

                    // Define snapping options
                    var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 30, null, new Color([0, 255, 255, 0.5]));
                    mapvars.map.enableSnapping({
                        'snapPointSymbol': symbol,
                        'tolerance': 20,
                        'snapKey': keys.ALT
                    });

                    myEditor.startup();
                } catch(e) {
                    alert(e);
                }
            },
            
            toggleLayer: function (layerName, isVisible) {
                arrayUtils.forEach(mapvars.mapLayers, function(layer) {
                    switch (layer.url) {
                    case "http://gis.srh.noaa.gov/ArcGIS/rest/services/Radar_warnings/MapServer":
                        if (layerName === "nwsrw")
                            layer.setVisibility(isVisible);
                        break;
                    case "http://atlas.resources.ca.gov/ArcGIS/rest/services/Atmosphere_Climate/USCityWeatherForecast/MapServer":
                        if (layerName === "nwswf")
                            layer.setVisibility(isVisible);
                        break;
                    }
                });
            }
        });
    return App;
});

