const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CarrierConfig = require('./models/CarrierConfig');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const carriers = [
  {
    code: 'DHL',
    name: 'DHL Express',
    description: 'Servicio express internacional',
    website: 'https://www.dhl.com',
    trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB=',
    api: {
      enabled: false,
      provider: 'dhl',
      environment: 'sandbox'
    },
    pricing: {
      perPound: 5.50,
      customsFeePercent: 10,
      insurancePercent: 5,
      minCharge: 15
    },
    estimatedDays: { min: 3, max: 5 },
    isActive: true,
    sortOrder: 1
  },
  {
    code: 'FEDEX',
    name: 'FedEx',
    description: 'Servicio terrestre y express',
    website: 'https://www.fedex.com',
    trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=',
    api: {
      enabled: false,
      provider: 'fedex',
      environment: 'sandbox'
    },
    pricing: {
      perPound: 5.00,
      customsFeePercent: 10,
      insurancePercent: 5,
      minCharge: 12
    },
    estimatedDays: { min: 3, max: 7 },
    isActive: true,
    sortOrder: 2
  },
  {
    code: 'UPS',
    name: 'UPS',
    description: 'United Parcel Service',
    website: 'https://www.ups.com',
    trackingUrl: 'https://www.ups.com/track?tracknum=',
    api: {
      enabled: false,
      provider: 'ups',
      environment: 'sandbox'
    },
    pricing: {
      perPound: 4.75,
      customsFeePercent: 10,
      insurancePercent: 5,
      minCharge: 10
    },
    estimatedDays: { min: 3, max: 7 },
    isActive: true,
    sortOrder: 3
  },
  {
    code: 'USPS',
    name: 'USPS',
    description: 'Servicio Postal de Estados Unidos',
    website: 'https://www.usps.com',
    trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
    api: {
      enabled: false,
      provider: 'usps',
      environment: 'sandbox'
    },
    pricing: {
      perPound: 3.50,
      customsFeePercent: 10,
      insurancePercent: 5,
      minCharge: 8
    },
    estimatedDays: { min: 7, max: 14 },
    isActive: true,
    sortOrder: 4
  },
  {
    code: 'AMAZON',
    name: 'Amazon Logistics',
    description: 'Servicio de envío de Amazon',
    website: 'https://www.amazon.com',
    trackingUrl: 'https://www.amazon.com/gp/your-account/order-details?orderID=',
    pricing: {
      perPound: 4.00,
      customsFeePercent: 10,
      insurancePercent: 5,
      minCharge: 5
    },
    estimatedDays: { min: 5, max: 10 },
    isActive: true,
    sortOrder: 5
  },
  {
    code: 'ALIEXPRESS',
    name: 'AliExpress Shipping',
    description: 'Envío estándar de AliExpress',
    website: 'https://www.aliexpress.com',
    trackingUrl: 'https://global.cainiao.com/detail.htm?mailNoList=',
    pricing: {
      perPound: 3.00,
      customsFeePercent: 10,
      insurancePercent: 5,
      minCharge: 5
    },
    estimatedDays: { min: 15, max: 30 },
    isActive: true,
    sortOrder: 6
  },
  {
    code: 'TEMU',
    name: 'Temu Shipping',
    description: 'Servicio de envío de Temu',
    website: 'https://www.temu.com',
    trackingUrl: 'https://www.temu.com/order-tracking.html?trackingNo=',
    pricing: {
      perPound: 3.50,
      customsFeePercent: 10,
      insurancePercent: 5,
      minCharge: 5
    },
    estimatedDays: { min: 10, max: 20 },
    isActive: true,
    sortOrder: 7
  },
  {
    code: 'OTRO',
    name: 'Otro Carrier',
    description: 'Otros servicios de envío',
    pricing: {
      perPound: 4.50,
      customsFeePercent: 10,
      insurancePercent: 5,
      minCharge: 10
    },
    estimatedDays: { min: 7, max: 14 },
    isActive: true,
    sortOrder: 99
  }
];

const importData = async () => {
  try {
    await CarrierConfig.deleteMany();
    await CarrierConfig.insertMany(carriers);
    console.log('Carriers importados exitosamente');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
