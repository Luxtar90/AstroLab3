import { StyleSheet } from 'react-native';

// Color palette
const lightColors = {
  primary: '#1E88E5',
  primaryLight: '#64B5F6',
  primaryDark: '#0D47A1',
  secondary: '#26A69A',
  secondaryLight: '#80CBC4',
  secondaryDark: '#00796B',
  accent: '#FF4081',
  background: '#F5F7FA',
  card: '#FFFFFF',
  text: '#263238',
  textLight: '#607D8B',
  border: '#E0E0E0',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  inputBackground: '#FFFFFF',
  highlight: '#E3F2FD',
  gradient: {
    primary: ['#1E88E5', '#1565C0'],
    secondary: ['#26A69A', '#00796B'],
    accent: ['#FF4081', '#C2185B'],
    success: ['#4CAF50', '#2E7D32'],
    warning: ['#FF9800', '#EF6C00'],
    danger: ['#F44336', '#C62828'],
    cool: ['#00BCD4', '#0097A7'],
    warm: ['#FF5722', '#E64A19'],
    night: ['#3F51B5', '#303F9F'],
    lab: ['#1E88E5', '#5E35B1'],
  },
};

// Dark mode colors
const darkColors = {
  primary: '#2196F3',
  primaryLight: '#64B5F6',
  primaryDark: '#1565C0',
  secondary: '#4DB6AC',
  secondaryLight: '#B2DFDB',
  secondaryDark: '#00796B',
  accent: '#FF4081',
  background: '#121212',
  card: '#1E1E1E',
  text: '#ECEFF1',
  textLight: '#B0BEC5',
  border: '#333333',
  error: '#EF5350',
  success: '#66BB6A',
  warning: '#FFA726',
  info: '#2196F3',
  inputBackground: '#2C2C2C',
  highlight: '#1E88E5',
  gradient: {
    primary: ['#2196F3', '#1976D2'],
    secondary: ['#4DB6AC', '#00796B'],
    accent: ['#FF4081', '#D81B60'],
    success: ['#66BB6A', '#388E3C'],
    warning: ['#FFA726', '#F57C00'],
    danger: ['#EF5350', '#D32F2F'],
    cool: ['#26C6DA', '#0097A7'],
    warm: ['#FF7043', '#E64A19'],
    night: ['#5C6BC0', '#3949AB'],
    lab: ['#2196F3', '#7E57C2'],
  },
};

// Font sizes
const fontSize = {
  xs: 10,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
};

// Spacing
const spacing = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
const borderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  pill: 50,
};

// Shadow
const shadow = {
  small: {
    // Sombras eliminadas para un diseño más limpio
    elevation: 0,
  },
  medium: {
    // Sombras eliminadas para un diseño más limpio
    elevation: 0,
  },
  large: {
    // Sombras eliminadas para un diseño más limpio
    elevation: 0,
  },
  // Estilo especial para efectos de brillo sin sombra
  glow: {
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
};

// Animations
const animations = {
  timing: {
    fast: 200,
    normal: 350,
    slow: 500,
  },
  easing: {
    bounce: 'bounce',
    elastic: 'elastic(1)',
    ease: 'ease',
    linear: 'linear',
  },
};

// Lab patterns
const labPatterns = {
  dots: {
    size: 2,
    spacing: 20,
    color: 'rgba(0, 0, 0, 0.05)',
    darkColor: 'rgba(255, 255, 255, 0.05)',
  },
  grid: {
    lineWidth: 1,
    spacing: 30,
    color: 'rgba(0, 0, 0, 0.03)',
    darkColor: 'rgba(255, 255, 255, 0.03)',
  },
  molecules: {
    opacity: 0.05,
    darkOpacity: 0.08,
  },
};

// Estilos específicos para la temática de laboratorio
const labStyles = {
  glassMorphism: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  neonBorder: {
    borderWidth: 1,
    borderColor: '#4DB6AC',
    shadowColor: '#4DB6AC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradientBorder: {
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  flaskIcon: {
    width: 40,
    height: 40,
    tintColor: '#4DB6AC',
  },
  labButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(77, 182, 172, 0.2)',
    borderWidth: 1,
    borderColor: '#4DB6AC',
  },
};

// Estilos para iconos
const iconStyles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  small: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  medium: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  large: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
};

