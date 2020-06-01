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
    }
};

wwd.addEventListener("mousemove", handlePick);

function analisar(cidade, datainicio){
    if(cidade.value == ""){
        alert("por favor insira dados corretos");
    } else if (datainicio.value == "") {
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
                    placemark.label = k.name+'-'+k.id;
                    placemarkLayer.addRenderable(placemark);
                }
            });
        });
}

function buscarNitrogenio(){

    date = datainicio.value;
    var year = parseInt(date.split("-")[0],10);
    var dayMonthRel = [0,31,28,31,30,31,30,31,31,30,31,30,31];
    if(year % 4 == 0){
        dayMonthRel[2] = 29;
    } // se for bissexto
    var month = parseInt(date.split("-")[1],10);
    stationid = parseInt(pinatual.split('-')[1],10);

    console.log(year + '-' + month + '-' + dayMonthRel[month] + '-' + stationid + '-' + date);
    url = 'https://obscure-earth-56458.herokuapp.com/stations/'

    nitrogenio = [];
    xaxys = [];

    for(day = 1; 1 <= dayMonthRel[month]; day++){
        url = 'https://obscure-earth-56458.herokuapp.com/stations/' + stationid +
        + '/' + year + '/' + month + '/' + day;
        fetch(url, {'Origin' : 'https://pinwheel-nasa.co/'})
        .then(function(response) {
            response.json().then(function(json){
                console.log(json.quality.ozone);
            });
        });
        sleep(2000);
        //xaxys.push(day+'/'+month);
    }


    // trace1 = {
    //     type: 'scatter',
    //     x: xaxys,
    //     y: nitrogenio,
    //     mode: 'lines',
    //     name: 'Red',
    //     line: {
    //       color: 'rgb(219, 64, 82)',
    //       width: 3
    //     }
    // };
    
}

function plotar(datainicio){
    if(pinatual != null && highlightedItems != []){
        alert(pinatual);
        buscarNitrogenio();
    }
}

function graph(){
    trace1 = {
        type: 'scatter',
        x: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        y: [38, 40, 42, 42, 42, 42, 42, 43, 43, 42, 42, 42, 43, 43, 43, 43, 43, 43, 42],
        mode: 'lines',
        name: 'Red',
        line: {
          color: 'rgb(219, 64, 82)',
          width: 3
        }
      };
      
      trace2 = {
        type: 'scatter',
        x: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        y: [38, 40, 42, 42, 42, 42, 42, 43, 43, 42, 42, 42, 43, 43, 43, 43, 43, 43, 42],
        mode: 'lines',
        name: 'Blue',
        line: {
          color: 'rgb(55, 128, 191)',
          width: 1
        }
      };
      
      var layout = {
        width: 500,
        height: 500
      };
      
      var data = [trace1, trace2];
      
      Plotly.newPlot('myDiv', data, layout);
}