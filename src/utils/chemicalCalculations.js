// Periodic table data with atomic masses
const periodicTable = {
  'H': 1.008,
  'He': 4.0026,
  'Li': 6.94,
  'Be': 9.0122,
  'B': 10.81,
  'C': 12.011,
  'N': 14.007,
  'O': 15.999,
  'F': 18.998,
  'Ne': 20.180,
  'Na': 22.990,
  'Mg': 24.305,
  'Al': 26.982,
  'Si': 28.085,
  'P': 30.974,
  'S': 32.06,
  'Cl': 35.45,
  'Ar': 39.948,
  'K': 39.098,
  'Ca': 40.078,
  'Sc': 44.956,
  'Ti': 47.867,
  'V': 50.942,
  'Cr': 51.996,
  'Mn': 54.938,
  'Fe': 55.845,
  'Co': 58.933,
  'Ni': 58.693,
  'Cu': 63.546,
  'Zn': 65.38,
  'Ga': 69.723,
  'Ge': 72.630,
  'As': 74.922,
  'Se': 78.971,
  'Br': 79.904,
  'Kr': 83.798,
  'Rb': 85.468,
  'Sr': 87.62,
  'Y': 88.906,
  'Zr': 91.224,
  'Nb': 92.906,
  'Mo': 95.95,
  'Tc': 98,
  'Ru': 101.07,
  'Rh': 102.91,
  'Pd': 106.42,
  'Ag': 107.87,
  'Cd': 112.41,
  'In': 114.82,
  'Sn': 118.71,
  'Sb': 121.76,
  'Te': 127.60,
  'I': 126.90,
  'Xe': 131.29,
  'Cs': 132.91,
  'Ba': 137.33,
  'La': 138.91,
  'Ce': 140.12,
  'Pr': 140.91,
  'Nd': 144.24,
  'Pm': 145,
  'Sm': 150.36,
  'Eu': 151.96,
  'Gd': 157.25,
  'Tb': 158.93,
  'Dy': 162.50,
  'Ho': 164.93,
  'Er': 167.26,
  'Tm': 168.93,
  'Yb': 173.05,
  'Lu': 174.97,
  'Hf': 178.49,
  'Ta': 180.95,
  'W': 183.84,
  'Re': 186.21,
  'Os': 190.23,
  'Ir': 192.22,
  'Pt': 195.08,
  'Au': 196.97,
  'Hg': 200.59,
  'Tl': 204.38,
  'Pb': 207.2,
  'Bi': 208.98,
  'Po': 209,
  'At': 210,
  'Rn': 222,
  'Fr': 223,
  'Ra': 226,
  'Ac': 227,
  'Th': 232.04,
  'Pa': 231.04,
  'U': 238.03,
  'Np': 237,
  'Pu': 244,
  'Am': 243,
  'Cm': 247,
  'Bk': 247,
  'Cf': 251,
  'Es': 252,
  'Fm': 257,
  'Md': 258,
  'No': 259,
  'Lr': 266,
  'Rf': 267,
  'Db': 268,
  'Sg': 269,
  'Bh': 270,
  'Hs': 277,
  'Mt': 278,
  'Ds': 281,
  'Rg': 282,
  'Cn': 285,
  'Nh': 286,
  'Fl': 289,
  'Mc': 290,
  'Lv': 293,
  'Ts': 294,
  'Og': 294
};

