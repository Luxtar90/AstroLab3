// AstroBotConnectionSettings.js
// Componente para configurar y probar la conexión con el backend de AstroBot

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as AstroBotService from '../services/AstroBotService';
import { getAstroBotStyles } from '../styles/astroBotStyles';
import { useTheme } from '../context/ThemeContext';

/**
 * Componente que muestra el estado de conexión con el backend de AstroBot
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isVisible - Indica si el modal está visible
 * @param {Function} props.onClose - Función para cerrar el modal
 * @returns {React.Component} - Componente de configuración de conexión
 */
const AstroBotConnectionSettings = ({ isVisible, onClose }) => {
  // Estado local
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  
  // Obtener el tema del contexto
  const { isDarkMode, themeColors } = useTheme();
  
  // Obtener estilos basados en el tema
  const styles = getAstroBotStyles(isDarkMode ? 'dark' : 'light');

  /**
   * Verifica la conexión con el backend
   */
  const checkConnection = useCallback(async () => {
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      // Obtener el estado actual de la conexión
      const status = AstroBotService.getConnectionStatus();
      setConnectionStatus(status);
      
      // Intentar conectar con el backend automáticamente
      const result = await AstroBotService.checkBackendConnection();
      setConnectionStatus(result);
      
      // Proporcionar feedback táctil
      provideFeedback(result.isConnected);
    } catch (error) {
      console.error('Error al verificar conexión:', error);
      setConnectionError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Proporciona feedback táctil basado en el resultado de la conexión
   * 
   * @param {boolean} isSuccess - Indica si la conexión fue exitosa
   */
  const provideFeedback = (isSuccess) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(
        isSuccess 
          ? Haptics.NotificationFeedbackType.Success 
          : Haptics.NotificationFeedbackType.Warning
      );
    }
  };

  // Verificar la conexión al abrir el modal
  useEffect(() => {
    if (isVisible) {
      checkConnection();
    }
  }, [isVisible, checkConnection]);

  /**
   * Renderiza el indicador de estado de conexión
   * 
   * @returns {React.Component} - Componente de estado de conexión
   */
  const renderConnectionStatus = () => {
    if (!connectionStatus && !connectionError) return null;
    
    const statusConfig = getConnectionStatusConfig();
    
    return (
      <View style={[styles.connectionStatusBox, { 
        borderColor: statusConfig.color, 
        backgroundColor: `${statusConfig.color}20` 
      }]}>
        <View style={styles.connectionStatusHeader}>
          <MaterialIcons name={statusConfig.icon} size={24} color={statusConfig.color} />
          <Text style={[styles.connectionStatusTitle, { color: statusConfig.color }]}>
            {statusConfig.text}
          </Text>
        </View>
        
        <Text style={styles.connectionStatusDescription}>
          {statusConfig.description}
        </Text>
        
        {!isLoading && (
          <TouchableOpacity
            style={[styles.connectionRetryButton, { backgroundColor: statusConfig.color }]}
            onPress={checkConnection}
          >
            <Text style={styles.connectionRetryButtonText}>Verificar conexión</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  /**
   * Obtiene la configuración de estado de conexión basada en el estado actual
   * 
   * @returns {Object} - Configuración de estado (color, texto, icono, descripción)
   */
  const getConnectionStatusConfig = () => {
    let config = {
      color: '#999', // Gris por defecto
      text: 'Verificando conexión...',
      icon: 'sync',
      description: 'Espera mientras verificamos la conexión con el backend.'
    };
    
    if (connectionStatus && connectionStatus.isConnected) {
      config = {
        color: themeColors.success, // Verde
        text: 'Conectado con Astrobot',
        icon: 'check-circle',
        description: `La conexión con Astrobot está funcionando correctamente. Tiempo de respuesta: ${connectionStatus.responseTime}ms`
      };
      
      if (connectionStatus.serverVersion) {
        config.description += `\nVersión del servidor: ${connectionStatus.serverVersion}`;
      }
    } else if (connectionStatus && connectionStatus.isSimulationMode) {
      config = {
        color: themeColors.warning, // Amarillo
        text: 'Modo simulación',
        icon: 'sync',
        description: 'No se pudo conectar al backend. El bot está funcionando en modo simulación con capacidades limitadas.'
      };
      
      if (connectionStatus.error) {
        config.description += `\nRazón: ${connectionStatus.error}`;
      }
    } else {
      config = {
        color: themeColors.error, // Rojo
        text: 'Sin conexión',
        icon: 'error',
        description: connectionError || (connectionStatus && connectionStatus.error) 
          ? `Error: ${connectionError || connectionStatus.error}` 
          : 'No se pudo conectar al backend. Verifica tu conexión a internet y que el servidor esté en funcionamiento.'
      };
    }
    
    return config;
  };

  /**
   * Renderiza el contenido del modal
   * 
   * @returns {React.Component} - Contenido del modal
   */
  const renderContent = () => {
    return (
      <View style={styles.connectionSettingsContent}>
        <View style={styles.connectionSettingsHeader}>
          <Text style={styles.connectionSettingsTitle}>
            Estado de conexión
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.connectionSettingsCloseButton}>
            <MaterialIcons name="close" size={24} color={themeColors.text} />
          </TouchableOpacity>
        </View>
        
        {isLoading ? renderLoadingState() : renderConnectionStatus()}
      </View>
    );
  };

  /**
   * Renderiza el estado de carga
   * 
   * @returns {React.Component} - Componente de estado de carga
   */
  const renderLoadingState = () => (
    <View style={styles.connectionLoadingContainer}>
      <ActivityIndicator size="large" color={themeColors.primary} />
      <Text style={styles.connectionLoadingText}>
        Verificando conexión con el backend...
      </Text>
      <Text style={styles.connectionLoadingSubText}>
        Esto puede tardar unos segundos. Estamos detectando automáticamente la mejor configuración.
      </Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.connectionSettingsModal}>
        {renderContent()}
      </View>
    </Modal>
  );
};

export default AstroBotConnectionSettings;
