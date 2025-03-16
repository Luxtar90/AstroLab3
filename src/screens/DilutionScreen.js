import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Animated, 
  Easing,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import CustomDropdown from '../components/CustomDropdown';
import { useTheme } from '../context/ThemeContext';
import { useCalculation } from '../context/CalculationContext';
import globalStyles from '../styles/globalStyles';
import FloatingActionButton from '../components/FloatingActionButton';
import AnimatedAlert from '../components/AnimatedAlert';
import ConfirmationModal from '../components/ConfirmationModal';

const DilutionScreen = ({ navigation }) => {
  // Estados para los valores de entrada
  const [initialConcentration, setInitialConcentration] = useState('');
  const [aliquotVolume, setAliquotVolume] = useState('');
  const [finalConcentration, setFinalConcentration] = useState('');
  const [finalVolume, setFinalVolume] = useState('');
  const [dilutionCount, setDilutionCount] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('mL');
  const [concentrationUnit, setConcentrationUnit] = useState('N');
  const [dilutionType, setDilutionType] = useState('simple');
  
  // Estados para los resultados y errores
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertTitle, setAlertTitle] = useState('');
  const [showHomeConfirmation, setShowHomeConfirmation] = useState(false);
  
  // Referencias y animaciones
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  
  // Obtener el tema actual y el contexto de cálculos
  const { isDarkMode, themeColors } = useTheme();
  const { calculationResults, updateCalculationResults } = useCalculation();
  
  // Estado para la masa molar y fórmula
  const [molarMass, setMolarMass] = useState(null);
  const [formula, setFormula] = useState('');
  
  // Efectos de animación al cargar la pantalla
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Efecto para verificar si hay datos de masa molar disponibles
  useEffect(() => {
    if (calculationResults && calculationResults.molarMass && calculationResults.formula) {
      // Actualizar el estado con los datos del contexto
      setMolarMass(calculationResults.molarMass);
      setFormula(calculationResults.formula);
      
      // Mostrar alerta informativa
      showAnimatedAlert(
        `Usando masa molar de ${calculationResults.formula}: ${calculationResults.molarMass.toFixed(4)} g/mol`,
        'info',
        'Datos disponibles'
      );
    }
  }, [calculationResults]);
  
  // Función para mostrar alertas animadas
  const showAnimatedAlert = (message, type = 'success', title = '') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertTitle(title);
    setShowAlert(true);
    
    // Ocultar la alerta después de 3 segundos
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  
  // Función para reiniciar el formulario
  const resetForm = () => {
    setInitialConcentration('');
    setAliquotVolume('');
    setFinalConcentration('');
    setFinalVolume('');
    setDilutionCount('');
    setResult('');
    setError('');
    setShowResults(false);
    
    // Animación al reiniciar
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    showAnimatedAlert('Formulario reiniciado', 'info', 'Nuevo cálculo');
    
    // Scroll al inicio
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
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
  
  // Función para validar números
  const validateNumber = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };
  
  // Función para calcular la dilución
  const calculateDilution = () => {
    setError('');
    
    if (dilutionType === 'simple') {
      // Validar que los valores ingresados sean números positivos
      if (!validateNumber(initialConcentration)) {
        setError('La concentración inicial debe ser un número positivo');
        showAnimatedAlert('La concentración inicial debe ser un número positivo', 'error', 'Error de validación');
        return;
      }
      
      if (!validateNumber(finalConcentration)) {
        setError('La concentración deseada debe ser un número positivo');
        showAnimatedAlert('La concentración deseada debe ser un número positivo', 'error', 'Error de validación');
        return;
      }
      
      if (!validateNumber(finalVolume)) {
        setError('El volumen final debe ser un número positivo');
        showAnimatedAlert('El volumen final debe ser un número positivo', 'error', 'Error de validación');
        return;
      }
      
      try {
        // Calcular el volumen inicial necesario
        const c1 = parseFloat(initialConcentration);
        const c2 = parseFloat(finalConcentration);
        const v2 = parseFloat(finalVolume);
        
        const v1 = (c2 * v2) / c1;
        
        setResult(`Volumen inicial necesario: ${v1.toFixed(2)} ${volumeUnit}\nVolumen de diluyente: ${(v2 - v1).toFixed(2)} ${volumeUnit}`);
        setShowResults(true);
        showAnimatedAlert('Cálculo completado con éxito', 'success', 'Resultado');
        
        // Hacer scroll a los resultados
        if (scrollViewRef.current) {
          setTimeout(() => {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }, 100);
        }
      } catch (error) {
        console.error('Error al calcular la dilución simple:', error);
        setError('Error al calcular la dilución');
        showAnimatedAlert('Error al calcular la dilución', 'error', 'Error de cálculo');
      }
    } else {
      // Dilución seriada
      if (!validateNumber(initialConcentration)) {
        setError('La concentración inicial debe ser un número positivo');
        showAnimatedAlert('La concentración inicial debe ser un número positivo', 'error', 'Error de validación');
        return;
      }
      
      if (!validateNumber(aliquotVolume)) {
        setError('El volumen de alícuota debe ser un número positivo');
        showAnimatedAlert('El volumen de alícuota debe ser un número positivo', 'error', 'Error de validación');
        return;
      }
      
      if (!validateNumber(finalVolume)) {
        setError('El volumen final debe ser un número positivo');
        showAnimatedAlert('El volumen final debe ser un número positivo', 'error', 'Error de validación');
        return;
      }
      
      if (!validateNumber(dilutionCount) || parseInt(dilutionCount) <= 0) {
        setError('El número de diluciones debe ser un número entero positivo');
        showAnimatedAlert('El número de diluciones debe ser un número entero positivo', 'error', 'Error de validación');
        return;
      }
      
      try {
        // Calcular dilución seriada
        const c1 = parseFloat(initialConcentration);
        const vAliquot = parseFloat(aliquotVolume);
        const vFinal = parseFloat(finalVolume);
        const n = parseInt(dilutionCount);
        
        // Factor de dilución por paso
        const dilutionFactor = vAliquot / vFinal;
        
        // Concentración final después de n diluciones
        const finalConc = c1 * Math.pow(dilutionFactor, n);
        
        // Preparar resultados
        let dilutionSteps = 'Pasos de dilución:\n';
        let currentConc = c1;
        
        for (let i = 1; i <= n; i++) {
          currentConc = currentConc * dilutionFactor;
          dilutionSteps += `Paso ${i}: ${currentConc.toFixed(4)} ${concentrationUnit}\n`;
        }
        
        setResult(`Concentración final: ${finalConc.toFixed(4)} ${concentrationUnit}\n\n${dilutionSteps}`);
        setShowResults(true);
        showAnimatedAlert('Cálculo completado con éxito', 'success', 'Resultado');
        
        // Hacer scroll a los resultados
        if (scrollViewRef.current) {
          setTimeout(() => {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }, 100);
        }
      } catch (error) {
        console.error('Error al calcular la dilución seriada:', error);
        setError('Error al calcular la dilución seriada');
        showAnimatedAlert('Error al calcular la dilución seriada', 'error', 'Error de cálculo');
      }
    }
  };
  
  // Función para manejar el cambio de tipo de dilución
  const handleDilutionTypeChange = (value) => {
    setDilutionType(value);
    resetForm();
  };
  
  // Renderizar la sección de resultados
  const renderResults = () => {
    if (!showResults) return null;
    
    return (
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
            {dilutionType === 'simple' ? 'Volumen Final:' : 'Dilución Seriada:'}
          </Text>
          <Text
            style={{
              fontSize: globalStyles.fontSize.xlarge,
              fontWeight: 'bold',
              color: themeColors.primary,
              textAlign: 'center',
            }}
          >
            {result}
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
          {/* Mostrar información de masa molar si está disponible */}
          {formula && molarMass && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: globalStyles.spacing.small,
                paddingBottom: globalStyles.spacing.small,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Text
                style={{
                  fontSize: globalStyles.fontSize.medium,
                  color: isDarkMode ? '#FFFFFF' : themeColors.text,
                }}
              >
                Compuesto:
              </Text>
              <Text
                style={{
                  fontSize: globalStyles.fontSize.medium,
                  fontWeight: 'bold',
                  color: isDarkMode ? '#FFFFFF' : themeColors.text,
                }}
              >
                {formula} ({molarMass ? molarMass.toFixed(4) : '0.0000'} g/mol)
              </Text>
            </View>
          )}
          
          {dilutionType === 'simple' ? (
            <>
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
                  Concentración Inicial:
                </Text>
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.medium,
                    fontWeight: 'bold',
                    color: isDarkMode ? '#FFFFFF' : themeColors.text,
                  }}
                >
                  {parseFloat(initialConcentration).toFixed(2)} {concentrationUnit}
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
                  Volumen de Alícuota:
                </Text>
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.medium,
                    fontWeight: 'bold',
                    color: isDarkMode ? '#FFFFFF' : themeColors.text,
                  }}
                >
                  {parseFloat(aliquotVolume).toFixed(2)} {volumeUnit}
                </Text>
              </View>
              
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
                  Concentración Final:
                </Text>
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.medium,
                    fontWeight: 'bold',
                    color: isDarkMode ? '#FFFFFF' : themeColors.text,
                  }}
                >
                  {parseFloat(finalConcentration).toFixed(2)} {concentrationUnit}
                </Text>
              </View>
            </>
          ) : (
            <>
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
                  Concentración Inicial:
                </Text>
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.medium,
                    fontWeight: 'bold',
                    color: isDarkMode ? '#FFFFFF' : themeColors.text,
                  }}
                >
                  {parseFloat(initialConcentration).toFixed(2)} {concentrationUnit}
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
                  Alícuota por Dilución:
                </Text>
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.medium,
                    fontWeight: 'bold',
                    color: isDarkMode ? '#FFFFFF' : themeColors.text,
                  }}
                >
                  {parseFloat(aliquotVolume).toFixed(2)} {volumeUnit}
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
                  Volumen Final por Dilución:
                </Text>
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.medium,
                    fontWeight: 'bold',
                    color: isDarkMode ? '#FFFFFF' : themeColors.text,
                  }}
                >
                  {parseFloat(finalVolume).toFixed(2)} {volumeUnit}
                </Text>
              </View>
              
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
                  Número de Diluciones:
                </Text>
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.medium,
                    fontWeight: 'bold',
                    color: isDarkMode ? '#FFFFFF' : themeColors.text,
                  }}
                >
                  {dilutionCount}
                </Text>
              </View>
            </>
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
              color: isDarkMode ? '#FFFFFF' : themeColors.text,
              marginBottom: globalStyles.spacing.small,
            }}
          >
            Nota: Los resultados se basan en la fórmula C₁V₁ = C₂V₂ para diluciones simples y en la fórmula de dilución seriada para diluciones seriadas.
          </Text>
        </View>
      </Animated.View>
    );
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
                outputRange: [50, 0],
              })}],
            }}
          >
            {/* Tarjeta principal de entrada */}
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
                Calculadora de Dilución
              </Text>
              
              <Text
                style={{
                  fontSize: globalStyles.fontSize.small,
                  color: isDarkMode ? '#FFFFFF' : themeColors.textLight,
                  textAlign: 'center',
                  marginBottom: globalStyles.spacing.large,
                }}
              >
                Calcula diluciones simples usando la fórmula C₁V₁ = C₂V₂
              </Text>
              
              <CustomDropdown
                placeholder="Selecciona el tipo de dilución"
                options={[
                  { label: 'Dilución Simple', value: 'simple' },
                  { label: 'Dilución Seriada', value: 'serial' }
                ]}
                value={dilutionType}
                onValueChange={handleDilutionTypeChange}
              />
              
              {dilutionType === 'simple' ? (
                <>
                  <View style={{ marginTop: globalStyles.spacing.medium }}>
                    <Text style={{
                      fontSize: globalStyles.fontSize.medium,
                      color: isDarkMode ? '#FFFFFF' : '#AAAAAA',
                      marginBottom: globalStyles.spacing.small,
                    }}>
                      Concentración Inicial
                    </Text>
                    <InputField
                      placeholder="Concentración inicial (N)"
                      value={initialConcentration}
                      onChangeText={setInitialConcentration}
                      keyboardType="numeric"
                      style={{ marginBottom: globalStyles.spacing.medium }}
                    />
                  </View>
                  
                  <View style={{ marginBottom: globalStyles.spacing.medium }}>
                    <Text style={{
                      fontSize: globalStyles.fontSize.medium,
                      color: isDarkMode ? '#FFFFFF' : '#AAAAAA',
                      marginBottom: globalStyles.spacing.small,
                    }}>
                      Concentración Deseada
                    </Text>
                    <InputField
                      placeholder="Concentración deseada (N)"
                      value={finalConcentration}
                      onChangeText={setFinalConcentration}
                      keyboardType="numeric"
                      style={{ marginBottom: globalStyles.spacing.medium }}
                    />
                  </View>
                  
                  <View style={{ marginBottom: globalStyles.spacing.medium }}>
                    <Text style={{
                      fontSize: globalStyles.fontSize.medium,
                      color: isDarkMode ? '#FFFFFF' : '#AAAAAA',
                      marginBottom: globalStyles.spacing.small,
                    }}>
                      Volumen Final
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flex: 1 }}>
                        <InputField
                          placeholder="Volumen final"
                          value={finalVolume}
                          onChangeText={setFinalVolume}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={{ marginLeft: globalStyles.spacing.small, width: 80 }}>
                        <CustomDropdown
                          placeholder="mL"
                          options={[
                            { label: 'mL', value: 'mL' },
                            { label: 'L', value: 'L' },
                            { label: 'µL', value: 'µL' }
                          ]}
                          value={volumeUnit}
                          onValueChange={(value) => setVolumeUnit(value)}
                          compact={true}
                        />
                      </View>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={{ marginTop: globalStyles.spacing.medium }}>
                    <Text style={{
                      fontSize: globalStyles.fontSize.medium,
                      color: isDarkMode ? '#FFFFFF' : '#AAAAAA',
                      marginBottom: globalStyles.spacing.small,
                    }}>
                      Concentración Inicial
                    </Text>
                    <InputField
                      placeholder="Concentración inicial (N)"
                      value={initialConcentration}
                      onChangeText={setInitialConcentration}
                      keyboardType="numeric"
                      style={{ marginBottom: globalStyles.spacing.medium }}
                    />
                  </View>
                  
                  <View style={{ marginBottom: globalStyles.spacing.medium }}>
                    <Text style={{
                      fontSize: globalStyles.fontSize.medium,
                      color: isDarkMode ? '#FFFFFF' : '#AAAAAA',
                      marginBottom: globalStyles.spacing.small,
                    }}>
                      Volumen de Alícuota
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flex: 1 }}>
                        <InputField
                          placeholder="Volumen de alícuota"
                          value={aliquotVolume}
                          onChangeText={setAliquotVolume}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={{ marginLeft: globalStyles.spacing.small, width: 80 }}>
                        <CustomDropdown
                          placeholder="mL"
                          options={[
                            { label: 'mL', value: 'mL' },
                            { label: 'L', value: 'L' },
                            { label: 'µL', value: 'µL' }
                          ]}
                          value={volumeUnit}
                          onValueChange={(value) => setVolumeUnit(value)}
                          compact={true}
                        />
                      </View>
                    </View>
                  </View>
                  
                  <View style={{ marginBottom: globalStyles.spacing.medium }}>
                    <Text style={{
                      fontSize: globalStyles.fontSize.medium,
                      color: isDarkMode ? '#FFFFFF' : '#AAAAAA',
                      marginBottom: globalStyles.spacing.small,
                    }}>
                      Volumen Final
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flex: 1 }}>
                        <InputField
                          placeholder="Volumen final"
                          value={finalVolume}
                          onChangeText={setFinalVolume}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={{ marginLeft: globalStyles.spacing.small, width: 80 }}>
                        <CustomDropdown
                          placeholder="mL"
                          options={[
                            { label: 'mL', value: 'mL' },
                            { label: 'L', value: 'L' },
                            { label: 'µL', value: 'µL' }
                          ]}
                          value={volumeUnit}
                          onValueChange={(value) => setVolumeUnit(value)}
                          compact={true}
                        />
                      </View>
                    </View>
                  </View>
                  
                  <View style={{ marginBottom: globalStyles.spacing.medium }}>
                    <Text style={{
                      fontSize: globalStyles.fontSize.medium,
                      color: isDarkMode ? '#FFFFFF' : '#AAAAAA',
                      marginBottom: globalStyles.spacing.small,
                    }}>
                      Número de diluciones
                    </Text>
                    <InputField
                      placeholder="Número de diluciones seriadas"
                      value={dilutionCount}
                      onChangeText={setDilutionCount}
                      keyboardType="numeric"
                      style={{ marginBottom: globalStyles.spacing.medium }}
                    />
                  </View>
                </>
              )}
              
              <CustomButton
                title="Calcular Dilución"
                onPress={calculateDilution}
                style={{ marginTop: globalStyles.spacing.medium }}
              />
              
              {error ? (
                <Text
                  style={{
                    color: themeColors.error,
                    marginTop: globalStyles.spacing.medium,
                    textAlign: 'center',
                  }}
                >
                  {error}
                </Text>
              ) : null}
              
              {renderResults()}
            </View>
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

export default DilutionScreen;
