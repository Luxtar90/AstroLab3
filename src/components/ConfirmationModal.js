import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Animated,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import globalStyles from '../styles/globalStyles';

const ConfirmationModal = ({ 
  visible, 
  title, 
  message, 
  onCancel, 
  onConfirm, 
  cancelText = "CANCELAR", 
  confirmText = "ACEPTAR",
  icon = "help-outline"
}) => {
  const { isDarkMode } = useTheme();
  const themeColors = isDarkMode ? globalStyles.darkColors : globalStyles.lightColors;
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[
              styles.modalContainer,
              {
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: themeColors.primary,
              }
            ]}>
              <LinearGradient
                colors={isDarkMode 
                  ? [themeColors.primary + '80', themeColors.accent + '80'] 
                  : [themeColors.primary + '40', themeColors.accent + '40']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
              >
                <MaterialIcons 
                  name={icon} 
                  size={36} 
                  color={isDarkMode ? '#FFFFFF' : themeColors.primary} 
                  style={styles.icon} 
                />
                <Text style={[
                  styles.title,
                  { color: isDarkMode ? '#FFFFFF' : themeColors.primary }
                ]}>
                  {title}
                </Text>
              </LinearGradient>
              
              <View style={styles.contentContainer}>
                <Text style={[
                  styles.message,
                  { color: isDarkMode ? '#FFFFFF' : themeColors.text }
                ]}>
                  {message}
                </Text>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.button, 
                      styles.cancelButton,
                      { borderColor: themeColors.textLight }
                    ]} 
                    onPress={onCancel}
                  >
                    <Text style={[
                      styles.buttonText, 
                      styles.cancelText,
                      { color: isDarkMode ? '#FFFFFF' : themeColors.textLight }
                    ]}>
                      {cancelText}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.button, 
                      styles.confirmButton,
                      { backgroundColor: themeColors.primary }
                    ]} 
                    onPress={onConfirm}
                  >
                    <Text style={[
                      styles.buttonText, 
                      styles.confirmText
                    ]}>
                      {confirmText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const modalWidth = width * 0.85;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: modalWidth,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderWidth: 1,
  },
  headerGradient: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  confirmButton: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelText: {
    opacity: 0.8,
  },
  confirmText: {
    color: '#FFFFFF',
  },
});

export default ConfirmationModal;
