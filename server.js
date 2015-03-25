var zetta = require('zetta');
var MqttScout = require('./mqtt_scout');
var LED = require('./led');

var options = {
  uri: process.env.MQTT_URI,
  map: {
    'led': LED
  }
};

zetta()
  .name('arduino-mqtt')
  .use(MqttScout, options)
  .link('https://zetta-cloud-2.herokuapp.com')
  .listen(process.env.PORT || 1337);
