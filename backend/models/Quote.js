const mongoose = require('mongoose');

const quoteItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true }
});

const quoteSchema = new mongoose.Schema({
  quoteNumber: {
    type: String,
    unique: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [quoteItemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  taxPercent: {
    type: Number,
    default: 13
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'CRC'],
    default: 'USD'
  },
  exchangeRate: {
    type: Number,
    default: 520
  },
  status: {
    type: String,
    enum: ['BORRADOR', 'ENVIADA', 'ACEPTADA', 'RECHAZADA', 'FACTURADA', 'EXPIRADA'],
    default: 'BORRADOR'
  },
  validUntil: {
    type: Date
  },
  notes: {
    type: String
  },
  terms: {
    type: String,
    default: 'Cotización válida por 15 días. Precios sujetos a cambio sin previo aviso.'
  },
  convertedToInvoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
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

quoteSchema.pre('save', async function(next) {
  if (this.isNew && !this.quoteNumber) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.quoteNumber = `COT-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Quote', quoteSchema);
