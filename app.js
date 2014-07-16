/**
 * Module dependecies
 */

var path = require('path');
var config = require('./config.js')['ntwitter'];
var twitter = require('ntwitter');
var controller = require('./controller.js');


//Twitter API Config
var twit = new twitter(config);

// Twitter symbols array
var watch = ['#BeamCam','#BeamTemp','#BeamPressure','#BeamAlt','#BeamRealAlt', '#BeamLED'];

twit.verifyCredentials(function (err, data) {
    if(err) console.log(err);
})
.stream('user', {track:watch}, function(stream) {
	console.log("Twitter stream is ready and waiting for inc tweets...");
	stream.on('data', function (data) {

		if (data.text !== undefined) {

			var name = data.user.screen_name;
			var hashtags = data.entities.hashtags;
			var options = { cam: false,
							temp: false,
							pressure: false,
							alt: false,
							real_alt: false}

			for(var i=0,l=hashtags.length;i<l;i++){
				var hashtag = hashtags[i].text.toLowerCase();
				if( hashtag == 'beamcam') options.cam = true;
				if( hashtag == 'beamtemp') options.temp = true;
				if( hashtag == 'beampressure') options.pressure = true;
				if( hashtag == 'beamalt') options.alt = true;
				if( hashtag == 'beamrealalt') options.real_alt = true;

			}

			if(options.cam) controller.cam(name)
			else if (options.temp)
				controller.sensor('temp','The temperature is',name)
			else if (options.pressure)
				controller.sensor('pressure','The pressure is',name)
			else if (options.alt)
				controller.sensor('alt','The altitude is ',name)
			else if (options.real_alt)
				controller.sensor('real_alt','The real altitude is ',name)
		}
	});

	stream.on('error', function (err, code) {
		console.log("err: "+err+" "+code)
	});
});