// Densidades aproximadas a temperatura ambiente (25°C) para compuestos comunes
const commonCompoundDensities = {
  'H2O': { density: 1.0, temperature: 25 },  // Agua
  'CO2': { density: 0.001977, temperature: 25 }, // Dióxido de carbono (gas)
  'C6H12O6': { density: 1.54, temperature: 25 }, // Glucosa
  'NaCl': { density: 2.16, temperature: 25 }, // Cloruro de sodio
  'CH3OH': { density: 0.792, temperature: 25 }, // Metanol
  'C2H5OH': { density: 0.789, temperature: 25 }, // Etanol
  'C3H8O3': { density: 1.26, temperature: 25 }, // Glicerol
  'HCl': { density: 1.49, temperature: 25 }, // Ácido clorhídrico (concentrado)
  'H2SO4': { density: 1.84, temperature: 25 }, // Ácido sulfúrico (concentrado)
  'HNO3': { density: 1.51, temperature: 25 }, // Ácido nítrico (concentrado)
  'NH3': { density: 0.000769, temperature: 25 }, // Amoníaco (gas)
  'CH4': { density: 0.000656, temperature: 25 }, // Metano (gas)
  'C6H6': { density: 0.879, temperature: 25 }, // Benceno
  'C7H8': { density: 0.867, temperature: 25 }, // Tolueno
  'C8H10': { density: 0.865, temperature: 25 }, // Xileno
  'CH3COOH': { density: 1.049, temperature: 25 }, // Ácido acético
  'C3H6O': { density: 0.784, temperature: 25 }, // Acetona
  'C4H10': { density: 0.00249, temperature: 25 }, // Butano (gas)
  'C3H8': { density: 0.00201, temperature: 25 }, // Propano (gas)
  'O2': { density: 0.001331, temperature: 25 }, // Oxígeno (gas)
  'N2': { density: 0.001165, temperature: 25 }, // Nitrógeno (gas)
  'He': { density: 0.000166, temperature: 25 }, // Helio (gas)
  'Ar': { density: 0.001662, temperature: 25 }, // Argón (gas)
  'C12H22O11': { density: 1.59, temperature: 25 }, // Sacarosa
  'C2H3NaO2': { density: 1.528, temperature: 25 }, // Acetato de sodio
  'KCl': { density: 1.98, temperature: 25 }, // Cloruro de potasio
  'CaCl2': { density: 2.15, temperature: 25 }, // Cloruro de calcio
  'MgCl2': { density: 2.32, temperature: 25 }, // Cloruro de magnesio
  'K2SO4': { density: 2.66, temperature: 25 }, // Sulfato de potasio
  'Na2SO4': { density: 2.68, temperature: 25 }, // Sulfato de sodio
  'CaCO3': { density: 2.71, temperature: 25 }, // Carbonato de calcio
  'NaHCO3': { density: 2.20, temperature: 25 }, // Bicarbonato de sodio
  'KMnO4': { density: 2.70, temperature: 25 }, // Permanganato de potasio
  'AgNO3': { density: 4.35, temperature: 25 }, // Nitrato de plata
  'FeCl3': { density: 2.90, temperature: 25 }, // Cloruro férrico
  'ZnSO4': { density: 3.54, temperature: 25 }, // Sulfato de zinc
  'CuSO4': { density: 3.60, temperature: 25 }, // Sulfato de cobre
  'CH1.8O0.5N0.2': { density: 1.05, temperature: 25 }, // Fórmula promedio bacterias
  'CH1.83O0.55N0.25': { density: 1.06, temperature: 25 }, // Aerobacter aerogenes
  'CH1.77O0.49N0.24': { density: 1.05, temperature: 25 }, // Escherichia coli
  'CH1.75O0.43N0.22': { density: 1.04, temperature: 25 }, // Klebsiella aerogenes
};

/**
 * Parse a chemical formula into its constituent elements and their quantities
 * @param {string} formula - Chemical formula (e.g., "H2O", "CO2", "CH1.8O0.5N0.2")
 * @returns {Object} - Object with elements as keys and quantities as values
 */
export const parseFormula = (formula) => {
  if (!formula || formula.trim() === '') {
    throw new Error('Formula cannot be empty');
  }

  const elements = {};
  let i = 0;

  while (i < formula.length) {
    // If uppercase letter, it's the start of an element
    if (formula[i].match(/[A-Z]/)) {
      let element = formula[i];
      i++;

      // If lowercase letter, it's part of the element symbol
      while (i < formula.length && formula[i].match(/[a-z]/)) {
        element += formula[i];
        i++;
      }

      // Check if element exists in periodic table
      if (!periodicTable[element]) {
        throw new Error(`Unknown element: ${element}`);
      }

      // If number or decimal point, it's the quantity of the element
      let quantity = '';
      while (i < formula.length && (formula[i].match(/[0-9]/) || formula[i] === '.')) {
        quantity += formula[i];
        i++;
      }

      // If no number specified, quantity is 1
      quantity = quantity ? parseFloat(quantity) : 1;

      // Add to elements object
      elements[element] = (elements[element] || 0) + quantity;
    } else if (formula[i] === '(') {
      // Handle parentheses
      i++;
      let subFormula = '';
      let parenthesesCount = 1;

      while (i < formula.length && parenthesesCount > 0) {
        if (formula[i] === '(') parenthesesCount++;
        if (formula[i] === ')') parenthesesCount--;

        if (parenthesesCount > 0) {
          subFormula += formula[i];
        }
        i++;
      }

      // If number or decimal point after closing parenthesis, it's the multiplier
      let multiplier = '';
      while (i < formula.length && (formula[i].match(/[0-9]/) || formula[i] === '.')) {
        multiplier += formula[i];
        i++;
      }

      // If no number specified, multiplier is 1
      multiplier = multiplier ? parseFloat(multiplier) : 1;

      // Parse subformula and add to elements
      const subElements = parseFormula(subFormula);
      for (const element in subElements) {
        elements[element] = (elements[element] || 0) + subElements[element] * multiplier;
      }
    } else {
      // Skip unexpected characters
      i++;
    }
  }

  return elements;
};

