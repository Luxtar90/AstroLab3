import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Animated,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import * as AstroBotService from '../services/AstroBotService';
import globalStyles from '../styles/globalStyles';
import { getAstroBotStyles } from '../styles/astroBotStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AstroBotConnectionSettings from './AstroBotConnectionSettings';
import { useTheme } from '../context/ThemeContext';

/**
 * Componente para renderizar una burbuja de chat
 */
const ChatBubble = ({ item, theme }) => {
  const styles = getAstroBotStyles(theme);
  const themeColors = theme === 'dark' ? globalStyles.darkColors : globalStyles.lightColors;
  const isUser = !item.isBot;
  
  return (
    <View
      style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.botBubble,
        item.isError && { backgroundColor: 'rgba(255, 59, 48, 0.2)' },
      ]}
    >
      {!isUser && (
        <View style={styles.botIconContainer}>
          <MaterialCommunityIcons 
            name="flask-outline" 
            size={16} 
            color={theme === 'dark' ? themeColors.accent : themeColors.primaryDark} 
          />
        </View>
      )}
      <Text
        style={[
          styles.messageText,
          isUser ? styles.userText : styles.botText,
          item.isError && styles.errorText,
        ]}
        // Asegurar que el texto no se corte
        numberOfLines={0}
      >
        {item.text}
      </Text>
      
      {/* Indicador de modo simulación */}
      {item.isBot && item.simulated && (
        <Text style={styles.simulatedIndicator}>
          (modo offline)
        </Text>
      )}
      
      {/* Modelo utilizado */}
      {item.model && (
        <Text style={styles.modelIndicator}>
          (modelo: {item.model})
        </Text>
      )}
    </View>
  );
};

/**
 * Componente para mostrar el estado de conexión
 */
const ConnectionStatus = ({ status, isChecking, showError, onRetry, theme }) => {
  const styles = getAstroBotStyles(theme);
  const themeColors = theme === 'dark' ? globalStyles.darkColors : globalStyles.lightColors;
  
  if (isChecking) {
    return (
      <View style={styles.connectionStatusContainer}>
        <ActivityIndicator size="small" color={themeColors.accent} />
        <Text style={[styles.connectionStatusText, { color: themeColors.textLight }]}>
          Verificando conexión...
        </Text>
      </View>
    );
  }
  
  if (showError) {
    return (
      <TouchableOpacity style={styles.connectionStatusContainer} onPress={onRetry}>
        <View style={[styles.connectionDot, { backgroundColor: themeColors.error }]} />
        <Text style={[styles.connectionStatusText, { color: themeColors.error }]}>
          {status.error || 'Error de conexión. Toca para reintentar.'}
        </Text>
      </TouchableOpacity>
    );
  }
  
  if (status.isConnected) {
    return (
      <View style={styles.connectionStatusContainer}>
        <View style={[styles.connectionDot, { backgroundColor: '#4CAF50' }]} />
        <Text style={[styles.connectionStatusText, { color: themeColors.success }]}>
          Conectado
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.connectionStatusContainer}>
      <View style={[styles.connectionDot, { backgroundColor: '#FFA000' }]} />
      <Text style={[styles.connectionStatusText, { color: themeColors.warning }]}>
        Sin conexión (modo simulación)
      </Text>
    </View>
  );
};

/**
 * Modal para interactuar con AstroBot
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isVisible - Indica si el modal está visible
 * @param {Function} props.onClose - Función a ejecutar al cerrar el modal
 * @param {Object} props.theme - Tema actual de la aplicación
 */
