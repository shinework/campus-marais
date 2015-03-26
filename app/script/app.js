$(document).ready(function() {
  L.mapbox.accessToken = 'pk.eyJ1Ijoic2hpbmV3b3JrIiwiYSI6IlJ2eW9LalkifQ.2hEyr-Y9_cMlaW-UohSmig';
  var map = L.mapbox.map('map', 'shinework.lgonh47n');
  map.setView(new L.LatLng(48.86025, 2.36126), 15);

  var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
  elems.forEach(function(html) {
    var switchery = new Switchery(html, { size: 'small' });
  });

  var greenWay = [
    [2.398925,48.841115],
    [2.397337,48.841185],
    [2.396790,48.841214],
    [2.396554,48.841171],
    [2.396318,48.841171],
    [2.396114,48.841171],
    [2.395856,48.841200],
    [2.395717,48.841164],
    [2.395535,48.841143],
    [2.395395,48.841136],
    [2.394505,48.841108],
    [2.393904,48.841080],
    [2.393593,48.841058],
    [2.392659,48.841122],
    [2.391168,48.841489],
    [2.387027,48.842428],
    [2.385535,48.842774],
    [2.385031,48.842887],
    [2.383969,48.843410],
    [2.382317,48.844186],
    [2.377574,48.846453],
    [2.372864,48.848719],
    [2.371738,48.849326],
    [2.371202,48.849715]
  ];

  var latlngs = [];
  _.forEach(greenWay, function(positions) {
    latlngs.push(L.latLng(positions[1], positions[0]));
  });
  var poly = L.polyline(latlngs, {color: 'green'});
  var greenWayLayout = L.layerGroup([poly]);
  greenWayLayout.addTo(map);

  var velibStations = [
    3101,
    3012,
    3011,
    3005,
    3004,
    3006,
    3003,
    3001,
    3002,
    3008,
    3007,
    3009,
    3010,
    3014,
    4104,
    4021,
    4020,
    4019,
    4018,
    4017,
    4014,
    4103,
    4016,
    4013,
    4015,
    4012,
    4011,
    3013,
    4010,
    4107,
    4101,
    4009,
    4007,
    4005,
    4105,
    4006,
    4003,
    4001,
    4002]
  ;

  // Markers
  var velibIcon = L.icon({
    iconUrl: 'app/asset/icon-velib.png',
    iconSize:     [20, 25]
  });
  var autolibIcon = L.icon({
    iconUrl: 'app/asset/icon-autolib.png',
    iconSize:     [20, 25]
  });

  var locationMarker = L.icon({
    iconUrl: 'app/asset/icon-poi.png',
    iconSize:     [20, 25]
  });

  var calls = [];
  var layerVelib = null;
  var layerAutolib = null;
  var layerMap = null;

  _.forEach(velibStations, function(idStation) {
    var getStations = function(callback) {
      $.get('https://api.jcdecaux.com/vls/v1/stations/'+idStation+'?contract=paris&apiKey=fe2bf527170619f1c17248cc613f85ecdda13ef1', function(data) {
        callback(null, data);
      });
    };
    calls.push(getStations);
  });

  async.parallel(calls,
    function(err, results){
      var markersVelib = [];
      _.forEach(results, function(data) {
        //var name = data.address + ' (' + data.available_bikes + '/' + data.bike_stands + ')';
        markersVelib.push(L.marker([data.position.lat, data.position.lng], {icon: velibIcon}));
      });
      layerVelib = L.layerGroup(markersVelib);
      layerVelib.addTo(map);
    });

  $('#velibCheckbox').change(function() {
    if($(this).is(":checked")) {
      map.addLayer(layerVelib);
    } else {
      map.removeLayer(layerVelib);
    }
  });

  $('#autolibCheckbox').change(function() {
    if($(this).is(":checked")) {
      map.addLayer(layerAutolib);
    } else {
      map.removeLayer(layerAutolib);
    }
  });

  $('#greenWayCheckbox').change(function() {
    if($(this).is(":checked")) {
      map.addLayer(greenWayLayout);
    } else {
      map.removeLayer(greenWayLayout);
    }
  });

  $.get('http://data.iledefrance.fr/api/records/1.0/search?dataset=stations_et_espaces_autolib&facet=code_postal&facet=code_departement&facet=ville&facet=type_de_station&facet=emplacement&refine.code_postal=75003', function(data) {
    var markersAutolib = [];

    _.forEach(data.records, function(station) {
      markersAutolib.push(L.marker([station.fields.field13[0], station.fields.field13[1]], {icon: autolibIcon}));
    });

    layerAutolib = L.layerGroup(markersAutolib);
    layerAutolib.addTo(map);
  });

  $('.link-map').click(function() {
    if (layerMap !== null)
      layerMap.clearLayers();
    var id = $(this).attr('id');
    var markersMap = [];

    var locations = data[id]
    _.forEach(locations, function(location) {
      markersMap.push(L.marker([location.lat, location.lng], {icon: locationMarker}));
    });

    layerMap = L.layerGroup(markersMap);
    layerMap.addTo(map);
  });
});
