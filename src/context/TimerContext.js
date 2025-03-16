import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crear el contexto
const TimerContext = createContext();

// Clave para almacenar los datos en AsyncStorage
const TIMER_STORAGE_KEY = '@astrolab_timer_data';
const CELL_COUNTER_STORAGE_KEY = '@astrolab_cell_counter_data';

// Proveedor del contexto
export const TimerProvider = ({ children }) => {
  // Estados para el timer
  const [timerHistory, setTimerHistory] = useState([]);
  
  // Estados para el contador de células
  const [cellCounterHistory, setCellCounterHistory] = useState([]);
  
  // Cargar datos al iniciar la aplicación
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar historial de timers
        const timerData = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
        if (timerData) {
          setTimerHistory(JSON.parse(timerData));
        }
        
        // Cargar historial de contador de células
        const cellCounterData = await AsyncStorage.getItem(CELL_COUNTER_STORAGE_KEY);
        if (cellCounterData) {
          setCellCounterHistory(JSON.parse(cellCounterData));
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Guardar un nuevo timer en el historial
  const saveTimer = async (timerData) => {
    try {
      const newHistory = [...timerHistory, timerData];
      setTimerHistory(newHistory);
      await AsyncStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(newHistory));
      return true;
    } catch (error) {
      console.error('Error al guardar timer:', error);
      return false;
    }
  };
  
  // Limpiar el historial de timers
  const clearTimerHistory = async () => {
    try {
      setTimerHistory([]);
      await AsyncStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error al limpiar historial de timers:', error);
      return false;
    }
  };
  
  // Guardar una nueva sesión de contador de células
  const saveCellCounterSession = async (sessionData) => {
    try {
      const newHistory = [...cellCounterHistory, sessionData];
      setCellCounterHistory(newHistory);
      await AsyncStorage.setItem(CELL_COUNTER_STORAGE_KEY, JSON.stringify(newHistory));
      return true;
    } catch (error) {
      console.error('Error al guardar sesión de contador:', error);
      return false;
    }
  };
  
  // Limpiar el historial de contador de células
  const clearCellCounterHistory = async () => {
    try {
      setCellCounterHistory([]);
      await AsyncStorage.setItem(CELL_COUNTER_STORAGE_KEY, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error al limpiar historial de contador:', error);
      return false;
    }
  };
  
  // Valor del contexto
  const value = {
    timerHistory,
    saveTimer,
    clearTimerHistory,
    cellCounterHistory,
    saveCellCounterSession,
    clearCellCounterHistory,
  };
  
  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer debe ser usado dentro de un TimerProvider');
  }
  return context;
};
