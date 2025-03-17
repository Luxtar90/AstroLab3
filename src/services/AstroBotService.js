// AstroBotService.js
// Servicio para manejar la comunicación con el backend de AstroBot

// URL base para el backend de AstroBot
// Usamos la IP de la máquina en la red local en lugar de localhost/127.0.0.1
// para permitir conexiones desde dispositivos móviles
const API_BASE_URL = 'http://192.168.100.129:5000'; // IP de tu computadora en la red
// Puedes encontrar tu IP con el comando "ipconfig" en Windows o "ifconfig" en Mac/Linux

// Estado de la conexión con el backend
let connectionStatus = {
  isConnected: false,
  lastChecked: null,
  lastResponseTime: null,
  error: null,
  consecutiveFailures: 0
};

// Niveles de log
const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

// Modo de simulación (se activa cuando el backend no está disponible)
let simulationMode = true; // Modo de simulación por defecto (se desactiva al conectar)

// Constante para definir la longitud máxima de respuesta
const MAX_RESPONSE_LENGTH = 2000; // Ajustar según sea necesario

// Respuestas simuladas para cuando el backend no está disponible
const SIMULATED_RESPONSES = [
  "Estoy funcionando en modo offline. El backend no está disponible en este momento. Puedo responder preguntas básicas sobre química, cálculos de laboratorio y diluciones, pero para funcionalidades avanzadas necesitarás conectar con el backend. Intenta reiniciar el servidor o verificar la conexión para acceder a todas las capacidades. El modelo DeepSeek R1 Zero proporciona respuestas más detalladas y precisas cuando está conectado.",
  "Puedo responder preguntas básicas en modo offline. Para funcionalidad completa con el modelo DeepSeek R1 Zero, asegúrate de que el backend esté en ejecución. En este modo, tengo acceso a información sobre masa molar, diluciones, concentraciones, pureza de reactivos y estequiometría básica. Si necesitas cálculos más complejos o acceso a la base de datos completa, será necesario establecer conexión con el servidor.",
  "Soy AstroBot en modo offline. Algunas funciones están limitadas sin conexión al backend. Puedo ayudarte con conceptos fundamentales de química y cálculos básicos de laboratorio. Para obtener respuestas más precisas y personalizadas usando el modelo DeepSeek R1 Zero, te recomiendo verificar la conexión con el servidor y reiniciar la aplicación si es necesario.",
  "El backend no está disponible. Estoy operando con capacidades reducidas. Sin embargo, puedo asistirte con información general sobre química, fórmulas básicas y conceptos de laboratorio. Para acceder a todas mis funcionalidades con DeepSeek R1 Zero, incluyendo cálculos avanzados y acceso a la base de datos completa, necesitarás establecer conexión con el servidor.",
  "Para cálculos químicos básicos, puedo ayudarte incluso sin conexión al backend. Tengo información sobre masa molar, diluciones, concentraciones y pureza de reactivos. Si necesitas realizar cálculos más complejos o acceder a información específica de compuestos con el modelo DeepSeek R1 Zero, te recomiendo verificar la conexión con el servidor para utilizar todas mis capacidades.",
  "Estoy en modo de simulación porque no pude conectarme al backend. Intenta reiniciar el servidor o verificar la configuración de red. Mientras tanto, puedo asistirte con información general sobre química y cálculos básicos de laboratorio. Para acceder a todas mis funcionalidades con DeepSeek R1 Zero, incluyendo análisis avanzados y respuestas personalizadas, necesitarás establecer conexión con el servidor.",
];

