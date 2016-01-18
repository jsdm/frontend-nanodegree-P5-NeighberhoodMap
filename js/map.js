// HEADER COMMENT
// This JS file contains the code for running the Search bar, the resulting list from the search bar, the Wikipedia lookup from 
// the pressed item in the list and a Google map with markings of where the list results are located.

// Data
var nepalList = [
{
  name: "Children's Art Museum of Nepal",
  latlng: {lat: 27.711140, lng: 85.322141},
  description: 'Creative space designed for children and youth',
  things: 'Hotel'
},
{
  name: 'Narayanhity Palace',
  latlng: {lat: 27.715010, lng: 85.318097},
  description: 'The old royal palace where most of the royal family was murdered in 2002',
  things: 'Museum'
},
{
  name: 'Royal Nepal Academy',
  latlng: {lat: 27.708903, lng: 85.320373},
  description: 'Formerly Royal Nepal Academy, now Nepal Academy',
  things: 'School'
},
{
  name: 'Department of passport',
  latlng: {lat: 27.714620, lng: 85.316349},
  description: "The department of passports where there's always a long line of people renewing their passports for overseas work",
  things: 'Passports...?'
},
{
  name: 'Garden of Dreams',
  latlng: {lat: 27.714464, lng: 85.314480},
  description: 'A neo-classical garden',
  things: 'Hotel'
}
];
var map;
var center={lat: 27.712039, lng: 85.317721};

// Automatically updated list with knockout.js which adds markers to a Google Map
// and fetches lookup of pressed item on Wikipedia
function searchViewModel() {
  var infoWindow = new google.maps.InfoWindow();
  var self = this;
  // Knockout Observables for showing wikipedia data in DOM
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
    }
    // Empty the markers array before repopulating with new list
    markers = [];
    // Function that populates markers array and places them on the map
    function placeMarker(loc){
      var oldMarker;
      var marker = new google.maps.Marker({
        position: self.iniList()[loc].latlng,
        map: map,
        title: self.iniList()[loc].name,
        });
      markers.push(marker);
      google.maps.event.addListener(marker, 'click', function() {
        self.openInfo(self.iniList()[loc]);
      });
    }
    // Function that opens the infoWindow of any clicked marker. Called from the list in index.html
    self.openInfo = function(inp) {
      for (var j = 0; j < markers.length; j++) {
        if(markers[j].title === inp.name){
          markers[j].setAnimation(google.maps.Animation.BOUNCE);
        }
        else {markers[j].setAnimation(null);}
      }
      self.wikiReq(inp, map);
    };
    // Function that makes AJAX requests to wikipedia when a marker is clicked. called from openInfo()
    self.wikiReq = function(inp, map) {
      var wikiSource = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + inp.name + '&format=json&callback=wikiCallback';
      var wikiRequestTimeout = setTimeout(function(){
        infoWindow.setContent("Failed to get Wikipedia resources");
      }, 5000);

      $.ajax({
        url: wikiSource,
        dataType: "jsonp",
        success: function( response){
            var articleList = response[1];
            var articleSnip = response[2];
            var infoWindowString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h3 id="firstHeading" class="firstHeading">'+articleList[0]+'</h3>'+
              '<div id="bodyContent">'+
              '<p>'+articleSnip[0]+'</p>'+
              '</div>'+
              '</div>';
            infoWindow.setContent(infoWindowString);
            var updlng = inp.latlng.lng;
            var updlat = inp.latlng.lat + 0.0015;
            var updpos = {lat: updlat, lng: updlng};
            infoWindow.setPosition(updpos);
            infoWindow.open(map);
            clearTimeout(wikiRequestTimeout);
        }
      });
    };
    // Iterating through the updated list and placing markers
    for (var i = 0; i < self.iniList().length; i++) {
      placeMarker(i);
    }
  };
    
// Subscribe to the query variable and run search function when it changes
self.query.subscribe(self.search);
// Place markers when first loading the web page
self.putMarker();
}
// Add Google map to div (Called from index.html when the google maps api is loaded)
function initMap() {
  var mapProp = {
    center:center,
    zoom:15,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
  ko.applyBindings(new searchViewModel());
}
