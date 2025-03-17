# AstroBot - Asistente de Laboratorio

AstroBot es un asistente virtual para la aplicación AstroLab Calculator, diseñado para ayudar a los usuarios con consultas relacionadas con la química y los cálculos de laboratorio.

## Características

- Interfaz de chat intuitiva
- Respuestas contextuales sobre química y cálculos
- Integración con la aplicación principal
- Diseño adaptable al tema claro/oscuro

## Implementación

AstroBot está implementado como un componente modal en React Native, que se muestra cuando el usuario presiona el botón flotante en la pantalla principal.

### Archivos Principales

- `src/components/AstroBotChatModal.js`: Componente principal del chat
- `src/services/AstroBotService.js`: Servicio para comunicación con el backend
- `src/screens/HomeScreen.js`: Integración del botón flotante

### Flujo de Usuario

1. El usuario presiona el botón flotante en la pantalla principal
2. Se abre el modal de chat con AstroBot
3. El usuario puede enviar mensajes y recibir respuestas
4. El usuario puede cerrar el chat en cualquier momento

## Integración con el Backend

Para integrar AstroBot con el backend, se ha implementado un servicio dedicado en `src/services/AstroBotService.js` que maneja la comunicación con el servidor.

### Configuración del Backend

El backend debe exponer los siguientes endpoints:

- **POST /chat**: Endpoint principal para todas las comunicaciones con AstroBot
  - Envío de mensajes
  - Verificación de conexión
  - Inicio de sesión (opcional)

### Formato de Solicitudes y Respuestas

#### Envío de Mensajes

**Solicitud:**
```json
{
  "message": "Texto del mensaje del usuario",
  "sessionId": "ID_de_sesion_opcional"
}
```
**Respuesta:**
```json
{
  "response": "Texto de respuesta del bot"
}
```

### Manejo de Errores y Timeouts

El servicio implementa un sistema de timeout manual para todas las solicitudes al backend:

- 5 segundos para verificación de conexión e inicio de sesión
- 10 segundos para envío de mensajes

Si una solicitud excede el tiempo límite, se lanzará un error que será manejado apropiadamente por la interfaz.

### Verificación de Conexión

Antes de mostrar la interfaz de chat, la aplicación verifica la conexión con el backend enviando un mensaje de "ping". Si la conexión falla, se muestra un mensaje de error al usuario.

### Pruebas

Se ha creado un script de prueba `test_backend.js` que permite verificar la conexión con el backend y simular una sesión completa. Para ejecutarlo:
```bash
node test_backend.js
```

### Documentación Adicional

Para más detalles sobre la integración con el backend, consulte el archivo `BACKEND_INTEGRATION.md`.

## Flujo de Comunicación

1. Al abrir el modal de chat, se verifica la conexión con el backend
2. Si la conexión es exitosa, se inicia una sesión
3. Cuando el usuario envía un mensaje, se envía al backend
4. El backend procesa el mensaje y envía una respuesta
5. La respuesta se muestra en la interfaz de chat

## Ejemplos de Uso

### Iniciar el chat
```javascript
// En HomeScreen.js
const handleOpenChat = () => {
  setIsChatModalVisible(true);
};

// Botón flotante
<FloatingActionButton
  icon="chat"
  onPress={handleOpenChat}
  position="bottomRight"
  color={theme.colors.primary}
/>;
```

### Enviar un mensaje
```javascript
// En AstroBotChatModal.js
const handleSendMessage = async (message) => {
  try {
    const response = await AstroBotService.sendMessageToAstroBot(message, sessionId);
    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      text: response.message,
      isBot: true
    }]);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
  }
};
```

## Personalización

El componente de chat puede personalizarse modificando los estilos en `AstroBotChatModal.js`. Se adapta automáticamente al tema claro/oscuro de la aplicación.

## Próximos Pasos

- Implementar historial de conversaciones persistente
- Añadir capacidad de enviar imágenes o archivos
- Mejorar las respuestas contextuales basadas en la actividad del usuario