// Respuestas simuladas específicas para preguntas comunes
const KEYWORD_RESPONSES = {
  "masa molar": "⚗️ La masa molar de una sustancia se calcula sumando las masas atómicas de todos los átomos que la componen, expresadas en unidades de masa atómica (uma) o gramos por mol. La masa atómica de cada elemento se encuentra en la tabla periódica de los elementos. \n\n🧪 Por ejemplo, si quieres calcular la masa molar del agua (H2O), primero sumarías las masas atómicas del hidrógeno (H) y el oxígeno (O). La masa atómica del hidrógeno es aproximadamente 1 g/mol y la del oxígeno es aproximadamente 16 g/mol. Por lo tanto, la masa molar del agua sería: 2(1 g/mol) + 1(16 g/mol) = 18 g/mol. \n\n📊 Este valor representa la masa de un mol de moléculas de agua. Para compuestos más complejos, el proceso es el mismo: multiplica la masa atómica de cada elemento por el número de átomos de ese elemento en la molécula, y luego suma todos estos valores.",
  
  "dilución": "🧪 La fórmula para calcular la dilución es la siguiente:\n\n📝 C1 × V1 = C2 × V2\n\nDonde:\n- C1 es la concentración inicial de la solución (por ejemplo, en moles por litro).\n- V1 es el volumen inicial de la solución que se va a diluir.\n- C2 es la concentración final deseada de la solución diluida.\n- V2 es el volumen final de la solución diluida que se quiere preparar.\n\n🔬 Para calcular la dilución, puedes despejar cualquiera de las variables de la fórmula en función de las otras tres. Por ejemplo, si conoces la concentración inicial (C1), el volumen inicial (V1) y la concentración final deseada (C2), puedes calcular el volumen final (V2) utilizando la fórmula V2 = (C1 × V1) / C2. \n\n⚠️ Esta fórmula es fundamental en el laboratorio para preparar soluciones con concentraciones específicas a partir de soluciones más concentradas. Es importante recordar que las unidades de concentración deben ser consistentes en ambos lados de la ecuación.",
  
  "concentración": "🧪 La concentración de una solución puede expresarse de varias formas, cada una con aplicaciones específicas en química y análisis de laboratorio:\n\n1️⃣ Molaridad (M): Moles de soluto por litro de solución (mol/L). Es la medida más común en química para expresar concentración.\n\n2️⃣ Molalidad (m): Moles de soluto por kilogramo de solvente (mol/kg). Útil para propiedades coligativas que dependen de la proporción de partículas.\n\n3️⃣ Fracción molar (X): Moles de un componente dividido por los moles totales de todos los componentes. Se utiliza en cálculos termodinámicos.\n\n4️⃣ Porcentaje en masa (%m/m): Masa de soluto dividida por la masa total de la solución, multiplicada por 100. Común en aplicaciones industriales.\n\n5️⃣ Porcentaje en volumen (%v/v): Volumen de soluto dividido por el volumen total, multiplicado por 100. Usado frecuentemente para mezclas de líquidos.\n\n6️⃣ Partes por millón (ppm) o partes por billón (ppb): Utilizadas para concentraciones muy bajas, como en análisis ambiental.\n\n🔍 La elección del tipo de concentración depende del contexto y aplicación específica del análisis químico.",
  
  "pureza": "🧪 La pureza de un reactivo indica el porcentaje de la sustancia deseada en la muestra. Para calcular la masa real de un reactivo, multiplica la masa total por el porcentaje de pureza. \n\n📊 Por ejemplo, si tienes 10 gramos de un reactivo con 95% de pureza, la masa real de la sustancia activa sería 10g × 0.95 = 9.5g. \n\n⚗️ Este cálculo es crucial en análisis cuantitativo y preparación de soluciones precisas. Los reactivos de alta pureza (>99%) se utilizan en investigación y análisis sensibles, mientras que reactivos de menor pureza pueden ser adecuados para aplicaciones educativas o industriales menos exigentes. \n\n⚠️ Siempre verifica la pureza en la etiqueta del reactivo y ajusta tus cálculos en consecuencia para obtener resultados precisos en tus experimentos de laboratorio.",
  
  "estequiometría": "⚖️ La estequiometría es el cálculo de las relaciones cuantitativas entre reactivos y productos en una reacción química, basándose en la ley de conservación de la masa. Este principio fundamental permite determinar las cantidades exactas de sustancias que participan en una reacción. \n\n🔬 El proceso para realizar cálculos estequiométricos incluye: \n1️⃣ Balancear la ecuación química para asegurar que el número de átomos de cada elemento sea igual en ambos lados\n2️⃣ Convertir masas a moles utilizando las masas molares\n3️⃣ Aplicar las proporciones molares de la ecuación balanceada\n4️⃣ Convertir de nuevo a unidades de masa si es necesario\n\n📊 La estequiometría también permite calcular el rendimiento teórico, el rendimiento real y el porcentaje de rendimiento de una reacción, así como identificar el reactivo limitante que determina la cantidad máxima de producto que puede formarse.",
  
  "densidad papel": "📄 Para calcular la densidad del papel, necesitas determinar su masa y volumen. Sigue estos pasos:\n\n1️⃣ Mide la masa del papel utilizando una balanza analítica (en gramos).\n2️⃣ Mide las dimensiones del papel: largo, ancho y espesor (en cm).\n3️⃣ Calcula el volumen multiplicando largo × ancho × espesor (en cm³).\n4️⃣ Calcula la densidad dividiendo la masa entre el volumen (g/cm³).\n\n📊 La densidad típica del papel varía según el tipo:\n- 📝 Papel de impresión estándar: 0.7-0.9 g/cm³\n- 📸 Papel fotográfico: 1.0-1.4 g/cm³\n- 🗂️ Cartulina: 0.6-0.7 g/cm³\n\n🔍 Alternativamente, puedes usar el gramaje (g/m²) y el espesor (mm) para calcular la densidad con la fórmula: Densidad = Gramaje / (Espesor × 1000).",
  
  "ayuda": "👋 ¡Hola! Soy AstroBot, tu asistente de laboratorio virtual diseñado para ayudarte con diversos aspectos de química y cálculos de laboratorio. Puedo asistirte con:\n\n⚗️ Cálculos de masa molar: Determinar la masa molecular de compuestos químicos.\n\n🧪 Diluciones: Calcular concentraciones y volúmenes para preparar soluciones diluidas.\n\n📊 Concentraciones: Explicar y calcular diferentes tipos de concentración (molaridad, molalidad, porcentajes, etc.).\n\n🔍 Pureza de reactivos: Ajustar cálculos considerando la pureza de los compuestos utilizados.\n\n⚖️ Estequiometría: Realizar cálculos basados en ecuaciones químicas balanceadas.\n\n🔄 Conversiones de unidades: Transformar entre diferentes unidades de medida utilizadas en química.\n\n🧠 Propiedades físico-químicas: Proporcionar información sobre propiedades de elementos y compuestos.\n\n💬 Puedes hacerme preguntas específicas sobre estos temas o solicitar ayuda para resolver problemas de laboratorio. ¿En qué puedo ayudarte hoy?",
};

