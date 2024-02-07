const axios = require('axios');
const base64 = require('base-64');

// Configura las credenciales
const username = 'elastic';
const password = '3VDywTV3JZdiPbZ0AOMa';
const credentials = base64.encode(`${username}:${password}`);

// Configura la URL de Elasticsearch y el índice donde deseas insertar el documento
const elasticsearchUrl = 'http://34.28.106.98:9200';  // Reemplaza con la URL de tu instancia de Elasticsearch
const index = 'pokemon';  // Reemplaza con el índice donde deseas insertar el documento

// Documento JSON para insertar
const nuevoDocumento = 
    {
        "name":"snorlax",
        "type":"fire"
    }
;

// Realiza una solicitud POST a Elasticsearch para insertar el documento
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