/**
 * Calculate the molar mass of a chemical compound
 * @param {string} formula - Chemical formula (e.g., "H2O", "CO2")
 * @returns {number} - Molar mass in g/mol
 */
export const calculateMolarMass = (formula) => {
  try {
    const elements = parseFormula(formula);
    let molarMass = 0;

    for (const element in elements) {
      if (!periodicTable[element]) {
        throw new Error(`Unknown element: ${element}`);
      }
      molarMass += periodicTable[element] * elements[element];
    }

    // Devolver como número, no como cadena
    return parseFloat(molarMass.toFixed(4));
  } catch (error) {
    throw error;
  }
};

/**
 * Calculate the amount of substance needed based on purity
 * @param {number} desiredAmount - Desired amount in grams
 * @param {number} purity - Purity percentage (0-100)
 * @returns {number} - Required amount in grams
 */
export const calculateAmountWithPurity = (desiredAmount, purity) => {
  if (purity <= 0 || purity > 100) {
    throw new Error('Purity must be between 0 and 100');
  }
  
  const requiredAmount = (desiredAmount * 100) / purity;
  return parseFloat(requiredAmount.toFixed(4));
};

/**
 * Calculate concentration for a solution
 * @param {number} mass - Mass in grams
 * @param {number} volume - Volume in specified unit
 * @param {string} volumeUnit - Volume unit (L, mL, uL)
 * @param {string} concentrationType - Type of concentration (M, m, N, F, %(m/v), %(m/m), %(v/v), ppm, ppb, ppt)
 * @param {number} molarMass - Molar mass of the compound (for Molarity calculations)
 * @param {number} density - Density of the solution (g/mL) for certain calculations
 * @returns {number} - Concentration in specified units
 */
export const calculateConcentration = (mass, volume, volumeUnit, concentrationType, molarMass = null, density = null) => {
  // Convert volume to liters
  let volumeInLiters;
  switch (volumeUnit) {
    case 'L':
      volumeInLiters = volume;
      break;
    case 'mL':
      volumeInLiters = volume / 1000;
      break;
    case 'uL':
      volumeInLiters = volume / 1000000;
      break;
    default:
      throw new Error('Invalid volume unit');
  }

  // Calculate concentration based on type
  switch (concentrationType) {
    case 'M': // Molaridad (mol/L)
      if (!molarMass) {
        throw new Error('Molar mass is required for Molarity calculations');
      }
      return parseFloat((mass / molarMass / volumeInLiters).toFixed(4));
    
    case 'm': // Molalidad (mol/kg de disolvente)
      if (!molarMass) {
        throw new Error('Molar mass is required for Molality calculations');
      }
      // Asumimos que la masa del disolvente = volumen * densidad - masa del soluto
      if (!density) {
        throw new Error('Density is required for Molality calculations');
      }
      const solventMass = (volumeInLiters * 1000 * density) - mass; // en gramos
      if (solventMass <= 0) {
        throw new Error('Invalid solvent mass calculated');
      }
      return parseFloat((mass / molarMass / (solventMass / 1000)).toFixed(4));
    
    case 'N': // Normalidad (eq/L)
      if (!molarMass) {
        throw new Error('Molar mass and equivalence factor are required for Normality calculations');
      }
      // Para simplificar, asumimos factor de equivalencia = 1
      // En una implementación real, se necesitaría el factor de equivalencia específico
      const equivalenceFactor = 1;
      return parseFloat((mass / (molarMass / equivalenceFactor) / volumeInLiters).toFixed(4));
    
    case 'F': // Formalidad (peso-fórmula-gramo/L)
      if (!molarMass) {
        throw new Error('Molar mass is required for Formality calculations');
      }
      return parseFloat((mass / molarMass / volumeInLiters).toFixed(4));
    
    case '%(m/v)': // Porcentaje masa/volumen
      // Concentración en g/100mL
      return parseFloat((mass / (volumeInLiters * 10)).toFixed(4));
    
    case '%(m/m)': // Porcentaje masa/masa
      if (!density) {
        throw new Error('Density is required for mass/mass percentage calculations');
      }
      // Masa total = masa soluto + masa disolvente
      const totalMass = mass + (volumeInLiters * 1000 * density) - mass;
      return parseFloat((mass / totalMass * 100).toFixed(4));
    
    case '%(v/v)': // Porcentaje volumen/volumen
      // Para este cálculo necesitaríamos el volumen del soluto
      // Asumimos que tenemos la densidad del soluto
      if (!density) {
        throw new Error('Density of solute is required for volume/volume percentage calculations');
      }
      const soluteVolume = mass / density; // en mL
      return parseFloat((soluteVolume / (volumeInLiters * 1000) * 100).toFixed(4));
    
    case 'ppm': // Partes por millón (mg/L)
      return parseFloat((mass / volumeInLiters * 1000).toFixed(4));
    
    case 'ppb': // Partes por billón (μg/L)
      return parseFloat((mass / volumeInLiters * 1000000).toFixed(4));
    
    case 'ppt': // Partes por trillón (ng/L)
      return parseFloat((mass / volumeInLiters * 1000000000).toFixed(4));
    
    default:
      throw new Error('Invalid concentration type');
  }
};

