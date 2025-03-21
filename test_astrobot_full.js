// test_astrobot_full.js
// Script para probar todas las funcionalidades de AstroBot

const { 
  checkBackendConnection, 
  getConnectionStatus, 
  getWelcomeMessage,
  sendMessage,
  startAstroBotSession,
  getSuggestionsMessage
} = require('./src/services/AstroBotService');

// URLs para pruebas
const LOCAL_URL = 'http://192.168.100.129:5000';
const DEPLOYED_URL = 'https://astroback-jfj5.onrender.com';

// Función para probar una URL específica
async function testUrl(url, description) {
  console.log(`\n=== Probando ${description}: ${url} ===`);
  
  try {
    // Probar conexión básica
    console.log(`\nProbando conexión a ${url}/status...`);
    const response = await fetch(`${url}/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Conexión exitosa - Status: ${response.status}`);
      console.log('Respuesta:', data);
      return true;
    } else {
      console.log(`❌ Error en respuesta - Status: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
    return false;
  }
}

// Función principal de prueba
async function testAstroBotFull() {
  console.log('=== Prueba completa de AstroBot ===');
  
  try {
    // 1. Probar URLs individuales
    const localAvailable = await testUrl(LOCAL_URL, 'URL local');
    const deployedAvailable = await testUrl(DEPLOYED_URL, 'URL desplegada');
    
    if (!localAvailable && !deployedAvailable) {
      console.log('\n⚠️ ADVERTENCIA: Ninguna URL está disponible. Las siguientes pruebas pueden fallar.');
    } else {
      console.log('\n✅ Al menos una URL está disponible. Continuando con las pruebas...');
    }
    
    // 2. Verificar conexión con el backend (usando lógica automática de selección de URL)
    console.log('\n2. Verificando conexión con el backend...');
    const connectionResult = await checkBackendConnection();
    console.log('Resultado de la conexión:', connectionResult);
    
    // 3. Obtener estado de conexión
    console.log('\n3. Estado de conexión actual:');
    const status = getConnectionStatus();
    console.log(status);
    
    // 4. Iniciar sesión
    console.log('\n4. Iniciando sesión...');
    const sessionData = await startAstroBotSession();
    console.log('Datos de sesión:', sessionData);
    
    // 5. Obtener mensaje de bienvenida
    console.log('\n5. Obteniendo mensaje de bienvenida...');
    const welcomeMessage = await getWelcomeMessage();
    console.log('Mensaje de bienvenida:', welcomeMessage);
    
    // 6. Obtener sugerencias
    console.log('\n6. Obteniendo sugerencias...');
    const suggestionsMessage = getSuggestionsMessage();
    console.log('Sugerencias:', suggestionsMessage);
    
    // 7. Enviar mensaje al bot
    console.log('\n7. Enviando mensaje al bot...');
    const response = await sendMessage('Hola, ¿cómo estás?', sessionData.sessionId);
    console.log('Respuesta del bot:', response);
    
    // 8. Enviar mensaje con consulta química
    console.log('\n8. Enviando consulta química...');
    const chemResponse = await sendMessage('¿Cuál es la masa molar del agua?', sessionData.sessionId);
    console.log('Respuesta a consulta química:', chemResponse);
    
    console.log('\n=== Prueba completada ===');
  } catch (error) {
    console.error('Error durante la prueba:', error);
  }
}

// Ejecutar la prueba
testAstroBotFull();
