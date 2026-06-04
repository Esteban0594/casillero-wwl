const axios = require('axios');

// Tipo de cambio de respaldo por si falla la API
let cachedRate = 520;
let lastUpdate = null;

const getExchangeRate = async () => {
  try {
    // Intentar obtener de la API del Banco Central de Costa Rica (BCCR)
    // O usar una API pública de respaldo
    
    // Opción 1: API pública gratuita
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
      timeout: 5000
    });
    
    if (response.data && response.data.rates && response.data.rates.CRC) {
      cachedRate = Math.round(response.data.rates.CRC * 100) / 100;
      lastUpdate = new Date();
      return {
        rate: cachedRate,
        source: 'ExchangeRate API',
        lastUpdate: lastUpdate,
        success: true
      };
    }
  } catch (error) {
    console.log('Error al obtener tipo de cambio de API primaria, intentando respaldo...');
  }

  try {
    // Opción 2: Intentar de otra fuente
    const response = await axios.get('https://open.er-api.com/v6/latest/USD', {
      timeout: 5000
    });
    
    if (response.data && response.data.rates && response.data.rates.CRC) {
      cachedRate = Math.round(response.data.rates.CRC * 100) / 100;
      lastUpdate = new Date();
      return {
        rate: cachedRate,
        source: 'Open Exchange Rates',
        lastUpdate: lastUpdate,
        success: true
      };
    }
  } catch (error) {
    console.log('Error al obtener tipo de cambio de API secundaria, usando respaldo...');
  }

  // Si ambas fallan, usar el tipo de cambio cacheado o el de respaldo
  return {
    rate: cachedRate,
    source: 'Respaldo (último conocido)',
    lastUpdate: lastUpdate,
    success: false
  };
};

const getBCRRate = async () => {
  try {
    // Intentar obtener del BCCR (Banco Central de Costa Rica)
    // Esta es una URL de ejemplo, puede necesitar ajustes
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
    const response = await axios.get(
      `https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML?Indicador=318&FechaInicio=${dateStr}&FechaFinal=${dateStr}&Nombre=guest&SubNiveles=N`,
      { timeout: 10000 }
    );
    
    // Parsear la respuesta XML del BCCR
    if (response.data && response.data.includes('NUM_VALOR')) {
      const match = response.data.match(/NUM_VALOR>([\d.]+)<\/NUM_VALOR/);
      if (match && match[1]) {
        cachedRate = parseFloat(match[1]);
        lastUpdate = new Date();
        return {
          rate: cachedRate,
          source: 'Banco Central de Costa Rica',
          lastUpdate: lastUpdate,
          success: true
        };
      }
    }
  } catch (error) {
    console.log('Error al obtener tipo de cambio del BCCR');
  }
  
  return null;
};

module.exports = {
  getExchangeRate,
  getBCRRate
};
