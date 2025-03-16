import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import globalStyles from '../styles/globalStyles';
import { useTheme } from '../context/ThemeContext';

const ResultDisplay = ({ 
  title, 
  results = [], 
  style = {},
  visible = true,
  icon = 'analytics',
}) => {
  const { isDarkMode } = useTheme();
  const themeColors = isDarkMode ? globalStyles.darkColors : globalStyles.lightColors;

  if (!visible || results.length === 0) {
    return null;
  }

  return (
    <View style={[{
      backgroundColor: themeColors.card,
      borderRadius: globalStyles.borderRadius.medium,
      padding: globalStyles.spacing.medium,
      marginBottom: globalStyles.spacing.large,
      ...globalStyles.shadow.medium,
    }, style]}>
      {title && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: globalStyles.spacing.medium,
          paddingBottom: globalStyles.spacing.small,
          borderBottomWidth: 1,
          borderBottomColor: themeColors.border,
        }}>
          <MaterialIcons 
            name={icon} 
            size={24} 
            color={themeColors.primary} 
            style={{
              marginRight: globalStyles.spacing.small,
            }} 
          />
          <Text style={{
            fontSize: globalStyles.fontSize.large,
            fontWeight: 'bold',
            color: themeColors.text,
          }}>{title}</Text>
        </View>
      )}
      
      {results.map((result, index) => (
        <View key={index} style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: globalStyles.spacing.small,
          paddingBottom: globalStyles.spacing.xs,
          borderBottomWidth: 1,
          borderBottomColor: themeColors.border + '30', // 30% opacity
        }}>
          <Text style={{
            flex: 1,
            fontSize: globalStyles.fontSize.medium,
            fontWeight: 'bold',
            color: themeColors.text,
          }}>{result.label}:</Text>
          <Text style={{
            fontSize: globalStyles.fontSize.medium,
            fontWeight: 'bold',
            color: themeColors.primary,
            marginRight: globalStyles.spacing.xs,
          }}>{result.value}</Text>
          {result.unit && <Text style={{
            fontSize: globalStyles.fontSize.small,
            color: themeColors.textLight,
          }}>{result.unit}</Text>}
        </View>
      ))}
    </View>
  );
};

export default ResultDisplay;