/**
 * Calculate the mass of solute needed to achieve a desired concentration
 * @param {number} concentration - Desired concentration
 * @param {number} volume - Volume in specified unit
 * @param {string} volumeUnit - Volume unit (L, mL, uL)
 * @param {string} concentrationType - Type of concentration (M, m, N, F, %(m/v), %(m/m), %(v/v), ppm, ppb, ppt)
 * @param {number} molarMass - Molar mass of the compound (for Molarity calculations)
 * @param {number} density - Density of the solution (g/mL) for certain calculations
 * @param {Object} additionalParams - Additional parameters for specific calculations
 * @returns {number} - Mass of solute needed in grams
 */
export const calculateSoluteMass = (
  concentration, 
  volume, 
  volumeUnit, 
  concentrationType, 
  molarMass = null, 
  density = null,
  additionalParams = {}
) => {
  // Convert volume to liters
  let volumeInLiters;
  switch (volumeUnit) {
    case 'L':
      volumeInLiters = volume;
      break;
    case 'mL':
      volumeInLiters = volume / 1000;
      break;
    case 'uL':
      volumeInLiters = volume / 1000000;
      break;
    default:
      throw new Error('Invalid volume unit');
  }

  // Calculate mass based on concentration type
  switch (concentrationType) {
    case 'M': // Molaridad (mol/L)
      if (!molarMass) {
        throw new Error('Molar mass is required for Molarity calculations');
      }
      return parseFloat((concentration * volumeInLiters * molarMass).toFixed(4));
    
    case 'm': // Molalidad (mol/kg de disolvente)
      if (!molarMass) {
        throw new Error('Molar mass is required for Molality calculations');
      }
      if (!density) {
        throw new Error('Density is required for Molality calculations');
      }
      
      // Ecuación: m = n_soluto / kg_disolvente
      // Donde: n_soluto = masa_soluto / molarMass
      // Por lo tanto: masa_soluto = m * kg_disolvente * molarMass
      
      // Para calcular kg_disolvente, necesitamos resolver:
      // masa_total = masa_soluto + masa_disolvente
      // masa_total = volumen * densidad
      // masa_disolvente = masa_total - masa_soluto
      
      // Esto nos lleva a una ecuación:
      // masa_soluto = m * (volumen*densidad - masa_soluto)/1000 * molarMass
      // Resolviendo para masa_soluto:
      
      const volumeInMilliliters = volumeInLiters * 1000;
      const totalMass = volumeInMilliliters * density;
      const soluteMass = (concentration * molarMass * totalMass) / (1000 + concentration * molarMass);
      
      return parseFloat(soluteMass.toFixed(4));
    
    case 'N': // Normalidad (eq/L)
      // Usando la fórmula N = g/(V*Peq)
      // Despejando g: g = N * V * Peq
      
      // Si tenemos el peso equivalente directamente
      if (additionalParams.equivalentWeight) {
        return parseFloat((concentration * volumeInLiters * additionalParams.equivalentWeight).toFixed(4));
      }
      
      // Si tenemos la masa molar y el factor de equivalencia
      if (molarMass && additionalParams.equivalenceFactor) {
        const equivalentWeight = molarMass / additionalParams.equivalenceFactor;
        return parseFloat((concentration * volumeInLiters * equivalentWeight).toFixed(4));
      }
      
      // Si tenemos la fórmula y el tipo de reacción
      if (additionalParams.formula && additionalParams.reactionType) {
        try {
          const equivalentWeight = calculateEquivalentWeight(
            additionalParams.formula, 
            additionalParams.reactionType, 
            additionalParams.valence
          );
          return parseFloat((concentration * volumeInLiters * equivalentWeight).toFixed(4));
        } catch (error) {
          throw new Error(`Error calculating equivalent weight: ${error.message}`);
        }
      }
      
      // Si solo tenemos la masa molar, asumimos factor = 1
      if (molarMass) {
        return parseFloat((concentration * volumeInLiters * molarMass).toFixed(4));
      }
      
      throw new Error('Insufficient data for Normality calculations. Need either equivalent weight, or molar mass and equivalence factor.');
    
    case 'F': // Formalidad (peso-fórmula-gramo/L)
      if (!molarMass) {
        throw new Error('Molar mass is required for Formality calculations');
      }
      return parseFloat((concentration * volumeInLiters * molarMass).toFixed(4));
    
    case '%(m/v)': // Porcentaje masa/volumen
      // Concentración en g/100mL
      return parseFloat((concentration * volumeInLiters * 10).toFixed(4));
    
    case '%(m/m)': // Porcentaje masa/masa
      if (!density) {
        throw new Error('Density is required for mass/mass percentage calculations');
      }
      
      // Ecuación: %(m/m) = (masa_soluto / masa_total) * 100
      // Donde: masa_total = masa_soluto + masa_disolvente
      // masa_disolvente = volumen * densidad - masa_soluto
      
      // Resolviendo para masa_soluto:
      // %(m/m) = (masa_soluto / (masa_soluto + volumen*densidad - masa_soluto)) * 100
      // %(m/m) = (masa_soluto / (volumen*densidad)) * 100
      // masa_soluto = (%(m/m) * volumen * densidad) / 100
      
      const volumeInML = volumeInLiters * 1000;
      const massSolvent = volumeInML * density;
      const massTotal = massSolvent * 100 / (100 - concentration);
      const massSolute = massTotal - massSolvent;
      
      return parseFloat(massSolute.toFixed(4));
    
    case '%(v/v)': // Porcentaje volumen/volumen
      if (!density) {
        throw new Error('Density of solute is required for volume/volume percentage calculations');
      }
      
      // Ecuación: %(v/v) = (volumen_soluto / volumen_total) * 100
      // volumen_soluto = (%(v/v) * volumen_total) / 100
      // masa_soluto = volumen_soluto * densidad_soluto
      
      const soluteVolume = (concentration * volumeInLiters * 1000) / 100;
      return parseFloat((soluteVolume * density).toFixed(4));
    
    case 'ppm': // Partes por millón (mg/L)
      return parseFloat((concentration * volumeInLiters / 1000).toFixed(4));
    
    case 'ppb': // Partes por billón (μg/L)
      return parseFloat((concentration * volumeInLiters / 1000000).toFixed(4));
    
    case 'ppt': // Partes por trillón (ng/L)
      return parseFloat((concentration * volumeInLiters / 1000000000).toFixed(4));
    
    default:
      throw new Error('Invalid concentration type');
  }
};

