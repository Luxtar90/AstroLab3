// AstroBotService.js
// Servicio para manejar la comunicación con el backend de AstroBot

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// URL base para el backend de AstroBot
// Configuración dinámica para diferentes entornos
let API_BASE_URL;

// URL para producción - CAMBIAR ESTA URL POR LA DE TU SERVIDOR REAL EN PRODUCCIÓN
const PRODUCTION_API_URL = 'https://astroback-jfj5.onrender.com';

// Puerto del servidor Flask
const SERVER_PORT = '5000';

// Estado de la conexión con el backend
let connectionStatus = {
  isConnected: false,
  lastChecked: null,
  lastResponseTime: null,
  error: null,
  consecutiveFailures: 0,
  serverVersion: null,
  serverStatus: null
};

// Modo de simulación (cuando no hay conexión con el backend)
let simulationMode = true;

// Límite máximo para respuestas simuladas
const MAX_RESPONSE_LENGTH = 2000;

// Niveles de log
const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

// Constantes para URLs
const LOCAL_IP = '192.168.100.129';
const LOCAL_PORT = 5000;
const DEPLOYED_URL = 'https://astroback-jfj5.onrender.com'; // URL proporcionada por el usuario
const LOCAL_TIMEOUT = 5000;    // 5 segundos para conexiones locales
const DEPLOYED_TIMEOUT = 30000; // 30 segundos para el servidor desplegado
const FAILURES_BEFORE_SIMULATION = 3;

/**
 * Función para detectar si estamos en un emulador
 * @returns {Promise<boolean>} - true si estamos en un emulador, false en caso contrario
 */
const isEmulator = async () => {
  // Para Android, podemos detectar emuladores comunes por la dirección IP
  if (Platform.OS === 'android') {
    try {
      // Intentar cargar una preferencia guardada
      const savedIsEmulator = await AsyncStorage.getItem('IS_EMULATOR');
      if (savedIsEmulator !== null) {
        return savedIsEmulator === 'true';
      }
      
      // Si no hay preferencia guardada, hacer una detección automática
      const netInfo = await NetInfo.fetch();
      
      // Verificar si estamos en un emulador basado en la dirección IP
      if (netInfo.details && netInfo.details.ipAddress) {
        const ip = netInfo.details.ipAddress;
        // IPs típicas de emuladores Android
        return ip.startsWith('10.0.2.') || // AVD
               ip.startsWith('10.0.3.') || // Genymotion
               (ip === '127.0.0.1'); // Localhost
      }
      
      return __DEV__; // En desarrollo, asumimos que es emulador
    } catch (error) {
      log(LOG_LEVELS.ERROR, 'Error al detectar emulador:', error);
      return __DEV__; // En caso de error, asumir emulador en desarrollo
    }
  }
  
  // Para iOS, es más difícil detectar automáticamente
  if (Platform.OS === 'ios') {
    try {
      const netInfo = await NetInfo.fetch();
      
      // En iOS, si estamos en un simulador, la IP suele ser 127.0.0.1
      if (netInfo.details && netInfo.details.ipAddress) {
        return netInfo.details.ipAddress === '127.0.0.1';
      }
      
      return __DEV__; // En desarrollo, asumimos que es simulador
    } catch (error) {
      log(LOG_LEVELS.ERROR, 'Error al detectar simulador iOS:', error);
      return __DEV__; // En caso de error, asumir simulador en desarrollo
    }
  }
  
  return false; // Para otras plataformas, asumir que no es emulador
};

/**
 * Función para obtener la dirección IP del servidor basada en el entorno
 * @returns {Promise<string>} - Dirección IP del servidor
 */
