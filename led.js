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
    .when('waiting-turn-on', { allow: ['turn-on-ack'] })
    .when('waiting-turn-off', { allow: ['turn-off-ack'] })
    .map('turn-on', this.tryTurnOn)
    .map('turn-off', this.tryTurnOff)
    .map('turn-on-ack', this.turnOnAck)
    .map('turn-off-ack', this.turnOffAck);
};

LED.prototype.tryTurnOn = function(cb) {
  this._client.publish('led/' + this._name + '/transition/turn-on');
  this.state = 'waiting-turn-on';
  cb();
};

LED.prototype.tryTurnOff = function(cb) {
  this._client.publish('led/' + this._name + '/transition/turn-off');
  this.state = 'waiting-turn-off';
  cb();
};

LED.prototype.turnOnAck = function(cb) {
  this.state = 'on';
  cb();
};

LED.prototype.turnOffAck = function(cb) {
  this.state = 'off';
  cb();
};

LED.prototype.ack = function(transition, message) {
  if (transition === 'turn-on') {
    this.call('turn-on-ack');
  } else if (transition === 'turn-off') {
    this.call('turn-off-ack');
  }
};
