import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Easing,
  StatusBar,
  Vibration,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTimer } from '../context/TimerContext';
import globalStyles from '../styles/globalStyles';
import FloatingActionButton from '../components/FloatingActionButton';
import AnimatedAlert from '../components/AnimatedAlert';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

const TimerScreen = ({ navigation }) => {
  // Estados para el timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerHours, setTimerHours] = useState(0);
  const [timerDuration, setTimerDuration] = useState(0);
  const [timerName, setTimerName] = useState('');
  const [timerMode, setTimerMode] = useState('chronometer'); // 'chronometer' o 'countdown'
  
  // Estados para alertas y animaciones
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertTitle, setAlertTitle] = useState('');
  
  // Referencias y animaciones
  const timerInterval = useRef(null);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;
  const loopAnimationRef = useRef(null);
  
  // Obtener el tema actual y el contexto de timer
  const { isDarkMode, themeColors } = useTheme();
  const { timerHistory, saveTimer, clearTimerHistory } = useTimer();
  
  // Efecto para animaciones al cargar la pantalla
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
    
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);
  
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
  
  // Función para iniciar el timer
  const startTimer = () => {
    if (!timerName) {
      showAnimatedAlert('Por favor ingresa un nombre para el timer', 'error', 'Error');
      return;
    }
    
    // Validar duración solo en modo countdown
    if (timerMode === 'countdown' && (timerDuration <= 0)) {
      showAnimatedAlert('Por favor ingresa una duración válida', 'error', 'Error');
      return;
    }
    
    // Si el timer estaba pausado, continuar desde donde quedó
    if (timerPaused) {
      setTimerPaused(false);
      setTimerRunning(true);
    } else {
      // Iniciar un nuevo timer
      setTimerSeconds(0);
      setTimerMinutes(0);
      setTimerHours(0);
      setTimerRunning(true);
    }
    
    // Animar el timer
    const loopAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(timerAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(timerAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Guardar la referencia a la animación en bucle
    loopAnimationRef.current = loopAnimation;
    
    // Iniciar la animación
    loopAnimation.start();
    
    // Iniciar el intervalo del timer
    timerInterval.current = setInterval(() => {
      setTimerSeconds(prevSeconds => {
        let newSeconds = prevSeconds + 1;
        let newMinutes = timerMinutes;
        let newHours = timerHours;
        
        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes += 1;
          
          if (newMinutes >= 60) {
            newMinutes = 0;
            newHours += 1;
          }
        }
        
        setTimerMinutes(newMinutes);
        setTimerHours(newHours);
        
        // Verificar si se ha alcanzado la duración del timer (solo en modo countdown)
        if (timerMode === 'countdown') {
          const totalSeconds = newHours * 3600 + newMinutes * 60 + newSeconds;
          if (totalSeconds >= timerDuration * 60) {
            stopTimer(true);
            Vibration.vibrate([500, 500, 500]);
            showAnimatedAlert('¡Timer completado!', 'success', 'Completado');
          }
        }
        
        return newSeconds;
      });
    }, 1000);
  };
  
  // Función para pausar el timer
  const pauseTimer = () => {
    if (timerRunning) {
      clearInterval(timerInterval.current);
      setTimerPaused(true);
      setTimerRunning(false);
      
      // Detener la animación usando la referencia guardada
      try {
        if (loopAnimationRef.current) {
          loopAnimationRef.current.stop();
        }
      } catch (error) {
        console.log('Error al detener la animación:', error);
      }
    }
  };
  
  // Función para detener el timer
  const stopTimer = async (completed = false) => {
    clearInterval(timerInterval.current);
    
    // Guardar el timer en el historial
    if (timerRunning || timerPaused) {
      const totalSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
      const newTimer = {
        name: timerName,
        duration: timerMode === 'countdown' ? timerDuration : totalSeconds / 60, // en minutos
        elapsed: totalSeconds / 60, // en minutos
        completed: completed,
        timestamp: new Date().toISOString(),
        mode: timerMode,
      };
      
      // Guardar en el contexto y en AsyncStorage
      const saved = await saveTimer(newTimer);
      if (saved) {
        showAnimatedAlert('Timer guardado correctamente', 'success', 'Guardado');
      } else {
        showAnimatedAlert('Error al guardar el timer', 'error', 'Error');
      }
    }
    
    // Reiniciar el timer
    setTimerRunning(false);
    setTimerPaused(false);
    setTimerSeconds(0);
    setTimerMinutes(0);
    setTimerHours(0);
    
    // Detener la animación usando la referencia guardada
    try {
      if (loopAnimationRef.current) {
        loopAnimationRef.current.stop();
        loopAnimationRef.current = null;
      }
    } catch (error) {
      console.log('Error al detener la animación:', error);
    }
    
    // Restablecer el valor de la animación
    if (timerAnim) {
      timerAnim.setValue(1);
    }
  };
  
  // Función para formatear el tiempo
  const formatTime = (hours, minutes, seconds) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Función para confirmar la navegación a la pantalla de inicio
  const confirmNavigateToHome = () => {
    if (timerRunning) {
      Alert.alert(
        "Timer en progreso",
        "¿Estás seguro de que quieres salir? El timer seguirá corriendo en segundo plano.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", onPress: () => navigation.navigate('Home') }
        ]
      );
    } else {
      navigation.navigate('Home');
    }
  };
  
  // Función para limpiar el historial
  const handleClearHistory = async () => {
    Alert.alert(
      "Limpiar historial",
      "¿Estás seguro de que quieres eliminar todo el historial de timers?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            const cleared = await clearTimerHistory();
            if (cleared) {
              showAnimatedAlert('Historial eliminado correctamente', 'success', 'Eliminado');
            } else {
              showAnimatedAlert('Error al eliminar el historial', 'error', 'Error');
            }
          }
        }
      ]
    );
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? themeColors.background : '#F5F7FA' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#121212' : '#F5F7FA'} />
      
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ 
          flexGrow: 1,
          padding: globalStyles.spacing.medium,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            marginBottom: globalStyles.spacing.medium,
          }}
        >
          <LinearGradient
            colors={[
              isDarkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(240, 240, 240, 0.8)'
            ]}
            style={{
              borderRadius: globalStyles.borderRadius.large,
              padding: globalStyles.spacing.large,
              marginBottom: globalStyles.spacing.medium,
              borderLeftWidth: 4,
              borderLeftColor: themeColors.accent,
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
              Timer de Laboratorio
            </Text>
            
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-around', 
              marginBottom: globalStyles.spacing.medium,
              backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(240, 240, 240, 0.8)',
              borderRadius: globalStyles.borderRadius.medium,
              padding: globalStyles.spacing.small,
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: globalStyles.spacing.small,
                  backgroundColor: timerMode === 'chronometer' 
                    ? (isDarkMode ? themeColors.primary : themeColors.primaryLight) 
                    : 'transparent',
                  borderRadius: globalStyles.borderRadius.small,
                  alignItems: 'center',
                  marginRight: 5,
                }}
                onPress={() => setTimerMode('chronometer')}
                disabled={timerRunning || timerPaused}
              >
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.small,
                    fontWeight: timerMode === 'chronometer' ? 'bold' : 'normal',
                    color: timerMode === 'chronometer' 
                      ? (isDarkMode ? '#FFFFFF' : themeColors.primary) 
                      : themeColors.textLight,
                  }}
                >
                  Cronómetro
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: globalStyles.spacing.small,
                  backgroundColor: timerMode === 'countdown' 
                    ? (isDarkMode ? themeColors.primary : themeColors.primaryLight) 
                    : 'transparent',
                  borderRadius: globalStyles.borderRadius.small,
                  alignItems: 'center',
                  marginLeft: 5,
                }}
                onPress={() => setTimerMode('countdown')}
                disabled={timerRunning || timerPaused}
              >
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.small,
                    fontWeight: timerMode === 'countdown' ? 'bold' : 'normal',
                    color: timerMode === 'countdown' 
                      ? (isDarkMode ? '#FFFFFF' : themeColors.primary) 
                      : themeColors.textLight,
                  }}
                >
                  Temporizador
                </Text>
              </TouchableOpacity>
            </View>
            
            <InputField
              label="Nombre del Timer"
              value={timerName}
              onChangeText={setTimerName}
              placeholder="Ej. Reacción de esterificación"
              icon="label"
              editable={!timerRunning}
            />
            
            {timerMode === 'countdown' && (
              <InputField
                label="Duración (minutos)"
                value={timerDuration.toString()}
                onChangeText={(text) => setTimerDuration(parseFloat(text) || 0)}
                placeholder="Ej. 30"
                keyboardType="numeric"
                icon="timer"
                editable={!timerRunning}
              />
            )}
            
            <Animated.View
              style={{
                transform: [{ scale: timerAnim }],
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderRadius: globalStyles.borderRadius.large,
                padding: globalStyles.spacing.large,
                marginVertical: globalStyles.spacing.medium,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: timerRunning 
                  ? themeColors.accent 
                  : timerPaused 
                    ? themeColors.warning 
                    : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: globalStyles.fontSize.xxlarge,
                  fontWeight: 'bold',
                  color: timerRunning 
                    ? themeColors.accent 
                    : timerPaused 
                      ? themeColors.warning 
                      : themeColors.text,
                  textAlign: 'center',
                }}
              >
                {formatTime(timerHours, timerMinutes, timerSeconds)}
              </Text>
              
              <Text
                style={{
                  fontSize: globalStyles.fontSize.small,
                  color: isDarkMode ? '#FFFFFF' : themeColors.textLight,
                  textAlign: 'center',
                  marginTop: globalStyles.spacing.small,
                }}
              >
                {timerRunning 
                  ? (timerMode === 'chronometer' ? 'Cronómetro en progreso' : 'Temporizador en progreso')
                  : timerPaused 
                    ? (timerMode === 'chronometer' ? 'Cronómetro pausado' : 'Temporizador pausado')
                    : (timerMode === 'chronometer' ? 'Cronómetro detenido' : 'Temporizador detenido')}
              </Text>
            </Animated.View>
            
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: globalStyles.spacing.medium,
              }}
            >
              {!timerRunning && !timerPaused ? (
                <CustomButton
                  title="Iniciar"
                  onPress={startTimer}
                  style={{
                    backgroundColor: themeColors.success,
                    flex: 1,
                    marginRight: globalStyles.spacing.small,
                  }}
                  icon="play-arrow"
                />
              ) : (
                <CustomButton
                  title={timerPaused ? "Continuar" : "Pausar"}
                  onPress={timerPaused ? startTimer : pauseTimer}
                  style={{
                    backgroundColor: timerPaused ? themeColors.success : themeColors.warning,
                    flex: 1,
                    marginRight: globalStyles.spacing.small,
                  }}
                  icon={timerPaused ? "play-arrow" : "pause"}
                />
              )}
              
              <CustomButton
                title="Detener"
                onPress={() => stopTimer()}
                style={{
                  backgroundColor: themeColors.error,
                  flex: 1,
                  marginLeft: globalStyles.spacing.small,
                }}
                icon="stop"
                disabled={!timerRunning && !timerPaused}
              />
            </View>
          </LinearGradient>
          
          {timerHistory.length > 0 && (
            <LinearGradient
              colors={[
                isDarkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(240, 240, 240, 0.8)'
              ]}
              style={{
                borderRadius: globalStyles.borderRadius.large,
                padding: globalStyles.spacing.large,
                marginBottom: globalStyles.spacing.medium,
                borderLeftWidth: 4,
                borderLeftColor: themeColors.info,
              }}
            >
              <Text
                style={{
                  fontSize: globalStyles.fontSize.large,
                  fontWeight: 'bold',
                  color: themeColors.info,
                  textAlign: 'center',
                  marginBottom: globalStyles.spacing.medium,
                }}
              >
                Historial de Timers
              </Text>
              
              {timerHistory.map((timer, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    borderRadius: globalStyles.borderRadius.medium,
                    padding: globalStyles.spacing.medium,
                    marginBottom: globalStyles.spacing.small,
                    borderLeftWidth: 3,
                    borderLeftColor: timer.completed ? themeColors.success : themeColors.warning,
                  }}
                >
                  <Text
                    style={{
                      fontSize: globalStyles.fontSize.medium,
                      fontWeight: 'bold',
                      color: isDarkMode ? '#FFFFFF' : themeColors.text,
                      marginBottom: globalStyles.spacing.xs,
                    }}
                  >
                    {timer.name} {timer.mode === 'chronometer' ? '(Cronómetro)' : '(Temporizador)'}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {timer.mode === 'countdown' ? (
                      <Text style={{ fontSize: globalStyles.fontSize.small, color: isDarkMode ? '#FFFFFF' : themeColors.textLight }}>
                        Duración: {timer.duration.toFixed(1)} min
                      </Text>
                    ) : (
                      <Text style={{ fontSize: globalStyles.fontSize.small, color: isDarkMode ? '#FFFFFF' : themeColors.textLight }}>
                        Cronómetro
                      </Text>
                    )}
                    <Text style={{ fontSize: globalStyles.fontSize.small, color: isDarkMode ? '#FFFFFF' : themeColors.textLight }}>
                      Tiempo: {timer.elapsed.toFixed(1)} min
                    </Text>
                    <Text
                      style={{
                        fontSize: globalStyles.fontSize.small,
                        color: timer.completed ? themeColors.success : themeColors.warning,
                        fontWeight: 'bold',
                      }}
                    >
                      {timer.mode === 'countdown' ? (timer.completed ? 'Completado' : 'Detenido') : 'Registrado'}
                    </Text>
                  </View>
                </View>
              ))}
              
              <CustomButton
                title="Limpiar Historial"
                onPress={handleClearHistory}
                style={{
                  backgroundColor: themeColors.error,
                  marginTop: globalStyles.spacing.small,
                }}
                icon="delete"
              />
            </LinearGradient>
          )}
        </Animated.View>
      </ScrollView>
      
      {/* Botones flotantes */}
      <FloatingActionButton
        icon="arrow-back"
        onPress={() => navigation.goBack()}
        position="bottomLeft"
        style={{
          backgroundColor: themeColors.primary,
        }}
      />
      
      <FloatingActionButton
        icon="home"
        onPress={confirmNavigateToHome}
        position="bottomRight"
        style={{
          backgroundColor: themeColors.accent,
        }}
      />
      
      {/* Alerta animada */}
      <AnimatedAlert
        visible={showAlert}
        message={alertMessage}
        type={alertType}
        title={alertTitle}
      />
    </View>
  );
};

export default TimerScreen;