const getServerIP = async () => {
  try {
    // Primero verificar si estamos en un emulador
    const emulator = await isEmulator();
    
    if (emulator) {
      // En emuladores, usamos direcciones IP específicas
      if (Platform.OS === 'android') {
        // En Android, el host de la máquina puede variar según el emulador
        // Intentar con varias opciones comunes
        return '10.0.2.2'; // AVD estándar
      } else if (Platform.OS === 'ios') {
        // En iOS, el host de la máquina es localhost
        return 'localhost';
      }
    } else {
      // En dispositivos físicos, intentamos obtener la IP del gateway
      const netInfo = await NetInfo.fetch();
      
      if (netInfo.details && netInfo.details.ipAddress) {
        // Obtener los primeros 3 octetos de la IP y agregar .1 (gateway típico)
        const ipParts = netInfo.details.ipAddress.split('.');
        if (ipParts.length === 4) {
          return `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.1`;
        }
      }
    }
    
    // Si no podemos determinar la IP, usar una dirección de fallback
    return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  } catch (error) {
    log(LOG_LEVELS.ERROR, 'Error al obtener IP del servidor:', error);
    return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  }
};

/**
 * Obtiene la URL base adecuada según el entorno
 * @returns {Promise<string>} - URL base para el API
 */
const getAppropriateBaseUrl = async () => {
  try {
    log(LOG_LEVELS.INFO, 'Determinando URL base apropiada para API');
    
    // Intentar primero con la URL desplegada
    try {
      log(LOG_LEVELS.INFO, `Probando URL desplegada: ${DEPLOYED_URL}`);
      const deployedResponse = await fetch(`${DEPLOYED_URL}/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: DEPLOYED_TIMEOUT
      });
      
      if (deployedResponse.ok) {
        log(LOG_LEVELS.INFO, `Conexión exitosa a URL desplegada: ${DEPLOYED_URL}`);
        return DEPLOYED_URL;
      }
    } catch (deployedError) {
      log(LOG_LEVELS.WARN, `No se pudo conectar a URL desplegada: ${deployedError.message}`);
    }
    
    // Intentar con la IP del servidor de Flask (de los logs)
    try {
      const flaskServerUrl = `http://${LOCAL_IP}:${LOCAL_PORT}`;
      log(LOG_LEVELS.INFO, `Probando IP del servidor Flask: ${flaskServerUrl}`);
      
      const flaskResponse = await fetch(`${flaskServerUrl}/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: LOCAL_TIMEOUT
      });
      
      if (flaskResponse.ok) {
        log(LOG_LEVELS.INFO, `Conexión exitosa a IP del servidor Flask: ${flaskServerUrl}`);
        return flaskServerUrl;
      }
    } catch (flaskError) {
      log(LOG_LEVELS.WARN, `No se pudo conectar a IP del servidor Flask: ${flaskError.message}`);
    }
    
    // Si no se pudo conectar a ninguna URL específica, intentar determinar la IP del servidor
    const serverIP = await getServerIP();
    const baseUrl = `http://${serverIP}:${LOCAL_PORT}`;
    log(LOG_LEVELS.INFO, `Usando URL base determinada automáticamente: ${baseUrl}`);
    
    return baseUrl;
  } catch (error) {
    log(LOG_LEVELS.ERROR, `Error al determinar URL base: ${error.message}`);
    throw error;
  }
};

// Inicializar la URL base
const initializeApiBaseUrl = async () => {
  try {
    log(LOG_LEVELS.INFO, 'Inicializando URL base para AstroBot');
    
    // Primero intentamos cargar una URL guardada
    const savedUrl = await AsyncStorage.getItem('API_BASE_URL');
    
    if (savedUrl) {
      API_BASE_URL = savedUrl;
      log(LOG_LEVELS.INFO, `URL base cargada desde almacenamiento: ${API_BASE_URL}`);
      
      // Verificar si la URL guardada es accesible
      try {
        const isEmulatorDevice = await isEmulator();
        
        // Si estamos en un emulador pero la URL guardada no es de emulador,
        // o viceversa, podríamos necesitar una URL diferente
        if (isEmulatorDevice && !savedUrl.includes('localhost') && 
            !savedUrl.includes('10.0.2.2') && !savedUrl.includes('10.0.3.2') && 
            !savedUrl.includes('127.0.0.1')) {
          log(LOG_LEVELS.WARN, 'La URL guardada no parece ser compatible con el emulador actual');
          // No retornamos, seguimos para detectar una URL apropiada
        } else {
          // La URL parece ser compatible con el entorno actual
          console.log('AstroBot API URL:', API_BASE_URL);
          return;
        }
      } catch (error) {
        log(LOG_LEVELS.WARN, `Error al verificar compatibilidad de URL guardada: ${error.message}`);
        // Continuamos para detectar una URL apropiada
      }
    }
    
    // Si no hay URL guardada o no es compatible, detectar automáticamente
    API_BASE_URL = await getAppropriateBaseUrl();
    log(LOG_LEVELS.INFO, `URL base detectada automáticamente: ${API_BASE_URL}`);
    console.log('AstroBot API URL:', API_BASE_URL);
    
    // Guardar la URL detectada para futuras sesiones
    await AsyncStorage.setItem('API_BASE_URL', API_BASE_URL);
  } catch (error) {
    log(LOG_LEVELS.ERROR, `Error al inicializar API_BASE_URL: ${error.message}`, { error });
    
    // Fallback en caso de error
    if (Platform.OS === 'android') {
      API_BASE_URL = `http://10.0.2.2:${SERVER_PORT}`;
    } else if (Platform.OS === 'ios') {
      API_BASE_URL = `http://localhost:${SERVER_PORT}`;
    } else {
      API_BASE_URL = 'http://localhost:5000';
    }
    log(LOG_LEVELS.INFO, `URL base establecida por fallback: ${API_BASE_URL}`);
  }
};

/**
 * Verifica la conexión con el backend de AstroBot
 * 
 * Este método realiza las siguientes operaciones:
 * 1. Verifica si hay conexión a internet
 * 2. Determina la URL apropiada para el backend según el entorno
 * 3. Intenta conectar con el backend
 * 4. Actualiza el estado de conexión
 * 5. Activa el modo simulación si es necesario
 * 
 * @param {number} timeoutMs - Tiempo de espera en milisegundos para la conexión
 * @returns {Promise<Object>} - Objeto con el estado de la conexión:
 *   - isConnected: Boolean que indica si está conectado
 *   - isSimulationMode: Boolean que indica si está en modo simulación
 *   - responseTime: Tiempo de respuesta en ms (si está conectado)
 *   - serverVersion: Versión del servidor (si está disponible)
 *   - error: Mensaje de error (si hay un error)
 */
export const checkBackendConnection = async (timeoutMs = 10000) => {
  log(LOG_LEVELS.INFO, 'Verificando conexión con el backend...');
  
  // Actualizar estado de conexión a "verificando"
  connectionStatus = { ...connectionStatus, isChecking: true };
  
  // Lista de URLs para probar en orden de prioridad
  const urlsToTry = [
    DEPLOYED_URL,
    `http://${LOCAL_IP}:${LOCAL_PORT}`,
    `http://10.0.2.2:${LOCAL_PORT}`,
    `http://10.0.3.2:${LOCAL_PORT}`,
    `http://localhost:${LOCAL_PORT}`,
    `http://127.0.0.1:${LOCAL_PORT}`
  ];
  
  // Eliminar duplicados
  const uniqueUrls = [...new Set(urlsToTry)];
  
  log(LOG_LEVELS.INFO, `Probando conexión con las siguientes URLs: ${uniqueUrls.join(', ')}`);
  
  // Crear un controlador de aborto para el timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    // Intentar conectar con cada URL hasta que una funcione
    for (const url of uniqueUrls) {
      try {
        log(LOG_LEVELS.INFO, `Intentando conectar a: ${url}/status`);
        
        const response = await fetch(`${url}/status`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        });
        
        // Si la respuesta es exitosa, actualizar la URL base y el estado de conexión
        if (response.ok) {
          const data = await response.json();
          log(LOG_LEVELS.SUCCESS, `Conexión exitosa a ${url}. Respuesta: ${JSON.stringify(data)}`);
          
          // Actualizar URL base global
          API_BASE_URL = url;
          
          // Actualizar estado de conexión
          connectionStatus = {
            isConnected: true,
            isSimulationMode: false,
            isChecking: false,
            url: url,
            serverInfo: data
          };
          
          // Limpiar el timeout y devolver el estado
          clearTimeout(timeoutId);
          return { ...connectionStatus };
        } else {
          log(LOG_LEVELS.WARNING, `Error en respuesta de ${url}: ${response.status} ${response.statusText}`);
        }
      } catch (urlError) {
        log(LOG_LEVELS.WARNING, `No se pudo conectar a ${url}: ${urlError.message}`);
        // Continuar con la siguiente URL
      }
    }
    
    // Si llegamos aquí, no se pudo conectar a ninguna URL
    log(LOG_LEVELS.WARNING, 'No se pudo conectar a ninguna URL. Activando modo simulación.');
    
    // Actualizar contador de fallos consecutivos
    consecutiveFailures++;
    
    // Activar modo simulación después de cierto número de fallos
    if (consecutiveFailures >= FAILURES_BEFORE_SIMULATION) {
      connectionStatus = {
        isConnected: false,
        isSimulationMode: true,
        isChecking: false,
        error: 'No se pudo conectar al backend después de múltiples intentos'
      };
    } else {
      connectionStatus = {
        isConnected: false,
        isSimulationMode: false,
        isChecking: false,
        error: 'No se pudo conectar al backend'
      };
    }
    
    return { ...connectionStatus };
  } catch (error) {
    // Manejar errores generales (incluyendo timeout)
    const errorMessage = error.name === 'AbortError' 
      ? 'Tiempo de espera agotado al conectar con el backend' 
      : `Error al verificar conexión: ${error.message}`;
    
    log(LOG_LEVELS.ERROR, errorMessage);
    
    // Actualizar contador de fallos consecutivos
    consecutiveFailures++;
    
    // Activar modo simulación después de cierto número de fallos
    connectionStatus = {
      isConnected: false,
      isSimulationMode: consecutiveFailures >= FAILURES_BEFORE_SIMULATION,
      isChecking: false,
      error: errorMessage
    };
    
    return { ...connectionStatus };
  } finally {
    // Asegurar que el timeout se limpie
    clearTimeout(timeoutId);
  }
};

/**
 * Envía un mensaje al backend y obtiene la respuesta
 * @param {string} message - Mensaje a enviar
 * @param {string} sessionId - ID de sesión
 * @returns {Promise<Object>} - Respuesta del backend
 */
export const sendMessage = async (message, sessionId) => {
  log(LOG_LEVELS.INFO, `Enviando mensaje al backend: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
  
  try {
    // Verificar si hay conexión con el backend
    if (!connectionStatus.isConnected && !connectionStatus.isSimulationMode) {
      // Intentar reconectar
      await checkBackendConnection();
    }
    
    // Si estamos en modo simulación, generar respuesta simulada
    if (connectionStatus.isSimulationMode) {
      log(LOG_LEVELS.INFO, 'Usando modo simulación para respuesta');
      const simulatedResponse = await simulateResponse(message);
      return {
        text: simulatedResponse,
        model: 'simulación',
        sessionId: sessionId || 'local_session',
        timestamp: new Date().toISOString()
      };
    }
    
    // Determinar la URL base a utilizar
    const baseUrl = API_BASE_URL || await getAppropriateBaseUrl();
    const isDeployed = baseUrl === DEPLOYED_URL;
    const timeout = isDeployed ? DEPLOYED_TIMEOUT : LOCAL_TIMEOUT;
    
    log(LOG_LEVELS.INFO, `Usando ${isDeployed ? 'URL desplegada' : 'URL local'} (${baseUrl}) con timeout de ${timeout}ms`);
    
    // Crear un controlador de aborto para el timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      log(LOG_LEVELS.WARNING, `Timeout alcanzado (${timeout}ms) al enviar mensaje a ${baseUrl}`);
    }, timeout);
    
    try {
      // Preparar los datos para la solicitud
      const requestData = {
        message: message,
        sessionId: sessionId
      };
      
      log(LOG_LEVELS.INFO, `Enviando POST a ${baseUrl}/chat con sessionId: ${sessionId}`);
      
      // Enviar solicitud al backend
      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });
      
      // Limpiar el timeout
      clearTimeout(timeoutId);
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}. ${errorData}`);
      }
      
      // Procesar la respuesta
      const data = await response.json();
      
      // Verificar si la respuesta contiene un mensaje
      if (!data.message && !data.response) {
        throw new Error('Respuesta inválida del servidor: no contiene mensaje');
      }
      
      // Extraer el mensaje (algunos backends usan 'message', otros 'response')
      const responseText = data.message || data.response;
      
      log(LOG_LEVELS.SUCCESS, `Respuesta recibida del backend (${responseText.length} caracteres)`);
      
      return {
        text: responseText,
        model: data.model || 'desconocido',
        sessionId: data.sessionId || sessionId,
        timestamp: new Date().toISOString()
      };
    } catch (fetchError) {
      // Limpiar el timeout si aún está activo
      clearTimeout(timeoutId);
      
      // Si es un error de timeout, intentar con la otra URL
      if (fetchError.name === 'AbortError') {
        const alternativeUrl = baseUrl === DEPLOYED_URL ? `http://${LOCAL_IP}:${LOCAL_PORT}` : DEPLOYED_URL;
        log(LOG_LEVELS.WARNING, `Timeout con ${baseUrl}, intentando con URL alternativa: ${alternativeUrl}`);
        
        try {
          const alternativeResponse = await fetch(`${alternativeUrl}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              message: message,
              sessionId: sessionId
            }),
            timeout: baseUrl === DEPLOYED_URL ? LOCAL_TIMEOUT : DEPLOYED_TIMEOUT
          });
          
          if (alternativeResponse.ok) {
            const alternativeData = await alternativeResponse.json();
            
            // Actualizar URL base para futuras solicitudes
            API_BASE_URL = alternativeUrl;
            
            log(LOG_LEVELS.SUCCESS, `Respuesta recibida de URL alternativa: ${alternativeUrl}`);
            
            // Extraer el mensaje (algunos backends usan 'message', otros 'response')
            const responseText = alternativeData.message || alternativeData.response;
            
            return {
              text: responseText,
              model: alternativeData.model || 'desconocido',
              sessionId: alternativeData.sessionId || sessionId,
              timestamp: new Date().toISOString()
            };
          }
        } catch (alternativeError) {
          log(LOG_LEVELS.ERROR, `Error al intentar con URL alternativa: ${alternativeError.message}`);
          // Continuar con el flujo de error
        }
      }
      
      // Manejar el error original
      throw fetchError;
    }
  } catch (error) {
    log(LOG_LEVELS.ERROR, `Error al enviar mensaje: ${error.message}`);
    
    // Activar modo simulación después de error
    connectionStatus.isSimulationMode = true;
    
    // Generar respuesta de error
    return {
      text: `Lo siento, ha ocurrido un error al procesar tu mensaje: ${error.message}. Estoy funcionando en modo offline con capacidades limitadas.`,
      model: 'simulación',
      sessionId: sessionId || 'error_session',
      timestamp: new Date().toISOString(),
      isError: true
    };
  }
};

/**
 * Obtiene el mensaje de bienvenida del backend
 * @returns {Promise<Object>} - Mensaje de bienvenida
 */
export const getWelcomeMessage = async () => {
  try {
    // Verificar si hay conexión con el backend
    if (!connectionStatus.isConnected && !connectionStatus.isSimulationMode) {
      // Intentar reconectar
      await checkBackendConnection();
    }
    
    // Si estamos en modo simulación, devolver mensaje predeterminado
    if (connectionStatus.isSimulationMode) {
      log(LOG_LEVELS.INFO, 'Usando mensaje de bienvenida predeterminado (modo simulación)');
      return {
        text: '¡Hola! Soy AstroBot, tu asistente especializado en química y cálculos de laboratorio. Actualmente estoy funcionando en modo offline con capacidades limitadas.',
        model: 'simulación',
        isWelcome: true,
        isError: true
      };
    }
    
    // Determinar la URL base a utilizar
    const baseUrl = API_BASE_URL || await getAppropriateBaseUrl();
    const isDeployed = baseUrl === DEPLOYED_URL;
    const timeout = isDeployed ? DEPLOYED_TIMEOUT : LOCAL_TIMEOUT;
    
    log(LOG_LEVELS.INFO, `Obteniendo mensaje de bienvenida desde ${isDeployed ? 'URL desplegada' : 'URL local'} (${baseUrl}) con timeout de ${timeout}ms`);
    
    // Crear un controlador de aborto para el timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      log(LOG_LEVELS.WARNING, `Timeout alcanzado (${timeout}ms) al obtener mensaje de bienvenida de ${baseUrl}`);
    }, timeout);
    
    try {
      // Enviar solicitud al backend
      const response = await fetch(`${baseUrl}/welcome`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      // Limpiar el timeout
      clearTimeout(timeoutId);
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}. ${errorData}`);
      }
      
      // Procesar la respuesta
      const data = await response.json();
      
      // Verificar si la respuesta contiene un mensaje
      if (!data.message && !data.welcome_message) {
        throw new Error('Respuesta inválida del servidor: no contiene mensaje de bienvenida');
      }
      
      // Extraer el mensaje (algunos backends usan 'message', otros 'welcome_message')
      const welcomeText = data.message || data.welcome_message;
      
      log(LOG_LEVELS.SUCCESS, `Mensaje de bienvenida recibido del backend (${welcomeText.length} caracteres)`);
      
      return {
        text: welcomeText,
        model: data.model || 'desconocido',
        isWelcome: true
      };
    } catch (fetchError) {
      // Limpiar el timeout si aún está activo
      clearTimeout(timeoutId);
      
      // Si es un error de timeout, intentar con la otra URL
      if (fetchError.name === 'AbortError') {
        const alternativeUrl = baseUrl === DEPLOYED_URL ? `http://${LOCAL_IP}:${LOCAL_PORT}` : DEPLOYED_URL;
        log(LOG_LEVELS.WARNING, `Timeout con ${baseUrl}, intentando con URL alternativa: ${alternativeUrl}`);
        
        try {
          const alternativeResponse = await fetch(`${alternativeUrl}/welcome`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            timeout: baseUrl === DEPLOYED_URL ? LOCAL_TIMEOUT : DEPLOYED_TIMEOUT
          });
          
          if (alternativeResponse.ok) {
            const alternativeData = await alternativeResponse.json();
            
            // Actualizar URL base para futuras solicitudes
            API_BASE_URL = alternativeUrl;
            
            log(LOG_LEVELS.SUCCESS, `Mensaje de bienvenida recibido de URL alternativa: ${alternativeUrl}`);
            
            // Extraer el mensaje (algunos backends usan 'message', otros 'welcome_message')
            const welcomeText = alternativeData.message || alternativeData.welcome_message;
            
            return {
              text: welcomeText,
              model: alternativeData.model || 'desconocido',
              isWelcome: true
            };
          }
        } catch (alternativeError) {
          log(LOG_LEVELS.ERROR, `Error al intentar con URL alternativa: ${alternativeError.message}`);
          // Continuar con el flujo de error
        }
      }
      
      // Manejar el error original
      throw fetchError;
    }
  } catch (error) {
    log(LOG_LEVELS.ERROR, `Error al obtener mensaje de bienvenida: ${error.message}`);
    
    // Activar modo simulación después de error
    connectionStatus.isSimulationMode = true;
    
    // Devolver mensaje predeterminado
    return {
      text: '¡Hola! Soy AstroBot, tu asistente especializado en química y cálculos de laboratorio. Estoy funcionando en modo offline con capacidades limitadas debido a un problema de conexión.',
      model: 'simulación',
      isWelcome: true,
      isError: true
    };
  }
};

