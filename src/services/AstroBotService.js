// AstroBotService.js
// Servicio para manejar la comunicación con el backend de AstroBot

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// URL base para el backend de AstroBot
// Configuración dinámica para diferentes entornos
let API_BASE_URL;

// URL para producción - CAMBIAR ESTA URL POR LA DE TU SERVIDOR REAL EN PRODUCCIÓN
const PRODUCTION_API_URL = 'https://tu-servidor-de-produccion.com';

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
        // En Android, el host de la máquina es 10.0.2.2 para AVD
        return '10.0.2.2';
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
 * Función para obtener la URL base adecuada según el entorno
 * @returns {Promise<string>} - URL base para el API
 */
const getAppropriateBaseUrl = async () => {
  // En producción, usar la URL de producción
  if (!__DEV__) {
    return PRODUCTION_API_URL;
  }
  
  // En desarrollo, detectar automáticamente la URL
  try {
    const serverIP = await getServerIP();
    return `http://${serverIP}:${SERVER_PORT}`;
  } catch (error) {
    log(LOG_LEVELS.ERROR, 'Error al obtener URL base:', error);
    // Fallback en caso de error
    return Platform.OS === 'android' 
      ? `http://10.0.2.2:${SERVER_PORT}` 
      : `http://localhost:${SERVER_PORT}`;
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

// Obtener el estado actual de la conexión
export const getConnectionStatus = () => {
  return {
    isConnected: connectionStatus.isConnected,
    lastChecked: connectionStatus.lastChecked,
    lastResponseTime: connectionStatus.lastResponseTime,
    error: connectionStatus.error,
    isSimulationMode: simulationMode,
    serverVersion: connectionStatus.serverVersion,
    serverStatus: connectionStatus.serverStatus
  };
};

// Obtiene la URL base actual de la API
export const getApiBaseUrl = () => {
  return API_BASE_URL;
};

// Respuestas simuladas para cuando el backend no está disponible
const SIMULATED_RESPONSES = [
  "Estoy funcionando en modo offline. El backend no está disponible en este momento. Puedo responder preguntas básicas sobre química, cálculos de laboratorio y diluciones, pero para funcionalidades avanzadas necesitarás conectar con el backend. Intenta reiniciar el servidor o verificar la conexión para acceder a todas las capacidades. El modelo DeepSeek R1 Zero proporciona respuestas más detalladas y precisas cuando está conectado.",
  "Puedo responder preguntas básicas en modo offline. Para funcionalidad completa con el modelo DeepSeek R1 Zero, asegúrate de que el backend esté en ejecución. En este modo, tengo acceso a información sobre masa molar, diluciones, concentraciones, pureza de reactivos y estequiometría básica. Si necesitas cálculos más complejos o acceso a la base de datos completa, será necesario establecer conexión con el servidor.",
  "Soy AstroBot en modo offline. Algunas funciones están limitadas sin conexión con el backend. Puedo ayudarte con conceptos fundamentales de química y cálculos básicos de laboratorio. Para obtener respuestas más precisas y personalizadas usando el modelo DeepSeek R1 Zero, te recomiendo verificar la conexión con el servidor y reiniciar la aplicación si es necesario.",
  "El backend no está disponible. Estoy operando con capacidades reducidas. Sin embargo, puedo asistirte con información general sobre química, fórmulas básicas y conceptos de laboratorio. Para acceder a todas mis funcionalidades con DeepSeek R1 Zero, incluyendo cálculos avanzados y acceso a la base de datos completa, necesitarás establecer conexión con el servidor.",
  "Para cálculos químicos básicos, puedo ayudarte incluso sin conexión al backend. Tengo información sobre masa molar, diluciones, concentraciones y pureza de reactivos. Si necesitas realizar cálculos más complejos o acceder a información específica de compuestos con el modelo DeepSeek R1 Zero, te recomiendo verificar la conexión con el servidor para utilizar todas mis capacidades.",
  "Estoy en modo de simulación porque no pude conectarme al backend. Intenta reiniciar el servidor o verificar la configuración de red. Mientras tanto, puedo asistirte con información general sobre química y cálculos básicos de laboratorio. Para acceder a todas mis funcionalidades con DeepSeek R1 Zero, incluyendo análisis avanzados y respuestas personalizadas, necesitarás establecer conexión con el servidor.",
];

// Respuestas simuladas específicas para preguntas comunes
const KEYWORD_RESPONSES = {
  "masa molar": " La masa molar de una sustancia se calcula sumando las masas atómicas de todos los átomos que la componen, expresadas en unidades de masa atómica (uma) o gramos por mol. La masa atómica de cada elemento se encuentra en la tabla periódica de los elementos. \n\n Por ejemplo, si quieres calcular la masa molar del agua (H2O), primero sumarías las masas atómicas del hidrógeno (H) y el oxígeno (O). La masa atómica del hidrógeno es aproximadamente 1 g/mol y la del oxígeno es aproximadamente 16 g/mol. Por lo tanto, la masa molar del agua sería: 2(1 g/mol) + 1(16 g/mol) = 18 g/mol. \n\n Este valor representa la masa de un mol de moléculas de agua. Para compuestos más complejos, el proceso es el mismo: multiplica la masa atómica de cada elemento por el número de átomos de ese elemento en la molécula, y luego suma todos estos valores.",
  
  "dilución": " La fórmula para calcular la dilución es la siguiente:\n\n C1 × V1 = C2 × V2\n\nDonde:\n- C1 es la concentración inicial de la solución (por ejemplo, en moles por litro).\n- V1 es el volumen inicial de la solución que se va a diluir.\n- C2 es la concentración final deseada de la solución diluida.\n- V2 es el volumen final de la solución diluida que se quiere preparar.\n\n Para calcular la dilución, puedes despejar cualquiera de las variables de la fórmula en función de las otras tres. Por ejemplo, si conoces la concentración inicial (C1), el volumen inicial (V1) y la concentración final deseada (C2), puedes calcular el volumen final (V2) utilizando la fórmula V2 = (C1 × V1) / C2. \n\n Esta fórmula es fundamental en el laboratorio para preparar soluciones con concentraciones específicas a partir de soluciones más concentradas. Es importante recordar que las unidades de concentración deben ser consistentes en ambos lados de la ecuación.",
  
  "concentración": " La concentración de una solución puede expresarse de varias formas, cada una con aplicaciones específicas en química y análisis de laboratorio:\n\n1. Molaridad (M): Moles de soluto por litro de solución (mol/L). Es la medida más común en química para expresar concentración.\n\n2. Molalidad (m): Moles de soluto por kilogramo de solvente (mol/kg). Útil para propiedades coligativas que dependen de la proporción de partículas.\n\n3. Fracción molar (X): Moles de un componente dividido por los moles totales de todos los componentes. Se utiliza en cálculos termodinámicos.\n\n4. Porcentaje en masa (%m/m): Masa de soluto dividida por la masa total de la solución, multiplicada por 100. Común en aplicaciones industriales.\n\n5. Porcentaje en volumen (%v/v): Volumen de soluto dividido por el volumen total, multiplicado por 100. Usado frecuentemente para mezclas de líquidos.\n\n6. Partes por millón (ppm) o partes por billón (ppb): Utilizadas para concentraciones muy bajas, como en análisis ambiental.\n\n La elección del tipo de concentración depende del contexto y aplicación específica del análisis químico.",
  
  "pureza": " La pureza de un reactivo indica el porcentaje de la sustancia deseada en la muestra. Para calcular la masa real de un reactivo, multiplica la masa total por el porcentaje de pureza. \n\n Por ejemplo, si tienes 10 gramos de un reactivo con 95% de pureza, la masa real de la sustancia activa sería 10g × 0.95 = 9.5g. \n\n Este cálculo es crucial en análisis cuantitativo y preparación de soluciones precisas. Los reactivos de alta pureza (>99%) se utilizan en investigación y análisis sensibles, mientras que reactivos de menor pureza pueden ser adecuados para aplicaciones educativas o industriales menos exigentes. \n\n Siempre verifica la pureza en la etiqueta del reactivo y ajusta tus cálculos en consecuencia para obtener resultados precisos en tus experimentos de laboratorio.",
  
  "estequiometría": " La estequiometría es el cálculo de las relaciones cuantitativas entre reactivos y productos en una reacción química, basándose en la ley de conservación de la masa. Este principio fundamental permite determinar las cantidades exactas de sustancias que participan en una reacción. \n\n El proceso para realizar cálculos estequiométricos incluye: \n1. Balancear la ecuación química para asegurar que el número de átomos de cada elemento sea igual en ambos lados\n2. Convertir masas a moles utilizando las masas molares\n3. Aplicar las proporciones molares de la ecuación balanceada\n4. Convertir de nuevo a unidades de masa si es necesario\n\n La estequiometría también permite calcular el rendimiento teórico, el rendimiento real y el porcentaje de rendimiento de una reacción, así como identificar el reactivo limitante que determina la cantidad máxima de producto que puede formarse.",
  
  "densidad papel": " Para calcular la densidad del papel, necesitas determinar su masa y volumen. Sigue estos pasos:\n\n1. Mide la masa del papel utilizando una balanza analítica (en gramos).\n2. Mide las dimensiones del papel: largo, ancho y espesor (en cm).\n3. Calcula el volumen multiplicando largo × ancho × espesor (en cm³).\n4. Calcula la densidad dividiendo la masa entre el volumen (g/cm³).\n\n La densidad típica del papel varía según el tipo:\n- Papel de impresión estándar: 0.7-0.9 g/cm³\n- Papel fotográfico: 1.0-1.4 g/cm³\n- Cartulina: 0.6-0.7 g/cm³\n\n Alternativamente, puedes usar el gramaje (g/m²) y el espesor (mm) para calcular la densidad con la fórmula: Densidad = Gramaje / (Espesor × 1000).",
  
  "ayuda": " ¡Hola! Soy AstroBot, tu asistente de laboratorio virtual diseñado para ayudarte con diversos aspectos de química y cálculos de laboratorio. Puedo asistirte con:\n\n Cálculos de masa molar: Determinar la masa molecular de compuestos químicos.\n\n Diluciones: Calcular concentraciones y volúmenes para preparar soluciones diluidas.\n\n Concentraciones: Explicar y calcular diferentes tipos de concentración (molaridad, molalidad, porcentajes, etc.).\n\n Pureza de reactivos: Ajustar cálculos considerando la pureza de los compuestos utilizados.\n\n Estequiometría: Realizar cálculos basados en ecuaciones químicas balanceadas.\n\n Conversiones de unidades: Transformar entre diferentes unidades de medida utilizadas en química.\n\n Propiedades físico-químicas: Proporcionar información sobre propiedades de elementos y compuestos.\n\n Puedes hacerme preguntas específicas sobre estos temas o solicitar ayuda para resolver problemas de laboratorio. ¿En qué puedo ayudarte hoy?",
};

/**
 * Obtiene un mensaje de bienvenida aleatorio
 * @returns {string} Mensaje de bienvenida
 */
export const getWelcomeMessage = () => {
  const welcomeMessages = [
    " ¡Hola! Bienvenido a AstroBot, tu asistente de laboratorio personal. Estoy aquí para ayudarte con tus cálculos químicos, resolver dudas sobre reactivos, y asistirte en tus experimentos. ¿En qué puedo ayudarte hoy?",
    " ¡Saludos científico! Soy AstroBot, tu asistente virtual de laboratorio. Puedo ayudarte con cálculos de masa molar, diluciones, concentraciones y mucho más. ¿Qué necesitas calcular hoy?",
    " ¡Bienvenido al laboratorio virtual! Soy AstroBot, tu compañero de experimentos. Estoy listo para ayudarte con cualquier duda química o cálculo que necesites. ¿Por dónde quieres empezar?",
    " ¡Hola! Soy AstroBot, tu asistente personal para todo lo relacionado con química y cálculos de laboratorio. ¿Tienes alguna pregunta sobre estequiometría, pureza de reactivos o preparación de soluciones?",
  ];
  
  return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
};

/**
 * Obtiene sugerencias de temas para el usuario
 * @returns {string} Mensaje con sugerencias
 */
export const getSuggestionsMessage = () => {
  return "Puedes preguntarme sobre:\n• Cálculos de masa molar\n• Diluciones y concentraciones\n• Pureza de reactivos\n• Estequiometría\n• Conversiones de unidades\n• Propiedades físico-químicas";
};

/**
 * Implementa un mecanismo de timeout para peticiones fetch
 * 
 * Esta función envuelve una promesa fetch con un timeout configurable
 * para evitar que las peticiones queden pendientes indefinidamente.
 * También implementa soporte para AbortController cuando está disponible.
 * 
 * @param {Promise|string|Object} fetchPromise - Promesa de fetch, URL o configuración
 * @param {number} timeoutMs - Tiempo de espera en milisegundos
 * @returns {Promise<Response>} - Promesa con la respuesta o error si excede el timeout
 * @throws {Error} - Error si la petición excede el tiempo de espera
 */
const fetchWithTimeout = async (fetchPromise, timeoutMs = 10000) => {
  // Asegurarse de que timeoutMs sea un número razonable
  if (!timeoutMs || timeoutMs < 1000) {
    timeoutMs = 10000; // Valor mínimo de 10 segundos
    log(LOG_LEVELS.WARN, `Tiempo de espera demasiado corto, usando valor predeterminado: ${timeoutMs}ms`);
  }
  
  let timeoutId;
  let abortController;
  
  try {
    // Si la API de AbortController está disponible, usarla
    if (typeof AbortController !== 'undefined') {
      abortController = new AbortController();
      const signal = abortController.signal;
      
      // Convertir diferentes tipos de entrada a una promesa fetch con signal
      if (typeof fetchPromise === 'string') {
        // Si fetchPromise es una URL directa (string)
        const url = fetchPromise;
        fetchPromise = fetch(url, { signal });
      } 
      else if (typeof fetchPromise === 'object' && fetchPromise.url) {
        // Si fetchPromise es un objeto de configuración
        const { url, options = {} } = fetchPromise;
        fetchPromise = fetch(url, {
          ...options,
          signal
        });
      }
      // Si fetchPromise ya es una instancia de Promise (fetch ya ejecutado),
      // no podemos agregar la señal, pero el timeout seguirá funcionando
    }
  
    // Crear una promesa que se rechaza después de timeoutMs
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        // Abortar la solicitud si es posible
        if (abortController) {
          abortController.abort();
        }
        reject(new Error(`La solicitud excedió el tiempo de espera (${timeoutMs}ms)`));
      }, timeoutMs);
    });
    
    // Competir entre la promesa de fetch y la de timeout
    return Promise.race([
      // Envolver fetchPromise para limpiar el timeout cuando se resuelva
      new Promise((resolve, reject) => {
        Promise.resolve(fetchPromise)
          .then(response => {
            clearTimeout(timeoutId);
            resolve(response);
          })
          .catch(error => {
            clearTimeout(timeoutId);
            reject(error);
          });
      }),
      timeoutPromise
    ]);
  } catch (error) {
    // Limpiar el timeout si ocurre un error
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Registrar el error
    log(LOG_LEVELS.ERROR, `Error en fetchWithTimeout: ${error.message}`, { error });
    
    // Propagar el error
    throw error;
  }
};

