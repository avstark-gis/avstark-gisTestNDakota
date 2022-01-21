//Step 1: Create the Leaflet map

//fix for the icons part 1 of 2
var teardrop = new L.Icon({
    iconUrl: "img/images/marker-icon.png",
    iconSize: [18, 25],
    popupAnchor: [-3, -15]
});
var teardrop2 = new L.Icon({
    iconUrl: "img/images/marker-shawdow.png",
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
     
    //locations for overlay as individual markers
    var 
    lehigh = L.marker([46.8722, -102.7040], {icon: teardrop}).bindPopup('<b>County: Stark</b><br><b>Location Name: </b>Lehigh Coal Mine'),
    gladstone = L.marker([46.7623, -102.5821], {icon: teardrop}).bindPopup('<b>County: Stark</b><br><b>Location Name: </b>Lehigh Homestead'),
    daglum = L.marker([46.7032, -103.0196], {icon: teardrop}).bindPopup('<b>County: Stark</b><br><b>Location Name: </b>Daglum'),
    daglumVicinity1 = L.marker([46.6038, -103.0312], {icon: teardrop}).bindPopup('<b>County: Slope</b><br><b>Location Name: </b>Jensen Farmstead One'),
    daglumVicinity2 = L.marker([46.6037, -103.0311], {icon: teardrop}).bindPopup('<b>County: Slope</b><br><b>Location Name: </b>Jensen Farmstead Two'),
    daglumVicinity3 = L.marker([46.5992, -103.0304], {icon: teardrop}).bindPopup('<b>County: Slope</b><br><b>Location name: </b>Rural School'),
    schefield = L.marker([46.6746, -102.8550], {icon: teardrop}).bindPopup('<b>County: Stark</b><br><b>Location Name: </b>School');
    
    //fix for the icons part 2 of 2 is choosing that icon in above layers

    //creating layer group for locations
    var overlayLocations = L.layerGroup([lehigh,gladstone,daglum,daglumVicinity1,daglumVicinity2,daglumVicinity3,schefield]);
   
    //add Mapbox base tilelayer
   var mapboxMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'INSERT YOUR MAPBOX KEY HERE'
    });
    
    var esriMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
    });
        var openStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    });
    //create the map object
    let map = L.map('map', {
        center: [46.6746, -102.8550],
        zoom: 10 ,
        minZoom: 6,
        layers:[openStreetMap_HOT, overlayLocations]
    });
    //create overlay object
    var overlayMap = {
        "ND Oral History Locations" : overlayLocations
    };
    //create the actual control button
    L.control.layers(null, overlayMap).addTo(map);

    //info popup
    var infoPopup = L.popup()
        .setLatLng([46.6746, -102.8550])
        .setContent("<b>This is the Map Information Popup</b><br>Alternative to Splash Screen Intro")
        .openOn(map);

    //call getData ()
    getData(map);   
};

/*popup Constructor
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
    
};*/


$(document).ready(createMap);