const mongoose = require('mongoose');

const carrierConfigSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  logo: {
    type: String
  },
  website: {
    type: String
  },
  trackingUrl: {
    type: String
  },
  api: {
    enabled: { type: Boolean, default: false },
    provider: { type: String },
    apiKey: { type: String },
    apiSecret: { type: String },
    accountNumber: { type: String },
    environment: { type: String, enum: ['sandbox', 'production'], default: 'sandbox' },
    endpoints: {
      tracking: { type: String },
      rates: { type: String },
      labels: { type: String },
      pickup: { type: String }
    },
    credentials: { type: mongoose.Schema.Types.Mixed },
    lastSync: { type: Date },
    syncStatus: { type: String, enum: ['active', 'inactive', 'error'], default: 'inactive' },
    errorMessage: { type: String }
  },
  pricing: {
    baseRate: { type: Number, default: 0 },
    perPound: { type: Number, default: 0 },
    perCubicInch: { type: Number, default: 0 },
    customsFeePercent: { type: Number, default: 10 },
    insurancePercent: { type: Number, default: 5 },
    minCharge: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' }
  },
  estimatedDays: {
    min: { type: Number },
    max: { type: Number }
  },
  supportedCountries: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

carrierConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CarrierConfig', carrierConfigSchema);
