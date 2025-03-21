# Pruebas Post-Instalación de AstroLab Calculator

Este documento proporciona una lista de verificación para probar la aplicación AstroLab Calculator después de instalarla, con énfasis en la funcionalidad de AstroBot y su conexión con el backend desplegado.

## Pruebas de Conexión

1. **Verificación de Conexión a Internet**
   - [ ] Asegurarse de que el dispositivo tiene conexión a Internet activa
   - [ ] Comprobar que no hay restricciones de firewall que bloqueen las conexiones

2. **Verificación del Backend**
   - [ ] Visitar [https://astroback-jfj5.onrender.com/status](https://astroback-jfj5.onrender.com/status) en un navegador
   - [ ] Confirmar que el backend responde con un mensaje de estado OK

## Pruebas de AstroBot

1. **Inicialización**
   - [ ] Abrir la aplicación AstroLab Calculator
   - [ ] Tocar el botón de AstroBot (icono de chat) en la esquina inferior derecha
   - [ ] Verificar que se abre el modal de chat

2. **Indicador de Conexión**
   - [ ] Observar el indicador de estado en la parte superior del chat
   - [ ] Confirmar que el color corresponde al estado de conexión:
     - Verde: Conectado al backend (desplegado o local)
     - Amarillo: Modo simulación
     - Rojo: Error de conexión

3. **Mensaje de Bienvenida**
   - [ ] Verificar que se muestra un mensaje de bienvenida automáticamente
   - [ ] Comprobar que el mensaje incluye sugerencias de temas

4. **Envío de Mensajes**
   - [ ] Enviar un mensaje simple (ej. "Hola")
   - [ ] Verificar que se recibe una respuesta
   - [ ] Comprobar que la respuesta llega en un tiempo razonable (menos de 30 segundos)

5. **Consulta Química**
   - [ ] Enviar una consulta relacionada con química (ej. "¿Cuál es la masa molar del agua?")
   - [ ] Verificar que la respuesta contiene información química relevante

6. **Prueba de Desconexión**
   - [ ] Activar el modo avión en el dispositivo
   - [ ] Enviar un mensaje a AstroBot
   - [ ] Verificar que el sistema cambia a modo simulación (indicador amarillo)
   - [ ] Comprobar que se recibe una respuesta simulada
   - [ ] Desactivar el modo avión
   - [ ] Enviar otro mensaje
   - [ ] Verificar si el sistema vuelve a conectarse al backend (puede tardar hasta 30 segundos)

## Pruebas de Rendimiento

1. **Tiempo de Respuesta**
   - [ ] Medir el tiempo que tarda en recibir respuestas del backend
   - [ ] Verificar que las respuestas llegan en menos de 30 segundos

2. **Uso de Recursos**
   - [ ] Comprobar que la aplicación no consume excesiva batería
   - [ ] Verificar que la aplicación no se cierra inesperadamente durante el uso

## Pruebas de Interfaz de Usuario

1. **Visualización de Mensajes**
   - [ ] Verificar que los mensajes se muestran correctamente en las burbujas de chat
   - [ ] Comprobar que los mensajes largos se muestran adecuadamente
   - [ ] Verificar que el scroll funciona correctamente cuando hay muchos mensajes

2. **Animaciones**
   - [ ] Comprobar que las animaciones de apertura y cierre del chat funcionan suavemente
   - [ ] Verificar que la animación de escritura se muestra cuando se está generando una respuesta

## Notas Finales

- Registrar cualquier problema encontrado durante las pruebas
- Anotar los tiempos de respuesta para diferentes tipos de consultas
- Documentar cualquier comportamiento inesperado para su posterior análisis
