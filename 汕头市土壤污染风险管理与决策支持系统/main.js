
    const Map = new ol.Map({
        view: new ol.View({
            projection: 'EPSG:4326',
            center: [116.423, 23.23],
            maxZoom: 15,
            minZoom:8,
            zoom:10,
            
        }),
   
        target: "js-map"
    })

    // Map.on("click", function(e){
    //     alert(e.coordinate)
    // })

    const OSMStandard = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        title: 'OSMStandard'
    })

    const OSMHumanitarian = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        }),
        visible: true,
        
        title: "OSMHumanitarian"
    })

    const stamenTerrain = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
            attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
        }),
        visible: true,
        title: "StamenTerrain"
    })

    const layergroup = new ol.layer.Group({
        layers:[
            OSMStandard, OSMHumanitarian, stamenTerrain
        ]
    })
    Map.addLayer(layergroup);

    //栅格图层
    // 土地利用
    const landuse = new ol.layer.Tile({

        title: 'landuse',
        source: new ol.source.TileWMS({
          url: 'http://localhost:8080/geoserver/wms',
          params: {'LAYERS': 'shantou_raster:shantou_landuse_2020'},
          serverType: 'geoserver',
          // Countries have transparency, so do not fade tiles:
          transition: 0,
        })
      });

    //行政区划图层
    const shantou_district = new ol.layer.Tile({

        title: 'district',
        source: new ol.source.TileWMS({
          url: 'http://localhost:8080/geoserver/wms',
          params: {'LAYERS': 'shantou_vector:shantou'},
          serverType: 'geoserver',
          // Countries have transparency, so do not fade tiles:
          transition: 0,
        })
      });

    //路网图层
    const roads = new ol.layer.Tile({

    title: 'roads',
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: {'LAYERS': 'shantou_vector:roads'},
        serverType: 'geoserver',
        // Countries have transparency, so do not fade tiles:
        transition: 0,
    })
    });
    //水体图层
    const waterbody = new ol.layer.Tile({

        title: 'waterbody',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'shantou_vector:water_body'},
            serverType: 'geoserver',
            // Countries have transparency, so do not fade tiles:
            transition: 0,
        })
        });
      
     
      //Map.addLayer(shantou_district);
      //Map.addLayer(roads);

    //切换底图
    const baselayers = document.querySelectorAll('.sidebar > input[type=radio]');
    for(baselayer of baselayers){
        baselayer.addEventListener('change', function(){
            let baselayerElementValue = this.value;
            layergroup.getLayers().forEach(function(element, index, array){
                let baselayerTitle = element.get('title');
                element.setVisible(baselayerTitle === baselayerElementValue)
            })
        })
    };
    function dist(obj){
        if(obj.checked){
            Map.addLayer(shantou_district)
        }
        else{
            Map.removeLayer(shantou_district)
        }
    };

    function road(obj){
        if(obj.checked){
            Map.addLayer(roads)
        }
        else{
            Map.removeLayer(roads)
        }
    };

    function water(obj){
        if(obj.checked){
            Map.addLayer(waterbody)
        }
        else{
            Map.removeLayer(waterbody)
        }
    };

    function land(obj){
        if(obj.checked){
            Map.addLayer(landuse)
        }
        else{
            Map.removeLayer(landuse)
        }
    };
    // 添加采样点图层
    // const samplesite_layer = new ol.layer.Vector({
    //     source: new ol.source.Vector({
    //       format: new ol.format.GeoJSON(),
    //       url: "https://services8.arcgis.com/PINgMXpNbFV5h7f0/arcgis/rest/services/samplesites/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&f=pgeojson"
    //     })
    //   });
      
    // Map.addLayer(samplesite_layer);

    //添加geoserver图层
//     const POI_layer = new ol.layer.Image({
        
//         extent: [-13884991, 2870341, -7455066, 6338219],
//        source: new ol.source.ImageWMS({
//       url: 'https://ahocevar.com/geoserver/wms',
//       params: {'LAYERS': 'topp:states'},
//       ratio: 1,
//       serverType: 'geoserver',
//     })
// });

    // Map.addLayer(POI_layer);

    //添加缩放控件
    var zoomslider = new ol.control.ZoomSlider();
    Map.addControl(zoomslider);

    // 控制图层透明度的控件
    const opacityInput = document.getElementById('opacity-input');
    const opacityOutput = document.getElementById('opacity-output');
    function update() {
        const opacity = parseFloat(opacityInput.value);
        stamenTerrain.setOpacity(opacity);
        opacityOutput.innerText = opacity.toFixed(2);
    }
    opacityInput.addEventListener('input', update);

