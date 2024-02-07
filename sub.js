const mqtt = require('mqtt')
const axios = require('axios');
const base64 = require('base-64');

const username = 'elastic';
const password = '3VDywTV3JZdiPbZ0AOMa';
const credentials = base64.encode(`${username}:${password}`);
const elasticsearchUrl = 'http://34.28.106.98:9200';
const sub = mqtt.connect('mqtt://34.28.106.98:9000');
var index = '';
const indexDist = "distancia";
const indexHumo = "humo";
const indexLuz = "luz";

var timestamp = new Date().toISOString();
var timestampDist = new Date().toISOString();
var timestampHumo = new Date().toISOString();
var timestampLuz = new Date().toISOString();


sub.on('connect', () => {
    sub.subscribe('Tema/Datos')
    sub.subscribe('Tema/TempAgua')
})

sub.on('message', (topic, message) => {

  if(topic ==='Tema/Datos'){
    index = '';

    const mensaje = message.toString();

    const temperaturaMatch = mensaje.match(/Temperatura: ([\d.]+) °C/);
    const humedadMatch = mensaje.match(/Humedad: ([\d.]+) %/);
    const distanciaMatch = mensaje.match(/Distancia: ([\d.]+) cm/); 
    const humoMatch = mensaje.match(/Humo: ([\d.]+) humo/);   
    const luzMatch = mensaje.match(/Luz: ([\d.]+) luz/); 

    // Verificar si se encontraron coincidencias y extraer los valores
    const temperatura = temperaturaMatch ? parseFloat(temperaturaMatch[1]) : null;
    const humedad = humedadMatch ? parseFloat(humedadMatch[1]) : null;
    const distancia = distanciaMatch ? parseFloat(distanciaMatch[1]) : null;
    const humo = humoMatch ? parseFloat(humoMatch[1]) : null;
    const luz = luzMatch ? parseFloat(luzMatch[1]) : null;

    //console.log(' temp:' + temperatura);
    //console.log('humedad' + humedad);

    timestamp = new Date().toISOString();
    timestampDist = new Date().toISOString();
    timestampHumo = new Date().toISOString();
    timestampLuz = new Date().toISOString();

    console.log(timestamp);
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
          console.log('Documento insertado con éxito:', response.data);
        })
        .catch(error => {
          console.error('Error al insertar el documento:', error.message);
        });
    

    console.log(timestampDist);
    const nuevoDocumentoDist =
    {
        "Distancia" : distancia, 
        "@timestamp" : timestampDist
    };

    axios.post(`${elasticsearchUrl}/${indexDist}/_doc`, nuevoDocumentoDist, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log('Documento insertado con éxito:', response.data);
        })
        .catch(error => {
          console.error('Error al insertar el documento:', error.message);
        });
    

    console.log(timestampHumo);
    const nuevoDocumentoHumo =
    {
        "Humo" : humo, 
        "@timestamp" : timestampHumo
    };

    axios.post(`${elasticsearchUrl}/${indexHumo}/_doc`, nuevoDocumentoHumo, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log('Documento insertado con éxito:', response.data);
        })
        .catch(error => {
          console.error('Error al insertar el documento:', error.message);
        });
    

      console.log(timestampLuz);
      const nuevoDocumentoLuz =
      {
          "Luz" : luz, 
          "@timestamp" : timestampLuz
      };
  
      axios.post(`${elasticsearchUrl}/${indexLuz}/_doc`, nuevoDocumentoLuz, {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            console.log('Documento insertado con éxito:', response.data);
          })
          .catch(error => {
            console.error('Error al insertar el documento:', error.message);
          });
        }

        if(topic==='Tema/TempAgua'){

          index = 'termo_agua';
          const mensaje = message.toString();
          console.log("mensaje 142"+ mensaje);
          const temperaturaAguaMatch = mensaje.match(/TemperaturaAgua:\s*(-?\d+(\.\d+)?)/);
          const temperatura = temperaturaAguaMatch ? parseFloat(temperaturaAguaMatch[1]) : null;
          console.log(' temperatura agua :' + temperatura);
          timestamp = new Date().toISOString();
          console.log(timestamp);
          const nuevoDocumento1 = 
          {
            "Temperatura":temperatura,
            "@timestamp" : timestamp 
          };
    
       
        
    
        axios.post(`${elasticsearchUrl}/${index}/_doc`, nuevoDocumento1, {
            headers: {
              'Authorization': `Basic ${credentials}`,
              'Content-Type': 'application/json'
            }
            }).then(response => {
              console.log('Documento insertado con éxito:');
            }) .catch(error => {
              console.error('Error al insertar el documento:', error.message);
            });
        
    
    
    
        }



      })