/**
 * Calculate dilution parameters using C1*V1 = C2*V2
 * @param {Object} params - Parameters for dilution calculation
 * @param {number} params.c1 - Initial concentration
 * @param {number} params.v1 - Initial volume (to be calculated if null)
 * @param {number} params.c2 - Final concentration
 * @param {number} params.v2 - Final volume
 * @returns {Object} - Object with all four parameters, including the calculated one
 */
export const calculateDilution = (params) => {
  const { c1, v1, c2, v2 } = params;
  
  // Validate that exactly one parameter is null/undefined
  const nullParams = [c1, v1, c2, v2].filter(p => p === null || p === undefined).length;
  if (nullParams !== 1) {
    throw new Error('Exactly one parameter must be null for calculation');
  }

  // Calculate the unknown parameter
  if (c1 === null || c1 === undefined) {
    // C1 = C2 * V2 / V1
    const calculatedC1 = parseFloat(((c2 * v2) / v1).toFixed(4));
    return { c1: calculatedC1, v1, c2, v2 };
  } else if (v1 === null || v1 === undefined) {
    // V1 = C2 * V2 / C1
    const calculatedV1 = parseFloat(((c2 * v2) / c1).toFixed(4));
    return { c1, v1: calculatedV1, c2, v2 };
  } else if (c2 === null || c2 === undefined) {
    // C2 = C1 * V1 / V2
    const calculatedC2 = parseFloat(((c1 * v1) / v2).toFixed(4));
    return { c1, v1, c2: calculatedC2, v2 };
  } else if (v2 === null || v2 === undefined) {
    // V2 = C1 * V1 / C2
    const calculatedV2 = parseFloat(((c1 * v1) / c2).toFixed(4));
    return { c1, v1, c2, v2: calculatedV2 };
  }
};

