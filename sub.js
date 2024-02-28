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
    sub.subscribe('Tema/LED')
})

sub.on('message', (topic, message) => {


  
  if(topic ==='Tema/Datos'){;
    index = 'termometro';
    const mensaje = message.toString()
    console.log("mensaje 142"+ mensaje);
    const temperaturaMatch = mensaje.match(/Temperatura: ([\d.]+) °C/);
    const humedadMatch = mensaje.match(/Humedad: ([\d.]+) %/);
    const temperatura = temperaturaMatch ? parseFloat(temperaturaMatch[1]) : null;
    const humedad = humedadMatch ? parseFloat(humedadMatch[1]) : null;
    console.log(' temperatura  :' + temperatura);
    console.log(' humedad :' + humedad);
    var timestamp = new Date().toISOString();
    console.log(timestamp);
    let valorTemperatura;
    let valorHumedad;
    if (temperatura < -10){
      valorTemperatura = "EXTREMADAMENTE FRÍO";
    } 
    if (temperatura  >= -10 && temperatura <= 5){
      valorTemperatura = "MUY FRÍO";
    } 
    if (temperatura > 5 && temperatura <= 15){
      valorTemperatura = "FRÍO";
    } 
    if (temperatura > 15 && temperatura <= 25){
      valorTemperatura = "TEMPLADO";
    } 
    if (temperatura > 25 && temperatura <= 35){
      valorTemperatura = "CÁLIDO";
    } 
    if (temperatura > 35 && temperatura <= 45){
      valorTemperatura = "CALUROSO";
    } 
    if (temperatura > 45){
      valorTemperatura = "EXTREMADAMENTE CALUROSO";
    } 



    if (humedad < 10){
      valorHumedad = "EXTREMADAMENTE SECO";
    } 
    if (humedad  >= 10 && humedad <= 20){
      valorHumedad = "MUY SECO";
    } 
    if (humedad > 20 && humedad <= 30){
      valorHumedad = "SECO";
    } 
    if (humedad > 30 && humedad <= 50){
      valorHumedad = "MODERADAMENTE HUMEDO";
    } 
    if (humedad > 50 && humedad <= 60){
      valorHumedad = "HÚMEDO";
    } 
    if (humedad > 60 && humedad <= 70){
      valorHumedad = "MUY HÚMEDO";
    } 
    if (humedad > 70){
      valorHumedad = "EXTREMADAMENTE HÚMEDO";
    } 

    const nuevoDocumento =
    {
        "Temperatura":temperatura,
        'ValorTemperatura' : valorTemperatura,
        "Humedad" : humedad,
        'ValorHumedad' : valorHumedad,
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
    indexTempAgua = 'termo_agua';
    const mensaje = message.toString();
    console.log("mensaje 142"+ mensaje);
    const temperaturaAguaMatch = mensaje.match(/TemperaturaAgua:\s*(-?\d+(\.\d+)?)/);
    const temperatura = temperaturaAguaMatch ? parseFloat(temperaturaAguaMatch[1]) : null;
    console.log(' temperatura agua :' + temperatura);
    timestamp = new Date().toISOString();
    console.log(timestamp);
    let valorTemperatura;

    if (temperatura < -10){
      valorTemperatura = "EXTREMADAMENTE FRÍO";
    } 
    if (temperatura  >= -10 && temperatura <= 5){
      valorTemperatura = "MUY FRÍO";
    } 
    if (temperatura > 5 && temperatura <= 15){
      valorTemperatura = "FRÍO";
    } 
    if (temperatura > 15 && temperatura <= 25){
      valorTemperatura = "TEMPLADO";
    } 
    if (temperatura > 25 && temperatura <= 35){
      valorTemperatura = "CÁLIDO";
    } 
    if (temperatura > 35 && temperatura <= 45){
      valorTemperatura = "CALIENTE";
    } 
    if (temperatura > 98){
      valorTemperatura = "HIRBIENDO";
    } 


    const nuevoDocumento1 = 
    {
      "ValorTemperatura":valorTemperatura,
      "Temperatura":temperatura,
      "@timestamp" : timestamp 
    };
  
    axios.post(`${elasticsearchUrl}/${indexTempAgua}/_doc`, nuevoDocumento1, {
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
    indexDist = 'distancia';
    const mensaje = message.toString();
    console.log("mensaje 142"+ mensaje);
    const distanciaMatch = mensaje.match(/Distancia: ([\d.]+) cm/); 
    const distancia = distanciaMatch ? parseFloat(distanciaMatch[1]) : null;
    console.log(' distancia :' + distancia);
    var timestampDist = new Date().toISOString();
    console.log(timestampDist);
    let valorDistancia;
    if (distancia <= 10){
      valorDistancia = "MUY CERCA";
    } 
    else if (distancia  > 10 && distancia <= 50){
      valorDistancia = "CERCA";
    } 
    if (distancia > 50 && distancia < 100){
      valorDistancia = "LEJOS";
    } 
    if (distancia >= 100){
      valorDistancia = "MUY LEJOS";
    } 
    const nuevoDocumentoDist =
    {
        "Distancia" : distancia, 
        'ValorDistancia' : valorDistancia,
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
    indexLuz = 'luz';
    const mensaje = message.toString();
    console.log("mensaje 142"+ mensaje);
    const luzMatch = mensaje.match(/Luz: ([\d.]+) luz/); 
    const luz = luzMatch ? parseFloat(luzMatch[1]) : null;
    console.log(' luz :' + luz);
    var timestampLuz = new Date().toISOString();
    console.log(timestampLuz);
    let valorLuz;
    if (luz == 0){
      valorLuz = "OSCURO"; 
    }
    if (luz == 1){
      valorLuz = "TENUE"; 
    }
    if (luz == 2){
      valorLuz = "CLARO"; 
    }
    if (luz == 3){
      valorLuz = "BRILLANTE"; 
    }
    if (luz == 4){
      valorLuz = "MUY BRILLANTE"; 
    }
    const nuevoDocumentoLuz =
    {
        "Luz" : luz, 
        'ValorLuz' : valorLuz,
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
    indexHumo = 'humo';
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

  if(topic==='Tema/LED'){
    indexLED = 'led';
    const mensaje = message.toString();
    console.log("mensaje 142"+ mensaje);
    const ledMatch = mensaje.match(/LED: ([\d.]+)/); 
    const led = ledMatch ? parseFloat(ledMatch[1]) : null;
    console.log(' led :' + led);
    var timestampLED = new Date().toISOString();
    console.log(timestampLED);
    const nuevoDocumentoLED =
    {
        "LED" : led, 
        "@timestamp" : timestampLED
    };

    axios.post(`${elasticsearchUrl}/${indexLED}/_doc`, nuevoDocumentoLED, {
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
