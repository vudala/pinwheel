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
// The common pick-handling function.
var handlePick = function (o) {
    // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
    // the mouse or tap location.
    var x = o.clientX,
        y = o.clientY;

    var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items

    // De-highlight any previously highlighted placemarks.
    for (var h = 0; h < highlightedItems.length; h++) {
        highlightedItems[h].highlighted = false;
    }
    highlightedItems = [];

    // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
    // relative to the upper left corner of the canvas rather than the upper left corner of the page.
    var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
    if (pickList.objects.length > 0) {
        redrawRequired = true;
    }

    // Highlight the items picked by simply setting their highlight flag to true.
    if (pickList.objects.length > 0) {
        for (var p = 0; p < pickList.objects.length; p++) {
            pickList.objects[p].userObject.highlighted = true;

            // Keep track of highlighted items in order to de-highlight them later.
            highlightedItems.push(pickList.objects[p].userObject);

            // Detect whether the placemark's label was picked. If so, the "labelPicked" property is true.
            // If instead the user picked the placemark's image, the "labelPicked" property is false.
            // Applications might use this information to determine whether the user wants to edit the label
            // or is merely picking the placemark as a whole.
            if (pickList.objects[p].labelPicked) {
                console.log(pickList.objects[p].userObject.label);
                pinatual = pickList.objects[p].userObject.label;
            }
        }
    }

    // Update the window if we changed anything.
    if (redrawRequired) {
        wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
    }
};

// Listen for mouse moves and highlight the placemarks that the cursor rolls over.
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

    fetch(url)
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