/**
 * Obtiene un mensaje de bienvenida aleatorio
 * @returns {string} Mensaje de bienvenida
 */
export const getWelcomeMessage = () => {
  const welcomeMessages = [
    "👋 ¡Hola! Bienvenido a AstroBot, tu asistente de laboratorio personal. Estoy aquí para ayudarte con tus cálculos químicos, resolver dudas sobre reactivos, y asistirte en tus experimentos. ¿En qué puedo ayudarte hoy?",
    "🧪 ¡Saludos científico! Soy AstroBot, tu asistente virtual de laboratorio. Puedo ayudarte con cálculos de masa molar, diluciones, concentraciones y mucho más. ¿Qué necesitas calcular hoy?",
    "⚗️ ¡Bienvenido al laboratorio virtual! Soy AstroBot, tu compañero de experimentos. Estoy listo para ayudarte con cualquier duda química o cálculo que necesites. ¿Por dónde quieres empezar?",
    "🔬 ¡Hola! Soy AstroBot, tu asistente personal para todo lo relacionado con química y cálculos de laboratorio. ¿Tienes alguna pregunta sobre estequiometría, pureza de reactivos o preparación de soluciones?",
  ];
  
  return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
};

/**
 * Obtiene sugerencias de temas para el usuario
 * @returns {string} Mensaje con sugerencias
 */
