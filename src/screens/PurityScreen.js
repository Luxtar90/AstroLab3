import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import FloatingActionButton from '../components/FloatingActionButton';
import AnimatedAlert from '../components/AnimatedAlert';
import ConfirmationModal from '../components/ConfirmationModal';
import { useTheme } from '../context/ThemeContext';
import { useCalculation } from '../context/CalculationContext';
import globalStyles from '../styles/globalStyles';

const PurityScreen = ({ navigation }) => {
  // Estados para los valores de entrada
  const [compound, setCompound] = useState('');
  const [impureMass, setImpureMass] = useState('');
  const [pureMass, setPureMass] = useState('');
  
  // Estados para los resultados y errores
  const [purityPercentage, setPurityPercentage] = useState(0);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertTitle, setAlertTitle] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showMolarMassInfo, setShowMolarMassInfo] = useState(false);
  const [showHomeConfirmation, setShowHomeConfirmation] = useState(false);
  
  // Referencias y animaciones
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  // Obtener el tema actual y los resultados de cálculo
  const { themeColors, isDarkMode } = useTheme();
  const { calculationResults } = useCalculation();
  
  // Efecto para animar la entrada del componente
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Verificar si hay resultados de masa molar disponibles
    if (calculationResults && calculationResults.molarMass && calculationResults.formula) {
      setCompound(calculationResults.formula);
      setShowMolarMassInfo(true);
      showAnimatedAlert(`Se ha cargado la fórmula ${calculationResults.formula} con masa molar ${calculationResults.molarMass ? calculationResults.molarMass.toFixed(2) : '0.00'} g/mol`, 'info', 'Datos de Masa Molar');
    }
  }, [fadeAnim, scaleAnim, slideAnim, calculationResults]);
  
  // Función para mostrar una alerta animada
  const showAnimatedAlert = (message, type = 'success', title = '') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertTitle(title);
    setShowAlert(true);
    
    // Ocultar la alerta después de un tiempo
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  
  // Función para reiniciar el formulario
  const resetForm = () => {
    setCompound('');
    setImpureMass('');
    setPureMass('');
    setPurityPercentage(0);
    setError('');
    setShowResults(false);
    
    // Animar el formulario
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Mostrar alerta de reinicio
    showAnimatedAlert('Formulario reiniciado', 'info', 'Reinicio');
  };
  
  // Función para validar que un valor sea un número positivo
  const validateNumber = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };
  
  // Función para confirmar el regreso al Home
  const confirmNavigateToHome = () => {
    setShowHomeConfirmation(true);
  };

  const handleConfirmHome = () => {
    setShowHomeConfirmation(false);
    navigation.navigate('Home');
  };

  const handleCancelHome = () => {
    setShowHomeConfirmation(false);
  };
  
  // Función para calcular la pureza
  const calculatePurity = () => {
    setError('');
    setIsCalculating(true);
    
    // Validar que los valores ingresados sean números positivos
    if (!validateNumber(impureMass)) {
      setError('La concentración deseada debe ser un número positivo');
      showAnimatedAlert('La concentración deseada debe ser un número positivo', 'error', 'Error de validación');
      setIsCalculating(false);
      return;
    }
    
    if (!validateNumber(pureMass)) {
      setError('El volumen deseado debe ser un número positivo');
      showAnimatedAlert('El volumen deseado debe ser un número positivo', 'error', 'Error de validación');
      setIsCalculating(false);
      return;
    }

    if (!validateNumber(compound)) {
      setError('La pureza del reactivo debe ser un número positivo');
      showAnimatedAlert('La pureza del reactivo debe ser un número positivo', 'error', 'Error de validación');
      setIsCalculating(false);
      return;
    }
    
    try {
      // Calcular la pureza (en este caso, estamos usando los campos para otros propósitos)
      const concentracionDeseada = parseFloat(impureMass);
      const volumenDeseado = parseFloat(pureMass);
      const purezaReactivo = parseFloat(compound);
      
      // Si tenemos datos de masa molar, los usamos en el cálculo
      let mensaje = '';
      if (calculationResults && calculationResults.molarMass && calculationResults.formula) {
        const masaMolar = calculationResults.molarMass;
        const formula = calculationResults.formula;
        
        // Calculamos la masa necesaria considerando la pureza
        const masaRequerida = (concentracionDeseada * volumenDeseado * masaMolar) / (purezaReactivo * 100);
        
        setPurityPercentage(masaRequerida);
        mensaje = `Para preparar ${volumenDeseado} mL de una solución de ${concentracionDeseada}% de ${formula} (MM: ${masaMolar ? masaMolar.toFixed(2) : '0.00'} g/mol) con una pureza de ${purezaReactivo}%, se necesitan ${masaRequerida.toFixed(4)} g del reactivo.`;
      } else {
        // Cálculo básico sin masa molar
        const masaRequerida = (concentracionDeseada * volumenDeseado) / purezaReactivo;
        setPurityPercentage(masaRequerida);
        mensaje = `Para preparar ${volumenDeseado} mL de una solución de ${concentracionDeseada}% con una pureza de ${purezaReactivo}%, se necesitan ${masaRequerida.toFixed(4)} g del reactivo.`;
      }
      
      setShowResults(true);
      showAnimatedAlert(mensaje, 'success', 'Resultado');
      
      // Animar la aparición de los resultados
      Animated.timing(resultAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      // Hacer scroll hacia abajo para mostrar el resultado
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error al calcular la pureza:', error);
      setError('Error al calcular la pureza');
      showAnimatedAlert('Error al calcular la pureza', 'error', 'Error de cálculo');
    } finally {
      setIsCalculating(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <LinearGradient
        colors={isDarkMode ? ['#1a2a3a', '#0d1520'] : ['#e0f7fa', '#b2ebf2']}
        style={{ flex: 1 }}
      >
        {/* Botón flotante para volver atrás */}
        <FloatingActionButton
          icon="arrow-back"
          onPress={() => navigation.goBack()}
          position="topLeft"
          size="medium"
          style={{
            backgroundColor: themeColors && themeColors.primary,
            margin: globalStyles.spacing.medium,
            ...globalStyles.shadow.medium,
            zIndex: 10, // Asegurar que esté por encima de otros elementos
          }}
        />
        
        {/* Botón flotante para ir a home */}
        <FloatingActionButton
          icon="home"
          onPress={confirmNavigateToHome}
          position="bottomRight"
          size="large"
          style={{
            backgroundColor: themeColors && themeColors.accent,
            margin: globalStyles.spacing.medium,
            ...globalStyles.shadow.glow,
            zIndex: 10, // Asegurar que esté por encima de otros elementos
          }}
        />
        
        {/* Modal de confirmación para volver al inicio */}
        <ConfirmationModal
          visible={showHomeConfirmation}
          title="Volver al inicio"
          message="¿Estás seguro que deseas volver a la pantalla principal? Se perderán todos los datos ingresados."
          onCancel={handleCancelHome}
          onConfirm={handleConfirmHome}
          icon="home"
        />
        
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ 
            flexGrow: 1,
            padding: globalStyles.spacing.medium,
            paddingTop: globalStyles.spacing.large + 40, // Espacio extra para el botón flotante
            paddingBottom: globalStyles.spacing.large + 40, // Espacio extra para el botón flotante
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })}],
            }}
          >
            {/* Tarjeta principal */}
            <View
              style={{
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                borderRadius: globalStyles.borderRadius.large,
                padding: globalStyles.spacing.large,
                marginBottom: globalStyles.spacing.large,
                ...globalStyles.shadow.medium,
              }}
            >
              <Text
                style={{
                  fontSize: globalStyles.fontSize.xlarge,
                  fontWeight: 'bold',
                  color: themeColors.primary,
                  textAlign: 'center',
                  marginBottom: globalStyles.spacing.medium,
                }}
              >
                Calculadora de Pureza
              </Text>
              
              <Text
                style={{
                  fontSize: globalStyles.fontSize.small,
                  color: isDarkMode ? '#FFFFFF' : themeColors.textLight,
                  textAlign: 'center',
                  marginBottom: globalStyles.spacing.large,
                }}
              >
                Calcula la cantidad necesaria según la pureza del reactivo
              </Text>
              
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  color: isDarkMode ? '#FFFFFF' : '#aaa',
                  marginBottom: 8,
                }}>
                  Concentración deseada (%)
                </Text>
                <InputField
                  placeholder="Ej: 2"
                  value={impureMass}
                  onChangeText={setImpureMass}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.8)' : 'rgba(240, 240, 240, 0.8)',
                    borderRadius: 8,
                    color: isDarkMode ? '#fff' : '#000',
                  }}
                  placeholderTextColor={isDarkMode ? "#777" : "#999"}
                />
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  color: isDarkMode ? '#FFFFFF' : '#aaa',
                  marginBottom: 8,
                }}>
                  Volumen deseado
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <InputField
                    placeholder="Ej: 100"
                    value={pureMass}
                    onChangeText={setPureMass}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.8)' : 'rgba(240, 240, 240, 0.8)',
                      borderRadius: 8,
                      color: isDarkMode ? '#fff' : '#000',
                      flex: 1,
                      marginRight: 10,
                    }}
                    placeholderTextColor={isDarkMode ? "#777" : "#999"}
                  />
                  <Text style={{ color: isDarkMode ? '#FFFFFF' : '#aaa', fontSize: 18 }}>mL</Text>
                </View>
              </View>

              <View style={{ marginBottom: 30 }}>
                <Text style={{
                  fontSize: 16,
                  color: isDarkMode ? '#FFFFFF' : '#aaa',
                  marginBottom: 8,
                }}>
                  Pureza del reactivo (%)
                </Text>
                <InputField
                  placeholder="Ej: 90"
                  value={compound}
                  onChangeText={setCompound}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.8)' : 'rgba(240, 240, 240, 0.8)',
                    borderRadius: 8,
                    color: isDarkMode ? '#fff' : '#000',
                  }}
                  placeholderTextColor={isDarkMode ? "#777" : "#999"}
                />
                {showMolarMassInfo && (
                  <TouchableOpacity
                    onPress={() => {
                      if (calculationResults && calculationResults.molarMass && calculationResults.formula) {
                        showAnimatedAlert(`Usando fórmula ${calculationResults.formula} con masa molar ${calculationResults.molarMass ? calculationResults.molarMass.toFixed(2) : '0.00'} g/mol para los cálculos`, 'info', 'Información');
                      } else {
                        showAnimatedAlert('No hay datos de masa molar disponibles. Ve a la calculadora de masa molar primero.', 'warning', 'Sin Datos');
                      }
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}
                  >
                    <MaterialIcons name="info-outline" size={16} color="#4a90e2" />
                    <Text style={{
                      fontSize: 14,
                      color: isDarkMode ? '#FFFFFF' : '#4a90e2',
                      marginLeft: 5,
                    }}>
                      {calculationResults && calculationResults.formula && calculationResults.molarMass ? 
                        `Usando ${calculationResults.formula} (${calculationResults.molarMass ? calculationResults.molarMass.toFixed(2) : '0.00'} g/mol)` : 
                        'Sin datos de masa molar'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <CustomButton
                title="Calcular Pureza"
                onPress={calculatePurity}
                loading={isCalculating}
                style={{
                  backgroundColor: '#4a90e2',
                  borderRadius: 8,
                  paddingVertical: 15,
                }}
                textStyle={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              />
            </View>

            {showResults && (
              <Animated.View 
                style={{
                  opacity: resultAnim,
                  transform: [{ translateY: resultAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })}],
                  marginTop: globalStyles.spacing.medium,
                  marginBottom: globalStyles.spacing.xxl,
                }}
              >
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.large,
                    fontWeight: 'bold',
                    color: themeColors.accent,
                    textAlign: 'center',
                    marginBottom: globalStyles.spacing.medium,
                  }}
                >
                  Resultados
                </Text>
                
                {/* Resultado principal */}
                <View
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    borderRadius: globalStyles.borderRadius.large,
                    padding: globalStyles.spacing.large,
                    marginBottom: globalStyles.spacing.medium,
                    ...globalStyles.shadow.medium,
                    borderLeftWidth: 4,
                    borderLeftColor: themeColors.accent,
                  }}
                >
                  <Text
                    style={{
                      fontSize: globalStyles.fontSize.medium,
                      fontWeight: 'bold',
                      color: themeColors.primary,
                      marginBottom: globalStyles.spacing.small,
                      textAlign: 'center',
                    }}
                  >
                    {calculationResults && calculationResults.formula ? `Masa de ${calculationResults.formula} necesaria:` : 'Masa necesaria:'}
                  </Text>
                  <Text
                    style={{
                      fontSize: globalStyles.fontSize.xlarge,
                      fontWeight: 'bold',
                      color: themeColors.primary,
                      textAlign: 'center',
                    }}
                  >
                    {purityPercentage.toFixed(4)} g
                  </Text>
                </View>
                
                {/* Sección de acciones */}
                <View
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                    borderRadius: globalStyles.borderRadius.large,
                    padding: globalStyles.spacing.large,
                    marginBottom: globalStyles.spacing.medium,
                    ...globalStyles.shadow.medium,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: globalStyles.spacing.small,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.medium,
                        color: isDarkMode ? '#FFFFFF' : themeColors.text,
                      }}
                    >
                      Concentración deseada (%):
                    </Text>
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.medium,
                        fontWeight: 'bold',
                        color: isDarkMode ? '#FFFFFF' : themeColors.text,
                      }}
                    >
                      {parseFloat(impureMass).toFixed(2)}%
                    </Text>
                  </View>
                  
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: globalStyles.spacing.small,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.medium,
                        color: isDarkMode ? '#FFFFFF' : themeColors.text,
                      }}
                    >
                      Volumen deseado:
                    </Text>
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.medium,
                        fontWeight: 'bold',
                        color: isDarkMode ? '#FFFFFF' : themeColors.text,
                      }}
                    >
                      {parseFloat(pureMass).toFixed(2)} mL
                    </Text>
                  </View>
                  
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: calculationResults && calculationResults.molarMass ? globalStyles.spacing.small : 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.medium,
                        color: isDarkMode ? '#FFFFFF' : themeColors.text,
                      }}
                    >
                      Pureza del reactivo (%):
                    </Text>
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.medium,
                        fontWeight: 'bold',
                        color: isDarkMode ? '#FFFFFF' : themeColors.text,
                      }}
                    >
                      {parseFloat(compound).toFixed(2)}%
                    </Text>
                  </View>

                  {calculationResults && calculationResults.molarMass && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: globalStyles.fontSize.medium,
                          color: isDarkMode ? '#FFFFFF' : themeColors.text,
                        }}
                      >
                        Masa molar ({calculationResults.formula}):
                      </Text>
                      <Text
                        style={{
                          fontSize: globalStyles.fontSize.medium,
                          fontWeight: 'bold',
                          color: isDarkMode ? '#FFFFFF' : themeColors.text,
                        }}
                      >
                        {calculationResults.molarMass ? calculationResults.molarMass.toFixed(2) : '0.00'} g/mol
                      </Text>
                    </View>
                  )}
                </View>
                
                {/* Nota informativa */}
                <View
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                    borderRadius: globalStyles.borderRadius.large,
                    padding: globalStyles.spacing.medium,
                    ...globalStyles.shadow.small,
                    borderLeftWidth: 2,
                    borderLeftColor: themeColors.primary,
                  }}
                >
                  <Text
                    style={{
                      fontSize: globalStyles.fontSize.small,
                      color: isDarkMode ? '#FFFFFF' : themeColors.primary,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    {calculationResults && calculationResults.molarMass 
                      ? `Fórmula: Masa (g) = (Conc. (%) × Vol. (mL) × MM (g/mol)) / (Pureza (%) × 100)`
                      : `Fórmula: Masa (g) = (Conc. (%) × Vol. (mL)) / Pureza (%)`}
                  </Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>
        
        {/* Alerta animada */}
        {showAlert && (
          <AnimatedAlert
            visible={showAlert}
            title={alertTitle}
            message={alertMessage}
            type={alertType}
            onClose={() => setShowAlert(false)}
            duration={2500}
          />
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default PurityScreen;
