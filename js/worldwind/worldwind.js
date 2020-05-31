var wwd = new WorldWind.WorldWindow("canvasOne");

wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
wwd.addLayer(placemarkLayer);

var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.3,
    WorldWind.OFFSET_FRACTION, 0.0);

placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);

placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";

var position = new WorldWind.Position(-23.5475, -46.63611, 100.0);
var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
placemark.label = "São Paulo\n" + "NO2: 32";
placemark.alwaysOnTop = true;
placemarkLayer.addRenderable(placemark);

position = new WorldWind.Position(-25.441105, -49.276855, 100.0);
placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
placemark.label = "Curitiba\n" + "NO2: 4";
placemark.alwaysOnTop = true;
placemarkLayer.addRenderable(placemark);
