import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const CalculationContext = createContext();

// Proveedor del contexto
export const CalculationProvider = ({ children }) => {
  // Estado para almacenar los resultados de los cálculos
  const [calculationResults, setCalculationResults] = useState({
    molarMass: null,
    formula: '',
    elements: {},
    concentration: null,
    purity: null,
    dilution: null,
    density: null
  });

  // Función para actualizar los resultados
  const updateCalculationResults = (type, data) => {
    setCalculationResults(prevState => ({
      ...prevState,
      [type]: data
    }));
  };

  // Función para obtener el resultado de un cálculo específico
  const getCalculationResult = (type) => {
    return calculationResults[type];
  };

  // Función para limpiar todos los resultados
  const clearCalculationResults = () => {
    setCalculationResults({
      molarMass: null,
      formula: '',
      elements: {},
      concentration: null,
      purity: null,
      dilution: null,
      density: null
    });
  };

  // Valor del contexto
  const value = {
    calculationResults,
    updateCalculationResults,
    getCalculationResult,
    clearCalculationResults
  };

  return (
    <CalculationContext.Provider value={value}>
      {children}
    </CalculationContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCalculation = () => {
  const context = useContext(CalculationContext);
  if (!context) {
    throw new Error('useCalculation debe ser usado dentro de un CalculationProvider');
  }
  return context;
};
