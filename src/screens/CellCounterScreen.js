import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Easing,
  StatusBar,
  Vibration,
  Alert,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTimer } from '../context/TimerContext';
import globalStyles from '../styles/globalStyles';
import FloatingActionButton from '../components/FloatingActionButton';
import AnimatedAlert from '../components/AnimatedAlert';
import CustomButton from '../components/CustomButton';

const CellCounterScreen = ({ navigation }) => {
  // Estados para el contador
  const [count, setCount] = useState(0);
  const [cpm, setCpm] = useState(0); // Células por minuto
  const [sessionCounts, setSessionCounts] = useState(0);
  const [averageTime, setAverageTime] = useState(0);
  const [countTimes, setCountTimes] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionName, setSessionName] = useState(`Sesión ${new Date().toLocaleDateString()}`);
  
  // Estados para alertas y animaciones
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertTitle, setAlertTitle] = useState('');
  
  // Referencias y animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const countAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  
  // Obtener el tema actual y el contexto de timer
  const { isDarkMode, themeColors } = useTheme();
  const { cellCounterHistory, saveCellCounterSession, clearCellCounterHistory } = useTimer();
  
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
    
    // Iniciar la sesión
    setSessionStartTime(new Date());
    
    return () => {
      // Guardar la sesión al salir si hay conteos
      if (sessionCounts > 0) {
        saveSessionData();
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
  
  // Función para incrementar el contador
  const incrementCount = () => {
    // Animar el botón
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
    
    // Animar el contador
    Animated.sequence([
      Animated.timing(countAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(countAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
    
    // Incrementar el contador
    setCount(prevCount => prevCount + 1);
    setSessionCounts(prevSessionCounts => prevSessionCounts + 1);
    
    // Registrar el tiempo
    const now = new Date();
    const newCountTimes = [...countTimes, now];
    setCountTimes(newCountTimes);
    
    // Calcular CPM si hay suficientes datos
    if (newCountTimes.length >= 2) {
      const timeRange = (now - newCountTimes[0]) / 1000 / 60; // en minutos
      if (timeRange > 0) {
        const newCpm = newCountTimes.length / timeRange;
        setCpm(Math.round(newCpm * 10) / 10); // Redondear a 1 decimal
      }
    }
    
    // Calcular tiempo promedio entre conteos
    if (newCountTimes.length >= 2) {
      let totalTime = 0;
      for (let i = 1; i < newCountTimes.length; i++) {
        totalTime += newCountTimes[i] - newCountTimes[i-1];
      }
      const avg = totalTime / (newCountTimes.length - 1) / 1000; // en segundos
      setAverageTime(Math.round(avg * 10) / 10); // Redondear a 1 decimal
    }
    
    // Vibración leve para feedback táctil
    Vibration.vibrate(20);
  };
  
  // Función para decrementar el contador
  const decrementCount = () => {
    if (count > 0) {
      setCount(prevCount => prevCount - 1);
      
      // Animar el contador
      Animated.sequence([
        Animated.timing(countAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(countAnim, {
          toValue: 1,
          duration: 150,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();
      
      // Vibración leve para feedback táctil
      Vibration.vibrate(20);
    }
  };
  
  // Función para guardar los datos de la sesión
  const saveSessionData = async () => {
    if (sessionCounts === 0) {
      showAnimatedAlert('No hay datos para guardar', 'error', 'Error');
      return;
    }
    
    const now = new Date();
    const sessionDuration = (now - sessionStartTime) / 1000 / 60; // en minutos
    
    const sessionData = {
      name: sessionName,
      count: count,
      totalCounts: sessionCounts,
      cpm: cpm,
      averageTime: averageTime,
      duration: sessionDuration,
      timestamp: now.toISOString(),
    };
    
    const saved = await saveCellCounterSession(sessionData);
    if (saved) {
      showAnimatedAlert('Sesión guardada correctamente', 'success', 'Guardado');
    } else {
      showAnimatedAlert('Error al guardar la sesión', 'error', 'Error');
    }
  };
  
  // Función para reiniciar el contador
  const resetCount = () => {
    // Preguntar si quiere guardar antes de reiniciar
    if (sessionCounts > 0) {
      Alert.alert(
        "Guardar sesión",
        "¿Quieres guardar esta sesión antes de reiniciar?",
        [
          { 
            text: "No", 
            onPress: () => {
              performReset();
            },
            style: "cancel" 
          },
          { 
            text: "Sí", 
            onPress: async () => {
              await saveSessionData();
              performReset();
            }
          }
        ]
      );
    } else {
      performReset();
    }
  };
  
  // Función para realizar el reinicio
  const performReset = () => {
    setCount(0);
    setCpm(0);
    setCountTimes([]);
    setAverageTime(0);
    setSessionStartTime(new Date());
    setSessionName(`Sesión ${new Date().toLocaleDateString()}`);
    
    // Animar el contador
    Animated.sequence([
      Animated.timing(countAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(countAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
    
    // Vibración leve para feedback táctil
    Vibration.vibrate([0, 30, 20, 30]);
    
    showAnimatedAlert('Contador reiniciado', 'info');
  };
  
  // Función para limpiar el historial
  const handleClearHistory = async () => {
    Alert.alert(
      "Limpiar historial",
      "¿Estás seguro de que quieres eliminar todo el historial de conteos?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            const cleared = await clearCellCounterHistory();
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
  
  // Función para confirmar la navegación a la pantalla de inicio
  const confirmNavigateToHome = () => {
    if (sessionCounts > 0) {
      Alert.alert(
        "Guardar sesión",
        "¿Quieres guardar esta sesión antes de salir?",
        [
          { 
            text: "No", 
            onPress: () => navigation.navigate('Home'),
            style: "cancel" 
          },
          { 
            text: "Sí", 
            onPress: async () => {
              await saveSessionData();
              navigation.navigate('Home');
            }
          }
        ]
      );
    } else {
      navigation.navigate('Home');
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? themeColors.background : '#F5F7FA' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#121212' : '#F5F7FA'} />
      
      <ScrollView
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
              borderLeftColor: themeColors.secondary,
            }}
          >
            <Text
              style={{
                fontSize: globalStyles.fontSize.large,
                fontWeight: 'bold',
                color: themeColors.secondary,
                textAlign: 'center',
                marginBottom: globalStyles.spacing.medium,
              }}
            >
              Contador de Células
            </Text>
            
            <TouchableOpacity
              onPress={() => {
                const newName = prompt("Nombre de la sesión", sessionName);
                if (newName) setSessionName(newName);
              }}
            >
              <Text
                style={{
                  fontSize: globalStyles.fontSize.medium,
                  color: themeColors.textLight,
                  textAlign: 'center',
                  marginBottom: globalStyles.spacing.medium,
                }}
              >
                {sessionName}
              </Text>
            </TouchableOpacity>
            
            <Animated.View
              style={{
                transform: [{ scale: countAnim }],
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderRadius: globalStyles.borderRadius.large,
                padding: globalStyles.spacing.large,
                marginBottom: globalStyles.spacing.medium,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: themeColors.secondary,
              }}
            >
              <Text
                style={{
                  fontSize: globalStyles.fontSize.xxlarge * 1.5,
                  fontWeight: 'bold',
                  color: themeColors.secondary,
                  textAlign: 'center',
                }}
              >
                {count}
              </Text>
              
              <Text
                style={{
                  fontSize: globalStyles.fontSize.small,
                  color: themeColors.textLight,
                  textAlign: 'center',
                  marginTop: globalStyles.spacing.small,
                }}
              >
                Células contadas
              </Text>
            </Animated.View>
            
            <Animated.View
              style={{
                transform: [{ scale: buttonScaleAnim }],
                marginBottom: globalStyles.spacing.medium,
              }}
            >
              <TouchableOpacity
                onPress={incrementCount}
                style={{
                  backgroundColor: themeColors.success,
                  borderRadius: 100,
                  padding: globalStyles.spacing.large,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                }}
              >
                <MaterialIcons name="add" size={50} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>
            
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginBottom: globalStyles.spacing.medium,
              }}
            >
              <TouchableOpacity
                onPress={decrementCount}
                style={{
                  backgroundColor: themeColors.warning,
                  borderRadius: 100,
                  padding: globalStyles.spacing.medium,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                }}
              >
                <MaterialIcons name="remove" size={30} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={resetCount}
                style={{
                  backgroundColor: themeColors.error,
                  borderRadius: 100,
                  padding: globalStyles.spacing.medium,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                }}
              >
                <MaterialIcons name="refresh" size={30} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={saveSessionData}
                style={{
                  backgroundColor: themeColors.info,
                  borderRadius: 100,
                  padding: globalStyles.spacing.medium,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                }}
              >
                <MaterialIcons name="save" size={30} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <LinearGradient
              colors={[
                isDarkMode ? 'rgba(35, 35, 35, 0.9)' : 'rgba(245, 245, 245, 0.9)',
                isDarkMode ? 'rgba(25, 25, 25, 0.8)' : 'rgba(235, 235, 235, 0.8)'
              ]}
              style={{
                borderRadius: globalStyles.borderRadius.medium,
                padding: globalStyles.spacing.medium,
                marginBottom: globalStyles.spacing.medium,
              }}
            >
              <Text
                style={{
                  fontSize: globalStyles.fontSize.medium,
                  fontWeight: 'bold',
                  color: themeColors.text,
                  marginBottom: globalStyles.spacing.small,
                }}
              >
                Estadísticas de la sesión
              </Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ fontSize: globalStyles.fontSize.small, color: isDarkMode ? '#FFFFFF' : themeColors.textLight }}>
                  Total contado:
                </Text>
                <Text style={{ fontSize: globalStyles.fontSize.small, fontWeight: 'bold', color: themeColors.text }}>
                  {sessionCounts} células
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ fontSize: globalStyles.fontSize.small, color: isDarkMode ? '#FFFFFF' : themeColors.textLight }}>
                  CPM:
                </Text>
                <Text style={{ fontSize: globalStyles.fontSize.small, fontWeight: 'bold', color: themeColors.text }}>
                  {cpm} células/min
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: globalStyles.fontSize.small, color: isDarkMode ? '#FFFFFF' : themeColors.textLight }}>
                  Tiempo promedio:
                </Text>
                <Text style={{ fontSize: globalStyles.fontSize.small, fontWeight: 'bold', color: themeColors.text }}>
                  {averageTime} seg
                </Text>
              </View>
            </LinearGradient>
          </LinearGradient>
          
          {cellCounterHistory.length > 0 && (
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
                Historial de Sesiones
              </Text>
              
              {cellCounterHistory.map((session, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    borderRadius: globalStyles.borderRadius.medium,
                    padding: globalStyles.spacing.medium,
                    marginBottom: globalStyles.spacing.small,
                    borderLeftWidth: 3,
                    borderLeftColor: themeColors.secondary,
                  }}
                >
                  <Text
                    style={{
                      fontSize: globalStyles.fontSize.medium,
                      fontWeight: 'bold',
                      color: themeColors.text,
                      marginBottom: globalStyles.spacing.xs,
                    }}
                  >
                    {session.name}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ fontSize: globalStyles.fontSize.small, color: isDarkMode ? '#FFFFFF' : themeColors.textLight }}>
                      Conteo final:
                    </Text>
                    <Text style={{ fontSize: globalStyles.fontSize.small, fontWeight: 'bold', color: themeColors.text }}>
                      {session.count} células
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ fontSize: globalStyles.fontSize.small, color: isDarkMode ? '#FFFFFF' : themeColors.textLight }}>
                      Total contado:
                    </Text>
                    <Text style={{ fontSize: globalStyles.fontSize.small, fontWeight: 'bold', color: themeColors.text }}>
                      {session.totalCounts} células
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ fontSize: globalStyles.fontSize.small, color: isDarkMode ? '#FFFFFF' : themeColors.textLight }}>
                      CPM:
                    </Text>
                    <Text style={{ fontSize: globalStyles.fontSize.small, fontWeight: 'bold', color: themeColors.text }}>
                      {session.cpm} células/min
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: globalStyles.fontSize.small, color: isDarkMode ? '#FFFFFF' : themeColors.textLight }}>
                      Duración:
                    </Text>
                    <Text style={{ fontSize: globalStyles.fontSize.small, fontWeight: 'bold', color: themeColors.text }}>
                      {Math.round(session.duration * 10) / 10} min
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

export default CellCounterScreen;
