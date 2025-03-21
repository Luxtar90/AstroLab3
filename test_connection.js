// test_connection.js
// Script para probar la conexión con el servidor Flask

const fetch = require('node-fetch');
const { exec } = require('child_process');

// URL desplegada para pruebas
const DEPLOYED_URL = 'https://astroback-jfj5.onrender.com';

// Obtener la dirección IP local
exec('ipconfig', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al ejecutar ipconfig: ${error.message}`);
    return;
  }
  
  console.log('Información de red:');
  
  // Buscar adaptadores de red y sus direcciones IPv4
  const networkInfo = stdout.split('\n')
    .filter(line => line.includes('IPv4') || line.includes('Adaptador'))
    .join('\n');
  
  console.log(networkInfo);
  
  // Extraer posibles IPs para probar
  const ipMatches = stdout.match(/IPv4[.\s]+: ([\d.]+)/g) || [];
  const ips = ipMatches.map(match => {
    const ip = match.match(/\d+\.\d+\.\d+\.\d+/)[0];
    return ip;
  });
  
  console.log('\nDirecciones IP encontradas:');
  console.log(ips);
  
  // Probar conexión con cada IP
  console.log('\nProbando conexiones:');
  
  // Añadir IPs comunes de emuladores y localhost
  const allIps = [
    ...ips,
    '192.168.100.129', // IP del servidor según los logs
    '127.0.0.1',
    'localhost',
    '10.0.2.2',
    '10.0.3.2',
    '192.168.100.1'  // La IP que está intentando usar actualmente
  ];
  
  // Primero probar la URL desplegada
  console.log('\n=== Probando URL desplegada ===');
  const deployedUrls = [
    `${DEPLOYED_URL}/status`,
    `${DEPLOYED_URL}/welcome`,
    `${DEPLOYED_URL}`
  ];
  
  deployedUrls.forEach(url => {
    console.log(`Probando conexión a: ${url}`);
    
    fetch(url, { timeout: 10000 })
      .then(response => {
        console.log(`✅ Conexión exitosa a ${url} - Status: ${response.status}`);
        return response.text();
      })
      .then(data => {
        console.log(`Respuesta: ${data.substring(0, 100)}${data.length > 100 ? '...' : ''}`);
      })
      .catch(error => {
        console.log(`❌ Error al conectar a ${url}: ${error.message}`);
      });
  });
  
  // Luego probar las IPs locales
  console.log('\n=== Probando IPs locales ===');
  
  // Probar cada IP
  allIps.forEach(ip => {
    const urls = [
      `http://${ip}:5000/status`,
      `http://${ip}:5000`
    ];
    
    urls.forEach(url => {
      console.log(`Probando conexión a: ${url}`);
      
      fetch(url, { timeout: 5000 })
        .then(response => {
          console.log(`✅ Conexión exitosa a ${url} - Status: ${response.status}`);
          return response.text();
        })
        .then(data => {
          console.log(`Respuesta: ${data.substring(0, 100)}${data.length > 100 ? '...' : ''}`);
        })
        .catch(error => {
          console.log(`❌ Error al conectar a ${url}: ${error.message}`);
        });
    });
  });
});

console.log('Ejecutando pruebas de conexión...');
