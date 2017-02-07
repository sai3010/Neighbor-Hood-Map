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
		var venueUrl = 'https://api.foursquare.com/v2/venues/' + self.venueId + '/tips?sort=recent&limit=5&v=20150609&client_id=W252SAVOZDZU3QTQ1CMDZOR0GCWRHCBKQHMDW1ZRIN2BAVRR&client_secret=EJMWHPN3ZHXQWENMP2UHSFYB1WI0F2RDEQMN304GMKGBIEUT';

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
			case "Coffee":
			this.icon = 'http://www.googlemapsmarkers.com/v1/C/009900/';
			break;
			case "Food":
			this.icon = 'http://www.googlemapsmarkers.com/v1/F/0099FF/';
			break;
			default:
			this.icon = 'http://www.googlemapsmarkers.com/v1/D/990000/';
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
		new Location('By 2 coffee', 12.9648003,77.5389259 ,'51d8034a498e44075a4a92fc', 'Coffee'),
		new Location('Captain\'s Food Court', 12.9190615,77.5183429, '52b4215211d2e0e5ef99e09b', 'Food'),
		new Location('Cafe Coffee Day', 12.9190613,77.5117768, '4c61410f924b76b0ae8afab9', 'Coffee'),
		new Location('Gopalan Arcade', 12.93597,77.5155649, '4beade509fa3ef3ba52f80c9', 'Shopping'),
		new Location('Kaapi Katte', 12.9164329,77.5184768, '4f140fece4b0253d4f512942', 'Food'),
		new Location('Chung Wah', 12.9250658,77.5486708, '4bd2c60cb221c9b62145d8d0', 'Food'),
		new Location('Royal Andhra Spice', 12.9057565,77.5188221, '4de4d44ec65b7a3e21522847', 'Food'),
		new Location('Pizza Hut',12.9057559,77.5035012, '4e7a0e46aeb79f7dabc48535', 'Food')
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