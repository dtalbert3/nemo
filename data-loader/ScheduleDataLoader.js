// This node app executes the data loader on a schedule

var exec = require('child_process').exec;
var schedule = require('node-schedule');


var rule = new schedule.RecurrenceRule();
rule.second = 30;

var j = schedule.scheduleJob(rule, function(){
  console.log("Running DataLoader\n");
  exec('node DataLoader.js', function callback(error, stdout, stderr){
      console.log(stdout);
  });
});
