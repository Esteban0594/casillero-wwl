const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { nombre, email, password, telefono, cedula, tipoCuenta, razonSocial, cedulaJuridica, direccion } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const casilleroNumber = `WWL-${Date.now().toString().slice(-6)}`;

    const user = await User.create({
      nombre,
      email,
      password,
      telefono,
      cedula,
      tipoCuenta: tipoCuenta || 'personal',
      razonSocial,
      cedulaJuridica,
      direccion,
      casillero: casilleroNumber
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        tipoCuenta: user.tipoCuenta,
        casillero: user.casillero,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAdmin = async (req, res) => {
  const { nombre, email, password, telefono, cedula, direccion } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create({
      nombre,
      email,
      password,
      telefono,
      cedula,
      direccion,
      role: 'admin'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        telefono: user.telefono,
        cedula: user.cedula,
        direccion: user.direccion,
        activo: user.activo,
        createdAt: user.createdAt
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createClient = async (req, res) => {
  const { nombre, email, password, telefono, cedula, tipoCuenta, razonSocial, cedulaJuridica, direccion } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const casilleroNumber = `WWL-${Date.now().toString().slice(-6)}`;

    const user = await User.create({
      nombre,
      email,
      password,
      telefono,
      cedula,
      tipoCuenta: tipoCuenta || 'personal',
      razonSocial,
      cedulaJuridica,
      direccion,
      role: 'cliente',
      casillero: casilleroNumber
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        tipoCuenta: user.tipoCuenta,
        telefono: user.telefono,
        cedula: user.cedula,
        razonSocial: user.razonSocial,
        cedulaJuridica: user.cedulaJuridica,
        direccion: user.direccion,
        casillero: user.casillero,
        activo: user.activo,
        bloqueado: user.bloqueado,
        createdAt: user.createdAt
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.bloqueado) {
        return res.status(403).json({ 
          message: 'Tu cuenta está bloqueada. Contacta a soporte para más información.',
          blocked: true,
          motivo: user.motivoBloqueo
        });
      }

      if (!user.activo) {
        return res.status(403).json({ 
          message: 'Tu cuenta está desactivada. Contacta a soporte.',
          inactive: true
        });
      }

      res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        tipoCuenta: user.tipoCuenta,
        casillero: user.casillero,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

const getUsers = async (req, res) => {
  try {
    const { role, search, activo, bloqueado, tipoCuenta } = req.query;
    let query = {};

    if (role) query.role = role;
    if (activo !== undefined) query.activo = activo === 'true';
    if (bloqueado !== undefined) query.bloqueado = bloqueado === 'true';
    if (tipoCuenta) query.tipoCuenta = tipoCuenta;
    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { casillero: { $regex: search, $options: 'i' } },
        { cedula: { $regex: search, $options: 'i' } },
        { razonSocial: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.nombre = req.body.nombre || user.nombre;
      user.email = req.body.email || user.email;
      user.telefono = req.body.telefono || user.telefono;
      user.cedula = req.body.cedula || user.cedula;
      user.direccion = req.body.direccion || user.direccion;
      user.role = req.body.role || user.role;
      user.tipoCuenta = req.body.tipoCuenta || user.tipoCuenta;
      user.razonSocial = req.body.razonSocial || user.razonSocial;
      user.cedulaJuridica = req.body.cedulaJuridica || user.cedulaJuridica;
      user.activo = req.body.activo !== undefined ? req.body.activo : user.activo;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        nombre: updatedUser.nombre,
        email: updatedUser.email,
        telefono: updatedUser.telefono,
        cedula: updatedUser.cedula,
        direccion: updatedUser.direccion,
        role: updatedUser.role,
        tipoCuenta: updatedUser.tipoCuenta,
        razonSocial: updatedUser.razonSocial,
        cedulaJuridica: updatedUser.cedulaJuridica,
        casillero: updatedUser.casillero,
        activo: updatedUser.activo,
        bloqueado: updatedUser.bloqueado
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          return res.status(400).json({ message: 'No se puede eliminar el último administrador' });
        }
      }
      await user.deleteOne();
      res.json({ message: 'Usuario eliminado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const { motivo } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.bloqueado = true;
    user.motivoBloqueo = motivo || 'Bloqueado por administrador';
    user.fechaBloqueo = new Date();
    user.bloqueadoPor = 'manual';
    
    await user.save();
    
    res.json({ 
      message: 'Usuario bloqueado exitosamente',
      user: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        bloqueado: user.bloqueado,
        motivoBloqueo: user.motivoBloqueo,
        fechaBloqueo: user.fechaBloqueo
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.bloqueado = false;
    user.motivoBloqueo = null;
    user.fechaBloqueo = null;
    user.bloqueadoPor = null;
    
    await user.save();
    
    res.json({ 
      message: 'Usuario desbloqueado exitosamente',
      user: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        bloqueado: user.bloqueado
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkAutoBlock = async () => {
  try {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const clientsToBlock = await User.find({
      role: 'cliente',
      activo: true,
      bloqueado: false,
      $or: [
        { ultimoPago: { $lt: sixtyDaysAgo } },
        { ultimoPago: null, createdAt: { $lt: sixtyDaysAgo } }
      ]
    });

    for (const client of clientsToBlock) {
      client.bloqueado = true;
      client.motivoBloqueo = 'Bloqueo automático: más de 60 días sin pagos registrados';
      client.fechaBloqueo = new Date();
      client.bloqueadoPor = 'automatico';
      await client.save();
    }

    return clientsToBlock.length;
  } catch (error) {
    console.error('Error en checkAutoBlock:', error);
    return 0;
  }
};

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClients = await User.countDocuments({ role: 'cliente' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({ activo: true });
    const inactiveUsers = await User.countDocuments({ activo: false });
    const blockedUsers = await User.countDocuments({ bloqueado: true });
    const personalAccounts = await User.countDocuments({ tipoCuenta: 'personal' });
    const juridicaAccounts = await User.countDocuments({ tipoCuenta: 'juridico' });

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalClients,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      blockedUsers,
      personalAccounts,
      juridicaAccounts,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  createAdmin,
  createClient,
  loginUser,
  getMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  checkAutoBlock,
  getStats
};
