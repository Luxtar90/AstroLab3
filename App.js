import React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import MolarMassScreen from './src/screens/MolarMassScreen';
import ConcentrationScreen from './src/screens/ConcentrationScreen';
import PurityScreen from './src/screens/PurityScreen';
import DilutionScreen from './src/screens/DilutionScreen';
import TimerScreen from './src/screens/TimerScreen';
import CellCounterScreen from './src/screens/CellCounterScreen';

// Import styles
import globalStyles from './src/styles/globalStyles';

// Import providers
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { CalculationProvider } from './src/context/CalculationContext';
import { TimerProvider } from './src/context/TimerContext';

// Create stack navigator
const Stack = createNativeStackNavigator();

// Main app content
const AppContent = () => {
  const { isDarkMode } = useTheme();
  
  // Crear tema de navegación personalizado
  const navigationTheme = {
    ...(isDarkMode ? NavigationDarkTheme : NavigationDefaultTheme),
    colors: {
      ...(isDarkMode ? NavigationDarkTheme.colors : NavigationDefaultTheme.colors),
      primary: isDarkMode ? globalStyles.darkColors.primary : globalStyles.lightColors.primary,
      background: isDarkMode ? globalStyles.darkColors.background : globalStyles.lightColors.background,
      card: isDarkMode ? globalStyles.darkColors.card : globalStyles.lightColors.card,
      text: isDarkMode ? globalStyles.darkColors.text : globalStyles.lightColors.text,
      border: isDarkMode ? globalStyles.darkColors.border : globalStyles.lightColors.border,
      notification: isDarkMode ? globalStyles.darkColors.error : globalStyles.lightColors.error,
    }
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle={isDarkMode ? "light-content" : "dark-content"} 
          backgroundColor={isDarkMode ? globalStyles.darkColors.primary : globalStyles.lightColors.primary} 
        />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: isDarkMode ? globalStyles.darkColors.primary : globalStyles.lightColors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: isDarkMode ? globalStyles.darkColors.background : globalStyles.lightColors.background,
            },
            animation: 'slide_from_right',
            headerShown: false,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
          />
          <Stack.Screen 
            name="MolarMass" 
            component={MolarMassScreen} 
            options={{ title: 'Cálculo de Masa Molar' }} 
          />
          <Stack.Screen 
            name="Concentration" 
            component={ConcentrationScreen} 
            options={{ title: 'Cálculo de Concentración' }} 
          />
          <Stack.Screen 
            name="Purity" 
            component={PurityScreen} 
            options={{ title: 'Cálculo de Pureza' }} 
          />
          <Stack.Screen 
            name="Dilution" 
            component={DilutionScreen} 
            options={{ title: 'Cálculo de Dilución' }} 
          />
          <Stack.Screen 
            name="Timer" 
            component={TimerScreen} 
            options={{ title: 'Timer y Contador de Moléculas' }} 
          />
          <Stack.Screen 
            name="CellCounter" 
            component={CellCounterScreen} 
            options={{ title: 'Contador de Células' }} 
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

// App principal
export default function App() {
  return (
    <ThemeProvider>
      <CalculationProvider>
        <TimerProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <AppContent />
          </SafeAreaView>
        </TimerProvider>
      </CalculationProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
