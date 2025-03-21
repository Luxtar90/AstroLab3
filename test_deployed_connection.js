// test_deployed_connection.js
// Script para probar específicamente la conexión con la URL desplegada

const fetch = require('node-fetch');
const AbortController = require('abort-controller');

// URL desplegada para pruebas
const DEPLOYED_URL = 'https://astroback-jfj5.onrender.com';
const TIMEOUT = 30000; // 30 segundos

/**
 * Realiza una prueba de conexión básica
 */
async function testBasicConnection() {
  console.log(`\n=== Probando conexión básica a ${DEPLOYED_URL} ===`);
  
  try {
    console.log(`Enviando GET a ${DEPLOYED_URL}/status...`);
    
    // Crear un controlador de aborto para el timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
    
    const startTime = Date.now();
    const response = await fetch(`${DEPLOYED_URL}/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    const endTime = Date.now();
    
    // Limpiar el timeout
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Conexión exitosa - Status: ${response.status}`);
      console.log(`⏱️ Tiempo de respuesta: ${endTime - startTime}ms`);
      console.log('Respuesta:', data);
      return true;
    } else {
      console.log(`❌ Error en respuesta - Status: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`⏱️ Timeout alcanzado después de ${TIMEOUT}ms`);
    } else {
      console.log(`❌ Error de conexión: ${error.message}`);
    }
    return false;
  }
}

/**
 * Prueba el endpoint de chat
 */
async function testChatEndpoint() {
  console.log(`\n=== Probando endpoint de chat en ${DEPLOYED_URL} ===`);
  
  try {
    const sessionId = `test_session_${Date.now()}`;
    const message = "Hola, esto es una prueba";
    
    console.log(`Enviando POST a ${DEPLOYED_URL}/chat...`);
    console.log(`Mensaje: "${message}", SessionId: ${sessionId}`);
    
    // Crear un controlador de aborto para el timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
    
    const startTime = Date.now();
    const response = await fetch(`${DEPLOYED_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        sessionId: sessionId
      }),
      signal: controller.signal
    });
    const endTime = Date.now();
    
    // Limpiar el timeout
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Respuesta exitosa - Status: ${response.status}`);
      console.log(`⏱️ Tiempo de respuesta: ${endTime - startTime}ms`);
      
      // Mostrar la respuesta del chat (limitada a 150 caracteres)
      const responseText = data.message || data.response || '';
      console.log(`Respuesta: "${responseText.substring(0, 150)}${responseText.length > 150 ? '...' : ''}"`);
      console.log(`Longitud de la respuesta: ${responseText.length} caracteres`);
      
      return true;
    } else {
      console.log(`❌ Error en respuesta - Status: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`⏱️ Timeout alcanzado después de ${TIMEOUT}ms`);
    } else {
      console.log(`❌ Error de conexión: ${error.message}`);
    }
    return false;
  }
}

/**
 * Prueba el endpoint de bienvenida
 */
async function testWelcomeEndpoint() {
  console.log(`\n=== Probando endpoint de bienvenida en ${DEPLOYED_URL} ===`);
  
  try {
    console.log(`Enviando GET a ${DEPLOYED_URL}/welcome...`);
    
    // Crear un controlador de aborto para el timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
    
    const startTime = Date.now();
    const response = await fetch(`${DEPLOYED_URL}/welcome`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    const endTime = Date.now();
    
    // Limpiar el timeout
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Respuesta exitosa - Status: ${response.status}`);
      console.log(`⏱️ Tiempo de respuesta: ${endTime - startTime}ms`);
      
      // Mostrar el mensaje de bienvenida (limitado a 150 caracteres)
      const welcomeText = data.message || data.welcome_message || '';
      console.log(`Mensaje: "${welcomeText.substring(0, 150)}${welcomeText.length > 150 ? '...' : ''}"`);
      console.log(`Longitud del mensaje: ${welcomeText.length} caracteres`);
      
      return true;
    } else {
      console.log(`❌ Error en respuesta - Status: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`⏱️ Timeout alcanzado después de ${TIMEOUT}ms`);
    } else {
      console.log(`❌ Error de conexión: ${error.message}`);
    }
    return false;
  }
}

/**
 * Función principal que ejecuta todas las pruebas
 */
async function runAllTests() {
  console.log('=== INICIANDO PRUEBAS DE CONEXIÓN CON URL DESPLEGADA ===');
  console.log(`URL: ${DEPLOYED_URL}`);
  console.log(`Timeout: ${TIMEOUT}ms`);
  console.log('Fecha y hora: ' + new Date().toLocaleString());
  
  // Ejecutar pruebas
  const basicConnectionResult = await testBasicConnection();
  const chatEndpointResult = await testChatEndpoint();
  const welcomeEndpointResult = await testWelcomeEndpoint();
  
  // Mostrar resumen
  console.log('\n=== RESUMEN DE PRUEBAS ===');
  console.log(`Conexión básica: ${basicConnectionResult ? '✅ ÉXITO' : '❌ FALLO'}`);
  console.log(`Endpoint de chat: ${chatEndpointResult ? '✅ ÉXITO' : '❌ FALLO'}`);
  console.log(`Endpoint de bienvenida: ${welcomeEndpointResult ? '✅ ÉXITO' : '❌ FALLO'}`);
  
  const overallResult = basicConnectionResult && chatEndpointResult && welcomeEndpointResult;
  console.log(`\nRESULTADO GENERAL: ${overallResult ? '✅ TODOS LOS TESTS PASARON' : '❌ ALGUNOS TESTS FALLARON'}`);
}

// Ejecutar todas las pruebas
runAllTests().catch(error => {
  console.error('Error general en las pruebas:', error);
});
