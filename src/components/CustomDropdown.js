import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../styles/globalStyles';
import { useTheme } from '../context/ThemeContext';

const CustomDropdown = ({ 
  label, 
  value, 
  onValueChange, 
  options, 
  placeholder = 'Select an option',
  error = null,
  style = {},
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { isDarkMode } = useTheme();
  const themeColors = isDarkMode ? globalStyles.darkColors : globalStyles.lightColors;

  const handleSelect = (item) => {
    onValueChange(item.value);
    setModalVisible(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <View style={[{
      marginBottom: globalStyles.spacing.medium,
    }, style]}>
      {label && (
        <Text style={{
          fontSize: globalStyles.fontSize.medium,
          fontWeight: 'bold',
          color: themeColors.text,
          marginBottom: globalStyles.spacing.xs,
        }}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity 
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: error ? themeColors.error : themeColors.border,
          borderRadius: globalStyles.borderRadius.small,
          backgroundColor: themeColors.inputBackground,
          padding: globalStyles.spacing.medium,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{
          fontSize: globalStyles.fontSize.medium,
          color: selectedOption ? themeColors.text : themeColors.textLight,
        }}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons 
          name="arrow-down" 
          size={24} 
          color={themeColors.text} 
        />
      </TouchableOpacity>
      
      {error && (
        <Text style={{
          color: themeColors.error,
          fontSize: globalStyles.fontSize.small,
          marginTop: globalStyles.spacing.xs,
        }}>
          {error}
        </Text>
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View 
            style={{
              width: '80%',
              maxHeight: '70%',
              backgroundColor: themeColors.card,
              borderRadius: globalStyles.borderRadius.medium,
              padding: globalStyles.spacing.medium,
              ...globalStyles.shadow.medium,
            }}
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: globalStyles.spacing.medium,
              paddingBottom: globalStyles.spacing.small,
              borderBottomWidth: 1,
              borderBottomColor: themeColors.border,
            }}>
              <Text style={{
                fontSize: globalStyles.fontSize.large,
                fontWeight: 'bold',
                color: themeColors.text,
              }}>
                {label || 'Select an option'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={{
                    padding: globalStyles.spacing.medium,
                    borderBottomWidth: 1,
                    borderBottomColor: themeColors.border + '30',
                  }}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={{
                    fontSize: globalStyles.fontSize.medium,
                    color: themeColors.text,
                  }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomDropdown;