/**
 * Simula una respuesta del backend cuando no hay conexión
 * @param {string} message - Mensaje del usuario
 * @returns {Object} - Respuesta simulada
 */
const simulateResponse = (message) => {
  // Normalizar el mensaje para comparación
  const normalizedMessage = message.toLowerCase().trim();
  
  // Respuestas predefinidas para preguntas comunes
  if (normalizedMessage.includes('hola') || normalizedMessage.includes('saludos') || normalizedMessage.includes('buenos días')) {
    return {
      text: '¡Hola! Soy AstroBot, tu asistente especializado en química y cálculos de laboratorio. Estoy en modo simulación porque no puedo conectarme al servidor. ¿En qué puedo ayudarte?',
      model: 'simulación',
      isError: false
    };
  } else if (normalizedMessage.includes('masa molar') || normalizedMessage.includes('peso molecular')) {
    return {
      text: 'Para calcular la masa molar de un compuesto, necesitas sumar las masas atómicas de todos los átomos en la molécula. Por ejemplo, para H₂O: (2 × 1.008) + 16.00 = 18.016 g/mol. Estoy en modo simulación, así que no puedo hacer cálculos específicos en este momento.',
      model: 'simulación',
      isError: false
    };
  } else if (normalizedMessage.includes('dilución') || normalizedMessage.includes('concentración')) {
    return {
      text: 'Para calcular diluciones, puedes usar la fórmula C₁V₁ = C₂V₂, donde C es concentración y V es volumen. Estoy en modo simulación, así que no puedo hacer cálculos específicos en este momento.',
      model: 'simulación',
      isError: false
    };
  } else if (normalizedMessage.includes('estequiometría') || normalizedMessage.includes('balanceo')) {
    return {
      text: 'La estequiometría se basa en la ley de conservación de la masa. Para balancear ecuaciones, debes asegurarte de que el número de átomos de cada elemento sea igual en ambos lados. Estoy en modo simulación, así que no puedo hacer balanceos específicos en este momento.',
      model: 'simulación',
      isError: false
    };
  } else if (normalizedMessage.includes('pureza') || normalizedMessage.includes('reactivo')) {
    return {
      text: 'La pureza de un reactivo indica el porcentaje del compuesto deseado en la muestra. Para calcular la cantidad real de sustancia, multiplica la masa total por el porcentaje de pureza. Estoy en modo simulación, así que no puedo hacer cálculos específicos en este momento.',
      model: 'simulación',
      isError: false
    };
  } else {
    // Respuesta genérica para otras preguntas
    return {
      text: 'Estoy en modo simulación porque no puedo conectarme al servidor. En modo normal, podría ayudarte con cálculos de masa molar, diluciones, estequiometría, pureza de reactivos y propiedades físico-químicas. Por favor, verifica la conexión con el servidor e intenta nuevamente.',
      model: 'simulación',
      isError: false
    };
  }
};