/**
 * Calculate density of a solution
 * @param {number} mass - Mass in grams
 * @param {number} volume - Volume in mL
 * @returns {number} - Density in g/mL
 */
export const calculateDensity = (mass, volume) => {
  if (volume <= 0) {
    throw new Error('El volumen debe ser mayor que cero');
  }
  return parseFloat((mass / volume).toFixed(4));
};

/**
 * Calculate serial dilutions
 * @param {number} initialConcentration - Initial concentration
 * @param {number} dilutionFactor - Dilution factor (e.g., 2 for 1:2 dilution, 10 for 1:10 dilution)
 * @param {number} numberOfDilutions - Number of dilutions to perform
 * @param {number} volumePerTube - Volume in each tube (mL)
 * @returns {Array} - Array of objects with concentration and volume for each dilution
 */
export const calculateSerialDilutions = (initialConcentration, dilutionFactor, numberOfDilutions, volumePerTube) => {
  if (dilutionFactor <= 1) {
    throw new Error('El factor de dilución debe ser mayor que 1');
  }
  
  if (numberOfDilutions <= 0) {
    throw new Error('El número de diluciones debe ser mayor que 0');
  }
  
  if (volumePerTube <= 0) {
    throw new Error('El volumen por tubo debe ser mayor que 0');
  }
  
  const dilutions = [];
  let currentConcentration = initialConcentration;
  
  // Calculate the transfer volume (volume to pass from one tube to the next)
  const transferVolume = volumePerTube / dilutionFactor;
  
  // Add the initial concentration (stock solution)
  dilutions.push({
    tubeNumber: 0,
    concentration: currentConcentration,
    dilutionFactor: 1, // No dilution for the stock
    solventVolume: 0, // No solvent added to stock
    transferVolume: transferVolume,
    finalVolume: volumePerTube
  });
  
  // Calculate each dilution
  for (let i = 1; i <= numberOfDilutions; i++) {
    // Calculate new concentration
    currentConcentration = currentConcentration / dilutionFactor;
    
    dilutions.push({
      tubeNumber: i,
      concentration: parseFloat(currentConcentration.toFixed(6)),
      dilutionFactor: dilutionFactor,
      solventVolume: volumePerTube - transferVolume,
      transferVolume: i < numberOfDilutions ? transferVolume : 0, // No transfer from the last tube
      finalVolume: volumePerTube
    });
  }
  
  return dilutions;
};

/**
 * Obtener la densidad ideal de un compuesto basado en su fórmula química
 * @param {string} formula - Fórmula química del compuesto
 * @returns {Object} - Objeto con la densidad y temperatura ideal
 */
export const getIdealDensity = (formula) => {
  // Normalizar la fórmula (eliminar espacios)
  const normalizedFormula = formula.replace(/\s+/g, '');
  
  // Verificar si la fórmula está en la base de datos
  if (commonCompoundDensities[normalizedFormula]) {
    return commonCompoundDensities[normalizedFormula];
  }
  
  // Si no está en la base de datos, estimar la densidad basada en la composición
  // Este es un método muy simplificado y aproximado
  const elements = parseFormula(normalizedFormula);
  
  // Densidades aproximadas para elementos comunes (g/cm³)
  const elementDensities = {
    'H': 0.00009,
    'C': 2.26,
    'N': 0.00125,
    'O': 0.00143,
    'F': 0.00169,
    'Na': 0.97,
    'Mg': 1.74,
    'Al': 2.70,
    'Si': 2.33,
    'P': 1.82,
    'S': 2.07,
    'Cl': 0.00321,
    'K': 0.86,
    'Ca': 1.55,
    'Fe': 7.87,
    'Cu': 8.96,
    'Zn': 7.13,
    'Ag': 10.49,
    'Au': 19.30,
    'Hg': 13.59,
    'Pb': 11.34
  };
  
  // Calcular una densidad aproximada basada en la proporción de elementos
  let totalMass = 0;
  let weightedDensity = 0;
  let totalAtoms = 0;
  
  for (const element in elements) {
    if (elementDensities[element] && periodicTable[element]) {
      const elementMass = elements[element] * periodicTable[element];
      totalMass += elementMass;
      weightedDensity += elementMass * elementDensities[element];
      totalAtoms += elements[element];
    }
  }
  
  // Si no pudimos calcular, devolver un valor predeterminado
  if (totalMass === 0 || totalAtoms === 0) {
    return { density: 1.0, temperature: 25 }; // Valor predeterminado similar al agua
  }
  
  // Calcular densidad promedio ponderada
  const estimatedDensity = weightedDensity / totalMass;
  
  // Ajustar la densidad basada en el estado físico probable
  // (Esto es una aproximación muy simplificada)
  let adjustedDensity = estimatedDensity;
  
  // Si contiene principalmente H, C, N, O en proporciones específicas, 
  // probablemente sea un compuesto orgánico
  const isOrganic = elements['C'] && elements['H'] && 
                   (elements['C'] / totalAtoms > 0.2) && 
                   (elements['H'] / totalAtoms > 0.3);
  
  if (isOrganic) {
    // Los compuestos orgánicos suelen tener densidades entre 0.7 y 1.5 g/cm³
    adjustedDensity = Math.min(Math.max(estimatedDensity, 0.7), 1.5);
  }
  
  return { 
    density: parseFloat(adjustedDensity.toFixed(4)), 
    temperature: 25  // Temperatura estándar
  };
};

