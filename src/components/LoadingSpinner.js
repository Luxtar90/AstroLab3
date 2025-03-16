import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import globalStyles from '../styles/globalStyles';

const LoadingSpinner = ({ message = 'Cargando...', size = 'large', fullScreen = false }) => {
  const { isDarkMode } = useTheme();
  const themeColors = isDarkMode ? globalStyles.darkColors : globalStyles.lightColors;
  
  if (fullScreen) {
    return (
      <View style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
      }}>
        <View style={{
          backgroundColor: themeColors.card,
          borderRadius: globalStyles.borderRadius.medium,
          padding: globalStyles.spacing.large,
          alignItems: 'center',
          justifyContent: 'center',
          ...globalStyles.shadow.medium,
          minWidth: 150,
        }}>
          <ActivityIndicator size={size} color={themeColors.primary} />
          {message && <Text style={{
            marginTop: globalStyles.spacing.medium,
            fontSize: globalStyles.fontSize.medium,
            color: themeColors.text,
            textAlign: 'center',
          }}>{message}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={{
      padding: globalStyles.spacing.large,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ActivityIndicator size={size} color={themeColors.primary} />
      {message && <Text style={{
        marginTop: globalStyles.spacing.medium,
        fontSize: globalStyles.fontSize.medium,
        color: themeColors.text,
        textAlign: 'center',
      }}>{message}</Text>}
    </View>
  );
};

export default LoadingSpinner;
