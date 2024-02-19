const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');

const app = express();
const client = mqtt.connect('mqtt://34.28.106.98:9000'); // Cambia 'localhost' por la dirección IP del servidor MQTT si no está en tu máquina local

app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log('connect ... ' , );
    console.error('si conecta:');
            res.json({ data : 'entro' });
});

app.post('/controlar-led', (req, res) => {
    // Obtener el estado del LED desde el cuerpo de la solicitud
    const estado = req.body.estado; // Supongamos que el cuerpo de la solicitud contiene el estado del LED (por ejemplo, { "estado": "encendido" })
    
    console.log('estado : ' ,estado );
    //nconsole.log(`Mensaje MQTT publicado correctamente: ${message}`);

    // Publicar el mensaje MQTT según el estado recibido
    const topic = 'topic/led';
    if (estado === '1' || estado === 1 ) {
        message = '1';
    } else if (estado === '2' || estado === 2) {
        message = '2';
    } else if (estado === '3' || estado === 3) {
        message = '3';
    } else if (estado === '4' || estado === 4 ) {
        message = '4';
    }else {
        message = '0'; // Valor predeterminado si estado no es ni '1', ni '2', ni '3'
    }

    client.publish(topic, message, (err) => {
        if (err) {
            console.error('Error al publicar el mensaje MQTT:', err);
            res.status(500).json({ error: 'Error al controlar el LED' });
        } else {
            console.log(`Mensaje MQTT publicado correctamente: ${message}`);
            res.status(200).json({ message: `LED ${estado}` });
        }
    });
});

const server = app.listen(9001, () => {
    console.log('Servidor Node.js escuchando en el puerto 9001');
});