// test_astrobot_service.js
// Script para probar directamente las funciones de AstroBotService

// Importar las funciones necesarias
const { 
  checkBackendConnection, 
  getConnectionStatus, 
  setApiBaseUrl,
  getApiBaseUrl
} = require('./src/services/AstroBotService');

// Función principal de prueba
async function testAstroBotService() {
  console.log('=== Prueba de AstroBotService ===');
  
  try {
    // 1. Obtener la URL base actual
    const currentUrl = await getApiBaseUrl();
    console.log(`URL base actual: ${currentUrl || 'No definida'}`);
    
    // 2. Probar conexión con la URL actual
    console.log('\nProbando conexión con la URL actual...');
    const connectionResult = await checkBackendConnection();
    console.log('Resultado de la conexión:', connectionResult);
    
    // 3. Probar conexión con la IP del servidor según los logs
    console.log('\nProbando conexión con la IP del servidor según los logs...');
    const testUrl = 'http://192.168.100.129:5000';
    const setUrlResult = await setApiBaseUrl(testUrl, true);
    console.log('Resultado de establecer URL:', setUrlResult);
    
    // 4. Obtener estado de conexión
    console.log('\nEstado de conexión actual:');
    const status = getConnectionStatus();
    console.log(status);
    
    console.log('\n=== Prueba completada ===');
  } catch (error) {
    console.error('Error durante la prueba:', error);
  }
}

// Ejecutar la prueba
testAstroBotService();