/**
 * Función para registrar mensajes de log
 * @param {string} level - Nivel de log (INFO, WARN, ERROR, DEBUG)
 * @param {string} message - Mensaje a registrar
 * @param {Object} data - Datos adicionales para el log
 */
const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...data
  };
  
  // Registrar en la consola
  switch (level) {
    case LOG_LEVELS.ERROR:
      console.error(`[${timestamp}] ${level}: ${message}`, data);
      break;
    case LOG_LEVELS.WARN:
      console.warn(`[${timestamp}] ${level}: ${message}`, data);
      break;
    case LOG_LEVELS.INFO:
      console.info(`[${timestamp}] ${level}: ${message}`, data);
      break;
    case LOG_LEVELS.DEBUG:
      console.debug(`[${timestamp}] ${level}: ${message}`, data);
      break;
    default:
      console.log(`[${timestamp}] ${level}: ${message}`, data);
  }
  
  // TODO: Implementar almacenamiento de logs si es necesario
};

/**
 * Obtiene el estado actual de la conexión
 * @returns {Object} - Estado actual de la conexión
 */
export const getConnectionStatus = () => {
  return { ...connectionStatus };
};

/**
 * Obtiene la URL base actual del API
 * @returns {Promise<string>} - URL base actual
 */
export const getApiBaseUrl = async () => {
  if (!API_BASE_URL) {
    await initializeApiBaseUrl();
  }
  return API_BASE_URL;
};