export const getSuggestionsMessage = () => {
  return "Puedes preguntarme sobre:\n• 📊 Cálculos de masa molar\n• 🧪 Diluciones y concentraciones\n• 🔍 Pureza de reactivos\n• ⚖️ Estequiometría\n• 🔄 Conversiones de unidades\n• 📝 Propiedades físico-químicas";
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
 * Verifica la conexión con el backend
 * @returns {Promise<Object>} - Objeto con el estado de la conexión
 */
export const checkBackendConnection = async () => {
  log(LOG_LEVELS.INFO, 'Verificando conexión con el backend');
  
  try {
    const startTime = Date.now();
    
    // Usamos el nuevo endpoint de status para verificar la conexión
    const response = await fetchWithTimeout(
      fetch(`${API_BASE_URL}/status`), 
      5000
    );
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      
      // Actualizar el estado de la conexión
      connectionStatus = {
        isConnected: true,
        lastChecked: new Date().toISOString(),
        lastResponseTime: responseTime,
        error: null,
        consecutiveFailures: 0,
        serverVersion: data.version || 'unknown',
        serverStatus: data.status || 'ok'
      };
      
      log(LOG_LEVELS.INFO, `Conexión exitosa con el backend (${responseTime}ms)`, data);
      
      // Desactivar modo simulación si estaba activo
      if (simulationMode) {
        log(LOG_LEVELS.INFO, 'Desactivando modo simulación, backend disponible');
        simulationMode = false;
      }
      
      return {
        isConnected: true,
        isSimulationMode: false,
        responseTime,
        serverVersion: data.version || 'unknown',
        serverStatus: data.status || 'ok'
      };
    } else {
      // Si la respuesta no es exitosa, incrementar contador de fallos
      connectionStatus = {
        ...connectionStatus,
        isConnected: false,
        lastChecked: new Date().toISOString(),
        lastResponseTime: responseTime,
        error: `Error HTTP: ${response.status}`,
        consecutiveFailures: connectionStatus.consecutiveFailures + 1
      };
      
      log(LOG_LEVELS.WARN, `Error al conectar con el backend: ${response.status}`, {
        status: response.status,
        responseTime
      });
      
      // Activar modo simulación después de 3 fallos consecutivos
      if (connectionStatus.consecutiveFailures >= 3 && !simulationMode) {
        log(LOG_LEVELS.WARN, 'Activando modo simulación después de fallos consecutivos');
        simulationMode = true;
      }
      
      return {
        isConnected: false,
        isSimulationMode: true,
        responseTime,
        error: `Error HTTP: ${response.status}`
      };
    }
  } catch (error) {
    // Si hay una excepción, incrementar contador de fallos
    connectionStatus = {
      ...connectionStatus,
      isConnected: false,
      lastChecked: new Date().toISOString(),
      error: error.message,
      consecutiveFailures: connectionStatus.consecutiveFailures + 1
    };
    
    log(LOG_LEVELS.ERROR, `Error al conectar con el backend: ${error.message}`, {
      error
    });
    
    // Activar modo simulación después de 3 fallos consecutivos
    if (connectionStatus.consecutiveFailures >= 3 && !simulationMode) {
      log(LOG_LEVELS.WARN, 'Activando modo simulación después de fallos consecutivos');
      simulationMode = true;
    }
    
    return {
      isConnected: false,
      isSimulationMode: true,
      error: error.message
    };
  }
};

/**
 * Obtiene el estado actual de la conexión con el backend
 * @returns {Object} - Estado de la conexión
 */
export const getConnectionStatus = () => {
  return {
    ...connectionStatus,
    isSimulationMode: simulationMode
  };
};

/**
 * Inicia una nueva sesión de chat con AstroBot
 * @returns {Promise<string>} - ID de la sesión
 */
export const startAstroBotSession = async () => {
  log(LOG_LEVELS.INFO, 'Iniciando nueva sesión de AstroBot');
  
  // Verificar la conexión con el backend
  const isConnected = await checkBackendConnection();
  
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

// Exportar un objeto con todas las funciones
export default {
  checkBackendConnection,
  getConnectionStatus,
  startAstroBotSession,
  getAvailableModels,
  sendMessageToAstroBot,
  endAstroBotSession,
  getWelcomeMessage,
  getSuggestionsMessage
};
