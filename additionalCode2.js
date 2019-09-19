/*******************
/@author Paul Hann (Esri UK)
/@description simple address serach for demo application for the Scottish Conference 2019
*******************/

// Require modules from the Esri JSAPI
require([
    "esri/widgets/Search",
    "esri/tasks/Locator",
    "esri/layers/FeatureLayer",
    "esri/tasks/support/Query", 
    "esri/ WebMap", //NEW - module used to load a map from portal \ ArcGIS Online
    "esri/views/MapView",// NEW - module to display map in page
    "esri/geometry/geometryEngine" // module to manimulate geometries on client (i.e. create a bufffer)
], function (
    Search,
    Locator,
    FeatureLayer,
    Query,
    WebMap,
    MapView,
    geometryEngine
) {

        //New - code to add a map to the page
        var webmap = new WebMap({
            portalItem: {
                id: "c00ee9e10bbb4d76ba60ab22481f89a5" // id of the ArcGIS Online web map
            }
        });

        //New - Code to add map to the page
        var view = new MapView({
            map: webmap,
            container: "mapDiv"
        });


        // Use JSAPI search widget for address searches
        var searchWidget = new Search({
            container: document.getElementById("search"),
            includeDefaultSources: false,
            view: view,
            sources: [
                {
                    locator: new Locator({ url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
                    singleLineFieldName: "SingleLine",
                    outFields: ["Addr_type"],
                    name: "ArcGIS World Geocoding Service",
                    placeholder: "Address Search",
                    countryCode: "GB"

                }
            ]
        });

        var hmoGeometry;

        // when the user selects a result, display the div with the fields for landlord and property details 
        searchWidget.on("search-complete", function (event) {
    
         // instantiate a new feature layer object using the REST URL of the council boundary layer
         const layer = new FeatureLayer({
                url: "https://services.arcgis.com/Qo2anKIAMzIEkIJB/arcgis/rest/services/ScotCon_2019_Sunnyshire_Boundary/FeatureServer/0"
            });

            // get the geometry of the selected address
            hmoGeometry = event.results[0].results[0].feature.geometry;

            // instantiate a new Query object
            const query = new Query();
            //define the geometry to be used in the spatial query
            query.geometry = hmoGeometry;
            // we will just return the objectid.
            query.outFields = ["OBJECTID"]
            // as we do not need to know the geometry of the results, set this to false.
            query.returnGeometry = false;

            // use the query object to query the layer
            layer.queryFeatures(query).then(function (results) {

                // check number of results. if there are results then the address is within the council boundary. otherwise it is not
                if (results.features.length > 0) {
                    document.getElementById("addressFeedback").innerHTML = "";
                    document.getElementById("step2").style.display = "block";
                    //New - check likeliood of approval
                    evaluateHMO(hmoGeometry);
                }
                else {
                    // not within council boundary
                    // Tell the user the issue
                    document.getElementById("addressFeedback").innerHTML = "The address you have entered is outwith the Sunnyshire council boundary. Please apply to the correct council."
                    document.getElementById("step2").style.display = "none";
                }
            });
        });



        /* NEW - function to check the likelihood of a HMO being approved */
        function evaluateHMO(geometry) {

            // instantiate a new feature layer object using the REST URL of the hmo layer
            const HMOlayer = new FeatureLayer({
                url: "https://services.arcgis.com/Qo2anKIAMzIEkIJB/arcgis/rest/services/ScotConfHMO/FeatureServer/0"
            });

            //1. buffer the HMO Geometry by 500m
            var ptBuff = geometryEngine.buffer(geometry, 500, "meters");

            //2. get all properties in the buffer

            // as I dont have access to a dataset for properties, I will just generate a random number for the purpose of the demo.
            // if you had the data, the process is the same as  hmo's below.
            var countOfProperties =Math.round( Math.random() * (500 - 100) + 150);

            //3. get all HMOs in buffer
            var query = new Query()
            query.geometry = ptBuff;
            query.outFields = ["*"]

            // do the query against the HMO layer
            HMOlayer.queryFeatures(query).then(function (results) {


               //4. work out the percentage HMO to residential properties
                var hmoCount = results.features.length;
                var hmoPercentage = Math.round((hmoCount / countOfProperties) * 100);
                var hmoRec = hmoPercentage > 10 & hmoPercentage < 50 ? "unlikely" : "likely";
                      

                //5. identfy any other factors (i.e. average number of beds compared to average in other hmos)
                var bedCount = 0;

                results.features.forEach(function (o, i) {
                    bedCount += parseInt(o.attributes["Number_of_Bedrooms_"]);

                });

                //6. show stats and recomendation.
                document.getElementById("hmoFeedback").innerHTML = "There are " + hmoCount + " HMOs already within 500m of this property <br/>";
                document.getElementById("hmoFeedback").innerHTML += "There are " + countOfProperties + " residential properties. <br/>";
                document.getElementById("hmoFeedback").innerHTML += hmoPercentage + "% of Properties are HMOs. <br/>";
                document.getElementById("hmoFeedback").innerHTML += "There are " + bedCount + " bedrooms available. <br/>";
                document.getElementById("hmoFeedback").innerHTML += "Based upon this it is " + hmoRec + " that your application on this property would be approved <br/><br/>";
                document.getElementById("hmoFeedback").innerHTML += "<b>This information is provided as a guide only. The final decision on whether to licence an HMO is taken by the Licencing committee. They will use this information along with property inspection and feedback from the Sunnyshire communities to make their decision. </b><br/><br/>"


            });
        }
    });
