const Package = require('../models/Package');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const Notification = require('../models/Notification');
const { detectCarrier, getAllCarriers } = require('../services/carrierService');

const registerPackage = async (req, res) => {
  try {
    const { trackingNumber, clientEmail, casillero, description, store, weight, dimensions, declaredValue, shippingMethod, notes } = req.body;

    const carrierInfo = detectCarrier(trackingNumber);

    let client;
    if (clientEmail) {
      client = await User.findOne({ email: clientEmail });
    } else if (casillero) {
      client = await User.findOne({ casillero: casillero });
    }

    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado. Proporcione email o número de casillero válido.' });
    }

    const existingPackage = await Package.findOne({ trackingNumber: trackingNumber.toUpperCase() });
    if (existingPackage) {
      return res.status(400).json({ message: 'Este número de tracking ya está registrado.' });
    }

    const newPackage = await Package.create({
      trackingNumber: trackingNumber.toUpperCase(),
      carrier: carrierInfo.code,
      carrierName: carrierInfo.name,
      client: client._id,
      casillero: client.casillero,
      description,
      store,
      weight,
      dimensions,
      declaredValue,
      shippingMethod: shippingMethod || 'STANDARD',
      notes,
      status: 'EN_CAMINO_MIAMI',
      origin: { city: 'Miami', state: 'FL', country: 'US' }
    });

    await Notification.create({
      user: client._id,
      type: 'PAQUETE_RECIBIDO',
      title: '¡Nuevo paquete registrado!',
      message: `Tu paquete con tracking ${trackingNumber} (${carrierInfo.name}) ha sido registrado en el sistema y está en camino a nuestro almacén en Miami.`,
      relatedPackage: newPackage._id
    });

    const populatedPackage = await Package.findById(newPackage._id).populate('client', 'nombre email casillero');

    res.status(201).json(populatedPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const receivedAtMiami = async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, dimensions, notes } = req.body;

    const pkg = await Package.findById(id).populate('client', 'nombre email casillero');
    if (!pkg) {
      return res.status(404).json({ message: 'Paquete no encontrado' });
    }

    pkg.status = 'RECIBIDO_MIAMI';
    pkg.receivedAtMiami = new Date();
    if (weight) pkg.weight = weight;
    if (dimensions) pkg.dimensions = dimensions;
    if (notes) pkg.internalNotes = notes;

    pkg.statusHistory.push({
      status: 'RECIBIDO_MIAMI',
      date: new Date(),
      location: 'Miami, FL',
      notes: 'Paquete recibido en nuestro almacén de Miami'
    });

    await pkg.save();

    await Notification.create({
      user: pkg.client._id,
      type: 'PAQUETE_RECIBIDO',
      title: '¡Paquete recibido en Miami!',
      message: `¡Buenas noticias ${pkg.client.nombre}! Tu paquete ${pkg.trackingNumber} ha sido recibido en nuestro almacén de Miami. Pronto será enviado a Costa Rica.`,
      relatedPackage: pkg._id
    });

    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePackageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, notes } = req.body;

    const pkg = await Package.findById(id).populate('client', 'nombre email casillero');
    if (!pkg) {
      return res.status(404).json({ message: 'Paquete no encontrado' });
    }

    pkg.status = status;
    pkg.statusHistory.push({
      status,
      date: new Date(),
      location,
      notes
    });

    if (status === 'EN_TRANSITO_CR') {
      pkg.shippedToCR = new Date();
    } else if (status === 'ENTREGADO') {
      pkg.deliveredAt = new Date();
    }

    await pkg.save();

    const statusMessages = {
      'EN_TRANSITO_CR': { type: 'PAQUETE_EN_TRANSITO', title: '¡Paquete en camino a Costa Rica!', message: `Tu paquete ${pkg.trackingNumber} está en camino a Costa Rica.` },
      'EN_ADUANA': { type: 'PAQUETE_EN_ADUANA', title: 'Paquete en aduana', message: `Tu paquete ${pkg.trackingNumber} está en trámites de aduana en Costa Rica.` },
      'EN_DISTRIBUCION': { type: 'PAQUETE_EN_TRANSITO', title: '¡Paquete en distribución!', message: `Tu paquete ${pkg.trackingNumber} está en distribución local. ¡Pronto lo recibirás!` },
      'ENTREGADO': { type: 'PAQUETE_ENTREGADO', title: '¡Paquete entregado!', message: `¡Tu paquete ${pkg.trackingNumber} ha sido entregado exitosamente!` }
    };

    if (statusMessages[status]) {
      await Notification.create({
        user: pkg.client._id,
        type: statusMessages[status].type,
        title: statusMessages[status].title,
        message: statusMessages[status].message,
        relatedPackage: pkg._id
      });
    }

    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPackages = async (req, res) => {
  try {
    const packages = await Package.find({ client: req.user._id })
      .sort({ createdAt: -1 })
      .populate('client', 'nombre email casillero');
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const { status, carrier, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (carrier) query.carrier = carrier;
    if (search) {
      query.$or = [
        { trackingNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const packages = await Package.find(query)
      .sort({ createdAt: -1 })
      .populate('client', 'nombre email casillero telefono');
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id)
      .populate('client', 'nombre email casillero telefono cedula direccion');
    if (!pkg) {
      return res.status(404).json({ message: 'Paquete no encontrado' });
    }
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCarriers = async (req, res) => {
  try {
    const carriers = getAllCarriers();
    res.json(carriers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Paquete no encontrado' });
    }
    await pkg.deleteOne();
    res.json({ message: 'Paquete eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerPackage,
  receivedAtMiami,
  updatePackageStatus,
  getMyPackages,
  getAllPackages,
  getPackageById,
  getCarriers,
  deletePackage
};
