// Data
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
var map;
var marks = [];
var center={lat: 27.715010, lng: 85.318097};

// 
function searchViewModel() {
  var self = this;
  self.iniList = ko.observableArray(nepalList);
  self.query = ko.observable('');
  self.search = function(value) {
    //Remove all the current list items, which removes them from the view
    self.iniList([]);
    if(value == '') return;
    for(var x in nepalList) {
      if(nepalList[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        self.iniList.push(nepalList[x]);
      }
    }
  };
  self.query.subscribe(self.search);

  // }
}
ko.applyBindings(new searchViewModel());