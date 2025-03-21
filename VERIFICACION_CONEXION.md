# Verificación de Conexión con el Backend Desplegado

Este documento proporciona instrucciones para verificar que la aplicación AstroLab Calculator se conecta correctamente al backend desplegado de AstroBot.

## URL del Backend Desplegado

El backend de AstroBot está desplegado en:

```plaintext
https://astroback-jfj5.onrender.com
```

## Verificación Directa del Backend

Antes de probar la aplicación, es recomendable verificar que el backend está funcionando correctamente:

1. Abre un navegador web en cualquier dispositivo con conexión a Internet.
2. Visita la siguiente URL: `https://astroback-jfj5.onrender.com/status`
3. Deberías recibir una respuesta similar a:

```json
{
  "message": "AstroBot backend is running",
  "status": "ok",
  "version": "1.0.0"
}
```

4. Si recibes esta respuesta, el backend está funcionando correctamente.

## Verificación desde la Aplicación

Para verificar que la aplicación se conecta correctamente al backend:

1. **Observa el Indicador de Conexión**:
   - Abre la aplicación AstroLab Calculator.
   - Toca el botón de AstroBot (icono de chat) en la esquina inferior derecha.
   - Observa el indicador de estado en la parte superior del chat:
     - **Verde**: Conectado al backend (desplegado o local).
     - **Amarillo**: Modo simulación (sin conexión).
     - **Rojo**: Error de conexión.

2. **Prueba de Mensajes**:
   - Envía un mensaje simple como "Hola" o "¿Cómo estás?".
   - Si recibes una respuesta elaborada y el indicador está verde, la conexión con el backend es correcta.
   - Si la respuesta es básica y el indicador está amarillo, la aplicación está en modo simulación.

## Solución de Problemas

Si la aplicación no se conecta al backend desplegado:

1. **Verifica tu Conexión a Internet**:
   - Asegúrate de que el dispositivo tiene una conexión a Internet estable.
   - Prueba a abrir otras aplicaciones o sitios web para confirmar la conectividad.

2. **Verifica el Estado del Servidor**:
   - El servidor de Render puede entrar en modo de suspensión después de períodos de inactividad.
   - La primera conexión puede tardar hasta 30 segundos mientras el servidor se reactiva.
   - Intenta enviar un mensaje y espera pacientemente la respuesta.

3. **Reinicia la Aplicación**:
   - Cierra completamente la aplicación AstroLab Calculator.
   - Vuelve a abrirla y prueba la conexión nuevamente.

4. **Comprueba los Tiempos de Espera**:
   - La aplicación está configurada con un tiempo de espera de 30 segundos para las conexiones al backend desplegado.
   - Si la respuesta tarda más de 30 segundos, la aplicación cambiará automáticamente al modo simulación.

## Comportamiento Esperado

- La aplicación intentará primero conectarse al backend desplegado.
- Si no puede conectarse al backend desplegado, intentará conectarse a un servidor local.
- Si ambas conexiones fallan, la aplicación funcionará en modo simulación.
- Incluso en modo simulación, la aplicación seguirá intentando conectarse al backend periódicamente.

## Notas Importantes

- El servidor desplegado en Render puede tener tiempos de respuesta variables dependiendo de la carga y el plan de servicio.
- La primera conexión después de un período de inactividad puede ser más lenta mientras el servidor se reactiva.
- La aplicación está diseñada para funcionar incluso sin conexión, proporcionando respuestas simuladas cuando sea necesario.