/**
 * Determina automáticamente el número de equivalentes de un compuesto
 * basado en su fórmula química y el tipo de reacción
 * @param {string} formula - Fórmula química del compuesto
 * @param {string} reactionType - Tipo de reacción ('acid', 'base', 'redox')
 * @returns {Object} - Objeto con número de equivalentes y explicación
 */
export const determineEquivalents = (formula, reactionType = 'acid') => {
  if (!formula) {
    return { equivalents: 1, explanation: 'Valor por defecto' };
  }

  try {
    // Normalizar la fórmula (eliminar espacios, etc.)
    const normalizedFormula = formula.replace(/\s/g, '');
    
    // Compuestos comunes con sus equivalentes
    const commonCompounds = {
      // Ácidos
      'H2SO4': { acid: 2, explanation: 'H2SO4 puede donar 2 H+' },
      'H3PO4': { acid: 3, explanation: 'H3PO4 puede donar 3 H+' },
      'H2CO3': { acid: 2, explanation: 'H2CO3 puede donar 2 H+' },
      'HCl': { acid: 1, explanation: 'HCl puede donar 1 H+' },
      'HNO3': { acid: 1, explanation: 'HNO3 puede donar 1 H+' },
      'CH3COOH': { acid: 1, explanation: 'CH3COOH puede donar 1 H+' },
      'HC2H3O2': { acid: 1, explanation: 'HC2H3O2 puede donar 1 H+' },
      'H3BO3': { acid: 1, explanation: 'H3BO3 puede donar 1 H+' },
      'H2C2O4': { acid: 2, explanation: 'H2C2O4 puede donar 2 H+' },
      'H2SO3': { acid: 2, explanation: 'H2SO3 puede donar 2 H+' },
      
      // Bases
      'NaOH': { base: 1, explanation: 'NaOH contiene 1 OH-' },
      'KOH': { base: 1, explanation: 'KOH contiene 1 OH-' },
      'Ca(OH)2': { base: 2, explanation: 'Ca(OH)2 contiene 2 OH-' },
      'Mg(OH)2': { base: 2, explanation: 'Mg(OH)2 contiene 2 OH-' },
      'Ba(OH)2': { base: 2, explanation: 'Ba(OH)2 contiene 2 OH-' },
      'Al(OH)3': { base: 3, explanation: 'Al(OH)3 contiene 3 OH-' },
      'Fe(OH)3': { base: 3, explanation: 'Fe(OH)3 contiene 3 OH-' },
      
      // Compuestos redox comunes con sus cambios de estado de oxidación
      'KMnO4': { redox: 5, explanation: 'KMnO4: Mn cambia de +7 a +2 (5e-)' },
      'K2Cr2O7': { redox: 6, explanation: 'K2Cr2O7: 2 Cr cambian de +6 a +3 (6e-)' },
      'H2O2': { redox: 2, explanation: 'H2O2: O cambia de -1 a -2 (2e-)' },
      'FeSO4': { redox: 1, explanation: 'FeSO4: Fe cambia de +2 a +3 (1e-)' },
      'Fe2(SO4)3': { redox: 2, explanation: 'Fe2(SO4)3: 2 Fe cambian de +3 a +2 (2e-)' },
    };
    
    // Verificar si es un compuesto común
    if (commonCompounds[normalizedFormula] && 
        commonCompounds[normalizedFormula][reactionType]) {
      return {
        equivalents: commonCompounds[normalizedFormula][reactionType],
        explanation: commonCompounds[normalizedFormula].explanation
      };
    }
    
    // Si no es un compuesto común, intentar determinar por análisis de la fórmula
    
    // Para ácidos, contar H al inicio (simplificado)
    if (reactionType === 'acid') {
      // Contar H+ potenciales
      const acidRegex = /^H(\d+)?/;
      const match = normalizedFormula.match(acidRegex);
      
      if (match) {
        const hCount = match[1] ? parseInt(match[1]) : 1;
        return {
          equivalents: hCount,
          explanation: `Estimado ${hCount} H+ basado en la fórmula`
        };
      }
    }
    
    // Para bases, contar OH
    if (reactionType === 'base') {
      // Contar OH- potenciales
      const baseRegex = /\(OH\)(\d+)?/;
      const match = normalizedFormula.match(baseRegex);
      
      if (match) {
        const ohCount = match[1] ? parseInt(match[1]) : 1;
        return {
          equivalents: ohCount,
          explanation: `Estimado ${ohCount} OH- basado en la fórmula`
        };
      }
    }
    
    // Para reacciones redox, es más complejo y requeriría análisis de estados de oxidación
    // Por ahora, devolvemos un valor predeterminado para redox
    if (reactionType === 'redox') {
      return {
        equivalents: 1,
        explanation: 'Valor predeterminado para reacciones redox'
      };
    }
    
    // Si no se puede determinar, devolver valor por defecto
    return {
      equivalents: 1,
      explanation: 'No se pudo determinar automáticamente'
    };
    
  } catch (error) {
    console.error('Error al determinar equivalentes:', error);
    return {
      equivalents: 1,
      explanation: 'Error en el análisis, usando valor por defecto'
    };
  }
};

