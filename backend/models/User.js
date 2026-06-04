const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email no válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6
  },
  telefono: {
    type: String,
    trim: true
  },
  cedula: {
    type: String,
    trim: true
  },
  tipoCuenta: {
    type: String,
    enum: ['personal', 'juridico'],
    default: 'personal'
  },
  razonSocial: {
    type: String,
    trim: true
  },
  cedulaJuridica: {
    type: String,
    trim: true
  },
  direccion: {
    type: String,
    trim: true
  },
  direccionFacturacion: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['cliente', 'admin'],
    default: 'cliente'
  },
  casillero: {
    type: String,
    unique: true,
    sparse: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  bloqueado: {
    type: Boolean,
    default: false
  },
  motivoBloqueo: {
    type: String
  },
  fechaBloqueo: {
    type: Date
  },
  bloqueadoPor: {
    type: String,
    enum: ['manual', 'automatico'],
  },
  ultimoPago: {
    type: Date
  },
  diasSinPago: {
    type: Number,
    default: 0
  },
  creditoActivo: {
    type: Boolean,
    default: false
  },
  limiteCredito: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
