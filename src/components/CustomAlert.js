import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import globalStyles from '../styles/globalStyles';

const CustomAlert = ({ type = 'info', message, onClose, showCloseButton = true }) => {
  const { isDarkMode } = useTheme();
  const styles = globalStyles.getStyles(isDarkMode);
  
  // Determinar el icono y estilo según el tipo de alerta
  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle',
          containerStyle: styles.alertSuccess,
          iconColor: styles.colors.success
        };
      case 'error':
        return {
          icon: 'error',
          containerStyle: styles.alertError,
          iconColor: styles.colors.error
        };
      case 'warning':
        return {
          icon: 'warning',
          containerStyle: styles.alertWarning,
          iconColor: styles.colors.warning
        };
      case 'info':
      default:
        return {
          icon: 'info',
          containerStyle: styles.alertInfo,
          iconColor: styles.colors.info
        };
    }
  };

  const { icon, containerStyle, iconColor } = getAlertConfig();

  return (
    <View style={[styles.alertContainer, containerStyle]}>
      <MaterialIcons name={icon} size={24} color={iconColor} style={styles.alertIcon} />
      <Text style={styles.alertText}>{message}</Text>
      {showCloseButton && onClose && (
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={20} color={styles.colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomAlert;
