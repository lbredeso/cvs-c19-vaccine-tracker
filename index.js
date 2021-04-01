const config = require('./config.json')

const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken, {
    lazyLoading: true,
	logLevel: 'debug'
});

const https = require('https');

let cookieRequest = https.request({
  host: 'www.cvs.com',
  path: `/immunizations/covid-19-vaccine`,
  headers: {
	  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:87.0) Gecko/20100101 Firefox/87.0"
  }
}, cookieResponse => {
	console.log(`Grabbing a cookie...${new Date()}`);
	let cookie = cookieResponse.headers['set-cookie'].find(cookie => cookie.includes("_abck"));
	
	let request = https.request({
	  host: 'www.cvs.com',
	  path: `/immunizations/covid-19-vaccine.vaccine-status.${config.cvs.state.abbreviation}.json?vaccineinfo=`,
	  headers: {
		  "Referer": "https://www.cvs.com/immunizations/covid-19-vaccine",
		  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:87.0) Gecko/20100101 Firefox/87.0",
		  "Cookie": cookie
	  }
	}, response => {
	  response.on('data', d => {
		console.log(`Looking for CVS vaccines...${new Date()}`);
		let json = JSON.parse(d);
		let pharmacies = json.responsePayloadData.data.MN;
		for (i in pharmacies) {
			let pharmacy = pharmacies[i];
			if (pharmacy.status !== "Fully Booked") {
				console.log("Found a pharmacy that isn't 'Fully Booked'");
				console.log(pharmacy);
			
				for (j in config.twilio.smsReceivers) {
					sendSms(config.twilio.smsReceivers[j], `Found an open CVS pharmacy in ${pharmacy.city}, please visit https://www.cvs.com/immunizations/covid-19-vaccine and click on ${config.cvs.state.name} to schedule an appointment.`);
				}
			}
		}
	  });	
	});

	request.on('error', error => {
	  console.error(error)
	})
	request.end();
});

cookieRequest.on('error', error => {
  console.error(error)
})
cookieRequest.end();

let sendSms = (to, message) => {
	client.messages
		.create({
			body: message,
			from: config.twilio.smsSender,
			to: to
		})
		.then(message =>  {
			console.log("Successfully sent SMS");
			console.log(message.sid);
		})
		.catch(error => {
			console.log(error);
		});
}
