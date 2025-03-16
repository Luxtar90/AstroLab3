import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import globalStyles from '../styles/globalStyles';

const AnimatedAlert = ({ 
  visible, 
  message, 
  type = 'success', 
  onClose,
  duration = 2500, // 2.5 segundos por defecto
  title = ''
}) => {
  const { isDarkMode } = useTheme();
  const themeColors = isDarkMode ? globalStyles.darkColors : globalStyles.lightColors;
  
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      // Mostrar alerta con animación
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.back(1.7)),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      ]).start();
      
      // Ocultar automáticamente después de la duración especificada
      const timer = setTimeout(() => {
        hideAlert();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);
  
  const hideAlert = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      if (onClose) onClose();
    });
  };
  
  // Determinar el color y el icono según el tipo
  let backgroundColor, iconName, textColor;
  
  switch (type) {
    case 'success':
      backgroundColor = themeColors.success;
      iconName = 'check-circle';
      textColor = '#FFFFFF';
      break;
    case 'error':
      backgroundColor = themeColors.error;
      iconName = 'error';
      textColor = '#FFFFFF';
      break;
    case 'warning':
      backgroundColor = themeColors.warning;
      iconName = 'warning';
      textColor = '#FFFFFF';
      break;
    case 'info':
      backgroundColor = themeColors.info;
      iconName = 'info';
      textColor = '#FFFFFF';
      break;
    default:
      backgroundColor = themeColors.primary;
      iconName = 'notifications';
      textColor = '#FFFFFF';
  }
  
  if (!visible) return null;
  
  return (
    <Animated.View 
      style={[
        styles.container,
        {
          backgroundColor,
          transform: [{ translateY }],
          opacity,
        }
      ]}
    >
      <View style={styles.content}>
        <MaterialIcons name={iconName} size={24} color={textColor} style={styles.icon} />
        <View style={styles.textContainer}>
          {title ? (
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          ) : null}
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={hideAlert} style={styles.closeButton}>
        <MaterialIcons name="close" size={20} color={textColor} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    margin: 10,
    marginTop: 40,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
});

export default AnimatedAlert;