/**
 * Función para registrar mensajes en la consola
 * @param {string} level - Nivel de log (INFO, WARN, ERROR, DEBUG)
 * @param {string} message - Mensaje a registrar
 * @param {Object} data - Datos adicionales (opcional)
 */
const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const prefix = `[AstroBot][${timestamp}][${level}]`;
  
  switch (level) {
    case LOG_LEVELS.DEBUG:
      console.debug(`${prefix} ${message}`, data);
      break;
    case LOG_LEVELS.INFO:
      console.info(`${prefix} ${message}`, data);
      break;
    case LOG_LEVELS.WARN:
      console.warn(`${prefix} ${message}`, data);
      break;
    case LOG_LEVELS.ERROR:
      console.error(`${prefix} ${message}`, data);
      break;
    default:
      console.log(`${prefix} ${message}`, data);
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
  log(LOG_LEVELS.INFO, 'Verificando conexión con el backend');
  
  try {
    // Paso 1: Verificar conexión a internet
    const netInfo = await NetInfo.fetch();
    
    if (!netInfo.isConnected || !netInfo.isInternetReachable) {
      log(LOG_LEVELS.WARN, 'No hay conexión a internet', { netInfo });
      
      // Actualizar estado de conexión
      connectionStatus = {
        ...connectionStatus,
        isConnected: false,
        lastChecked: new Date().toISOString(),
        error: 'No hay conexión a internet',
        consecutiveFailures: connectionStatus.consecutiveFailures + 1
      };
      
      // Activar modo simulación
      simulationMode = true;
      
      return {
        isConnected: false,
        isSimulationMode: true,
        error: 'No hay conexión a internet. El bot está funcionando en modo simulación.'
      };
    }
    
    // Paso 2: Obtener la URL base apropiada
    if (!API_BASE_URL) {
      await initializeApiBaseUrl();
    }
    
    // Paso 3: Intentar conectar con el backend
    const startTime = Date.now();
    
    // Usar fetchWithTimeout para evitar que la solicitud se quede esperando indefinidamente
    const fetchPromise = fetch(`${API_BASE_URL}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    const response = await fetchWithTimeout(fetchPromise, timeoutMs);
    
    // Calcular tiempo de respuesta
    const responseTime = Date.now() - startTime;
    
    // Paso 4: Procesar la respuesta
    if (response.ok) {
      const data = await response.json();
      
      // Actualizar estado de conexión
      connectionStatus = {
        isConnected: true,
        lastChecked: new Date().toISOString(),
        lastResponseTime: responseTime,
        error: null,
        consecutiveFailures: 0,
        serverVersion: data.version || 'desconocida',
        serverStatus: data.status || 'ok'
      };
      
      // Desactivar modo simulación si estaba activo
      if (simulationMode) {
        log(LOG_LEVELS.INFO, 'Desactivando modo simulación, conexión establecida');
        simulationMode = false;
      }
      
      log(LOG_LEVELS.INFO, `Conexión exitosa con el backend (${responseTime}ms)`, { 
        url: API_BASE_URL,
        serverVersion: connectionStatus.serverVersion,
        serverStatus: connectionStatus.serverStatus
      });
      
      return {
        isConnected: true,
        isSimulationMode: false,
        responseTime,
        serverVersion: connectionStatus.serverVersion,
        serverStatus: connectionStatus.serverStatus
      };
    } else {
      // La respuesta no fue exitosa
      const errorText = await response.text();
      const errorMessage = `Error en la respuesta del servidor: ${response.status} ${response.statusText}. ${errorText}`;
      
      log(LOG_LEVELS.ERROR, errorMessage, { 
        url: API_BASE_URL,
        status: response.status
      });
      
      // Actualizar estado de conexión
      connectionStatus = {
        ...connectionStatus,
        isConnected: false,
        lastChecked: new Date().toISOString(),
        error: errorMessage,
        consecutiveFailures: connectionStatus.consecutiveFailures + 1
      };
      
      // Activar modo simulación después de 3 fallos consecutivos
      if (connectionStatus.consecutiveFailures >= 3 && !simulationMode) {
        log(LOG_LEVELS.WARN, 'Activando modo simulación después de fallos consecutivos');
        simulationMode = true;
      }
      
      return {
        isConnected: false,
        isSimulationMode: simulationMode,
        error: errorMessage
      };
    }
  } catch (error) {
    // Capturar cualquier error durante el proceso
    log(LOG_LEVELS.ERROR, `Error al verificar conexión: ${error.message}`, { error });
    
    // Actualizar estado de conexión
    connectionStatus = {
      ...connectionStatus,
      isConnected: false,
      lastChecked: new Date().toISOString(),
      error: error.message,
      consecutiveFailures: connectionStatus.consecutiveFailures + 1
    };
    
    // Activar modo simulación después de 3 fallos consecutivos
    if (connectionStatus.consecutiveFailures >= 3 && !simulationMode) {
      log(LOG_LEVELS.WARN, 'Activando modo simulación después de fallos consecutivos');
      simulationMode = true;
    }
    
    return {
      isConnected: false,
      isSimulationMode: simulationMode,
      error: error.message
    };
  }
};

/**
 * Inicia una nueva sesión de chat con AstroBot
 * @returns {Promise<string>} - ID de la sesión
 */
export const startAstroBotSession = async () => {
  log(LOG_LEVELS.INFO, 'Iniciando nueva sesión de AstroBot');
  
  // Verificar la conexión con el backend
  const isConnected = await checkBackendConnection(10000); // Aumentar el tiempo de espera
  
  // Generar un ID de sesión único
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  log(LOG_LEVELS.INFO, `Nueva sesión iniciada: ${sessionId}`, { 
    isConnected, 
    simulationMode 
  });
  
  return sessionId;
};

/**
 * Obtiene la lista de modelos disponibles desde el backend
 * @returns {Promise<Array>} - Lista de modelos disponibles
 */
export const getAvailableModels = async () => {
  log(LOG_LEVELS.INFO, 'Obteniendo lista de modelos disponibles');
  
  try {
    const response = await fetchWithTimeout(
      fetch(`${API_BASE_URL}/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      5000
    );
    
    if (!response.ok) {
      throw new Error(`Error al obtener modelos: ${response.status}`);
    }
    
    const data = await response.json();
    log(LOG_LEVELS.INFO, 'Modelos obtenidos correctamente', { 
      count: data.models ? data.models.length : 0 
    });
    
    return {
      models: data.models || [],
      default: data.default || ''
    };
  } catch (error) {
    log(LOG_LEVELS.ERROR, `Error al obtener modelos: ${error.message}`, { error });
    // Proporcionar modelos simulados cuando no hay conexión
    return {
      models: ['GPT-3.5-Turbo', 'GPT-4', 'Claude-3-Opus'],
      default: 'GPT-3.5-Turbo'
    };
  }
};

