import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import globalStyles from '../styles/globalStyles';

const CustomButton = ({
  title,
  onPress,
  type = 'primary', // primary, secondary, outline, danger, success
  size = 'medium', // small, medium, large
  icon = null,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  style = {},
  textStyle = {},
  fullWidth = false,
}) => {
  const { isDarkMode } = useTheme();
  const themeColors = isDarkMode ? globalStyles.darkColors : globalStyles.lightColors;
  
  // Determinar los estilos según el tipo de botón
  const getButtonTypeStyle = () => {
    switch (type) {
      case 'secondary':
        return {
          backgroundColor: themeColors.secondary,
          textColor: '#FFFFFF',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: themeColors.primary,
          borderWidth: 1,
          textColor: themeColors.primary,
        };
      case 'danger':
        return {
          backgroundColor: themeColors.error,
          textColor: '#FFFFFF',
        };
      case 'success':
        return {
          backgroundColor: themeColors.success,
          textColor: '#FFFFFF',
        };
      case 'primary':
      default:
        return {
          backgroundColor: themeColors.primary,
          textColor: '#FFFFFF',
        };
    }
  };
  
  // Determinar los estilos según el tamaño del botón
  const getButtonSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: globalStyles.spacing.small,
          paddingHorizontal: globalStyles.spacing.medium,
          fontSize: globalStyles.fontSize.small,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingVertical: globalStyles.spacing.medium,
          paddingHorizontal: globalStyles.spacing.large,
          fontSize: globalStyles.fontSize.large,
          iconSize: 24,
        };
      case 'medium':
      default:
        return {
          paddingVertical: globalStyles.spacing.medium,
          paddingHorizontal: globalStyles.spacing.medium,
          fontSize: globalStyles.fontSize.medium,
          iconSize: 20,
        };
    }
  };
  
  const typeStyle = getButtonTypeStyle();
  const sizeStyle = getButtonSizeStyle();
  
  const buttonStyle = {
    backgroundColor: typeStyle.backgroundColor,
    borderColor: typeStyle.borderColor,
    borderWidth: typeStyle.borderWidth,
    borderRadius: globalStyles.borderRadius.medium,
    paddingVertical: sizeStyle.paddingVertical,
    paddingHorizontal: sizeStyle.paddingHorizontal,
    opacity: disabled ? 0.6 : 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : undefined,
    ...globalStyles.shadow.small,
    ...style,
  };
  
  const buttonTextStyle = {
    color: typeStyle.textColor,
    fontSize: sizeStyle.fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
    ...textStyle,
  };
  
  const iconStyle = {
    marginRight: iconPosition === 'left' ? globalStyles.spacing.small : 0,
    marginLeft: iconPosition === 'right' ? globalStyles.spacing.small : 0,
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={typeStyle.textColor} 
        />
      );
    }
    
    return (
      <>
        {icon && iconPosition === 'left' && (
          <MaterialIcons 
            name={icon} 
            size={sizeStyle.iconSize} 
            color={typeStyle.textColor} 
            style={iconStyle} 
          />
        )}
        <Text style={buttonTextStyle}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <MaterialIcons 
            name={icon} 
            size={sizeStyle.iconSize} 
            color={typeStyle.textColor} 
            style={iconStyle} 
          />
        )}
      </>
    );
  };
  
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default CustomButton;
