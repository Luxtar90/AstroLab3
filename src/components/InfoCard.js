import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import globalStyles from '../styles/globalStyles';

const InfoCard = ({
  title,
  content,
  icon,
  onPress,
  type = 'default', // default, info, success, warning, error
  style = {},
  titleStyle = {},
  contentStyle = {},
}) => {
  const { isDarkMode } = useTheme();
  const themeColors = isDarkMode ? globalStyles.darkColors : globalStyles.lightColors;
  
  // Determinar los estilos según el tipo de tarjeta
  const getCardTypeStyle = () => {
    switch (type) {
      case 'info':
        return {
          backgroundColor: themeColors.info + '20', // 20% opacity
          borderColor: themeColors.info,
          iconColor: themeColors.info,
        };
      case 'success':
        return {
          backgroundColor: themeColors.success + '20',
          borderColor: themeColors.success,
          iconColor: themeColors.success,
        };
      case 'warning':
        return {
          backgroundColor: themeColors.warning + '20',
          borderColor: themeColors.warning,
          iconColor: themeColors.warning,
        };
      case 'error':
        return {
          backgroundColor: themeColors.error + '20',
          borderColor: themeColors.error,
          iconColor: themeColors.error,
        };
      case 'default':
      default:
        return {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
          iconColor: themeColors.primary,
        };
    }
  };

  // Mapear los nombres de iconos de MaterialIcons a Ionicons
  const getIoniconName = (materialIconName) => {
    const iconMap = {
      'info': 'information-circle',
      'check_circle': 'checkmark-circle',
      'warning': 'warning',
      'error': 'alert-circle',
      'help': 'help-circle',
      'star': 'star',
      'favorite': 'heart',
      'settings': 'settings',
      'person': 'person',
      'home': 'home',
      // Añadir más mapeos según sea necesario
    };
    
    return iconMap[materialIconName] || 'information-circle';
  };

  const cardTypeStyle = getCardTypeStyle();
  const ioniconName = getIoniconName(icon);
  
  const cardStyle = {
    backgroundColor: cardTypeStyle.backgroundColor,
    borderRadius: globalStyles.borderRadius.medium,
    borderLeftWidth: 4,
    borderLeftColor: cardTypeStyle.borderColor,
    padding: globalStyles.spacing.medium,
    marginVertical: globalStyles.spacing.small,
    ...globalStyles.shadow.small,
    ...style,
  };

  const touchableCardStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const contentContainerStyle = {
    flex: 1,
  };

  const titleContainerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: globalStyles.spacing.small,
  };

  const iconStyle = {
    marginRight: globalStyles.spacing.small,
  };

  const titleTextStyle = {
    fontSize: globalStyles.fontSize.medium,
    fontWeight: 'bold',
    color: themeColors.text,
    ...titleStyle,
  };

  const contentTextStyle = {
    fontSize: globalStyles.fontSize.small,
    color: themeColors.text,
    ...contentStyle,
  };

  const arrowIconStyle = {
    marginLeft: globalStyles.spacing.small,
  };

  // Renderizar el contenido de la tarjeta
  const renderCardContent = () => (
    <>
      {(title || icon) && (
        <View style={titleContainerStyle}>
          {icon && (
            <Ionicons
              name={ioniconName}
              size={20}
              color={cardTypeStyle.iconColor}
              style={iconStyle}
            />
          )}
          {title && <Text style={titleTextStyle}>{title}</Text>}
        </View>
      )}
      {content && (
        typeof content === 'string' 
          ? <Text style={contentTextStyle}>{content}</Text>
          : content
      )}
    </>
  );

  // Si hay un onPress, envolver en TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity style={[cardStyle, touchableCardStyle]} onPress={onPress} activeOpacity={0.7}>
        <View style={contentContainerStyle}>
          {renderCardContent()}
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={themeColors.text}
          style={arrowIconStyle}
        />
      </TouchableOpacity>
    );
  }

  // Si no hay onPress, renderizar como View normal
  return (
    <View style={cardStyle}>
      {renderCardContent()}
    </View>
  );
};

export default InfoCard;
