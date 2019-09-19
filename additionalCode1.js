/*******************
/@author Paul Hann (Esri UK)
/@description simple address serach for demo application for the Scottish Conference 2019
*******************/


// Require modules from the Esri JSAPI
require([
    "esri/widgets/Search",
    "esri/tasks/Locator",
    "esri/layers/FeatureLayer", //EW: module that provides tools for interacting with FeatureLayers 
    "esri/tasks/support/Query" //*NEW:  module that provides tools to structure a query against a Layer
], function (
    Search,
    Locator,
    FeatureLayer, //*NEW: corresponds to above module
    Query //*NEW: corresponds to above module
) {
    
     // Use JSAPI search widget for address searches
    var searchWidget = new Search({
        container: document.getElementById("search"),
        includeDefaultSources: false,
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



    // when the user selects a result, display the div with the fields for landlord and property details 
    searchWidget.on("search-complete", function (event) {

        //*NEW: start - this code uses the address returned and checks if it is within the council boundary

        // instantiate a new feature layer object using the REST URL of the council boundary layer
        const layer = new FeatureLayer({
             url: "https://services.arcgis.com/Qo2anKIAMzIEkIJB/arcgis/rest/services/ScotCon_2019_Sunnyshire_Boundary/FeatureServer/0" 
        });

        // instantiate a new Query object
        const query = new Query();
        //define the geometry to be used in the spatial query
        query.geometry = event.results[0].results[0].feature.geometry;// this is the geometry of the address that the user selected
        // define at least one out field to be returned. As we will not be doing anything with the result other than checking it is there,
        // we will just return the objectid.
        query.outFields = ["OBJECTID"]
        // as we do not need to know the geometry of the results, set this to false.
        query.returnGeometry = false;

        // use the query object to query the layer
        layer.queryFeatures(query).then(function (results) {

            // check number of results. if there are results then the address is within the council boundary. otherwise it is not
            if (results.features.length > 0)
            {
                document.getElementById("addressFeedback").innerHTML = ""; // make sure user feedback string is empty
                document.getElementById("step2").style.display = "block"; // show the nest step panel
            }
            else
            {
                // not within council boundary
                // Tell the user the issue
                document.getElementById("addressFeedback").innerHTML = "The address you have entered is outwith the Sunnyshire council boundary. Please apply to the correct council."
                document.getElementById("step2").style.display = "none"; // ensure the next step panel is hidden
            }

            //NEW - End.

        });
    });

});
