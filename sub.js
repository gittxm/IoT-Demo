const mqtt = require('mqtt')
const axios = require('axios');
const base64 = require('base-64');

const username = 'elastic';
const password = '3VDywTV3JZdiPbZ0AOMa';
const credentials = base64.encode(`${username}:${password}`);
const elasticsearchUrl = 'http://34.28.106.98:9200';
const sub = mqtt.connect('mqtt://34.28.106.98:9000');
var index = '';

var timestamp = new Date().toISOString();



sub.on('connect', () => {
    sub.subscribe('Tema/Datos')
    sub.subscribe('Tema/TempAgua')
})

sub.on('message', (topic, message) => {

  if(topic ==='Tema/Datos'){
    const mensaje = message.toString();
    index = 'termometro';
   
    const temperaturaMatch = mensaje.match(/Temperatura: ([\d.]+) °C/);
    const humedadMatch = mensaje.match(/Humedad: ([\d.]+) %/);

    // Verificar si se encontraron coincidencias y extraer los valores
    const temperatura = temperaturaMatch ? parseFloat(temperaturaMatch[1]) : null;
    const humedad = humedadMatch ? parseFloat(humedadMatch[1]) : null;

    //console.log(' temp:' + temperatura);
    //console.log('humedad' + humedad);

   timestamp = new Date().toISOString();
   const nuevoDocumento = 
    {
        "Temperatura":temperatura,
        "Humedad" : humedad,
        "@timestamp" : timestamp 
        
    };

    axios.post(`${elasticsearchUrl}/${index}/_doc`, nuevoDocumento, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log('Documento insertado con éxito:');
        })
        .catch(error => {
          console.error('Error al insertar el documento:', error.message);
        });
    }
    
    if(topic==='Tema/TempAgua'){
      index = 'termo_agua';

      const mensaje = message.toString();
     console.log("mensaje 64564"+ mensaje);
    const temperaturaAguaMatch = mensaje.match(/TemperaturaAgua:\s*(-?\d+(\.\d+)?)/);
   // const humedadMatch = mensaje.match(/Humedad: ([\d.]+) %/);
   // console.log('tempera agua 54564 : '+ temperaturaAguaMatch);
    // Verificar si se encontraron coincidencias y extraer los valores
    const temperatura = temperaturaAguaMatch ? parseFloat(temperaturaAguaMatch[1]) : null;
    //const humedad = humedadMatch ? parseFloat(humedadMatch[1]) : null;

    console.log(' temperatura agua :' + temperatura);
    //console.log('humedad' + humedad);

   timestamp = new Date().toISOString();

   console.log(timestamp);
    const nuevoDocumento = 
    {
        "Temperatura":temperatura,
        "@timestamp" : timestamp 
        
    };

    axios.post(`${elasticsearchUrl}/${index}/_doc`, nuevoDocumento, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log('Documento insertado con éxito:');
        })
        .catch(error => {
          console.error('Error al insertar el documento:', error.message);
        });
    



    }
     } 
      )

   