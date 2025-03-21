// test_flask_connection.js
// Script para probar específicamente la conexión con el servidor Flask

const fetch = require('node-fetch');

// Configuración
const SERVER_IP = '192.168.100.129';
const SERVER_PORT = 5000;
const BASE_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

// Función para probar los endpoints del servidor Flask
async function testFlaskEndpoints() {
  console.log('=== Prueba de conexión con el servidor Flask ===');
  console.log(`URL base: ${BASE_URL}`);
  
  // Lista de endpoints a probar
  const endpoints = [
    { url: '/status', method: 'GET', description: 'Estado del servidor' },
    { url: '/welcome', method: 'GET', description: 'Mensaje de bienvenida' },
    { url: '/models', method: 'GET', description: 'Lista de modelos disponibles' },
    { url: '/healthcheck', method: 'GET', description: 'Verificación de salud del servidor' },
    { 
      url: '/chat', 
      method: 'POST', 
      description: 'Envío de mensaje', 
      body: JSON.stringify({ message: 'Hola, ¿cómo estás?' })
    }
  ];
  
  // Probar cada endpoint
  for (const endpoint of endpoints) {
    console.log(`\nProbando endpoint: ${endpoint.description} (${endpoint.method} ${endpoint.url})`);
    
    try {
      const options = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 5000
      };
      
      // Agregar body si es necesario
      if (endpoint.body) {
        options.body = endpoint.body;
      }
      
      const response = await fetch(`${BASE_URL}${endpoint.url}`, options);
      
      console.log(`✅ Conexión exitosa - Status: ${response.status} ${response.statusText}`);
      
      // Obtener y mostrar la respuesta
      const data = await response.json();
      console.log('Respuesta:');
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n=== Prueba completada ===');
}

// Ejecutar pruebas
testFlaskEndpoints();