/**
 * Establece una nueva URL base para el API
 * @param {string} url - Nueva URL base
 * @param {boolean} testConnection - Indica si se debe probar la conexión con la nueva URL
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const setApiBaseUrl = async (url, testConnection = true) => {
  try {
    if (!url) {
      return {
        success: false,
        message: 'La URL no puede estar vacía',
        previousUrl: API_BASE_URL
      };
    }
    
    log(LOG_LEVELS.INFO, `Cambiando URL base de ${API_BASE_URL || 'undefined'} a ${url}`);
    
    // Guardar la URL anterior para restaurarla en caso de error
    const previousUrl = API_BASE_URL;
    
    // Establecer la nueva URL
    API_BASE_URL = url;
    
    // Si se debe probar la conexión
    if (testConnection) {
      try {
        // Probar la conexión con la nueva URL
        const connectionResult = await checkBackendConnection();
        
        if (connectionResult.isConnected) {
          // Si la conexión es exitosa, guardar la nueva URL
          await AsyncStorage.setItem('API_BASE_URL', API_BASE_URL);
          
          // Guardar la IP del servidor para futuras sesiones
          const serverIP = url.replace(/^https?:\/\//, '').replace(/:.*$/, '');
          await AsyncStorage.setItem('SERVER_IP', serverIP);
          
          return {
            success: true,
            message: 'URL actualizada y conexión establecida correctamente',
            connectionStatus: connectionResult
          };
        } else {
          // Si la conexión falla, restaurar la URL anterior
          log(LOG_LEVELS.WARN, `Fallo al conectar con ${url}, restaurando URL anterior: ${previousUrl}`);
          API_BASE_URL = previousUrl;
          
          return {
            success: false,
            message: `No se pudo establecer conexión con ${url}: ${connectionResult.error}`,
            connectionStatus: connectionResult,
            previousUrl
          };
        }
      } catch (error) {
        // Si hay un error al probar la conexión, restaurar la URL anterior
        log(LOG_LEVELS.ERROR, `Error al probar conexión con ${url}: ${error.message}`);
        API_BASE_URL = previousUrl;
        
        return {
          success: false,
          message: `Error al probar conexión: ${error.message}`,
          previousUrl
        };
      }
    } else {
      // Si no se debe probar la conexión, guardar la nueva URL directamente
      await AsyncStorage.setItem('API_BASE_URL', API_BASE_URL);
      
      return {
        success: true,
        message: 'URL actualizada sin probar conexión',
        connectionStatus: getConnectionStatus()
      };
    }
  } catch (error) {
    log(LOG_LEVELS.ERROR, `Error al establecer URL base: ${error.message}`);
    
    return {
      success: false,
      message: `Error al establecer URL base: ${error.message}`
    };
  }
};

/**
 * Inicia una nueva sesión de AstroBot
 * @returns {Promise<Object>} - Datos de la sesión
 */
