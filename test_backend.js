// Script para probar la conexión con el backend de AstroBot
// Ejecutar con: node test_backend.js

// Usamos la IP de la máquina en la red local en lugar de localhost/127.0.0.1
// para permitir conexiones desde dispositivos móviles
const API_BASE_URL = 'http://172.18.112.1:5000';

/**
 * Implementación manual de timeout para fetch
 * @param {Promise} fetchPromise - Promesa de fetch
 * @param {number} timeoutMs - Tiempo de espera en milisegundos
 * @returns {Promise} - Promesa con timeout
 */
const fetchWithTimeout = async (fetchPromise, timeoutMs) => {
  let timeoutId;
  
  // Crear una promesa que se rechaza después de timeoutMs
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`La solicitud excedió el tiempo de espera (${timeoutMs}ms)`));
    }, timeoutMs);
  });
  
  try {
    // Usar Promise.race para competir entre fetch y timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Prueba la conexión con el backend
 */
async function testBackendConnection() {
  console.log('Probando conexión con el backend...');
  console.log(`URL: ${API_BASE_URL}/chat`);
  
  try {
    const startTime = Date.now();
    
    const fetchPromise = fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: "ping" }),
    });
    
    const response = await fetchWithTimeout(fetchPromise, 5000);
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexión exitosa');
      console.log(`Tiempo de respuesta: ${responseTime}ms`);
      console.log('Respuesta del servidor:', data);
      return true;
    } else {
      console.error(`❌ Error de conexión: ${response.status} ${response.statusText}`);
      try {
        const errorData = await response.json();
        console.error('Detalles del error:', errorData);
      } catch (e) {
        console.error('No se pudieron obtener detalles del error');
      }
      return false;
    }
  } catch (error) {
    console.error(`❌ Error al conectar con el backend: ${error.message}`);
    return false;
  }
}

/**
 * Prueba el envío de un mensaje al backend
 */
async function testSendMessage() {
  console.log('\nProbando envío de mensaje...');
  
  const testMessage = "Hola, esto es una prueba desde test_backend.js";
  console.log(`Mensaje: "${testMessage}"`);
  
  try {
    const fetchPromise = fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: testMessage }),
    });
    
    const response = await fetchWithTimeout(fetchPromise, 10000);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Mensaje enviado correctamente');
      console.log('Respuesta:', data.response);
      return true;
    } else {
      console.error(`❌ Error al enviar mensaje: ${response.status} ${response.statusText}`);
      try {
        const errorData = await response.json();
        console.error('Detalles del error:', errorData);
      } catch (e) {
        console.error('No se pudieron obtener detalles del error');
      }
      return false;
    }
  } catch (error) {
    console.error(`❌ Error al enviar mensaje: ${error.message}`);
    return false;
  }
}

/**
 * Función principal para ejecutar todas las pruebas
 */
async function runTests() {
  console.log('=== PRUEBAS DE CONEXIÓN CON BACKEND ===');
  console.log('Fecha y hora:', new Date().toLocaleString());
  console.log('-----------------------------------');
  
  const connectionSuccess = await testBackendConnection();
  
  if (connectionSuccess) {
    await testSendMessage();
  }
  
  console.log('\n=== FIN DE PRUEBAS ===');
}

// Ejecutar las pruebas
runTests().catch(error => {
  console.error('Error al ejecutar las pruebas:', error);
});
