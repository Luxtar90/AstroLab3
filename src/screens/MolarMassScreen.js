import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform, 
  StatusBar,
  Animated,
  Easing,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import globalStyles from '../styles/globalStyles';
import InputField from '../components/InputField';
import ResultDisplay from '../components/ResultDisplay';
import chemicalCalculations, { calculateMolarMass, parseFormula } from '../utils/chemicalCalculations';
import { useCalculation } from '../context/CalculationContext';
import { useTheme } from '../context/ThemeContext';
import CustomButton from '../components/CustomButton';
import LoadingSpinner from '../components/LoadingSpinner';
import FloatingActionButton from '../components/FloatingActionButton';
import AnimatedAlert from '../components/AnimatedAlert';
import ConfirmationModal from '../components/ConfirmationModal';

const MolarMassScreen = ({ navigation }) => {
  const [formula, setFormula] = useState('');
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [elements, setElements] = useState({});
  const [molarMassValue, setMolarMassValue] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertTitle, setAlertTitle] = useState('');
  const [showHomeConfirmation, setShowHomeConfirmation] = useState(false);
  
  // Referencias para animaciones
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  
  // Obtener funciones del contexto de cálculo y tema
  const { updateCalculationResults, calculationResults } = useCalculation();
  const { isDarkMode, themeColors } = useTheme();
  
  // Efectos de animación al cargar la pantalla
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
    
    // Cargar datos previos si existen
    if (calculationResults.formula) {
      setFormula(calculationResults.formula);
    }
  }, []);
  
  // Función para mostrar alertas animadas
  const showAnimatedAlert = (message, type = 'success', title = '') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertTitle(title);
    setShowAlert(true);
    
    // Ocultar automáticamente después de 2.5 segundos
    setTimeout(() => {
      setShowAlert(false);
    }, 2500);
  };

  const calculateMass = () => {
    if (!formula || formula.trim() === '') {
      setError('Por favor, ingresa una fórmula química');
      showAnimatedAlert('Por favor ingresa una fórmula química', 'error', 'Error de validación');
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      // Intentar analizar la fórmula
      const parsedFormula = parseFormula(formula);
      
      if (Object.keys(parsedFormula).length === 0) {
        throw new Error('No se pudo analizar la fórmula');
      }
      
      // Calcular la masa molar sumando las contribuciones de cada elemento
      let molarMass = 0;
      const elementDetails = [];
      
      for (const element in parsedFormula) {
        const quantity = parsedFormula[element];
        const atomicMass = chemicalCalculations.periodicTable[element];
        
        if (!atomicMass) {
          throw new Error(`Elemento desconocido: ${element}`);
        }
        
        const contribution = atomicMass * quantity;
        
        molarMass += contribution;
        
        elementDetails.push({
          element,
          quantity,
          atomicMass,
          contribution,
          percentage: 0 // Se calculará después
        });
      }
      
      // Calcular los porcentajes
      elementDetails.forEach(detail => {
        detail.percentage = (detail.contribution / molarMass * 100).toFixed(2);
      });
      
      // Actualizar el estado con los resultados
      setElements(parsedFormula);
      setMolarMassValue(molarMass);
      setResults(elementDetails);
      
      // Guardar el cálculo en el contexto
      updateCalculationResults('molarMass', {
        formula,
        molarMass,
        elementDetails,
        timestamp: new Date().toISOString()
      });
      
      // Mostrar los resultados con animación
      setShowResults(true);
      
      // Animar la aparición de los resultados
      Animated.timing(resultAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      // Desplazar hacia los resultados
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      // Mostrar alerta de éxito
      showAnimatedAlert(
        `La masa molar de ${formula} es ${molarMass.toFixed(4)} g/mol`,
        'success',
        '¡Cálculo Exitoso!'
      );
    } catch (err) {
      setError(`Error: ${err.message || 'No se pudo calcular la masa molar'}`);
      showAnimatedAlert(
        err.message || 'Verifica la fórmula e intenta de nuevo',
        'error',
        'Error en el Cálculo'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const handleContinueToCalculation = (screenName) => {
    if (!molarMassValue) {
      showAnimatedAlert('Por favor calcula la masa molar primero antes de continuar.', 'error', 'Valor no calculado');
      return;
    }
    
    navigation.navigate(screenName);
  };

  // Fórmulas comunes para cálculos rápidos
  const commonFormulas = [
    { name: 'Agua', formula: 'H2O' },
    { name: 'Dióxido de Carbono', formula: 'CO2' },
    { name: 'Glucosa', formula: 'C6H12O6' },
    { name: 'Cloruro de Sodio', formula: 'NaCl' },
    { name: 'Fórmula Promedio Bacterias', formula: 'CH1.8O0.5N0.2' },
    { name: 'Aerobacter aerogenes', formula: 'CH1.83O0.55N0.25' },
    { name: 'Escherichia coli', formula: 'CH1.77O0.49N0.24' },
    { name: 'Klebsiella aerogenes', formula: 'CH1.75O0.43N0.22' },
  ];

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

  const resetForm = () => {
    setFormula('');
    setError(null);
    setResults([]);
    setShowResults(false);
    setElements({});
    setMolarMassValue(null);
    
    // Animación de reinicio
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
    
    showAnimatedAlert('Formulario reiniciado', 'info', 'Nuevo cálculo');
    
    // Scroll al inicio
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const renderElementsBreakdown = () => {
    if (!showResults || Object.keys(elements).length === 0) return null;

    return (
      <Animated.View style={{
        backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        borderRadius: globalStyles.borderRadius.large,
        padding: globalStyles.spacing.large,
        marginTop: globalStyles.spacing.medium,
        marginBottom: globalStyles.spacing.large,
        ...globalStyles.shadow.glow,
        borderLeftWidth: 4,
        borderLeftColor: themeColors && themeColors.secondary,
        opacity: fadeAnim,
      }}>
        <Text style={{
          fontSize: globalStyles.fontSize.large,
          fontWeight: 'bold',
          color: themeColors && themeColors.secondary,
          marginBottom: globalStyles.spacing.medium,
          textAlign: 'center',
        }}>Desglose de Elementos</Text>
        
        {Object.entries(elements).map(([element, count]) => (
          <View key={element} style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: globalStyles.spacing.small,
            paddingBottom: globalStyles.spacing.xs,
            paddingHorizontal: globalStyles.spacing.small,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            borderRadius: globalStyles.borderRadius.small,
            padding: globalStyles.spacing.small,
          }}>
            <Text style={{
              fontSize: globalStyles.fontSize.medium,
              color: themeColors && themeColors.text,
              fontWeight: 'bold',
            }}>{element}</Text>
            <Text style={{
              fontSize: globalStyles.fontSize.medium,
              color: themeColors && themeColors.textLight,
            }}>× {count.toFixed(count % 1 === 0 ? 0 : 2)}</Text>
          </View>
        ))}
        
        <View style={{
          backgroundColor: (themeColors && themeColors.secondary) + '20',
          borderRadius: globalStyles.borderRadius.small,
          padding: globalStyles.spacing.small,
          marginTop: globalStyles.spacing.medium,
        }}>
          <Text style={{
            fontSize: globalStyles.fontSize.small,
            color: themeColors && themeColors.secondary,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            Masa Molar Total: {molarMassValue.toFixed(4)} g/mol
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
                Calculadora de Masa Molar
              </Text>
              
              <Text
                style={{
                  fontSize: globalStyles.fontSize.small,
                  color: isDarkMode ? '#FFFFFF' : (themeColors && themeColors.textLight),
                  textAlign: 'center',
                  marginBottom: globalStyles.spacing.large,
                }}
              >
                Calcula la masa molar de compuestos químicos
              </Text>
              <View style={{ marginBottom: globalStyles.spacing.medium }}>
                <InputField
                  label="Fórmula Química"
                  placeholder="Ej: H2O, NaCl, C6H12O6"
                  value={formula}
                  onChangeText={setFormula}
                  icon="science"
                  style={{ marginBottom: globalStyles.spacing.small }}
                />
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.small,
                    color: isDarkMode ? '#FFFFFF' : (themeColors && themeColors.textLight),
                    marginLeft: globalStyles.spacing.small,
                    fontStyle: 'italic',
                  }}
                >
                  Ingresa la fórmula química del compuesto
                </Text>
              </View>

              {/* Compuestos comunes */}
              <View style={{ 
                marginBottom: globalStyles.spacing.medium,
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.6)' : 'rgba(240, 240, 240, 0.7)',
                borderRadius: globalStyles.borderRadius.medium,
                padding: globalStyles.spacing.medium,
              }}>
                <Text style={{
                  fontSize: globalStyles.fontSize.medium,
                  fontWeight: 'bold',
                  color: themeColors && themeColors.secondary,
                  marginBottom: globalStyles.spacing.small,
                  textAlign: 'center',
                }}>
                  Compuestos Comunes
                </Text>
                
                <View style={{ 
                  flexDirection: 'row', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center',
                  marginTop: globalStyles.spacing.small,
                }}>
                  {[
                    { name: 'Agua', formula: 'H2O' },
                    { name: 'Glucosa', formula: 'C6H12O6' },
                    { name: 'Sal', formula: 'NaCl' },
                    { name: 'Ácido Acético', formula: 'CH3COOH' },
                    { name: 'Amoniaco', formula: 'NH3' },
                    { name: 'Metano', formula: 'CH4' },
                    { name: 'Etanol', formula: 'C2H5OH' },
                    { name: 'Dióxido de Carbono', formula: 'CO2' },
                  ].map((compound, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        paddingHorizontal: globalStyles.spacing.medium,
                        paddingVertical: globalStyles.spacing.small,
                        borderRadius: globalStyles.borderRadius.small,
                        margin: globalStyles.spacing.xs,
                        borderWidth: 1,
                        borderColor: themeColors && themeColors.secondary + '50',
                      }}
                      onPress={() => setFormula(compound.formula)}
                    >
                      <Text style={{ 
                        color: isDarkMode ? '#FFFFFF' : (themeColors && themeColors.text),
                        fontSize: globalStyles.fontSize.small,
                        fontWeight: 'bold',
                      }}>
                        {compound.formula}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {error ? (
                <Text
                  style={{
                    color: themeColors && themeColors.error,
                    marginVertical: globalStyles.spacing.medium,
                    textAlign: 'center',
                    fontSize: globalStyles.fontSize.medium,
                  }}
                >
                  {error}
                </Text>
              ) : null}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: globalStyles.spacing.large }}>
                <CustomButton
                  title="Calcular"
                  onPress={calculateMass}
                  icon="calculate"
                  loading={isCalculating}
                  style={{ 
                    flex: 1,
                    marginRight: globalStyles.spacing.small,
                    ...globalStyles.labStyles.neonBorder
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
                      color: themeColors && themeColors.accent,
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
                        color: themeColors && themeColors.primary,
                        marginBottom: globalStyles.spacing.small,
                        textAlign: 'center',
                      }}
                    >
                      Masa Molar de {formula}:
                    </Text>
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.xlarge,
                        fontWeight: 'bold',
                        color: themeColors && themeColors.primary,
                        textAlign: 'center',
                      }}
                    >
                      {molarMassValue.toFixed(4)} g/mol
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
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.medium,
                        fontWeight: 'bold',
                        color: themeColors && themeColors.secondary,
                        marginBottom: globalStyles.spacing.medium,
                        textAlign: 'center',
                      }}
                    >
                      Usar este resultado en:
                    </Text>
                    
                    <View style={{ 
                      flexDirection: 'row', 
                      flexWrap: 'wrap', 
                      justifyContent: 'space-between',
                      marginBottom: globalStyles.spacing.small,
                    }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: themeColors && themeColors.primary,
                          borderRadius: globalStyles.borderRadius.medium,
                          padding: globalStyles.spacing.medium,
                          width: '48%',
                          alignItems: 'center',
                          marginBottom: globalStyles.spacing.small,
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          // Guardar el resultado en el contexto
                          updateCalculationResults('molarMass', molarMassValue);
                          updateCalculationResults('formula', formula);
                          updateCalculationResults('elements', elements);
                          
                          // Navegar a la pantalla de Pureza
                          navigation.navigate('Purity');
                          
                          // Mostrar alerta
                          showAnimatedAlert(`Resultado guardado: ${formula} - ${molarMassValue.toFixed(4)} g/mol`, 'success', 'Ir a Pureza');
                        }}
                      >
                        <MaterialIcons name="science" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Pureza</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={{
                          backgroundColor: themeColors && themeColors.secondary,
                          borderRadius: globalStyles.borderRadius.medium,
                          padding: globalStyles.spacing.medium,
                          width: '48%',
                          alignItems: 'center',
                          marginBottom: globalStyles.spacing.small,
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          // Guardar el resultado en el contexto
                          updateCalculationResults('molarMass', molarMassValue);
                          updateCalculationResults('formula', formula);
                          updateCalculationResults('elements', elements);
                          
                          // Navegar a la pantalla de Concentración
                          navigation.navigate('Concentration');
                          
                          // Mostrar alerta
                          showAnimatedAlert(`Resultado guardado: ${formula} - ${molarMassValue.toFixed(4)} g/mol`, 'success', 'Ir a Concentración');
                        }}
                      >
                        <MaterialIcons name="opacity" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Concentración</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View style={{ 
                      flexDirection: 'row', 
                      flexWrap: 'wrap', 
                      justifyContent: 'space-between' 
                    }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: themeColors && themeColors.accent,
                          borderRadius: globalStyles.borderRadius.medium,
                          padding: globalStyles.spacing.medium,
                          width: '48%',
                          alignItems: 'center',
                          marginBottom: globalStyles.spacing.small,
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          // Guardar el resultado en el contexto
                          updateCalculationResults('molarMass', molarMassValue);
                          updateCalculationResults('formula', formula);
                          updateCalculationResults('elements', elements);
                          
                          // Navegar a la pantalla de Dilución
                          navigation.navigate('Dilution');
                          
                          // Mostrar alerta
                          showAnimatedAlert(`Resultado guardado: ${formula} - ${molarMassValue.toFixed(4)} g/mol`, 'success', 'Ir a Dilución');
                        }}
                      >
                        <MaterialIcons name="water-drop" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Dilución</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={{
                          backgroundColor: isDarkMode ? 'rgba(100, 100, 100, 0.5)' : 'rgba(200, 200, 200, 0.8)',
                          borderRadius: globalStyles.borderRadius.medium,
                          padding: globalStyles.spacing.medium,
                          width: '48%',
                          alignItems: 'center',
                          marginBottom: globalStyles.spacing.small,
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          // Solo guardar el resultado en el contexto
                          updateCalculationResults('molarMass', molarMassValue);
                          updateCalculationResults('formula', formula);
                          updateCalculationResults('elements', elements);
                          
                          // Mostrar alerta
                          showAnimatedAlert(`Resultado guardado: ${formula} - ${molarMassValue.toFixed(4)} g/mol`, 'success', 'Guardado');
                        }}
                      >
                        <MaterialIcons name="save" size={20} color={isDarkMode ? '#fff' : '#333'} style={{ marginRight: 8 }} />
                        <Text style={{ color: isDarkMode ? '#fff' : '#333', fontWeight: 'bold' }}>Solo Guardar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {/* Sección de composición elemental */}
                  <View
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                      borderRadius: globalStyles.borderRadius.large,
                      padding: globalStyles.spacing.large,
                      marginBottom: globalStyles.spacing.medium,
                      ...globalStyles.shadow.medium,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.medium,
                        fontWeight: 'bold',
                        color: themeColors && themeColors.secondary,
                        marginBottom: globalStyles.spacing.small,
                        textAlign: 'center',
                      }}
                    >
                      Composición Elemental
                    </Text>
                    
                    {Object.entries(elements).map(([element, count]) => (
                      <View 
                        key={element}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingVertical: globalStyles.spacing.small,
                          borderBottomWidth: Object.keys(elements).length > 1 ? 1 : 0,
                          borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              backgroundColor: isDarkMode ? themeColors.primary + '30' : themeColors.primary + '15',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginRight: globalStyles.spacing.small,
                              borderWidth: 1,
                              borderColor: isDarkMode ? themeColors.primary + '70' : themeColors.primary + '50',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: globalStyles.fontSize.medium,
                                fontWeight: 'bold',
                                color: isDarkMode ? themeColors.primary : themeColors.primary,
                              }}
                            >
                              {element}
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontSize: globalStyles.fontSize.medium,
                              color: themeColors && themeColors.text,
                            }}
                          >
                            {element}
                          </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text
                            style={{
                              fontSize: globalStyles.fontSize.medium,
                              fontWeight: 'bold',
                              color: themeColors && themeColors.text,
                            }}
                          >
                            {count} {count > 1 ? 'átomos' : 'átomo'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  
                  {/* Nota informativa */}
                  <View
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                      borderRadius: globalStyles.borderRadius.large,
                      padding: globalStyles.spacing.medium,
                      ...globalStyles.shadow.small,
                      borderLeftWidth: 2,
                      borderLeftColor: themeColors && themeColors.primary,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.small,
                        color: themeColors && themeColors.primary,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    >
                      La masa molar es la suma de las masas atómicas de todos los átomos en una molécula
                    </Text>
                  </View>
                </Animated.View>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default MolarMassScreen;