/**
 * Envía un mensaje a AstroBot y recibe una respuesta
 * @param {string} message - Mensaje a enviar
 * @param {string} sessionId - ID de la sesión (opcional)
 * @returns {Promise<Object>} - Respuesta del bot
 */
export const sendMessageToAstroBot = async (message, sessionId = null) => {
  log(LOG_LEVELS.INFO, 'Enviando mensaje a AstroBot', { message, sessionId });
  
  // Si estamos en modo simulación, devolver una respuesta simulada
  if (simulationMode) {
    log(LOG_LEVELS.INFO, 'Usando modo de simulación para respuesta', { simulationMode });
    
    // Simular un retraso realista
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const simulatedResponse = getSimulatedResponse(message);
    return {
      message: simulatedResponse,
      timestamp: new Date().toISOString(),
      sessionId,
      simulated: true,
      model: "simulación"
    };
  }
  
  try {
    const payload = {
      message,
      ...(sessionId && { sessionId })
    };
    
    // Usamos fetchWithTimeout para limitar el tiempo de espera a 30 segundos (aumentado de 10 segundos)
    const fetchPromise = fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const response = await fetchWithTimeout(fetchPromise, 30000); // Aumentado a 30 segundos
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      log(LOG_LEVELS.ERROR, `Error al enviar mensaje: ${errorData.message || 'Error desconocido'}`, {
        status: response.status,
        message
      });
      
      // Si hay un error, activar modo simulación y devolver una respuesta simulada
      simulationMode = true;
      
      // Determinar el tipo de error para proporcionar un mensaje más informativo
      let errorMessage = "Lo siento, no pude procesar tu solicitud en este momento.";
      
      if (error.message.includes('tiempo de espera')) {
        errorMessage = "Lo siento, la respuesta está tardando demasiado. Por favor, intenta con una pregunta más corta o específica.";
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage = "No puedo conectarme al servidor en este momento. Estoy trabajando en modo sin conexión.";
      }
      
      // Intentar obtener una respuesta simulada, pero si no hay coincidencia, usar el mensaje de error
      const simulatedResponse = getSimulatedResponse(message) || errorMessage;
      
      return {
        message: simulatedResponse,
        timestamp: new Date().toISOString(),
        sessionId,
        simulated: true,
        model: "simulación"
      };
    }
    
    const responseData = await response.json();
    log(LOG_LEVELS.INFO, 'Mensaje enviado correctamente, respuesta recibida', { 
      responseLength: responseData.response ? responseData.response.length : 0,
      status: responseData.status
    });
    
    // Adaptar el formato de respuesta al esperado por el componente
    return {
      message: responseData.response || 'No se recibió respuesta del servidor',
      timestamp: new Date().toISOString(),
      sessionId,
      simulated: false,
      model: responseData.model || "DeepSeek R1 Zero Base"
    };
  } catch (error) {
    log(LOG_LEVELS.ERROR, `Error al enviar mensaje: ${error.message}`, { error, message });
    
    // Si hay un error, activar modo simulación y devolver una respuesta simulada
    
    // Determinar el tipo de error para proporcionar un mensaje más informativo
    let errorMessage = "Lo siento, no pude procesar tu solicitud en este momento.";
    
    if (error.message.includes('tiempo de espera')) {
      errorMessage = "Lo siento, la respuesta está tardando demasiado. Por favor, intenta con una pregunta más corta o específica.";
    } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      errorMessage = "No puedo conectarme al servidor en este momento. Estoy trabajando en modo sin conexión.";
    }
    
    // Activar modo simulación
    simulationMode = true;
    
    // Intentar obtener una respuesta simulada, pero si no hay coincidencia, usar el mensaje de error
    const simulatedResponse = getSimulatedResponse(message) || errorMessage;
    
    return {
      message: simulatedResponse,
      timestamp: new Date().toISOString(),
      sessionId,
      simulated: true,
      model: "simulación"
    };
  }
};