export const startAstroBotSession = async () => {
  try {
    // Generar un ID de sesión único
    const sessionId = `session_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    log(LOG_LEVELS.INFO, `Iniciando nueva sesión de AstroBot: ${sessionId}`);
    
    // Guardar el ID de sesión en AsyncStorage
    await AsyncStorage.setItem('ASTROBOT_SESSION_ID', sessionId);
    
    return {
      sessionId,
      startTime: new Date().toISOString(),
      success: true
    };
  } catch (error) {
    log(LOG_LEVELS.ERROR, `Error al iniciar sesión de AstroBot: ${error.message}`);
    
    // Devolver un ID de sesión local en caso de error
    return {
      sessionId: `local_${Date.now()}`,
      startTime: new Date().toISOString(),
      success: false,
      error: error.message
    };
  }
};

/**
 * Obtiene un mensaje con sugerencias para el usuario
 * @returns {string} - Mensaje con sugerencias
 */
export const getSuggestionsMessage = () => {
  return "Puedo ayudarte con:\n\n" +
    "• Cálculos de masa molar de compuestos\n" +
    "• Diluciones y concentraciones\n" +
    "• Cálculos de pureza de reactivos\n" +
    "• Estequiometría y balanceo de ecuaciones\n" +
    "• Propiedades físico-químicas de elementos\n\n" +
    "¿Con qué puedo ayudarte hoy?";
};

// Inicializar el servicio
(async () => {
  try {
    await initializeApiBaseUrl();
    await checkBackendConnection();
  } catch (error) {
    log(LOG_LEVELS.ERROR, `Error al inicializar AstroBotService: ${error.message}`);
  }
})();

// Exportar funciones y constantes
export {
  simulationMode,
  API_BASE_URL,
  initializeApiBaseUrl
};
