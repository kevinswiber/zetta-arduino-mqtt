var zetta = require('zetta');
var MqttScout = require('./mqtt_scout');
var Ambient = require('./ambient_attx4');
var LED = require('./led');

var options = {
  uri: process.env.MQTT_URI,
  map: {
    'ambient-attx4': Ambient,
    'led': LED
  }
};

zetta()
  .name('tessel-fun')
  .use(MqttScout, options)
  .listen(1337);