/**
 * Finaliza una sesión de chat con AstroBot
 * @param {string} sessionId - ID de la sesión a finalizar
 * @returns {Promise<boolean>} - true si la sesión se finalizó correctamente
 */
export const endAstroBotSession = async (sessionId) => {
  log(LOG_LEVELS.INFO, `Finalizando sesión: ${sessionId}`);
  
  // En esta implementación simple, no necesitamos hacer nada especial para finalizar la sesión
  // En una implementación más compleja, podríamos enviar una solicitud al backend
  
  return true;
};

/**
 * Función para cambiar la URL del API dinámicamente
 * @param {string} url - URL del API
 * @param {boolean} testConnection - Si se debe probar la conexión con la nueva URL
 * @returns {Promise<Object>} - Objeto con el resultado de la operación
 */
export const setApiBaseUrl = async (url, testConnection = true) => {
  if (!url || url.trim() === '') {
    return {
      success: false,
      message: 'La URL no puede estar vacía',
      connectionStatus: null
    };
  }

  const newUrl = url.trim();
  
  // Guardar la URL anterior para poder restaurarla en caso de error
  const previousUrl = API_BASE_URL;
  
  // Actualizar la URL
  API_BASE_URL = newUrl;
  
  // Si no queremos probar la conexión, solo guardar la URL
  if (!testConnection) {
    try {
      await AsyncStorage.setItem('API_BASE_URL', API_BASE_URL);
      log(LOG_LEVELS.INFO, `API URL actualizada: ${API_BASE_URL}`);
      return {
        success: true,
        message: 'URL actualizada correctamente',
        connectionStatus: null
      };
    } catch (error) {
      log(LOG_LEVELS.ERROR, `Error al guardar API URL: ${error.message}`);
      return {
        success: false,
        message: `Error al guardar URL: ${error.message}`,
        connectionStatus: null
      };
    }
  }
  
  // Probar la conexión con la nueva URL
  log(LOG_LEVELS.INFO, `Probando conexión con la nueva URL: ${API_BASE_URL}`);
  
  try {
    // Intentar conectar con el backend
    const connectionResult = await checkBackendConnection(10000);
    
    if (connectionResult.isConnected) {
      // Si la conexión es exitosa, guardar la URL
      try {
        await AsyncStorage.setItem('API_BASE_URL', API_BASE_URL);
        log(LOG_LEVELS.INFO, `API URL actualizada y verificada: ${API_BASE_URL}`);
        
        // Guardar también el estado del emulador si estamos en uno
        const isEmu = await isEmulator();
        await AsyncStorage.setItem('IS_EMULATOR', String(isEmu));
        
        return {
          success: true,
          message: 'URL actualizada y conexión verificada correctamente',
          connectionStatus: connectionResult
        };
      } catch (error) {
        log(LOG_LEVELS.ERROR, `Error al guardar API URL: ${error.message}`);
        return {
          success: false,
          message: `Error al guardar la URL: ${error.message}`,
          connectionStatus: connectionResult
        };
      }
    } else {
      // Si la conexión falla, restaurar la URL anterior
      log(LOG_LEVELS.WARN, `No se pudo conectar con la URL: ${API_BASE_URL}`);
      API_BASE_URL = previousUrl;
      
      return {
        success: false,
        message: `No se pudo conectar con la URL: ${connectionResult.error || 'Error desconocido'}`,
        connectionStatus: connectionResult
      };
    }
  } catch (error) {
    // Si hay un error al probar la conexión, restaurar la URL anterior
    log(LOG_LEVELS.ERROR, `Error al probar conexión: ${error.message}`);
    API_BASE_URL = previousUrl;
    
    return {
      success: false,
      message: `Error al probar la conexión: ${error.message}`,
      connectionStatus: null
    };
  }
};

