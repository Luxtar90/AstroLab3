import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Animated, 
  Easing,
  StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import globalStyles from '../styles/globalStyles';
import FloatingActionButton from '../components/FloatingActionButton';
import AstroBotChatModal from '../components/AstroBotChatModal';

const HomeScreen = ({ navigation }) => {
  // Referencias para animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
  // Estado para el modal de chat
  const [showAstroBotModal, setShowAstroBotModal] = useState(false);
  
  // Obtener el tema actual
  const { isDarkMode, toggleTheme } = useTheme();
  const themeColors = isDarkMode ? globalStyles.darkColors : globalStyles.lightColors;
  
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
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Función para crear animación al presionar un botón
  const animatePress = (ref) => {
    Animated.sequence([
      Animated.timing(ref, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(ref, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // Datos de las tarjetas de cálculo
  const calculationCards = [
    {
      id: 1,
      title: 'Masa Molar',
      description: 'Calcula la masa molar de compuestos químicos y compuestos comunes.',
      icon: 'scale',
      screen: 'MolarMass',
      color: themeColors.accent,
      animRef: useRef(new Animated.Value(1)).current,
    },
    {
      id: 2,
      title: 'Pureza',
      description: 'Calcula la cantidad necesaria según la pureza del reactivo.',
      icon: 'filter-alt',
      screen: 'Purity',
      color: themeColors.info,
      animRef: useRef(new Animated.Value(1)).current,
    },
    {
      id: 3,
      title: 'Concentración',
      description: 'Calcula concentraciones molares, normales, porcentuales y ppm.',
      icon: 'science',
      screen: 'Concentration',
      color: themeColors.primary,
      animRef: useRef(new Animated.Value(1)).current,
    },
    {
      id: 4,
      title: 'Dilución',
      description: 'Calcula diluciones simples usando la fórmula C₁V₁ = C₂V₂.',
      icon: 'opacity',
      screen: 'Dilution',
      color: themeColors.warning,
      animRef: useRef(new Animated.Value(1)).current,
    },
    {
      id: 5,
      title: 'Timer',
      description: 'Cronómetro para experimentos con historial de tiempos.',
      icon: 'timer',
      screen: 'Timer',
      color: themeColors.success,
      animRef: useRef(new Animated.Value(1)).current,
    },
    {
      id: 6,
      title: 'Contador de Células',
      description: 'Contador manual para células con estadísticas de conteo.',
      icon: 'biotech',
      screen: 'CellCounter',
      color: themeColors.secondary,
      animRef: useRef(new Animated.Value(1)).current,
    },
  ];
  
  // Renderizar tarjeta de cálculo
  const renderCalculationCard = (item, index) => {
    const staggeredDelay = index * 100;
    
    // Animación con retraso escalonado para cada tarjeta
    useEffect(() => {
      setTimeout(() => {
        Animated.spring(item.animRef, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }, staggeredDelay);
    }, []);
    
    return (
      <Animated.View
        key={item.id}
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: item.animRef },
            { translateY: translateYAnim }
          ],
          marginBottom: globalStyles.spacing.medium,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            animatePress(item.animRef);
            setTimeout(() => navigation.navigate(item.screen), 150);
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
              ...globalStyles.shadow.medium,
              borderLeftWidth: 4,
              borderLeftColor: item.color,
              overflow: 'hidden',
            }}
          >
            {/* Patrón de laboratorio en el fondo */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              ...globalStyles.labStyles.pattern,
            }} />
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: isDarkMode ? item.color + '30' : item.color + '15',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: globalStyles.spacing.medium,
                  borderWidth: 1.5,
                  borderColor: isDarkMode ? item.color + '70' : item.color + '50',
                }}
              >
                <MaterialIcons 
                  name={item.icon} 
                  size={28} 
                  color={item.color} 
                  style={{ opacity: isDarkMode ? 1 : 0.9 }}
                />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.large,
                    fontWeight: 'bold',
                    color: themeColors.text,
                    marginBottom: globalStyles.spacing.xs,
                  }}
                >
                  {item.title}
                </Text>
                
                <Text
                  style={{
                    fontSize: globalStyles.fontSize.small,
                    color: themeColors.textLight,
                  }}
                >
                  {item.description}
                </Text>
              </View>
              
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={item.color}
                style={{ marginLeft: globalStyles.spacing.small }}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  // Función para abrir el modal de AstroBot
  const handleOpenAstroBot = () => {
    setShowAstroBotModal(true);
  };

  // Función para cerrar el modal de AstroBot
  const handleCloseAstroBot = () => {
    setShowAstroBotModal(false);
  };
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={themeColors.gradient.primary}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: globalStyles.spacing.medium,
            paddingBottom: globalStyles.spacing.xxl,
          }}
        >
          {/* Encabezado */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: globalStyles.spacing.large,
              backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              borderRadius: globalStyles.borderRadius.large,
              padding: globalStyles.spacing.medium,
              ...globalStyles.shadow.medium,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: globalStyles.fontSize.xxlarge,
                  fontWeight: 'bold',
                  color: themeColors.primary,
                  marginBottom: globalStyles.spacing.xs,
                }}
              >
                AstroLab
              </Text>
              
              <Text
                style={{
                  fontSize: globalStyles.fontSize.medium,
                  color: themeColors.textLight,
                }}
              >
                Calculadora Química
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: themeColors.card,
                justifyContent: 'center',
                alignItems: 'center',
                ...globalStyles.shadow.small,
              }}
            >
              <MaterialIcons
                name={isDarkMode ? 'light-mode' : 'dark-mode'}
                size={24}
                color={themeColors.primary}
              />
            </TouchableOpacity>
          </Animated.View>
          
          {/* Tarjeta de bienvenida */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              marginBottom: globalStyles.spacing.large,
            }}
          >
            <LinearGradient
              colors={themeColors.gradient.cool}
              style={{
                borderRadius: globalStyles.borderRadius.large,
                padding: globalStyles.spacing.large,
                ...globalStyles.shadow.glow,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.1,
                  ...globalStyles.labStyles.pattern,
                }}
              />
              
              <Text
                style={{
                  fontSize: globalStyles.fontSize.xlarge,
                  fontWeight: 'bold',
                  color: '#fff',
                  marginBottom: globalStyles.spacing.medium,
                  textAlign: 'center',
                }}
              >
                Bienvenido al Laboratorio
              </Text>
              
              <Text
                style={{
                  fontSize: globalStyles.fontSize.medium,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: globalStyles.spacing.large,
                  textAlign: 'center',
                }}
              >
                Tu asistente para cálculos químicos precisos y rápidos
              </Text>
              
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons name="science" size={24} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Selecciona un cálculo para comenzar
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
          
          {/* Tarjetas de cálculos */}
          <View style={{ marginBottom: globalStyles.spacing.large }}>
            <Text
              style={{
                fontSize: globalStyles.fontSize.large,
                fontWeight: 'bold',
                color: themeColors.text,
                marginBottom: globalStyles.spacing.medium,
              }}
            >
              Cálculos Disponibles
            </Text>
            
            {calculationCards.map(renderCalculationCard)}
          </View>
          
          {/* Información adicional */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              borderRadius: globalStyles.borderRadius.large,
              padding: globalStyles.spacing.large,
              marginBottom: globalStyles.spacing.large,
              ...globalStyles.shadow.medium,
            }}
          >
            <Text
              style={{
                fontSize: globalStyles.fontSize.large,
                fontWeight: 'bold',
                color: themeColors.text,
                marginBottom: globalStyles.spacing.medium,
                textAlign: 'center',
              }}
            >
              Acerca de AstroLab
            </Text>
            
            <Text
              style={{
                fontSize: globalStyles.fontSize.medium,
                color: themeColors.textLight,
                marginBottom: globalStyles.spacing.medium,
                textAlign: 'center',
              }}
            >
              AstroLab es una herramienta diseñada para estudiantes y profesionales de química, 
              proporcionando cálculos precisos para diversas aplicaciones de laboratorio.
            </Text>
            
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: globalStyles.spacing.medium,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: themeColors.primary + '20',
                  borderRadius: globalStyles.borderRadius.medium,
                  padding: globalStyles.spacing.medium,
                  alignItems: 'center',
                  width: '45%',
                }}
              >
                <MaterialIcons name="help-outline" size={24} color={themeColors.primary} />
                <Text
                  style={{
                    color: themeColors.primary,
                    marginTop: globalStyles.spacing.xs,
                    fontWeight: 'bold',
                  }}
                >
                  Ayuda
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  backgroundColor: themeColors.accent + '20',
                  borderRadius: globalStyles.borderRadius.medium,
                  padding: globalStyles.spacing.medium,
                  alignItems: 'center',
                  width: '45%',
                }}
              >
                <MaterialIcons name="info-outline" size={24} color={themeColors.accent} />
                <Text
                  style={{
                    color: themeColors.accent,
                    marginTop: globalStyles.spacing.xs,
                    fontWeight: 'bold',
                  }}
                >
                  Información
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
        
        {/* Botón de chat con AstroBot */}
        <FloatingActionButton
          icon="science"
          onPress={handleOpenAstroBot}
          position="bottomRight"
          style={{ 
            backgroundColor: themeColors.accent,
            bottom: 30,
            right: 30,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
          }}
          size={56}
          iconSize={28}
        />
      </LinearGradient>
      
      {/* Modal de chat con AstroBot */}
      <AstroBotChatModal
        isVisible={showAstroBotModal}
        onClose={handleCloseAstroBot}
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </View>
  );
};

export default HomeScreen;
