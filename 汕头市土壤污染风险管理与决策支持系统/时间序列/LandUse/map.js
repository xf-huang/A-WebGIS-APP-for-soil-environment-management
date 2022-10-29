var map, view, layerSwitcher;

view = new ol.View({
    projection:'EPSG:4326',
    center:[116.56,23.40],
    zoom:10
});

map = new ol.Map({
    target: 'map',
    view: view
});

// var satellite =  new ol.layer.Tile({
//     title: 'Satellite',
//     type: 'base',
//     visible: true,
//     source: new ol.source.XYZ({
//         attributions: ['Powered by Esri',
//             'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
//         ],
//         attributionsCollapsible: false,
//         url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//         maxZoom: 23
//     })
// });

var OSM =  new ol.layer.Tile({
    title: 'OSM',
    type: 'base',
    visible: true,
    source: new ol.source.OSM()
});

// var basemaps = new ol.layer.Group({
//     title: 'Base Maps',
//     layers:[satellite, OSM]
// });

map.addLayer(OSM);

var overlays = new ol.layer.Group({
    title: '时间序列图层',
    layers:[]
});

map.addLayer(overlays);

layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: true,
    tipLabel: 'Layers', // Optional label for button
    groupSelectStyle: 'children', // Can be 'children' [default], 'group' or 'none'
    collapseTipLabel: 'Collapse layers',
});
map.addControl(layerSwitcher);

layerSwitcher.renderPanel();

const wms = new ol.source.ImageWMS({
  url: 'http://localhost:8080/geoserver/wms',
  params: {
      'LAYERS': 'TimeSeries:汕头市土地覆盖类型_2000-2020',
      'time': '2000'
  },
  ratio: 1,
  serverType: 'geoserver'
});

const landuse = new ol.layer.Image({
    title: 'LandUse',
    // extent: [-180, -90, -180, 90],
    source: wms
});


// 获取legend
const updateLegend = function (resolution) {
    const graphicUrl = wms.getLegendUrl(resolution);
    const img = document.getElementById('legend');
    img.src = graphicUrl;
  };

// Initial legend
const resolution = map.getView().getResolution();
updateLegend(resolution);

// Update the legend when the resolution changes
map.getView().on('change:resolution', function (event) {
    const resolution = event.target.getResolution();
    updateLegend(resolution);
  });

overlays.getLayers().push(landuse);
layerSwitcher.renderPanel();



var dates = ['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020'];
var dateValue = document.getElementById("date_value");
dateValue.innerHTML = dates[0];
var sliderRange = document.getElementById("myRange");
sliderRange.max = dates.length-1;

     
      //console.log(dateValue.innerHTML);
      
      // Update the current slider value (each time you drag the slider handle)
      sliderRange.oninput = function() {
        dateValue.innerHTML = dates[this.value];
        overlays.getLayers().item(0).getSource().updateParams({'TIME': dates[this.value]});
         i = this.value;
         //console.log(i); 
        }

        var i = 0;                  //  set your counter to 0

      var timer;
        function play() {   
           
               //  create a loop function
          timer = setTimeout(run, 1000);
          function run () {   //  call a 3s setTimeout when the loop is called
          
            overlays.getLayers().item(0).getSource().updateParams({'TIME': dates[i]});
            dateValue.innerHTML = dates[i];
            sliderRange.value = i;
            //  your code here
           if(i<=20) {i++};                    //  increment the counter
            if (i < 22) {           //  if the counter < 22, call the loop function
              play();             //  ..  again which will trigger another 
            }                       //  ..  setTimeout()
          }
        }
        
       // myLoop(); 
        var start = document.getElementById("play");
        
	    start.addEventListener("click", play);

        var stop = document.getElementById("pause");
        
	   
	    stop.addEventListener("click", pause);

        var reset1 = document.getElementById("reset");
        
	   
	    reset1.addEventListener("click", reset);
       
        function pause() {
            console.log(i);
           clearTimeout(timer);
          
            overlays.getLayers().item(0).getSource().updateParams({'TIME': dates[i]});
            dateValue.innerHTML = dates[i];
            sliderRange.value = i;
        }

        function reset() {
           
            clearTimeout(timer);
             i = 0;
             overlays.getLayers().item(0).getSource().updateParams({'TIME': dates[i]});
             dateValue.innerHTML = dates[i];
             sliderRange.value = i;
         }

        
