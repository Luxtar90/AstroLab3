import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import globalStyles from '../styles/globalStyles';
import { useTheme } from '../context/ThemeContext';

const InputField = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default',
  error = null,
  style = {},
  inputStyle = {},
  icon = null,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  autoCapitalize = 'sentences',
  onBlur,
  onFocus,
}) => {
  const { isDarkMode } = useTheme();
  const themeColors = isDarkMode ? globalStyles.darkColors : globalStyles.lightColors;
  
  const containerStyle = {
    marginBottom: globalStyles.spacing.medium,
    ...style
  };
  
  const labelStyle = {
    fontSize: globalStyles.fontSize.medium,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: globalStyles.spacing.xs,
  };
  
  const inputContainerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: error ? themeColors.error : themeColors.border,
    borderRadius: globalStyles.borderRadius.small,
    backgroundColor: themeColors.inputBackground,
    paddingHorizontal: globalStyles.spacing.medium,
  };
  
  const iconStyle = {
    marginRight: globalStyles.spacing.small,
  };
  
  const textInputStyle = {
    flex: 1,
    color: themeColors.text,
    paddingVertical: globalStyles.spacing.small,
    fontSize: globalStyles.fontSize.medium,
    ...inputStyle
  };
  
  const errorTextStyle = {
    color: themeColors.error,
    fontSize: globalStyles.fontSize.small,
    marginTop: globalStyles.spacing.xs,
  };
  
  return (
    <View style={containerStyle}>
      {label && (
        <Text style={labelStyle}>
          {label}
        </Text>
      )}
      
      <View style={inputContainerStyle}>
        {icon && (
          <MaterialIcons 
            name={icon} 
            size={20} 
            color={themeColors.text} 
            style={iconStyle}
          />
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={themeColors.textLight}
          keyboardType={keyboardType}
          style={textInputStyle}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </View>
      
      {error && (
        <Text style={errorTextStyle}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default InputField;
