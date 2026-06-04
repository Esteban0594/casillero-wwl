const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: [true, 'El número de tracking es obligatorio'],
    unique: true,
    trim: true,
    uppercase: true
  },
  carrier: {
    type: String,
    enum: ['UPS', 'FEDEX', 'USPS', 'DHL', 'AMAZON', 'OTRO'],
    required: true
  },
  carrierName: {
    type: String,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  casillero: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  store: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: [
      'EN_CAMINO_MIAMI',
      'RECIBIDO_MIAMI',
      'EN_PROCESO',
      'EN_TRANSITO_CR',
      'EN_ADUANA',
      'EN_DISTRIBUCION',
      'ENTREGADO',
      'DEVUELTO'
    ],
    default: 'EN_CAMINO_MIAMI'
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    location: String,
    notes: String
  }],
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  declaredValue: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  origin: {
    city: String,
    state: String,
    country: { type: String, default: 'US' }
  },
  destination: {
    city: { type: String, default: 'San José' },
    state: { type: String, default: 'San José' },
    country: { type: String, default: 'CR' }
  },
  shippingMethod: {
    type: String,
    enum: ['STANDARD', 'EXPRESS', 'PREMIUM'],
    default: 'STANDARD'
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  customsFee: {
    type: Number,
    default: 0
  },
  insurance: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  receivedAtMiami: {
    type: Date
  },
  shippedToCR: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  estimatedDelivery: {
    type: Date
  },
  notes: {
    type: String
  },
  internalNotes: {
    type: String
  },
  notifyClient: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

packageSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
      notes: 'Paquete registrado en el sistema'
    });
  }
  next();
});

packageSchema.methods.updateStatus = function(newStatus, location, notes) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    date: new Date(),
    location: location,
    notes: notes
  });
};

module.exports = mongoose.model('Package', packageSchema);
