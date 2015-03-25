var util = require('util');
var Device = require('zetta-device');

var LED = module.exports = function(name, client) {
  this._name = name;
  this._client = client;

  Device.call(this);
};
util.inherits(LED, Device);

LED.prototype.init = function(config) {
  config
    .type('led')
    .name(this._name)
    .state('off')
    .when('off', { allow: ['turn-on'] })
    .when('on', { allow: ['turn-off'] })
    .map('turn-on', this.tryTurnOn)
    .map('turn-off', this.tryTurnOff)
};

LED.prototype.tryTurnOn = function(cb) {
  this._client.publish('led/' + this._name + '/transition/turn-on');
  this.state = 'on';
  cb();
};

LED.prototype.tryTurnOff = function(cb) {
  this._client.publish('led/' + this._name + '/transition/turn-off');
  this.state = 'off';
  cb();
};

LED.prototype.turnOnAck = function(cb) {
  if (this.state !== 'on') {
    this.state = 'on';
  }
  cb();
};

LED.prototype.turnOffAck = function(cb) {
  if (this.state !== 'off') {
    this.state = 'off';
  }
  cb();
};

LED.prototype.ack = function(transition, message) {
  if (transition === 'turn-on') {
    // acknowledge transition happened
  } else if (transition === 'turn-off') {
    // acknowledge transition happened
  }
};
