import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import globalStyles from '../styles/globalStyles';

const FloatingActionButton = ({ 
  onPress, 
  icon = 'refresh', 
  size = 'large', 
  style = {},
  position = 'bottomRight'
}) => {
  const { isDarkMode } = useTheme();
  const themeColors = isDarkMode ? globalStyles.darkColors : globalStyles.lightColors;
  
  // Animación de rotación
  const spinValue = new Animated.Value(0);
  
  const spin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();
  };
  
  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Tamaño del botón
  const buttonSize = size === 'small' ? 48 : size === 'large' ? 64 : 56;
  const iconSize = size === 'small' ? 20 : size === 'large' ? 32 : 24;
  
  // Posición del botón
  let positionStyle = {};
  switch (position) {
    case 'bottomRight':
      positionStyle = { bottom: 20, right: 20 };
      break;
    case 'bottomLeft':
      positionStyle = { bottom: 20, left: 20 };
      break;
    case 'topRight':
      positionStyle = { top: 20, right: 20 };
      break;
    case 'topLeft':
      positionStyle = { top: 20, left: 20 };
      break;
    case 'center':
      positionStyle = { bottom: 20, alignSelf: 'center' };
      break;
  }
  
  const handlePress = () => {
    spin();
    if (onPress) onPress();
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: themeColors.primary,
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          ...positionStyle,
          borderWidth: 1.5,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.3)',
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View style={{ transform: [{ rotate }] }}>
        <MaterialIcons name={icon} size={iconSize} color="#FFFFFF" />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default FloatingActionButton;
