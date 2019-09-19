/*******************
/@author Paul Hann (Esri UK)
/@description simple address serach for demo application for the Scottish Conference 2019
*******************/

// Require modules from the Esri JSAPI
require([
    "esri/widgets/Search",
    "esri/tasks/Locator"
], function (Search,
            Locator) {
    
    // Use JSAPI search widget for address searches
    var searchWidget = new Search({
        container: document.getElementById("search"),
        includeDefaultSources: false, // dont use defaults as this would serach the whole world. Whereas the configuration below will restrict to the UK.
        sources: [
            {
              locator: new Locator({ url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
              singleLineFieldName: "SingleLine",
              outFields: ["Addr_type"],
              name: "ArcGIS World Geocoding Service",
              placeholder: "Address Search",
              countryCode:"GB" // restrict to GB results only
             
            }
          ]
    });

    // when the user selects a result, display the div with the fields for landlord and property details 
    searchWidget.on("search-complete", function(event){
        // The results are stored in the event Object[]
        document.getElementById("step2").style.display = "block";
 
      });
    
  });
