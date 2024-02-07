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
    sub.subscribe('Tema/Distancia')
    sub.subscribe('Tema/Luz')
})

sub.on('message', (topic, message) => {
  index = '';

  if(topic ==='Tema/Datos'){;
    const temperaturaMatch = mensaje.match(/Temperatura: ([\d.]+) °C/);
    const humedadMatch = mensaje.match(/Humedad: ([\d.]+) %/);
    const mensaje = message.toString()
    
    // Verificar si se encontraron coincidencias y extraer los valores
    const temperatura = temperaturaMatch ? parseFloat(temperaturaMatch[1]) : null;
    const humedad = humedadMatch ? parseFloat(humedadMatch[1]) : null;
    
    //console.log(' temp:' + temperatura);
    //console.log('humedad' + humedad);

    timestamp = new Date().toISOString();
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

  if(topic==='Tema/Distancia'){
    index = 'distancia';
    const mensaje = message.toString();
    console.log("mensaje 142"+ mensaje);
    const distanciaMatch = mensaje.match(/Distancia: ([\d.]+) cm/); 
    const distancia = distanciaMatch ? parseFloat(distanciaMatch[1]) : null;
    console.log(' distancia :' + distancia);
    var timestampDist = new Date().toISOString();
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
  }

  if(topic==='Tema/Luz'){
    index = 'luz';
    const mensaje = message.toString();
    console.log("mensaje 142"+ mensaje);
    const luzMatch = mensaje.match(/Luz: ([\d.]+) luz/); 
    const luz = luzMatch ? parseFloat(luzMatch[1]) : null;
    console.log(' luz :' + luz);
    var timestampLuz = new Date().toISOString();
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

  if(topic==='Tema/Humo'){
    index = 'humo';
    const mensaje = message.toString();
    console.log("mensaje 142"+ mensaje);
    const humoMatch = mensaje.match(/Humo: ([\d.]+) humo/);   
    const humo = humoMatch ? parseFloat(humoMatch[1]) : null;
    console.log(' luz :' + luz);
    var timestampHumo = new Date().toISOString();
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
  }
})
