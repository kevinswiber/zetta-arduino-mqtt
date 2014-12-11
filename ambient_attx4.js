var util = require('util');
var Device = require('zetta-device');

var Ambient = module.exports = function(name) {
  this.lightLevel = null;
  this.soundLevel = null;
  this._name = name;

  Device.call(this);
};
util.inherits(Ambient, Device);

Ambient.prototype.init = function(config) {
  config
    .type('ambient-attx4')
    .name(this._name)
    .monitor('lightLevel')
    .monitor('soundLevel')
};

Ambient.prototype.receive = function(type, data) {
  if (['lightLevel', 'soundLevel'].indexOf(type) > -1) {
    this[type] = data;
  }
};
