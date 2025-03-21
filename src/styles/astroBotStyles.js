import { StyleSheet } from 'react-native';
import globalStyles from './globalStyles';

/**
 * Estilos para el componente AstroBot
 * @param {string} theme - Tema actual ('light' o 'dark')
 * @returns {Object} Objeto de estilos
 */
export const getAstroBotStyles = (theme) => {
  const themeColors = theme === 'dark' ? globalStyles.darkColors : globalStyles.lightColors;
  
  return StyleSheet.create({
    // Estilos del modal
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
      flex: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    container: {
      height: '90%',
      padding: globalStyles.spacing.medium,
      backgroundColor: themeColors.card,
      borderTopLeftRadius: globalStyles.borderRadius.large,
      borderTopRightRadius: globalStyles.borderRadius.large,
      ...globalStyles.shadow.medium,
    },
    
    // Estilos del encabezado
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: globalStyles.spacing.medium,
      paddingVertical: globalStyles.spacing.medium,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      backgroundColor: themeColors.cardDark,
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: globalStyles.fontSize.large,
      fontWeight: 'bold',
      color: themeColors.text,
      marginLeft: globalStyles.spacing.small,
    },
    settingsButton: {
      padding: globalStyles.spacing.small,
      marginLeft: globalStyles.spacing.small,
    },
    connectionIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: globalStyles.spacing.medium,
      backgroundColor: themeColors.cardLight,
      paddingHorizontal: globalStyles.spacing.small,
      paddingVertical: 4,
      borderRadius: globalStyles.borderRadius.medium,
    },
    headerConnectionDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: globalStyles.spacing.xs,
    },
    connectionStatusText: {
      fontSize: globalStyles.fontSize.small,
      color: themeColors.textLight,
    },
    closeButton: {
      padding: globalStyles.spacing.xs,
    },
    
    // Estilos del indicador de conexión
    connectionStatusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: globalStyles.spacing.xs,
      marginBottom: globalStyles.spacing.small,
    },
    connectionStatusText: {
      fontSize: globalStyles.fontSize.small,
      marginLeft: globalStyles.spacing.xs,
    },
    connectionDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 8,
    },
    
    // Estilos del estado de conexión
    connectionStatusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: globalStyles.spacing.medium,
      paddingVertical: globalStyles.spacing.small,
      backgroundColor: themeColors.cardDark,
      marginBottom: globalStyles.spacing.small,
    },
    connectionStatusText: {
      fontSize: globalStyles.fontSize.small,
      marginLeft: globalStyles.spacing.small,
    },
    connectionDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 8,
    },
    
    // Estilos de la lista de chat
    chatContainer: {
      paddingVertical: globalStyles.spacing.medium,
      paddingHorizontal: globalStyles.spacing.small,
      flexGrow: 1,
    },
    separator: {
      height: globalStyles.spacing.small,
    },
    
    // Estilos de las burbujas de chat
    messageBubble: {
      maxWidth: '85%',
      padding: globalStyles.spacing.medium,
      borderRadius: globalStyles.borderRadius.large,
      marginBottom: globalStyles.spacing.xs,
      ...globalStyles.shadow.small,
    },
    userBubble: {
      alignSelf: 'flex-end',
      backgroundColor: themeColors.primary,
      borderBottomRightRadius: globalStyles.borderRadius.xs,
    },
    botBubble: {
      alignSelf: 'flex-start',
      backgroundColor: themeColors.card,
      borderTopLeftRadius: globalStyles.borderRadius.xs,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    botIconContainer: {
      position: 'absolute',
      top: -8,
      left: -8,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
    },
    messageText: {
      fontSize: globalStyles.fontSize.medium,
      lineHeight: 22,
    },
    userText: {
      color: '#FFFFFF',
      fontWeight: '500',
    },
    botText: {
      color: themeColors.text,
      paddingLeft: 18, // Espacio para el icono
    },
    errorText: {
      color: themeColors.error,
    },
    
    // Indicador de simulación y modelo
    simulationIndicator: {
      fontSize: globalStyles.fontSize.xs,
      color: themeColors.textLight,
      marginTop: globalStyles.spacing.xs,
      fontStyle: 'italic',
    },
    modelIndicator: {
      fontSize: globalStyles.fontSize.xs,
      color: themeColors.textLight,
      marginTop: globalStyles.spacing.xs,
      fontStyle: 'italic',
    },
    
    // Selector de modelo
    modelSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: globalStyles.spacing.medium,
      paddingVertical: globalStyles.spacing.small,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      backgroundColor: themeColors.cardDark,
    },
    modelSelectorLabel: {
      fontSize: globalStyles.fontSize.small,
      fontWeight: 'bold',
      color: themeColors.text,
      marginRight: globalStyles.spacing.small,
    },
    pickerContainer: {
      flex: 1,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: globalStyles.borderRadius.small,
      backgroundColor: themeColors.card,
      height: 40,
      justifyContent: 'center',
      overflow: 'hidden',
      paddingHorizontal: globalStyles.spacing.small,
    },
    modelPicker: {
      height: 40,
      color: themeColors.text,
      width: '100%',
    },
    
    // Estilos del indicador de escritura
    typingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: globalStyles.spacing.medium,
      paddingVertical: globalStyles.spacing.small,
      borderRadius: globalStyles.borderRadius.large,
      borderBottomLeftRadius: 4,
      marginVertical: globalStyles.spacing.xs,
      marginBottom: globalStyles.spacing.small,
      backgroundColor: theme === 'dark' ? themeColors.card : themeColors.secondaryLight,
    },
    typingDots: {
      marginLeft: globalStyles.spacing.small,
    },
    
    // Estilos del área de entrada
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: globalStyles.spacing.small,
    },
    input: {
      flex: 1,
      borderRadius: globalStyles.borderRadius.pill,
      paddingHorizontal: globalStyles.spacing.medium,
      paddingVertical: globalStyles.spacing.small,
      maxHeight: 100,
      fontSize: globalStyles.fontSize.medium,
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: themeColors.inputBackground,
      color: themeColors.text,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: globalStyles.spacing.small,
      backgroundColor: themeColors.accent,
    },
    
    // Estilos del indicador de simulación
    simulatedIndicator: {
      fontSize: globalStyles.fontSize.xs,
      fontStyle: 'italic',
      marginTop: globalStyles.spacing.xs,
      textAlign: 'right',
      color: themeColors.warning,
    },
    
    // Estilos del componente de configuración de conexión
    connectionSettingsModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    connectionSettingsContent: {
      width: '90%',
      maxWidth: 500,
      borderRadius: globalStyles.borderRadius.medium,
      padding: globalStyles.spacing.large,
      backgroundColor: themeColors.card,
      ...globalStyles.shadow.medium,
    },
    connectionSettingsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: globalStyles.spacing.large,
    },
    connectionSettingsTitle: {
      fontSize: globalStyles.fontSize.large,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    connectionSettingsCloseButton: {
      padding: globalStyles.spacing.xs,
    },
    connectionLoadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: globalStyles.spacing.large,
      marginTop: globalStyles.spacing.large,
    },
    connectionLoadingText: {
      marginTop: globalStyles.spacing.medium,
      fontSize: globalStyles.fontSize.medium,
      fontWeight: 'bold',
      textAlign: 'center',
      color: themeColors.text,
    },
    connectionLoadingSubText: {
      marginTop: globalStyles.spacing.small,
      fontSize: globalStyles.fontSize.small,
      textAlign: 'center',
      color: themeColors.textSecondary,
      opacity: 0.8,
    },
    connectionStatusBox: {
      padding: globalStyles.spacing.large,
      borderRadius: globalStyles.borderRadius.medium,
      borderWidth: 1,
      marginTop: globalStyles.spacing.small,
    },
    connectionStatusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    connectionStatusTitle: {
      marginLeft: globalStyles.spacing.small,
      fontSize: globalStyles.fontSize.medium,
      fontWeight: 'bold',
    },
    connectionStatusDescription: {
      fontSize: globalStyles.fontSize.small,
      lineHeight: 20,
      color: themeColors.textSecondary,
      marginTop: globalStyles.spacing.small,
    },
    connectionRetryButton: {
      marginTop: globalStyles.spacing.medium,
      padding: globalStyles.spacing.small,
      borderRadius: globalStyles.borderRadius.small,
      alignItems: 'center',
    },
    connectionRetryButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
};