// Create theme-specific styles
const createStyles = (isDark) => {
  const colors = isDark ? darkColors : lightColors;

  return {
    // Export colors for use in other components
    colors,
    fontSize,
    spacing,
    borderRadius,
    shadow,
    animations,
    labPatterns,
    labStyles,
    iconStyles,

    // Common styles
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      padding: spacing.medium,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.medium,
      padding: spacing.medium,
      marginBottom: spacing.medium,
      ...shadow.medium,
    },
    title: {
      fontSize: fontSize.xxlarge,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: spacing.medium,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: fontSize.xlarge,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: spacing.medium,
    },
    description: {
      fontSize: fontSize.medium,
      color: colors.textLight,
      marginBottom: spacing.large,
      textAlign: 'center',
    },
    formContainer: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.medium,
      padding: spacing.medium,
      marginBottom: spacing.medium,
      ...shadow.light,
    },
    inputContainer: {
      marginBottom: spacing.medium,
    },
    inputLabel: {
      fontSize: fontSize.medium,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.small,
      padding: spacing.medium,
      fontSize: fontSize.medium,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.medium,
      padding: spacing.medium,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: spacing.medium,
      ...shadow.light,
    },
    buttonText: {
      color: colors.text,
      fontSize: fontSize.large,
      fontWeight: 'bold',
    },
    buttonSecondary: {
      backgroundColor: colors.secondary,
    },
    buttonWarning: {
      backgroundColor: colors.warning,
    },
    buttonError: {
      backgroundColor: colors.error,
    },
    resultContainer: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.medium,
      padding: spacing.medium,
      marginTop: spacing.medium,
      ...shadow.medium,
    },
    resultTitle: {
      fontSize: fontSize.large,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: spacing.medium,
      textAlign: 'center',
    },
    resultItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.small,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    resultLabel: {
      fontSize: fontSize.medium,
      color: colors.text,
      flex: 1,
    },
    resultValue: {
      fontSize: fontSize.medium,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'right',
    },
    resultUnit: {
      fontSize: fontSize.small,
      color: colors.textLight,
      marginLeft: spacing.xs,
      width: 60,
      textAlign: 'right',
    },
    errorText: {
      color: colors.error,
      fontSize: fontSize.medium,
      marginBottom: spacing.medium,
      textAlign: 'center',
    },
    previousValueContainer: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.medium,
      padding: spacing.medium,
      marginBottom: spacing.medium,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
      ...shadow.light,
    },
    previousValueTitle: {
      fontSize: fontSize.medium,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    previousValueText: {
      fontSize: fontSize.medium,
      color: colors.text,
    },
    previousValueNote: {
      fontSize: fontSize.small,
      color: colors.textLight,
      marginTop: spacing.xs,
      fontStyle: 'italic',
    },
    // Estilos para el selector
    pickerContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.small,
      backgroundColor: colors.inputBackground,
      marginBottom: spacing.medium,
    },
    picker: {
      color: colors.text,
      height: 50,
    },
    // Estilos para las alertas
    alertContainer: {
      padding: spacing.medium,
      borderRadius: borderRadius.medium,
      marginBottom: spacing.medium,
      flexDirection: 'row',
      alignItems: 'center',
    },
    alertSuccess: {
      backgroundColor: colors.success + '20', // 20% opacity
      borderLeftWidth: 4,
      borderLeftColor: colors.success,
    },
    alertError: {
      backgroundColor: colors.error + '20', // 20% opacity
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    alertWarning: {
      backgroundColor: colors.warning + '20', // 20% opacity
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
    },
    alertInfo: {
      backgroundColor: colors.info + '20', // 20% opacity
      borderLeftWidth: 4,
      borderLeftColor: colors.info,
    },
    alertIcon: {
      marginRight: spacing.small,
    },
    alertText: {
      flex: 1,
      fontSize: fontSize.medium,
      color: colors.text,
    },
    // Estilos para los iconos
    icon: {
      marginRight: spacing.small,
    },
    // Estilos para las tarjetas de la pantalla de inicio
    homeCard: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.medium,
      padding: spacing.medium,
      marginBottom: spacing.medium,
      flexDirection: 'row',
      alignItems: 'center',
      ...shadow.medium,
    },
    homeCardContent: {
      flex: 1,
    },
    homeCardTitle: {
      fontSize: fontSize.large,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    homeCardDescription: {
      fontSize: fontSize.small,
      color: colors.textLight,
    },
    homeCardIcon: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.round,
      backgroundColor: colors.primary + '20', // 20% opacity
    },
    // Estilos para el switch de tema
    themeToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: spacing.medium,
    },
    themeToggleText: {
      fontSize: fontSize.medium,
      color: colors.text,
      marginRight: spacing.small,
    },
    // Estilos para el tema de laboratorio de alta tecnología
    labCard: {
      ...labStyles.glassCard,
    },
    darkLabCard: {
      ...labStyles.glassCard,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    labButton: {
      ...labStyles.labButton,
    },
  };
};

// Exportar función para obtener estilos basados en el tema
export default {
  getStyles: (isDarkMode = false) => createStyles(isDarkMode),
  lightColors,
  darkColors,
  fontSize,
  spacing,
  borderRadius,
  shadow,
  animations,
  labPatterns,
  labStyles,
  iconStyles,
};
