// Location Class completely builds everything needed for each location marker.
var Location = function(title, lng, lat, venueId, cat) {
	var self = this;
	this.title = title;
	this.lng = lng;
	this.lat = lat;
	this.venueId = venueId;
	this.cat = cat;

// getConetent function retrieves 5 most recent tips from foursquare for the marker location.
	this.getContent = function() {
		var topTips = [];
		var venueUrl = 'https://api.foursquare.com/v2/venues/' + self.venueId + '/tips?sort=recent&limit=5&v=20150609&client_id=4EPS21I4V4MVCYXWDT4QNZZG1JETWZ2LIJMYQ34FNBWZ1RMV&client_secret=U3P1XLU204VMYO4BHGIWPDOY130Z1AFTT1OQTI2TY0HW0T43';

		$.getJSON(venueUrl,
			function(data) {
				$.each(data.response.tips.items, function(i, tips){
					topTips.push('<li>' + tips.text + '</li>');
				});

			}).done(function(){

				self.content = '<h2>' + self.title + '</h2>' + '<h3>5 Most Recent Comments</h3>' + '<ol class="tips">' + topTips.join('') + '</ol>';
			}).fail(function(jqXHR, textStatus, errorThrown) {
				self.content = '<h2>' + self.title + '</h2>' + '<h3>5 Most Recent Comments</h3>' + '<h4>Oops. There was a problem retrieving this location\'s comments.</h4>';
				console.log('getJSON request failed! ' + textStatus);
			});
		}();

		this.infowindow = new google.maps.InfoWindow();

		// Assigns a marker icon color based on the category of the location.
		switch (this.cat) {
			case "Education":
			this.icon = 'http://www.googlemapsmarkers.com/v1/009900/';
			break;
			case "Food":
			this.icon = 'http://www.googlemapsmarkers.com/v1/0099FF/';
			break;
			default:
			this.icon = 'http://www.googlemapsmarkers.com/v1/990000/';
		}
		this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(self.lng, self.lat),
			map: map,
			title: self.title,
			icon: self.icon
		});

		// Opens the info window for the location marker.
		this.openInfowindow = function() {
			for (var i=0; i < locationsModel.locations.length; i++) {
   			locationsModel.locations[i].infowindow.close();
  		}
			map.panTo(self.marker.getPosition())
			self.infowindow.setContent(self.content);
			self.infowindow.open(map,self.marker);
		};

		// Assigns a click event listener to the marker to open the info window.
		this.addListener = google.maps.event.addListener(self.marker,'click', (this.openInfowindow));
	};

	// Contains all the locations and search function.
	var locationsModel = {

		locations:[
		new Location('RNSIT', 12.9021954,77.5163933 ,'4ad4c00af964a5203ded20e3', 'Education'),
		new Location('Swargrani School', 12.9123717,77.5250546, '4adc8051f964a520b92c21e3', 'Education'),
		new Location('Best Club', 12.9126831,77.5204483, '4bb8979c3db7b713c965219a', 'Entertainment'),
		new Location('Cool Berryz', 12.9160618,77.5202904, '4b6b5120f964a52078002ce3', 'Food'),
		new Location('Cool Joint', 12.9288143,77.5837105, '4d615493e4fe5481a8618a9e', 'Food'),
		new Location('SJBIT', 12.8998893,77.4935995, '4c84e24574d7b60ca66196d8', 'Education'),
		new Location('BGS Hospital', 12.9070765,77.4969444, '4afee1fdf964a520333122e3', 'Hospital'),
		new Location('Pizza Hut', 12.9071631,77.4641135, '4aecb1b2f964a52056ca21e3', 'Food')
		],
		query: ko.observable(''),
	};


	// Search function for filtering through the list of locations based on the name of the location.
	locationsModel.search = ko.dependentObservable(function() {
		var self = this;
		var search = this.query().toLowerCase();
		return ko.utils.arrayFilter(self.locations, function(location) {
			return location.title.toLowerCase().indexOf(search) >= 0;
		});
	}, locationsModel);

	ko.applyBindings(locationsModel);