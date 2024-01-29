const express = require('express');
const mqtt = require('mqtt');

const app = express();
const mqttBroker = 'mqtt://localhost'; // Cambia esto a tu dirección de servidor MQTT

const mqttClient = mqtt.connect(mqttBroker);

app.get('/publish', (req, res) => {
  const topic = req.query.topic || 'default_topic';
  const message = req.query.message || 'Hello from MQTT server!';

  mqttClient.publish(topic, message, (err) => {
    if (err) {
      res.status(500).send('Error al publicar en el tema MQTT');
    } else {
      res.send(`Mensaje publicado en el tema ${topic}: ${message}`);
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor Node.js y MQTT escuchando en el puerto 3000');
});

