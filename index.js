var EventEmitter = require('events').EventEmitter;
var util = require('util');
var spawn = require('child_process').spawn;
var bl = require('bl');

function srcEscape(str) {
    var a = {};
    a[str] = 1;
    return JSON.stringify(a).slice(1,-3);
}

function SkypeApplescriptClient(name)
{
  EventEmitter.call(this);
  this.send = function(msg, callback) {
  	 var command = "tell application \"Skype\"\n  send command " + srcEscape(msg) +
  	   " script name \"" + name + "\"\nend tell";
  	 var ch = spawn('/usr/bin/osascript', []);
  	 ch.stdin.write(command);
     ch.stdin.end();
     ch.stdout.pipe(bl(function(err, data) {
     	callback(data.toString());
     }));
  };
}
util.inherits(SkypeApplescriptClient, EventEmitter);

module.exports.createClient = function(name, _bus, callback) {
  callback(null, new SkypeApplescriptClient())
}