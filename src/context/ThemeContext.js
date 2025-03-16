import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir los colores para cada tema
const lightThemeColors = {
  primary: '#0277bd',
  secondary: '#00838f',
  accent: '#00b0ff',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#212121',
  textSecondary: '#757575',
  error: '#d32f2f',
  success: '#388e3c',
  warning: '#f57c00',
  info: '#0288d1',
  gradient: {
    primary: ['#0277bd', '#01579b'],
    secondary: ['#00838f', '#006064'],
    accent: ['#00b0ff', '#0091ea'],
    teal: ['#e0f7fa', '#b2ebf2'],
    dark: ['#1a2a3a', '#0d1520']
  }
};

const darkThemeColors = {
  primary: '#29b6f6',
  secondary: '#26c6da',
  accent: '#40c4ff',
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#b0bec5',
  error: '#ef5350',
  success: '#66bb6a',
  warning: '#ffa726',
  info: '#29b6f6',
  gradient: {
    primary: ['#29b6f6', '#0288d1'],
    secondary: ['#26c6da', '#00acc1'],
    accent: ['#40c4ff', '#00b0ff'],
    teal: ['#1a2a3a', '#0d1520'],
    dark: ['#1a2a3a', '#0d1520']
  }
};

// Crear el contexto
const ThemeContext = createContext();

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar el tema guardado al iniciar
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        } else {
          // Si no hay tema guardado, usar el del dispositivo
          setIsDarkMode(deviceTheme === 'dark');
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [deviceTheme]);

  // Función para cambiar el tema
  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  // Obtener los colores del tema actual
  const themeColors = isDarkMode ? darkThemeColors : lightThemeColors;

  // Valor del contexto
  const value = {
    isDarkMode,
    toggleTheme,
    isLoading,
    themeColors
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