/**
 * Función para obtener una respuesta simulada basada en palabras clave
 * @param {string} message - Mensaje del usuario
 * @returns {string} - Respuesta simulada
 */
const getSimulatedResponse = (message) => {
  // Convertir mensaje a minúsculas para búsqueda de palabras clave
  const lowerMessage = message.toLowerCase();
  
  // Buscar palabras clave en el mensaje
  for (const [keyword, response] of Object.entries(KEYWORD_RESPONSES)) {
    if (lowerMessage.includes(keyword)) {
      // Asegurar que la respuesta no exceda el límite máximo
      if (response.length > MAX_RESPONSE_LENGTH) {
        return response.substring(0, MAX_RESPONSE_LENGTH);
      }
      return response;
    }
  }
  
  // Si no hay coincidencias de palabras clave, devolver una respuesta genérica
  const genericResponse = SIMULATED_RESPONSES[Math.floor(Math.random() * SIMULATED_RESPONSES.length)];
  
  // Asegurar que la respuesta no exceda el límite máximo
  if (genericResponse.length > MAX_RESPONSE_LENGTH) {
    return genericResponse.substring(0, MAX_RESPONSE_LENGTH);
  }
  return genericResponse;
};

// Inicializar la URL base
initializeApiBaseUrl().catch(error => {
  console.error('Error al inicializar API_BASE_URL:', error);
});

// Mostrar la URL configurada
console.log('AstroBot API URL:', API_BASE_URL);

// Exportar un objeto con todas las funciones
export default {
  checkBackendConnection,
  getConnectionStatus,
  startAstroBotSession,
  getAvailableModels,
  sendMessageToAstroBot,
  endAstroBotSession,
  getWelcomeMessage,
  getSuggestionsMessage,
  setApiBaseUrl,
  getApiBaseUrl
};
