var util = require('util');
var mqtt = require('mqtt');
var Scout = require('zetta-scout');

var MqttScout = module.exports = function(options) {
  options = options || {};

  this.client = null;

  if (options.uri) {
    this.client = mqtt.connect(options.uri, options);
  } else if (options.port && options.host) {
    this.client = mqtt.createClient(options.port, options.host, options);
  }

  this.map = options.map || {};

  this.devices = {};

  Scout.call(this);
}
util.inherits(MqttScout, Scout);

MqttScout.prototype.init = function(next) {
  var self = this;

  Object.keys(this.map).forEach(function(deviceType) {
    var topic = deviceType + '/#';
    self.client.subscribe(topic);
  });

  this.client.on('message', function(topic, message) {
    var split = topic.split('/');

    var deviceType = split[0];
    var name = split[1];
    var stream = split[2];

    var klass = self.map[deviceType];

    self._ensureDevice(deviceType, klass, name);

    var device = self.devices[deviceType + '/' + name];

    if (!device) {
      return;
    }

    if (stream === 'transition-ack') {
      var transition = split[3];
      if (device.ack && typeof device.ack === 'function') {
        device.ack(transition, message);
      }
    } else if (stream !== 'presence' && stream !== 'transition') {
      if (device.receive && typeof device.receive === 'function') {
        device.receive(stream, message);
      }
    }
  });

  next();
};

MqttScout.prototype._ensureDevice = function(deviceType, klass, name) {
  var self = this;

  var key = deviceType + '/' + name;

  if (!this.devices.hasOwnProperty(key)) {
    var query = this.server.where({ type: deviceType, name: name });
    this.server.find(query, function(err, results) {
      if (self.devices[key]) {
        return;
      }

      if (results.length > 0) {
        self.devices[key] = self.provision(results[0], klass, name, self.client);
      } else {
        self.devices[key] = self.discover(klass, name, self.client);
      }
    });
  }
};
