# AstroLab Calculator

<p align="center">
  <img src="assets/icon.png" alt="AstroLab Calculator Logo" width="120" height="120"/>
</p>

<div align="center">
  
  ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  
</div>

---

*Read this in [Spanish](#astrolab-calculator-es) / Leer esto en [Español](#astrolab-calculator-es)*

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Workflow](#workflow)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## 🔭 Overview

AstroLab Calculator is a comprehensive mobile application designed for chemistry students and laboratory professionals. It provides a suite of tools for common laboratory calculations, including molar mass calculations, purity adjustments, concentration conversions, and dilution calculations. The app features an intuitive, modern interface with both light and dark themes for comfortable use in any environment.

## ✨ Features

- **Molar Mass Calculator**: Calculate the molar mass of chemical compounds by entering their chemical formulas.
- **Purity Calculator**: Determine the amount of reagent needed based on its purity.
- **Concentration Calculator**: Convert between different concentration units (molarity, normality, percentage, ppm).
- **Dilution Calculator**: Calculate simple and serial dilutions using the C₁V₁ = C₂V₂ formula.
- **Laboratory Timer**: Set countdown timers or use a chronometer for laboratory procedures.
- **Cell Counter**: Count and track cell populations for biological experiments.
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable use in any lighting condition.
- **Responsive Design**: Optimized for various screen sizes and orientations.
- **Animated UI**: Smooth transitions and animations for an enhanced user experience.

## 🚀 Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/astrolab-calculator.git
   cd astrolab-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on a device or emulator:
   - Press `a` to run on an Android emulator
   - Press `i` to run on an iOS simulator
   - Scan the QR code with the Expo Go app on your physical device

## 📱 Usage

The application follows a logical workflow for laboratory calculations:

1. Start by calculating the molar mass of your compound
2. Adjust for purity if needed (typically between 80% and 99%)
3. Calculate the concentration of your solution
4. Perform dilution calculations if necessary

Each screen provides intuitive inputs and clear results, with helpful tooltips and explanations of the underlying formulas.

## 📁 Project Structure

```
AstroLabCalculator/
├── assets/               # Images, fonts, and other static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context for state management
│   ├── screens/          # Main application screens
│   ├── styles/           # Global styles and themes
│   └── utils/            # Utility functions and helpers
├── App.js                # Main application entry point
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## 🔄 Workflow

The application is designed with a specific workflow in mind:

1. **Molar Mass Calculation**: Select and calculate the molar mass of your compound
2. **Purity Calculation**: Define the purity of your reagent (typically between 80% and 99%)
3. **Concentration Calculation**: Calculate solution concentrations (%m/m, v/v, etc.)
4. **Dilution Calculation**: Perform dilution calculations if needed

This workflow mirrors the typical sequence of calculations performed in a laboratory setting.

## 🛠️ Technologies

- **React Native**: Core framework for cross-platform mobile development
- **Expo**: Development platform for building and deploying React Native applications
- **React Navigation**: Navigation library for screen transitions
- **AsyncStorage**: Local storage solution for saving user data
- **Expo Linear Gradient**: For creating gradient backgrounds
- **React Native Animated**: For creating fluid UI animations
- **React Native Vector Icons**: For including various icon sets

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<a name="astrolab-calculator-es"></a>
# AstroLab Calculator (ES)

<p align="center">
  <img src="assets/icon.png" alt="Logo de AstroLab Calculator" width="120" height="120"/>
</p>

<div align="center">
  
  ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  
</div>

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Tecnologías](#tecnologías)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## 🔭 Descripción General

AstroLab Calculator es una aplicación móvil completa diseñada para estudiantes de química y profesionales de laboratorio. Proporciona un conjunto de herramientas para cálculos comunes de laboratorio, incluyendo cálculos de masa molar, ajustes de pureza, conversiones de concentración y cálculos de dilución. La aplicación presenta una interfaz intuitiva y moderna con temas claros y oscuros para un uso cómodo en cualquier entorno.

## ✨ Características

- **Calculadora de Masa Molar**: Calcula la masa molar de compuestos químicos ingresando sus fórmulas químicas.
- **Calculadora de Pureza**: Determina la cantidad de reactivo necesaria según su pureza.
- **Calculadora de Concentración**: Convierte entre diferentes unidades de concentración (molaridad, normalidad, porcentaje, ppm).
- **Calculadora de Dilución**: Calcula diluciones simples y seriadas utilizando la fórmula C₁V₁ = C₂V₂.
- **Temporizador de Laboratorio**: Configura temporizadores de cuenta regresiva o utiliza un cronómetro para procedimientos de laboratorio.
- **Contador de Células**: Cuenta y rastrea poblaciones celulares para experimentos biológicos.
- **Modo Oscuro/Claro**: Alterna entre temas oscuros y claros para un uso cómodo en cualquier condición de iluminación.
- **Diseño Responsivo**: Optimizado para varios tamaños y orientaciones de pantalla.
- **Interfaz Animada**: Transiciones y animaciones suaves para una experiencia de usuario mejorada.

## 🚀 Instalación

### Requisitos Previos

- Node.js (v14 o posterior)
- npm o yarn
- Expo CLI
- Android Studio (para desarrollo en Android) o Xcode (para desarrollo en iOS)

### Configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tunombre/astrolab-calculator.git
   cd astrolab-calculator
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npx expo start
   ```

4. Ejecuta en un dispositivo o emulador:
   - Presiona `a` para ejecutar en un emulador de Android
   - Presiona `i` para ejecutar en un simulador de iOS
   - Escanea el código QR con la aplicación Expo Go en tu dispositivo físico

## 📱 Uso

La aplicación sigue un flujo de trabajo lógico para cálculos de laboratorio:

1. Comienza calculando la masa molar de tu compuesto
2. Ajusta la pureza si es necesario (típicamente entre 80% y 99%)
3. Calcula la concentración de tu solución
4. Realiza cálculos de dilución si es necesario

Cada pantalla proporciona entradas intuitivas y resultados claros, con consejos útiles y explicaciones de las fórmulas subyacentes.

## 📁 Estructura del Proyecto

```
AstroLabCalculator/
├── assets/               # Imágenes, fuentes y otros activos estáticos
├── src/
│   ├── components/       # Componentes UI reutilizables
│   ├── context/          # React Context para gestión de estado
│   ├── screens/          # Pantallas principales de la aplicación
│   ├── styles/           # Estilos globales y temas
│   └── utils/            # Funciones de utilidad y ayudantes
├── App.js                # Punto de entrada principal de la aplicación
├── app.json              # Configuración de Expo
└── package.json          # Dependencias y scripts
```

## 🔄 Flujo de Trabajo

La aplicación está diseñada con un flujo de trabajo específico en mente:

1. **Cálculo de Masa Molar**: Selecciona y calcula la masa molar de tu compuesto
2. **Cálculo de Pureza**: Define la pureza de tu reactivo (típicamente entre 80% y 99%)
3. **Cálculo de Concentración**: Calcula concentraciones de soluciones (%m/m, v/v, etc.)
4. **Cálculo de Dilución**: Realiza cálculos de dilución si es necesario

Este flujo de trabajo refleja la secuencia típica de cálculos realizados en un entorno de laboratorio.

## 🛠️ Tecnologías

- **React Native**: Framework principal para desarrollo móvil multiplataforma
- **Expo**: Plataforma de desarrollo para construir y desplegar aplicaciones React Native
- **React Navigation**: Biblioteca de navegación para transiciones de pantalla
- **AsyncStorage**: Solución de almacenamiento local para guardar datos de usuario
- **Expo Linear Gradient**: Para crear fondos con gradientes
- **React Native Animated**: Para crear animaciones fluidas de UI
- **React Native Vector Icons**: Para incluir varios conjuntos de iconos

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! No dudes en enviar un Pull Request.

1. Haz un fork del repositorio
2. Crea tu rama de características (`git checkout -b feature/caracteristica-asombrosa`)
3. Haz commit de tus cambios (`git commit -m 'Añadir alguna característica asombrosa'`)
4. Haz push a la rama (`git push origin feature/caracteristica-asombrosa`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.

# Anexos

A continuación se muestran los anexos del proyecto:

## Anexo 1
![Anexo 1](https://github.com/user-attachments/assets/a8ae7079-8a36-4f04-9a11-21089cc16144)

## Anexo 2
![Anexo 2](https://github.com/user-attachments/assets/2ae6440e-ceae-43a8-a1be-0de4b8d3d6e8)

## Anexo 3
![Anexo 3](https://github.com/user-attachments/assets/5aae7a1d-181a-4f8b-aa95-c84d8438dd52)

## Anexo 4
![Anexo 4](https://github.com/user-attachments/assets/35ed9d42-d5f1-4de7-8c92-3a16aadbbfc5)

## Anexo 5
![Anexo 5](https://github.com/user-attachments/assets/e41aff2f-cbb7-4469-a0e0-6b63b7fb1888)

## Anexo 6
![Anexo 6](https://github.com/user-attachments/assets/909aeff0-e6a0-4848-b3ef-b2f2210fee81)

## Anexo 7
![Anexo 7](https://github.com/user-attachments/assets/84a58f3c-491c-4102-a044-d1204b7611cb)

## Anexo 8
![Anexo 8](https://github.com/user-attachments/assets/08d87ad4-ed74-4047-89b3-ecdff41affdf)

## Anexo 9
![Anexo 9](https://github.com/user-attachments/assets/18214081-e7ed-4cba-bb76-ab17961a94e3)

## Anexo 10
![Anexo 10](https://github.com/user-attachments/assets/dad24d55-55ae-48cc-be3e-71e2b4c227dc)

