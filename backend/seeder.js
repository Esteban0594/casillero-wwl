const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();

    const adminUser = await User.create({
      nombre: 'Administrador WWL',
      email: 'admin@casillerowl.com',
      password: 'AdminWWL2024!',
      telefono: '+506 8888-8888',
      cedula: '0-0000-0000',
      direccion: 'San José, Costa Rica',
      role: 'admin'
    });

    console.log('Administrador creado exitosamente');
    console.log('Email: admin@casillerowl.com');
    console.log('Password: AdminWWL2024!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
