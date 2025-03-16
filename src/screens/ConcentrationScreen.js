import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from '../styles/globalStyles';
import InputField from '../components/InputField';
import CustomDropdown from '../components/CustomDropdown';
import ResultDisplay from '../components/ResultDisplay';
import { calculateMolarMass, determineEquivalents } from '../utils/chemicalCalculations';
import { useCalculation } from '../context/CalculationContext';
import { useTheme } from '../context/ThemeContext';
import CustomButton from '../components/CustomButton';
import FloatingActionButton from '../components/FloatingActionButton';
import AnimatedAlert from '../components/AnimatedAlert';
import ConfirmationModal from '../components/ConfirmationModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ConcentrationScreen = ({ navigation }) => {
  const [formula, setFormula] = useState('');
  const [mass, setMass] = useState('');
  const [volume, setVolume] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('mL');
  const [concentrationType, setConcentrationType] = useState('molar');
  const [density, setDensity] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState('');
  const [formulaText, setFormulaText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [molarMassValue, setMolarMassValue] = useState(null);
  const [equivalents, setEquivalents] = useState('1');
  const [normalityType, setNormalityType] = useState('acid_base');
  const [equivalentWeight, setEquivalentWeight] = useState('');
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [equivalentExplanation, setEquivalentExplanation] = useState('');
  const [concentration, setConcentration] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertTitle, setAlertTitle] = useState('');
  const [showHomeConfirmation, setShowHomeConfirmation] = useState(false);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  
  // Referencia al ScrollView
  const scrollViewRef = useRef(null);
  
  // Contexto de tema y cálculos
  const { isDarkMode, themeColors } = useTheme();
  const { calculationResults, updateCalculationResults } = useCalculation();
  
  // Efecto para verificar si hay datos de masa molar disponibles
  useEffect(() => {
    if (calculationResults && calculationResults.molarMass && calculationResults.formula) {
      // Actualizar el estado con los datos del contexto
      setMolarMassValue(calculationResults.molarMass);
      setFormula(calculationResults.formula);
      
      // Mostrar alerta informativa
      showAnimatedAlert(
        `Usando masa molar de ${calculationResults.formula}: ${calculationResults.molarMass ? calculationResults.molarMass.toFixed(4) : '0.0000'} g/mol`,
        'info',
        'Datos disponibles'
      );
    }
  }, [calculationResults]);
  
  // Cargar datos previos si existen
  useEffect(() => {
    if (calculationResults && calculationResults.formula) {
      setFormula(calculationResults.formula);
      
      // Si hay fórmula, intentar determinar equivalentes
      if (normalityType !== 'mass_eq') {
        try {
          const { equivalents: eq, explanation } = determineEquivalents(
            calculationResults.formula, 
            normalityType === 'molar_acid' ? 'acid' : 
            normalityType === 'molar_base' ? 'base' : 'acid'
          );
          setEquivalents(eq.toString());
          setEquivalentExplanation(explanation);
        } catch (e) {
          // Si hay error, mantener el valor por defecto
        }
      }
    }
    
    if (calculationResults && calculationResults.molarMass) {
      setMolarMassValue(calculationResults.molarMass);
    }
  }, []);

  // Actualizar equivalentes cuando cambia la fórmula o el tipo de normalidad
  useEffect(() => {
    if (formula && normalityType !== 'mass_eq') {
      try {
        const { equivalents: eq, explanation } = determineEquivalents(
          formula, 
          normalityType === 'molar_acid' ? 'acid' : 
          normalityType === 'molar_base' ? 'base' : 
          normalityType === 'redox' ? 'redox' : 'acid'
        );
        setEquivalents(eq.toString());
        setEquivalentExplanation(explanation);
      } catch (e) {
        // Si hay error, mantener el valor actual
      }
    }
  }, [formula, normalityType]);

  // Mostrar/ocultar campos según el tipo de concentración
  useEffect(() => {
    // Limpiar resultados al cambiar tipo
    setShowResults(false);
    setResult('');
    setFormulaText('');
  }, [concentrationType, normalityType]);

  // Efectos de animación
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
  }, []);

  // Función para validar números
  const validateNumber = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  // Función para convertir a litros
  const convertToLiters = (value, unit) => {
    switch (unit) {
      case 'L':
        return value;
      case 'mL':
        return value / 1000;
      case 'uL':
        return value / 1000000;
      default:
        return value / 1000; // Por defecto, asumimos mL
    }
  };

  // Función para mostrar errores
  const showError = (message) => {
    setError(message);
    setShowResults(false);
  };

  // Función para mostrar éxito
  const showSuccess = (title, message) => {
    setError(null);
    Alert.alert(title, message);
  };

  // Función para hacer scroll a los resultados
  const scrollToResults = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

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

  // Función para reiniciar el formulario
  const resetForm = () => {
    setMass('');
    setVolume('');
    setConcentration('');
    setResult('');
    setError(null);
    setShowResults(false);
    
    // Animación de reinicio
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
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

  const volumeUnitOptions = [
    { label: 'Litros (L)', value: 'L' },
    { label: 'Mililitros (mL)', value: 'mL' },
    { label: 'Microlitros (µL)', value: 'uL' },
  ];

  const concentrationTypeOptions = [
    { label: 'Molaridad (M) - mol/L', value: 'molar' },
    { label: 'Normalidad (N) - eq/L', value: 'normal' },
    { label: 'Porcentaje masa/volumen %(m/v)', value: 'porcentaje_mv' },
    { label: 'Porcentaje masa/masa %(m/m)', value: 'porcentaje_mm' },
  ];

  const normalityTypeOptions = [
    { label: 'Ácido-Base (general)', value: 'acid_base' },
    { label: 'Ácido (H+)', value: 'molar_acid' },
    { label: 'Base (OH-)', value: 'molar_base' },
    { label: 'Redox', value: 'redox' },
    { label: 'Peso Equivalente', value: 'mass_eq' },
  ];

  // Función para calcular la concentración
  const calculateConcentration = () => {
    setError('');
    setShowResults(false);
    
    try {
      let result = '';
      let formulaText = '';
      let massValue = parseFloat(mass);
      let volumeValue = parseFloat(volume);
      let molarMass = molarMassValue;
      
      // Validar entradas
      if (!validateNumber(mass)) {
        showError('La masa debe ser un número positivo');
        showAnimatedAlert('La masa debe ser un número positivo', 'error', 'Error de validación');
        return;
      }
      
      if (!validateNumber(volume)) {
        showError('El volumen debe ser un número positivo');
        showAnimatedAlert('El volumen debe ser un número positivo', 'error', 'Error de validación');
        return;
      }
      
      // Convertir volumen a litros
      const volumeInLiters = convertToLiters(volumeValue, volumeUnit);
      
      // Si no tenemos masa molar pero tenemos fórmula, calcularla
      if (!molarMass && formula) {
        molarMass = calculateMolarMass(formula);
        setMolarMassValue(molarMass);
      }
      
      // Si no tenemos masa molar y el tipo de concentración la requiere, mostrar error
      if (!molarMass && (concentrationType === 'molar' || concentrationType === 'normal')) {
        showError('Se requiere una fórmula química válida para calcular la concentración molar o normal');
        showAnimatedAlert('Se requiere una fórmula química válida para este cálculo', 'error', 'Error de cálculo');
        return;
      }
      
      // Calcular según el tipo de concentración
      switch (concentrationType) {
        case 'molar':
          // Concentración molar (mol/L)
          result = (massValue / molarMass) / volumeInLiters;
          formulaText = `Molaridad (M) = (Masa (g) / Masa Molar (g/mol)) / Volumen (L)`;
          setResult(`${result.toFixed(4)} M`);
          break;
          
        case 'normal':
          // Para normalidad, necesitamos el equivalente
          const eq = parseFloat(equivalents) || 1;
          result = ((massValue / molarMass) * eq) / volumeInLiters;
          formulaText = `Normalidad (N) = (Masa (g) / Masa Molar (g/mol) × Equivalentes) / Volumen (L)`;
          setResult(`${result.toFixed(4)} N`);
          break;
          
        case 'masaVolumen':
          // Concentración masa/volumen (g/L, mg/mL, etc.)
          result = massValue / volumeInLiters;
          formulaText = `Concentración (g/L) = Masa (g) / Volumen (L)`;
          setResult(`${result.toFixed(4)} g/L`);
          break;
          
        case 'porcentaje':
          // Concentración porcentual (% m/v)
          result = (massValue / volumeValue) * 100;
          formulaText = `Concentración (% m/v) = (Masa (g) / Volumen (mL)) × 100`;
          setResult(`${result.toFixed(4)} % m/v`);
          break;
          
        default:
          showError('Tipo de concentración no válido');
          return;
      }
      
      // Guardar resultado en el contexto
      updateCalculationResults('concentration', result);
      
      // Mostrar resultados
      setFormulaText(formulaText);
      setShowResults(true);
      
      // Mostrar alerta de éxito
      showAnimatedAlert('Cálculo completado con éxito', 'success', 'Resultado');
      
      // Animar la aparición de los resultados
      Animated.timing(resultAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      // Hacer scroll hacia abajo para mostrar el resultado
      scrollToResults();
    } catch (error) {
      console.error('Error al calcular la concentración:', error);
      showError('Error al calcular la concentración');
      showAnimatedAlert('Error al calcular la concentración', 'error', 'Error de cálculo');
    }
  };
  
  const calculateRequiredMass = () => {
    setError(null);
    
    // Validar datos de entrada
    if (!concentration || !volume) {
      setError('Por favor ingresa la concentración y el volumen');
      showAnimatedAlert('Por favor ingresa la concentración y el volumen', 'error', 'Error de validación');
      return;
    }
    
    if (!validateNumber(concentration) || !validateNumber(volume)) {
      setError('Los valores deben ser números positivos');
      showAnimatedAlert('Los valores deben ser números positivos', 'error', 'Error de validación');
      return;
    }
    
    if (parseFloat(volume) <= 0) {
      setError('El volumen debe ser un número positivo');
      showAnimatedAlert('El volumen debe ser un número positivo', 'error', 'Error de validación');
      return;
    }
    
    // Calcular masa requerida
    try {
      const concentrationValue = parseFloat(concentration);
      let volumeValue = parseFloat(volume);
      
      // Convertir volumen a litros si es necesario
      if (volumeUnit === 'mL') {
        volumeValue = volumeValue / 1000;
      }
      
      let requiredMass;
      let resultText = '';
      
      if (concentrationType === 'molar') {
        // Asegurarse de que tenemos la masa molar
        if (!molarMassValue) {
          setError('Por favor calcula primero la masa molar');
          showAnimatedAlert('Por favor calcula primero la masa molar', 'warning', 'Masa molar requerida');
          return;
        }
        
        // Calcular masa requerida para molaridad (mol/L)
        const moles = concentrationValue * volumeValue;
        requiredMass = moles * molarMassValue;
        resultText = `${requiredMass.toFixed(4)} g`;
      } else if (concentrationType === 'masaVolumen') {
        // Calcular masa requerida para concentración masa/volumen (g/L)
        requiredMass = concentrationValue * volumeValue;
        resultText = `${requiredMass.toFixed(4)} g`;
      } else if (concentrationType === 'porcentaje') {
        // Necesitamos la densidad para porcentaje masa
        if (!density) {
          setError('Por favor ingresa la densidad para calcular la masa requerida');
          showAnimatedAlert('Por favor ingresa la densidad', 'warning', 'Densidad requerida');
          return;
        }
        
        if (!validateNumber(density)) {
          setError('La densidad debe ser un número positivo');
          showAnimatedAlert('La densidad debe ser un número positivo', 'error', 'Error de validación');
          return;
        }
        
        const densityValue = parseFloat(density);
        // Calcular masa requerida para porcentaje masa (%)
        const solutionMass = volumeValue * densityValue * 1000; // en gramos
        requiredMass = (concentrationValue / 100) * solutionMass;
        resultText = `${requiredMass.toFixed(4)} g`;
      } else if (concentrationType === 'normal') {
        // Asegurarse de que tenemos la masa molar
        if (!molarMassValue) {
          setError('Por favor calcula primero la masa molar');
          showAnimatedAlert('Por favor calcula primero la masa molar', 'warning', 'Masa molar requerida');
          return;
        }
        
        // Calcular masa requerida para normalidad (eq/L)
        const equivalentsValue = parseFloat(equivalents);
        const moles = concentrationValue * volumeValue / equivalentsValue;
        requiredMass = moles * molarMassValue;
        resultText = `${requiredMass.toFixed(4)} g`;
      }
      
      setResult(resultText);
      setShowResults(true);
      showAnimatedAlert('Masa requerida calculada con éxito', 'success', 'Cálculo completado');
      
      // Hacer scroll a los resultados
      if (scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Error al calcular la masa requerida:', error);
      setError('Error al calcular la masa requerida');
      showAnimatedAlert('Error al calcular la masa requerida', 'error', 'Error de cálculo');
    }
  };

  const getConcentrationDescription = (type) => {
    switch (type) {
      case 'molar': return 'Moles de soluto por litro de solución';
      case 'normal': return 'Equivalentes de soluto por litro de solución (Peq = masa molar / número de cargas)';
      case 'porcentaje_mv': return 'Gramos de soluto por 100 mL de solución';
      case 'porcentaje_mm': return 'Gramos de soluto por 100 gramos de solución';
      default: return '';
    }
  };

  const concentrationTypes = [
    { label: 'Molaridad (M) - mol/L', value: 'molar' },
    { label: 'Normalidad (N) - eq/L', value: 'normal' },
    { label: 'Porcentaje masa/volumen %(m/v)', value: 'porcentaje_mv' },
    { label: 'Porcentaje masa/masa %(m/m)', value: 'porcentaje_mm' },
  ];

  const handleConcentrationTypeChange = (value) => {
    setConcentrationType(value);
    setShowResults(false);
    setResult('');
    setFormulaText('');
  };

  const concentrationTypeDescription = getConcentrationDescription(concentrationType);

  const renderInputFields = () => {
    if (concentrationType === 'normal') {
      return (
        <View>
          <CustomDropdown
            label="Tipo de Normalidad"
            placeholder="Selecciona el tipo de normalidad"
            options={normalityTypeOptions}
            value={normalityType}
            onValueChange={(value) => setNormalityType(value)}
            style={{ marginBottom: globalStyles.spacing.medium }}
          />
          
          {normalityType !== 'mass_eq' && (
            <InputField
              label="Equivalentes"
              placeholder="Número de equivalentes por mol"
              value={equivalents}
              onChangeText={setEquivalents}
              keyboardType="numeric"
              style={{ marginBottom: globalStyles.spacing.medium }}
              helperText={equivalentExplanation || "Número de H+ (ácidos), OH- (bases) o e- (redox) por molécula"}
            />
          )}
          
          {normalityType === 'mass_eq' && (
            <InputField
              label="Peso Equivalente (g/eq)"
              placeholder="Ingresa el peso equivalente"
              value={equivalentWeight}
              onChangeText={setEquivalentWeight}
              keyboardType="numeric"
              style={{ marginBottom: globalStyles.spacing.medium }}
              helperText="Peso equivalente en gramos por equivalente"
            />
          )}
        </View>
      );
    }

    return null;
  };

  const handleCalculate = () => {
    if (concentration && concentration.trim() !== '') {
      calculateRequiredMass();
    } else {
      calculateConcentration();
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
                Calculadora de Concentración
              </Text>
              
              <Text
                style={{
                  fontSize: globalStyles.fontSize.small,
                  color: isDarkMode ? '#FFFFFF' : themeColors.textLight,
                  textAlign: 'center',
                  marginBottom: globalStyles.spacing.large,
                }}
              >
                Calcula concentraciones molares, normales, porcentuales y ppm
              </Text>
              
              <View style={{ marginBottom: globalStyles.spacing.medium }}>
                <InputField
                  label="Fórmula Química"
                  placeholder="Ej: H2O, NaCl, C6H12O6"
                  value={formula}
                  onChangeText={setFormula}
                  icon="science"
                  style={{ marginBottom: globalStyles.spacing.medium }}
                />
              </View>

              <View style={{ marginBottom: globalStyles.spacing.medium }}>
                <CustomDropdown
                  label="Tipo de Concentración"
                  placeholder="Selecciona el tipo de concentración"
                  options={concentrationTypes}
                  value={concentrationType}
                  onValueChange={handleConcentrationTypeChange}
                />
                
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.small,
                    color: isDarkMode ? '#FFFFFF' : themeColors.textLight,
                    marginTop: globalStyles.spacing.xs,
                    marginLeft: globalStyles.spacing.small,
                    fontStyle: 'italic',
                  }}
                >
                  {concentrationTypeDescription}
                </Text>
              </View>

              {renderInputFields()}

              <InputField
                label="Masa del Soluto (g)"
                placeholder="Ingresa la masa en gramos"
                value={mass}
                onChangeText={setMass}
                keyboardType="numeric"
                style={{ marginBottom: globalStyles.spacing.medium }}
              />
              
              <View style={{ 
                flexDirection: 'row', 
                marginBottom: globalStyles.spacing.medium 
              }}>
                <View style={{ flex: 1, marginRight: globalStyles.spacing.small }}>
                  <InputField
                    label="Volumen de la Solución"
                    placeholder="Ingresa el volumen"
                    value={volume}
                    onChangeText={setVolume}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ width: 120 }}>
                  <CustomDropdown
                    label="Unidad"
                    placeholder="Unidad"
                    options={volumeUnitOptions}
                    value={volumeUnit}
                    onValueChange={(value) => setVolumeUnit(value)}
                  />
                </View>
              </View>
              
              <InputField
                label="Concentración"
                placeholder={`Ingresa la concentración para calcular masa requerida`}
                value={concentration}
                onChangeText={setConcentration}
                keyboardType="numeric"
                style={{ marginBottom: globalStyles.spacing.medium }}
              />
              
              {error ? (
                <Text
                  style={{
                    color: themeColors.error,
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
                  onPress={handleCalculate}
                  icon="calculate"
                  loading={false}
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
                      color: themeColors.accent,
                      textAlign: 'center',
                      marginBottom: globalStyles.spacing.medium,
                    }}
                  >
                    Resultados
                  </Text>
                  
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
                        fontSize: globalStyles.fontSize.xlarge,
                        fontWeight: 'bold',
                        color: themeColors.primary,
                        textAlign: 'center',
                      }}
                    >
                      {result}
                    </Text>
                  </View>
                  
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
                        fontSize: globalStyles.fontSize.small,
                        color: isDarkMode ? '#FFFFFF' : themeColors.textLight,
                        textAlign: 'center',
                        marginBottom: globalStyles.spacing.small,
                      }}
                    >
                      Fórmula utilizada: {concentrationType}
                    </Text>
                    
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.small,
                        color: isDarkMode ? '#FFFFFF' : themeColors.textLight,
                        textAlign: 'center',
                      }}
                    >
                      {formulaText}
                    </Text>
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
                      {formulaText}
                    </Text>
                  </View>
                </Animated.View>
              )}
            </View>
          </Animated.View>
        </ScrollView>
        
        {/* Modal de confirmación para volver al inicio */}
        <ConfirmationModal
          visible={showHomeConfirmation}
          title="Volver al inicio"
          message="¿Estás seguro que deseas volver a la pantalla principal? Se perderán todos los datos ingresados."
          onCancel={handleCancelHome}
          onConfirm={handleConfirmHome}
          icon="home"
        />
        
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

export default ConcentrationScreen;