const AstroBotChatModal = ({ isVisible, onClose, theme }) => {
  // Estados para el chat
  const [chatHistory, setChatHistory] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false });
  const [connectionCheckInProgress, setConnectionCheckInProgress] = useState(false);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  
  // Referencias
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current;

  // Obtener estilos basados en el tema
  const styles = getAstroBotStyles(theme);
  const themeColors = theme === 'dark' ? globalStyles.darkColors : globalStyles.lightColors;

  // Verificar la conexión con el backend cuando el modal se abre
  useEffect(() => {
    if (isVisible) {
      // Animar entrada del modal
      animateEntrance();
      
      // Verificar conexión con el backend
      const checkConnection = async () => {
        setConnectionCheckInProgress(true);
        try {
          const status = await AstroBotService.checkBackendConnection();
          setConnectionStatus(status);
          setShowConnectionError(status.error !== undefined && status.error !== null);
          
          if (status.isConnected) {
            // Iniciar sesión
            initializeSession();
            console.log('Conexión establecida con el backend');
          } else {
            console.log(`Sin conexión con el backend: ${status.error || 'Modo simulación activo'}`);
          }
        } catch (error) {
          console.error('Error al verificar conexión:', error);
          setShowConnectionError(true);
          setConnectionStatus({ 
            isConnected: false, 
            isSimulationMode: true,
            error: error.message 
          });
        } finally {
          setConnectionCheckInProgress(false);
        }
      };
      
      checkConnection();
    }
  }, [isVisible]);

  // Iniciar sesión cuando se establece la conexión
  useEffect(() => {
    if (connectionStatus.isConnected && !sessionId && isVisible) {
      initializeSession();
    }
  }, [connectionStatus.isConnected, sessionId, isVisible]);

  // Animación de entrada
  const animateEntrance = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Verificar la conexión con el backend
  const checkConnection = async () => {
    console.log('Verificando conexión con el backend...');
    
    try {
      const status = await AstroBotService.checkBackendConnection();
      setConnectionStatus(status);
      
      if (status.isConnected) {
        console.log('Conexión establecida con el backend');
        initializeSession();
      } else {
        console.log('No se pudo conectar con el backend:', status.error);
        setShowConnectionError(true);
      }
    } catch (error) {
      console.error('Error al verificar la conexión:', error);
      setConnectionStatus({
        isConnected: false,
        error: error.message
      });
      setShowConnectionError(true);
    }
  };

  // Inicializar sesión
  const initializeSession = async () => {
    try {
      // Iniciar sesión con el backend
      const sessionData = await AstroBotService.startAstroBotSession();
      setSessionId(sessionData.sessionId);
      console.log(`Sesión iniciada: ${sessionData.sessionId}`);
      
      // Mensaje de bienvenida completo
      const welcomeMessage = {
        id: Date.now().toString(),
        text: AstroBotService.getWelcomeMessage(),
        isBot: true,
        simulated: !connectionStatus.isConnected,
        model: connectionStatus.isConnected ? "DeepSeek R1 Zero Base" : "simulación"
      };
      
      // Mensaje adicional con sugerencias
      const suggestionsMessage = {
        id: (Date.now() + 1).toString(),
        text: AstroBotService.getSuggestionsMessage(),
        isBot: true,
        simulated: !connectionStatus.isConnected,
        model: connectionStatus.isConnected ? "DeepSeek R1 Zero Base" : "simulación"
      };
      
      // Mostrar saludo cada vez que se abre el chat
      setChatHistory([welcomeMessage, suggestionsMessage]);
      
      // Verificar si ya se mostró el saludo hoy para estadísticas
      const storageKey = 'astrobot_welcome_shown';
      const today = new Date().toISOString().split('T')[0];
      const storedDate = await AsyncStorage.getItem(storageKey);
      
      if (storedDate !== today) {
        // Guardar fecha de hoy en almacenamiento
        await AsyncStorage.setItem(storageKey, today);
        console.log('Primera interacción del día con AstroBot');
      }
    } catch (error) {
      console.error('Error al inicializar la sesión:', error);
      
      // Generar ID de sesión local en caso de error
      const fallbackSessionId = `local_${Date.now()}`;
      setSessionId(fallbackSessionId);
      
      // Mensaje de bienvenida en modo offline
      const offlineWelcomeMessage = {
        id: Date.now().toString(),
        text: '¡Hola! Soy AstroBot, tu asistente de laboratorio. Actualmente estoy funcionando en modo offline con capacidades limitadas. Haré lo mejor posible para ayudarte.',
        isBot: true,
        simulated: true,
        model: "simulación"
      };
      
      setChatHistory([offlineWelcomeMessage]);
    }
  };

  // Manejar envío de mensaje
  const handleSendMessage = async () => {
    const userMessageText = userMessage.trim();
    if (!userMessageText || isLoading) return;
    
    // Limpiar input y mostrar mensaje del usuario
    setUserMessage('');
    Keyboard.dismiss();
    
    const userMessageObj = { id: Date.now().toString(), text: userMessageText, isBot: false };
    setChatHistory(prevChat => [...prevChat, userMessageObj]);
    
    // Mostrar indicador de carga
    setIsLoading(true);
    
    try {
      console.log('Enviando mensaje al bot:', userMessageText);
      
      // Enviar mensaje al backend
      const response = await AstroBotService.sendMessageToAstroBot(userMessageText, sessionId);
      
      // Verificar si la respuesta es válida
      if (!response || !response.message) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      // Registrar la longitud de la respuesta para depuración
      console.log(`Longitud de la respuesta: ${response.message.length} caracteres`);
      
      // Agregar respuesta del bot al chat
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isBot: true,
        simulated: response.simulated,
        model: response.model || "desconocido"
      };
      
      setChatHistory(prevChat => [...prevChat, botMessage]);
      console.log('Respuesta recibida del bot');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Mostrar mensaje de error en el chat
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: `Lo siento, ha ocurrido un error: ${error.message}. Por favor, intenta de nuevo más tarde.`,
        isBot: true,
        simulated: true,
        model: "simulación"
      };
      
      setChatHistory(prevChat => [...prevChat, errorMessage]);
      
      // Actualizar estado de conexión
      setConnectionStatus(prevStatus => ({
        ...prevStatus,
        isConnected: false,
        error: error.message,
      }));
      
      setShowConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar separador entre mensajes
  const renderSeparator = () => <View style={styles.separator} />;

  // Desplazar al último mensaje cuando se agrega uno nuevo
  const scrollToBottom = () => {
    if (flatListRef.current && chatHistory.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Desplazar al último mensaje cuando cambia el historial
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const { isDarkMode } = useTheme();

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.7}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
      useNativeDriver={true}
      hideModalContentWhileAnimating={false}
      propagateSwipe={true}
      avoidKeyboard={true}
      statusBarTranslucent={true}
      onModalShow={animateEntrance}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Encabezado */}
            <View style={styles.header}>
              <View style={styles.headerTitle}>
                <MaterialCommunityIcons name="robot" size={24} color={themeColors.accent} />
                <Text style={styles.title}>AstroBot</Text>
                <TouchableOpacity 
                  onPress={() => setIsSettingsVisible(true)}
                  style={styles.settingsButton}
                >
                  <Ionicons name="settings-outline" size={20} color={themeColors.text} />
                </TouchableOpacity>
                <View style={styles.connectionIndicator}>
                  <View style={[styles.headerConnectionDot, { 
                    backgroundColor: connectionStatus.isConnected 
                      ? '#4CAF50' // Verde para conectado
                      : (showConnectionError ? '#FF3B30' : '#FFA000') // Rojo para error, Amarillo para simulación
                  }]} />
                  <Text style={styles.connectionStatusText}>
                    {connectionStatus.isConnected 
                      ? '🟢 Conectado' 
                      : (showConnectionError 
                          ? '🔴 Error' 
                          : (connectionStatus.isSimulationMode ? '🟡 Simulación' : '⚪ Sin conexión'))}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            
            {/* Lista de mensajes */}
            <FlatList
              ref={flatListRef}
              data={chatHistory}
              renderItem={({ item }) => <ChatBubble item={item} theme={theme} />}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={renderSeparator}
              contentContainerStyle={styles.chatContainer}
              onContentSizeChange={scrollToBottom}
              onLayout={scrollToBottom}
            />
            
            {/* Indicador de escritura */}
            {isLoading && (
              <View style={styles.typingIndicator}>
                <Text style={{ color: themeColors.text }}>AstroBot está escribiendo</Text>
                <ActivityIndicator size="small" color={themeColors.accent} style={styles.typingDots} />
              </View>
            )}
            
            {/* Área de entrada de texto */}
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Escribe un mensaje..."
                placeholderTextColor={themeColors.textLight}
                value={userMessage}
                onChangeText={setUserMessage}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
                multiline
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={!userMessage.trim() || isLoading}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <AstroBotConnectionSettings 
        isVisible={isSettingsVisible} 
        onClose={() => setIsSettingsVisible(false)} 
      />
    </Modal>
  );
};

export default AstroBotChatModal;
