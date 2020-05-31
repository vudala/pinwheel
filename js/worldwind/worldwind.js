var wwd = new WorldWind.WorldWindow("canvasOne");

wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
wwd.addLayer(placemarkLayer);

var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

placemarkAttributes.imageScale = 0.3;
placemarkAttributes.imageColor = WorldWind.Color.RED;
placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.3,
    WorldWind.OFFSET_FRACTION, 0.0);

placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;

placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

wwd.goTo(new WorldWind.Position(-23.5475, -46.63611, 800000.0));

posicionarpin();

var pinatual = null;

var highlightedItems = [];

var handlePick = function (o) {

    var x = o.clientX,
        y = o.clientY;

    var redrawRequired = highlightedItems.length > 0;

    for (var h = 0; h < highlightedItems.length; h++) {
        highlightedItems[h].highlighted = false;
    }
    highlightedItems = [];

    var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
    if (pickList.objects.length > 0) {
        redrawRequired = true;
    }

    if (pickList.objects.length > 0) {
        for (var p = 0; p < pickList.objects.length; p++) {
            pickList.objects[p].userObject.highlighted = true;

            highlightedItems.push(pickList.objects[p].userObject);

            if (pickList.objects[p].labelPicked) {
                console.log(pickList.objects[p].userObject.label);
                pinatual = pickList.objects[p].userObject.label;
            }
        }
    }

    if (redrawRequired) {
        wwd.redraw();
};

wwd.addEventListener("mousemove", handlePick);

function analisar(cidade, datainicio, datafim){
    if(cidade.value == ""){
        alert("por favor insira dados corretos");
    } else if (datainicio.value == "") {
        alert("por favor insira dados corretos");
    } else if (datafim.value == "") {
        alert("por favor insira dados corretos");
    } else {
        alert(cidade.value + " " + datainicio.value + " " + datafim.value);
    }
}

function posicionarpin(){   
    url = 'https://obscure-earth-56458.herokuapp.com/stations';

    fetch(url, {'Origin' : 'https://pinwheel-nasa.co/'})
        .then(function(response) {
            response.json().then(function(json){
                for (var k of json){
                    console.log(k.name);
                    var position = new WorldWind.Position(k.lat, k.lon, 100.0);
                    var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
                    highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                    highlightAttributes.imageScale = 0.5;
                    placemark.highlightAttributes = highlightAttributes;
                    placemark.alwaysOnTop = true;
                    placemark.label = k.name;
                    placemarkLayer.addRenderable(placemark);
                }
            });
        });
}

function plotar(){
    if(pinatual != null){
        alert(pinatual);
    }
}