const carrierPatterns = {
  AMAZON: {
    name: 'Amazon',
    patterns: [
      /^TBA[0-9]{12,15}$/i,
      /^[0-9]{3}-[0-9]{7}-[0-9]{7}$/,
      /^1[0-9]{3}-[0-9]{7}-[0-9]{7}$/
    ],
    trackingUrl: 'https://www.amazon.com/gp/your-account/order-details?orderID=',
    examples: ['TBA123456789000', 'TBA1234567890123']
  },
  EBAY: {
    name: 'eBay',
    patterns: [
      /^(94|93|92|94|95)[0-9]{20,22}$/,
      /^[A-Z]{2}[0-9]{9}US$/i,
      /^[0-9]{30,34}$/
    ],
    trackingUrl: 'https://www.ebay.com/sh/track?trackingNum=',
    examples: ['9400111899223100000000', '9205500000000000000000']
  },
  ALIEXPRESS: {
    name: 'AliExpress',
    patterns: [
      /^LP[0-9]{10,14}$/i,
      /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/i,
      /^[A-Z]{1}[0-9]{10,14}$/,
      /^[0-9]{13}$/,
      /^YT[0-9]{12,14}$/i
    ],
    trackingUrl: 'https://global.cainiao.com/detail.htm?mailNoList=',
    examples: ['LP009383838383', 'LP00123456789012']
  },
  TEMU: {
    name: 'Temu',
    patterns: [
      /^YT[0-9]{12,16}$/i,
      /^[A-Z]{2}[0-9]{12,16}$/i,
      /^TEMU[0-9]{10,14}$/i
    ],
    trackingUrl: 'https://www.temu.com/order-tracking.html?trackingNo=',
    examples: ['YT22383838383', 'YT22383838383838']
  },
  SHEIN: {
    name: 'Shein',
    patterns: [
      /^[0-9]{14,16}$/,
      /^US[0-9]{12,16}$/i,
      /^YT[0-9]{12,16}$/i
    ],
    trackingUrl: 'https://us.shein.com/track/order?trackingNo=',
    examples: ['12345678901234', 'US123456789012']
  },
  UPS: {
    name: 'UPS',
    patterns: [
      /^1Z[A-Z0-9]{16}$/i,
      /^[0-9]{26}$/,
      /^[0-9]{12}$/
    ],
    trackingUrl: 'https://www.ups.com/track?tracknum=',
    examples: ['1Z999AA10123456784']
  },
  FEDEX: {
    name: 'FedEx',
    patterns: [
      /^[0-9]{12}$/,
      /^[0-9]{15}$/,
      /^[0-9]{20}$/,
      /^[0-9]{22}$/
    ],
    trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=',
    examples: ['123456789012']
  },
  USPS: {
    name: 'USPS',
    patterns: [
      /^(94|93|92|94|95)[0-9]{20}$/,
      /^(94|93|92|94|95)[0-9]{22}$/,
      /^[A-Z]{2}[0-9]{9}US$/i
    ],
    trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
    examples: ['9400111899223100000000']
  },
  DHL: {
    name: 'DHL',
    patterns: [
      /^[0-9]{10}$/,
      /^[0-9]{11}$/,
      /^[A-Z]{3}[0-9]{7}$/i
    ],
    trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB=',
    examples: ['1234567890']
  },
  WALMART: {
    name: 'Walmart',
    patterns: [
      /^[0-9]{14,22}$/,
      /^WM[0-9]{10,14}$/i
    ],
    trackingUrl: 'https://www.walmart.com/orders/',
    examples: ['12345678901234']
  },
  TARGET: {
    name: 'Target',
    patterns: [
      /^[0-9]{12,15}$/,
      /^T[0-9]{10,12}$/
    ],
    trackingUrl: 'https://www.target.com/orders/',
    examples: ['123456789012']
  }
};

function detectCarrier(trackingNumber) {
  const cleanTracking = trackingNumber.replace(/[\s-]/g, '').toUpperCase();
  
  // Detectar por prefijos conocidos primero
  if (cleanTracking.startsWith('TBA')) {
    return { code: 'AMAZON', name: 'Amazon', trackingUrl: carrierPatterns.AMAZON.trackingUrl + cleanTracking, confidence: 'high' };
  }
  if (cleanTracking.startsWith('LP')) {
    return { code: 'ALIEXPRESS', name: 'AliExpress', trackingUrl: carrierPatterns.ALIEXPRESS.trackingUrl + cleanTracking, confidence: 'high' };
  }
  if (cleanTracking.startsWith('YT')) {
    return { code: 'TEMU', name: 'Temu', trackingUrl: carrierPatterns.TEMU.trackingUrl + cleanTracking, confidence: 'high' };
  }
  if (cleanTracking.startsWith('1Z')) {
    return { code: 'UPS', name: 'UPS', trackingUrl: carrierPatterns.UPS.trackingUrl + cleanTracking, confidence: 'high' };
  }
  
  // Buscar por patrones
  for (const [carrierCode, carrier] of Object.entries(carrierPatterns)) {
    for (const pattern of carrier.patterns) {
      if (pattern.test(cleanTracking)) {
        return {
          code: carrierCode,
          name: carrier.name,
          trackingUrl: carrier.trackingUrl + cleanTracking,
          confidence: 'high'
        };
      }
    }
  }
  
  return {
    code: 'OTRO',
    name: 'Desconocido',
    trackingUrl: null,
    confidence: 'low'
  };
}

function getCarrierInfo(carrierCode) {
  return carrierPatterns[carrierCode] || null;
}

function getAllCarriers() {
  return Object.entries(carrierPatterns).map(([code, info]) => ({
    code,
    name: info.name,
    examples: info.examples
  }));
}

function validateTrackingNumber(trackingNumber, expectedCarrier) {
  const cleanTracking = trackingNumber.replace(/[\s-]/g, '').toUpperCase();
  const carrier = carrierPatterns[expectedCarrier];
  
  if (!carrier) return false;
  
  return carrier.patterns.some(pattern => pattern.test(cleanTracking));
}

module.exports = {
  detectCarrier,
  getCarrierInfo,
  getAllCarriers,
  validateTrackingNumber,
  carrierPatterns
};
