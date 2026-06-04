const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'PAQUETE_RECIBIDO',
      'PAQUETE_EN_TRANSITO',
      'PAQUETE_EN_ADUANA',
      'PAQUETE_ENTREGADO',
      'FACTURA_CREADA',
      'FACTURA_PAGADA',
      'RECORDATORIO',
      'SISTEMA'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  },
  relatedInvoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
