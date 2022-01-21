//Step 1: Create the Leaflet map

//fix for the icons part 1 of 2
var teardrop = new L.Icon({
    iconUrl: "img/images/marker-icon.png",
    iconSize: [18, 25],
    popupAnchor: [-3, -15]
});
//practice icon
var emergencyCity = new L.Icon({
    iconUrl: "img/warning_city.png",
    iconSize: [18, 18],
    popupAnchor: [-3, -76]
});

//create the map object
function createMap() {
     
    //cities for overlay as individual markers
    var chicago = L.marker([41.8781, -87.6298], {icon: teardrop}).bindPopup('<b>Climate Hazards for Chicago, IL</b><br>Flash Flood, River Flood, Extreme Snow Events'),
    denver = L.marker([39.7392, -104.9903], {icon: teardrop}).bindPopup('<b>Climate Hazards for Denver, CO</b><br>Extreme hot days, Drought, Hail'),
    fortLauderdale = L.marker([26.125, -80.1003], {icon: teardrop}).bindPopup('<b>Climate Hazards for Fort Lauderdale, FL</b><br>Cyclone, Salt water intrusion, Permanent inundation'),
    houston = L.marker([29.7604, -95.3698], {icon: teardrop}).bindPopup('<b>Climate Hazards for Houston, TX</b><br>Extreme hot days, Drought, Heat wave, Flash flood, Cyclone, Storm Surge'),
    lancasterP = L.marker([40.0370, -76.3055], {icon: teardrop}).bindPopup('<b>Climate Hazards for Lancaster, PA</b><br>Drought, Air-borne disease, Extreme hot days, Subsidence'),
    nashville = L.marker([36.1627, 86.7816], {icon: teardrop}).bindPopup('<b>Climate Hazards for Nashville, TN</b><br>Heat wave, Flash flood, Extreme cold days'),
    nyc = L.marker([40.7831, -73.97812], {icon: teardrop}).bindPopup('<b>Climate Hazards for New York City, NY</b><br>Rain storm, Extreme winter conditions, Heat wave, Coastal Flood'),
    pheonix = L.marker([33.4484, -112.0740], {icon: teardrop}).bindPopup('<b>Climate Hazards for Pheonix, AZ</b><br>Extreme hot days, Vector-bourne disease, Heat wave, Flash flood, Drought'),
    portlandMe = L.marker([43.6591, -70.2568], {icon: teardrop}).bindPopup('<b>Climate Hazards for Portland, ME, NY</b><br>Co2 concentrations, Coastal flood, Cyclones<br>Extreme winter conditions, Flash flood, Storm surge'),
    portland = L.marker([45.5051, -122.6750], {icon: teardrop}).bindPopup('<b>Climate Hazards for Portland, OR</b><br>Drought, Heat wave, Landslide, Flash flood'),
    sanFrancisco = L.marker([37.7749, -122.4194], {icon: teardrop}).bindPopup('<b>Climate Hazards for San Francisco, CA</b><br>Salt water intrusion, Coastal flood, Drought, Heat wave <br> Permanent inundation, Rain storm, Extreme hot days'),
    santaFe = L.marker([35.6870, -105.9378], {icon: teardrop}).bindPopup('<b>Climate Hazards for Santa Fe, NM</b><br>Drought, Forest fire, Flash flood'),
    twinCities = L.marker([44.9375, -93.2010], {icon: teardrop}).bindPopup('<b>Climate Hazards for Twin Cities, MN</b><br>Rain Storm, Drought, Extreme winter conditions');
    
    //fix for the icons part 2 of 2 is choosing that icon in above layers

    //creating layer group for cities
    var overlayCities = L.layerGroup([chicago, denver, fortLauderdale, houston, lancasterP, nashville, pheonix, portland, portlandMe, nyc, sanFrancisco, santaFe, twinCities]);
   
    //add Mapbox base tilelayer
   //var mapboxMap
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYXZzdGFyayIsImEiOiJja3Fmamo2b3MxYWwwMm9wM3o3N3M4ajk5In0.5Qhk_Dq9r9pSK1lrRnRSKg'
    });
    
    var esriMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
    });
    //create the map object
    let map = L.map('map', {
        center: [32.20, -82.91],
        zoom: 6 ,
        minZoom: 4,
        layers:[esriMap, overlayCities]
    });
    //create overlay object
    var overlayMap = {
        "Cities in Potential Climate Crisis" : overlayCities
    };
    //create the actual control button
    L.control.layers(null, overlayMap).addTo(map);

    /*info popup
    var infoPopup = L.popup()
        .setLatLng([39.8355, -99.0909])
        .setContent("<b>Tips For Using This Map</b><br>Hover over temperature symbol for more info<br>Click on cities icon for more info<br>Turn cities off/on in the layers button<br>Cycle through the data with the sliding control or buttons")
        .openOn(map);*/

    //call getData ()
    getData(map);   
};
//Calculate PropRadius
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 2;
    //area based on attribute value and scale factor
    var area = (((attValue-32)**2) * scaleFactor) /2;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};
