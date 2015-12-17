//Initialize Google map
var map;
var marks = [];
var center={lat: 27.715010, lng: 85.318097};
var nepalList = [
{
  name: 'Yak and Yeti Hotel',
  latlng: {lat: 27.711906, lng: 85.321114},
  description: 'Old and very Nepali hotel from a bygone era',
  things: 'Hotel',
  label: "A"
},
{
  name: 'Narayanhiti Palace Museum',
  latlng: {lat: 27.715010, lng: 85.318097},
  description: 'The old royal palace where most of the royal family was murdered in 2002',
  things: 'Museum',
  label: "B"
},
{
  name: 'Mezze',
  latlng: {lat: 27.712571, lng: 85.317484},
  description: 'A good western/Italian inspired restaurant on the top of a mall, overlooking the royal palace',
  things: 'food',
  label: "C"
},
{
  name: 'Department of passport',
  latlng: {lat: 27.714620, lng: 85.316349},
  description: "The department of passports where there's always a long line of people renewing their passports for overseas work",
  things: 'Passports...?',
  label: "D"
},
{
  name: 'Hotel Annapurna',
  latlng: {lat: 27.710954, lng: 85.316375},
  description: 'A very nice and big hitel with some really good restaurants',
  things: 'Hotel',
  label: "E"
}
];

function initialize() {
  var mapProp = {
    center:center,
    zoom:16,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  // [END region_getplaces]
}
//Load Google Map
google.maps.event.addDomListener(window, 'load', initialize);

//Add list in the left side of page
function putMarkers() {
  nepalList.forEach(function(nepalList) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(nepalList.latlng),
      map: map,
      animation: google.maps.Animation.DROP,
      title: nepalList.name,
      label: nepalList.label
    });
    marks.push(marker);
  });
}
// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < marks.length; i++) {
    marks[i].setMap(map);
  }
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  marks = [];
}
var beenPressed = false;

var ViewModel = function() {
  this.addList = function() {
    var node;
    var element = document.getElementById("list");
    switch(beenPressed){
      case false:
        nepalList.forEach(function(nepalList){
          var head = document.createElement("H4");
          var headline = document.createTextNode(nepalList.label +"  -  " + nepalList.name);
          head.appendChild(headline);
          element.appendChild(head);
          var para = document.createElement("p");
          node = document.createTextNode(nepalList.description);
          para.appendChild(node);
          element.appendChild(para);
        });
        putMarkers();
        setMapOnAll(map);
        beenPressed = true;
        break;
      case true: 
        clearMarkers();
        beenPressed = false;
        break;
      }
    }
  }
ko.applyBindings(new ViewModel());


