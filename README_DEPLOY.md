# Guía de Despliegue de AstroLab Calculator

## Información General

Esta guía proporciona instrucciones para desplegar y distribuir la aplicación AstroLab Calculator, incluyendo la integración con el backend de AstroBot.

## Configuración del Backend

El backend de AstroBot está desplegado en:
- URL: https://astroback-jfj5.onrender.com

La aplicación está configurada para conectarse automáticamente a esta URL cuando esté disponible. Si el backend desplegado no está disponible, la aplicación intentará conectarse a un servidor local o funcionará en modo de simulación.

## Generación del APK

Para generar un APK de la aplicación:

1. Asegúrate de tener instalado EAS CLI:
   ```
   npm install -g eas-cli
   ```

2. Inicia sesión en tu cuenta de Expo:
   ```
   eas login
   ```

3. Configura el proyecto para EAS Build (si no lo has hecho):
   ```
   eas build:configure
   ```

4. Genera el APK:
   ```
   eas build -p android --profile apk
   ```

5. Sigue las instrucciones en pantalla. Una vez completado, podrás descargar el APK desde la URL proporcionada.

## Instalación del APK

1. Transfiere el APK al dispositivo Android.
2. En el dispositivo, navega hasta el archivo APK y tócalo para iniciar la instalación.
3. Es posible que debas habilitar la instalación desde fuentes desconocidas en la configuración de seguridad del dispositivo.

## Verificación de la Conexión

Para verificar que la aplicación se conecta correctamente al backend:

1. Abre la aplicación AstroLab Calculator.
2. Toca el botón de AstroBot (icono de chat) en la esquina inferior derecha.
3. Observa el indicador de estado de conexión en la parte superior del chat:
   - Verde: Conectado al backend desplegado o local
   - Amarillo: Modo de simulación (sin conexión)
   - Rojo: Error de conexión

## Solución de Problemas

Si la aplicación no puede conectarse al backend:

1. Verifica que el dispositivo tenga conexión a Internet.
2. Comprueba que el backend esté en funcionamiento visitando https://astroback-jfj5.onrender.com/status desde un navegador.
3. Si el backend está caído, la aplicación funcionará en modo de simulación con capacidades limitadas.

## Notas Adicionales

- La aplicación está configurada para intentar primero la conexión con el backend desplegado, luego con un servidor local y finalmente caer en modo de simulación si ambas opciones fallan.
- Los tiempos de espera para las conexiones al backend desplegado se han aumentado a 30 segundos para compensar posibles latencias.
- Se han implementado mecanismos de recuperación para manejar errores de conexión y proporcionar una experiencia de usuario fluida incluso cuando hay problemas de red.