//popup Constructor
function Popup(properties, attribute, layer, radius){
    this.properties = properties;
    this.attribute = attribute;
    this.layer = layer;
    this.year = attribute.split("_")[1];
    this.temperature = this.properties[attribute];
    this.content = "<p><b>State:</b> " +  this.properties.name + "</p>" + "<p><b>Average Temperature in: </b> "+ this.year + " <br>" + this.properties[attribute] + " Degrees Fahrenheit</p>";

    this.bindToLayer = function(){
        this.layer.bindPopup(this.content,{
            offset: new L.Point(0,-radius)
        });
    };
    
};
//Factory for Points
function myPointToLayer (feature,latlng, attributes){
    //assign current attribute based on first index of array "attribute"
    let attribute = attributes[0];

    let options = {
        radius: 8,
        fillColor: "#d95f0e",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }; 
    
    
    //which attribute to visualize
    let attValue = Number(feature.properties[attribute]);
    
    //attValue determines radius for each feature based on attribute value
    options.radius = calcPropRadius (attValue);
    
    //create circle marker layer
    let layer = L.circleMarker(latlng, options);
    //popup content with Constructor
    var popup = new Popup(feature.properties, attribute, layer, options.radius);
    //bind the popup
    popup.bindToLayer();
    //event listener for hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }
        click: function(){
            $("#panel").html(panelContent);
        }
    });
    //return layer to L.geojson pointToLayer
    console.log("this is the attValue: ", attValue);
    return layer;
};
//Create Attributes Array
function processData(data){
    //empty array to hold attributes
    var attributes = [];
    console.log("attributes: ",attributes);

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Unemployed") > -1){
            attributes.push(attribute);
        };
    };
    return attributes;
};
//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return myPointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
   
    //console.log("this is here  inside CpropS?");
};
// Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
            
            //updated popupContent with each interval
            var popup = new Popup(props, attribute, layer, radius);
            //addpopup to layer
            popup.bindToLayer();        
        };
    });
    
    //take this data and update the legend
    updateLegend(map, attribute);

};
//for the Legend
function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options:{
            position: 'bottomright'
        },
        onAdd: function (map) {
            //create container for the legend
            let container = L.DomUtil.create('div', 'legend-control-container');
            //add legend to container      
            $(container).append('<div id = "temporal-legend">')
            let svg = '<svg id = "attribute-legend" width = "160px" height = "60px">';
            let circles = {
                max: 20,
                mean: 40,
                min: 60
            };
            for (var circle in circles) {
                svg += '<circle class = "legend-circle" id = "' + circle + '" fill = "#d95f0e" fill-opacity = "0.6" stroke = "#000000" cx = "30"/>';
                //text string
                svg += '<text id = "' + circle + '-text" x = "65" y ="' + circles[circle] + '"></text>';
            };
            svg += "</svg>";    //close svg string
            console.log("this is the svg variable: ", svg);
            $(container).append(svg);
         
            return container;
        }
    });       
    
    map.addControl(new LegendControl());
    updateLegend(map, attributes[0]);
    
};
//Get circle values
function getCircleValues(map, attribute){
    //start with min at highest possible/max lowest
    let min = Infinity,
        max = -Infinity;
    
    map.eachLayer(function(layer){
    //get attribute value
    if (layer.feature){
        let attributeValue = Number(layer.feature.properties[attribute]);
        //test for min
        if (attributeValue < min){
            min = attributeValue;
        };
        //test for max
        if (attributeValue > max){
            max = attributeValue;
        };
    };
});
    //set mean
    let mean = (max + min) / 2;
    //return values as an object
    return{
        max: max,
        mean: mean,
        min: min
    };
};
//Update the legend
function updateLegend(map, attribute){
    //create the legend content
    let year = attribute.split("_")[1];
    
    let content = "Average Temp F:  " + "<b>" + year  + "</b>";
    //replace legend content
    $("#temporal-legend").html(content);

    //get max mean and min as object
    let circleValues = getCircleValues(map, attribute);

    for (var key in circleValues){
        //get the radius
        let radius = calcPropRadius(circleValues[key]);
        //assign the cy and r attributes
        $("#" + key).attr({
            cy: 59 - radius,
            r: radius
        });
        //add legend text
        $('#' + key + '-text').text(Math.round(circleValues[key]) + "   Degrees F");
    };
};
//create sequence controls
function createSequenceControls(map, attribute){
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function (map) {
            let container = L.DomUtil.create('div', 'sequence-control-container');
            //add skip reverse
            $(container).append('<button class = "skip" id = "reverse" title = "Reverse">Reverse</button>');
            //input slider
            $(container).append('<input class = "range-slider" type = "range">');
            //add skip forward 
            $(container).append('<button class = "skip" id = "forward" title = "Forward">Forward</button>');
        
             //remove mouse over events (default)
            L.DomEvent.disableClickPropagation(container);
            return container;
        }
    });
    map.addControl(new SequenceControl());
    //set slider attributes
    $('.range-slider').attr({
        max: 10,
        min: 0,
        value: 0,
        step: 1
    });
    //replace the text inside button.skip with an image
    $("#reverse").html('<img src= "img/reverseT.png">');
    $("#forward").html('<img src= "img/forward.png">');
    //create listener for buttons
    $(".skip").click(function (){
        //get old var index value
        let index = $(".range-slider").val();
        
        if($(this).attr("id") == "forward") {
            index++;
            index = index > 10 ? 0 : index; //past last attribute, wrap to first
        } else if ($(this).attr("id") == "reverse") {
            index--;
            index = index < 0 ? 10 : index; //past first attriubte, wrap to last
        }; 
        //update slider
        $(".range-slider").val(index);  
        updatePropSymbols(map, attribute[index]);  //pass attribute 
    });
    
    //create listener for the slider
    $(".range-slider").on("input", function() {
        let index = $(this).val();
        updatePropSymbols(map, attribute[index]);  //pass attribute
    
            
    });
   
};
//create new layer for overlay
function newOverlay (data, map, attributes) {
    
    let dataOverlay = L.geoJson(attributes);

    let temp2021 = L.layerGroup(dataOverlay);
    
    let overlayMap = {
        //"<span style=' color: gray'>Avg Temp 2021</span>": temp2021
        "Avg Temp 2021": temp2021
    };
    //add the layer toggle control
    L.control.layers(null, overlayMap).addTo(map);
    
    console.log("what is goingon here: ", temp2021);
    createPropSymbols(data, map, attributes);
    
};

//function to retrieve data
function getData(map) {

    $.ajax("data/merge2.geojson", {
        dataType: "json",
        success: function(response){
            var attributes = processData(response);
           
            createPropSymbols(response, map, attributes);
            //createSequenceControls(map,attributes);
            //createLegend(map, attributes);
            console.log(response);
        }
        
    });

}; 
//function to retrieve data
/*function getData2(map) {

    $.ajax("data/georg_simp.json", {
        dataType: "json",
        success: function(response){
            var attributes = processData(response);
            createPropSymbols(response, map, attributes);
            newOverlay(data, map, attributes);
        }

    });
};
console.log("Leaflet Above this?");*/
$(document).ready(createMap);