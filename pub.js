const mqtt = require('mqtt');

const pub = mqtt.connect('mqtt://localhost:9000');

pub.on('connect',() => {
   
   pub.publish('topic test','hello word ');
} )