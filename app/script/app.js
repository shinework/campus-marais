$(document).ready(function() {
  // Init map
  L.mapbox.accessToken = 'pk.eyJ1Ijoic2hpbmV3b3JrIiwiYSI6IlJ2eW9LalkifQ.2hEyr-Y9_cMlaW-UohSmig';
  var map = L.mapbox.map('map', 'shinework.lgonh47n');
  map.setView(new L.LatLng(48.86025, 2.36126), 15);

  // Custom checkbox
  var toggleButtons = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
  toggleButtons.forEach(function(content) {
    new Switchery(content, { size: 'small' });
  });

  // Green way stuff
  $('#greenWayCheckbox').change(function() {
    if($(this).is(":checked")) {
      map.addLayer(greenWayLayout);
    } else {
      map.removeLayer(greenWayLayout);
    }
  });

  // Add panel stuff
  var controlPanel = {
    'autolib': {
      'marker': L.icon({ iconUrl: 'app/asset/icon-autolib.png', iconSize: [20, 25] }),
      'checkboxId': 'autolibCheckbox',
      'markers': [],
      'layer': null
    },
    'velib': {
      'marker': L.icon({ iconUrl: 'app/asset/icon-velib.png', iconSize: [20, 25] }),
      'checkboxId': 'velibCheckbox',
      'markers': [],
      'layer': null
    }
  };

  var classicWayCoo = [];
  _.forEach(data['classicWay'], function(positions) {
    classicWayCoo.push(L.latLng(positions[1], positions[0]));
  });
  var classicWayLayout = L.layerGroup([L.polyline(classicWayCoo, {color: '#60cde4', dashArray: '20,15'})]);

  var greenWayCoo = [];
  _.forEach(data['greenWay'], function(positions) {
    greenWayCoo.push(L.latLng(positions[1], positions[0]));
  });
  var greenWayLayout = L.layerGroup([L.polyline(greenWayCoo, {color: 'green', dashArray: '20,15'})]);

  var userMarker = L.marker([48.86055289999999, 2.357431600000041], {icon: L.icon({ iconUrl: 'app/asset/icon-user.png', iconSize: [20, 25] })})
  userMarker.addTo(map);

  _.forEach(controlPanel, function(control, id) {
    _.forEach(data[id], function(station) {
      control.markers.push(L.marker([station.lat, station.lng], {icon: control.marker}));
    });

    control.layer = L.layerGroup(control.markers);

    $('#' + control.checkboxId).change(function() {
      if($(this).is(":checked")) {
        map.addLayer(control.layer);
      } else {
        map.removeLayer(control.layer);
      }
    });
  });

  // POI stuff
  var poiMarker = L.icon({ iconUrl: 'app/asset/icon-poi.png', iconSize: [20, 25] });
  var poiLayer  = null;

  $('.link-map').click(function() {
    if (poiLayer !== null) {
      poiLayer.clearLayers();
    }
    var id = $(this).attr('id');
    var markersMap = [];

    var poiClicked = false;
    var locations = data[id]
    _.forEach(locations, function(location) {
      var marker = L.marker([location.lat, location.lng], {icon: poiMarker});
      markersMap.push(marker);

      marker.on('click', function(e) {
        if (poiClicked) {
          poiClicked = false;
          map.removeLayer(classicWayLayout);
          map.removeLayer(greenWayLayout);
        } else {
          poiClicked = true;

          map.addLayer(classicWayLayout);
          map.addLayer(greenWayLayout);
        }
      });
    });

    poiLayer = L.layerGroup(markersMap);
    poiLayer.addTo(map);
  });
});
