// HEADER COMMENT
// This JS file contains the code for running the Search bar, the resulting list from the search bar, the Wikipedia lookup from 
// the pressed item in the list and a Google map with markings of where the list results are located.

// Data
var nepalList = [
{
  name: "Children's Art Museum of Nepal",
  latlng: {lat: 27.711140, lng: 85.322141},
  description: 'Creative space designed for children and youth',
  things: 'Hotel',
  label: "A"
},
{
  name: 'Narayanhity Palace',
  latlng: {lat: 27.715010, lng: 85.318097},
  description: 'The old royal palace where most of the royal family was murdered in 2002',
  things: 'Museum',
  label: "B"
},
{
  name: 'Royal Nepal Academy',
  latlng: {lat: 27.708903, lng: 85.320373},
  description: 'Formerly Royal Nepal Academy, now Nepal Academy',
  things: 'School',
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
  name: 'Garden of Dreams',
  latlng: {lat: 27.714464, lng: 85.314480},
  description: 'A neo-classical garden',
  things: 'Hotel',
  label: "E"
}
];
var map;
var marks = [];
var center={lat: 27.711292, lng: 85.316355};
var infoWindow = new google.maps.InfoWindow();
var $wikiElem = $('#wikiInfo');
// Add Google map to div
function initMap() {
  var mapProp = {
    center:center,
    zoom:16,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
}
initMap();

// Automatically updated list with knockout.js which adds markers to a Google Map
// and fetches lookup of pressed item on Wikipedia
function searchViewModel() {
  var self = this;
  var markers = [];
  // The array for the list
  self.iniList = ko.observableArray(nepalList);
  self.query = ko.observable('');
  // The search function that is run whenever there is changes in the search field. Gets the value from the searchfield
  self.search = function(value) {
    //Remove all the current list items, which removes them from the view
    self.iniList([]);
    // Find entries with matching letters and push them to iniList observableArray
    for(var x in nepalList) {
      if(nepalList[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        self.iniList.push(nepalList[x]);
      }
    }
    //Put markers from iniList to the map
    self.putMarker();
    // Remove old infowindow
    infoWindow.close();
  };
  // Function that puts markers to map (and deleting old ones first - and deleting any wikipedia information)
  self.putMarker = function() {

    // Delete all markers from map
    for (var j = 0; j < markers.length; j++) {
      markers[j].setMap(null);
    };
    // Delete any text in the wikiElem UL in index.HTML
    $wikiElem.text("");
    // Empty the markers array before repopulating with new list
    markers = [];
    // Function that populates markers array and places them on the map
    function placeMarker(loc){
      var marker = new google.maps.Marker({
        position: self.iniList()[loc].latlng,
        map: map,
        title: self.iniList()[loc].name,
        label: self.iniList()[loc].label
        });
      markers.push(marker);
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(self.iniList()[loc].description);
        infoWindow.open(map, marker);
      });
    }
    // Function that opens the infoWindow of any clicked marker. Called from the list in index.html
    self.openInfo = function(inp) {
      infoWindow.setContent(inp.description);
      var updlatlng = inp.latlng;
      var updlng = inp.latlng.lng;
      var updlat = inp.latlng.lat + 0.00077;
      var updpos = {lat: updlat, lng: updlng}
      infoWindow.setPosition(updpos);
      infoWindow.open(map);
      self.wikiReq(inp);
    };
    // Function that makes AJAX requests to wikipedia when a marker is clicked. called from openInfo()
    self.wikiReq = function(inp) {
      // var $wikiElem = $('#wikiInfo');
      $wikiElem.text("");
      var wikiSource = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + inp.name + '&format=json&callback=wikiCallback';
      var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get Wikipedia resources");
      }, 5000);

      $.ajax({
        url: wikiSource,
        dataType: "jsonp",
        success: function( response){
            var articleList = response[1];
            var articleSnip = response[2];
            for (var i = 0; i < articleList.length; i++) {
              articleStr = articleList[i];
              articleSnipStr = articleSnip[i];
              var url = 'http://en.wikipedia.org/wiki/' + articleStr;
              $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a><p>'+articleSnip+'</p></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
      })
    }
    // Iterating through the updated list and placing markers
    for (var i = 0; i < self.iniList().length; i++) {
      placeMarker(i);
    };
  }
    
// Subscribe to the query variable and run search function when it changes
self.query.subscribe(self.search);
// Place markers when first loading the web page
self.putMarker();
}
ko.applyBindings(new searchViewModel());
