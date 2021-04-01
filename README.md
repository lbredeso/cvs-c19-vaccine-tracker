# CVS COVID-19 Vaccine Tracker
This app monitors the CVS COVID-19 Vaccine site and sends SMS notifications when the desired state has openings.

## Setup
* Copy the example config into config.json:

		cp config.json.example config.json

* Create a Twilio account, if you don't already have one
* Purchase an SMS-capable Phone Number from Twilio
* Copy the ACCOUNT SID and AUTH TOKEN out of the API Credentials area inside of your Twilio account's General Settings into config.json
* Copy your new phone number into config.json as smsSender
* Add any number of desired SMS receivers into config.json as smsReceivers
* Set the desired state information in config.json
* Run the included run.sh script locally to loop the program, or use some alternate scheduling mechanism