/**
 * Calcula el peso equivalente de un compuesto
 * @param {string} formula - Fórmula química del compuesto
 * @param {string} type - Tipo de reacción ('acid', 'base', 'redox')
 * @param {number} valence - Valencia para reacciones redox (opcional)
 * @returns {number} - Peso equivalente en g/eq
 */
export const calculateEquivalentWeight = (formula, type = 'acid', valence = 1) => {
  try {
    const molarMass = calculateMolarMass(formula);
    
    // Para ácidos y bases, necesitaríamos analizar la fórmula para determinar
    // el número de H+ o OH- que puede donar/aceptar
    // Esta es una implementación simplificada
    
    let equivalentFactor = 1; // Por defecto
    
    switch (type.toLowerCase()) {
      case 'acid':
        // Ácidos comunes y su factor de equivalencia
        if (formula === 'H2SO4') equivalentFactor = 2;
        else if (formula === 'H3PO4') equivalentFactor = 3;
        else if (formula === 'H2CO3') equivalentFactor = 2;
        else if (formula === 'HCl') equivalentFactor = 1;
        else if (formula === 'HNO3') equivalentFactor = 1;
        else if (formula === 'CH3COOH' || formula === 'HC2H3O2') equivalentFactor = 1;
        else if (formula === 'H3BO3') equivalentFactor = 1;
        else if (formula === 'H2C2O4') equivalentFactor = 2;
        else if (formula === 'H2SO3') equivalentFactor = 2;
        break;
      
      case 'base':
        // Bases comunes y su factor de equivalencia
        if (formula === 'NaOH' || formula === 'KOH') equivalentFactor = 1;
        else if (formula === 'Ca(OH)2') equivalentFactor = 2;
        else if (formula === 'Mg(OH)2') equivalentFactor = 2;
        else if (formula === 'Ba(OH)2') equivalentFactor = 2;
        else if (formula === 'Al(OH)3') equivalentFactor = 3;
        else if (formula === 'Fe(OH)3') equivalentFactor = 3;
        break;
      
      case 'redox':
        // Para reacciones redox, el factor es la valencia (cambio en el estado de oxidación)
        equivalentFactor = valence;
        break;
      
      default:
        equivalentFactor = 1;
    }
    
    // Peso equivalente = Peso molecular / factor de equivalencia
    return parseFloat((molarMass / equivalentFactor).toFixed(4));
  } catch (error) {
    throw error;
  }
};

export default {
  parseFormula,
  calculateMolarMass,
  calculateAmountWithPurity,
  calculateConcentration,
  calculateSoluteMass,
  calculateDilution,
  calculateDensity,
  calculateSerialDilutions,
  getIdealDensity,
  determineEquivalents,
  calculateEquivalentWeight,
  periodicTable
};
