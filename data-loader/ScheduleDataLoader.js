// This node app executes the data loader on a schedule

var exec = require('child_process').exec;
var fs = require('fs');
var schedule = require('node-schedule');
var zerorpc = require("zerorpc");
var sleep = require('sleep');

// Load the config
var data = fs.readFileSync('./dataLoaderConfig.json'),
  dataLoaderOptions;

try {
  dataLoaderOptions = JSON.parse(data);
} catch (err) {
  console.log('There has been an error parsing your configuration JSON.');
  console.log(err);
  process.exit();
}


var rule = new schedule.RecurrenceRule()
rule.dayOfMonth = dataLoaderOptions.schedule.dayOfMonth;
rule.hour = dataLoaderOptions.schedule.hour;
rule.minute = dataLoaderOptions.schedule.minute;

console.log("Dataloader will run on this day of the month: ", rule.dayOfMonth);
console.log("Dataloader will run on this hour: ", rule.hour);
console.log("Dataloader will run on this minute: ", rule.minute);



var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

var aiRunFinished = false

/*
	client.invoke("dataLoad", "isAiDone", function(error, res, more) {
	    console.log(res);
	});


client.invoke("dataLoad", "pendingDataLoad", function(error, res, more) {
	console.log(res);
	while (!aiRunFinished) {
		sleep.sleep(10);
		
		console.log("polling");
		client.invoke("dataLoad", "isAiDone", function(error, res, more) {
			console.log("waiting");
			if (res == "ready") {
				aiRunFinished = true
			}
		});
		console.log("finished - " + aiRunFinished)
	}
	console.log("finished")
});

console.log("done")
*/


/*
setTimeout(function() {
	console.log("sending signal now");
	client.invoke("dataLoad", "pendingDataLoad", function(error, res, more) {
	    console.log(res);
	});
}, 5000);

setTimeout(function() {
	console.log("sending second signal now");
			client.invoke("dataLoad", "dataLoadDone", function(error, res, more) {
				console.log(res);
			});
}, 5000);

setTimeout(function() {
	console.log("sending third signal now");
			client.invoke("dataLoad", "isAiDone", function(error, res, more) {
				console.log(res);
			});
}, 5000);
*/


var aiRunFinished = false
var j = schedule.scheduleJob(rule, function(){
	client.invoke("dataLoad", "pendingDataLoad", function(error, res, more) {
	    console.log(res);
	});
	while (!aiRunFinished) {
		client.invoke("dataLoad", "isAiDone", function(error, res, more) {
			if (res = "ready") {
				aiRunFinished = true
			}
		})
	}
  console.log("Running DataLoader\n");
  exec('node DataLoader.js', function callback(error, stdout, stderr){
      console.log(stdout);
			client.invoke("dataLoad", "dataLoadDone", function(error, res, more) {
				console.log(res);
			});
  });
});

