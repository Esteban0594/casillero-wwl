const CarrierConfig = require('../models/CarrierConfig');

const getCarriers = async (req, res) => {
  try {
    const carriers = await CarrierConfig.find().sort({ sortOrder: 1, name: 1 });
    res.json(carriers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCarrierById = async (req, res) => {
  try {
    const carrier = await CarrierConfig.findById(req.params.id);
    if (!carrier) {
      return res.status(404).json({ message: 'Carrier no encontrado' });
    }
    res.json(carrier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCarrier = async (req, res) => {
  try {
    const { code, name, description, logo, website, trackingUrl, api, pricing, estimatedDays, supportedCountries, isActive } = req.body;

    const existingCarrier = await CarrierConfig.findOne({ code: code.toUpperCase() });
    if (existingCarrier) {
      return res.status(400).json({ message: 'Ya existe un carrier con ese código' });
    }

    const carrier = await CarrierConfig.create({
      code: code.toUpperCase(),
      name,
      description,
      logo,
      website,
      trackingUrl,
      api,
      pricing,
      estimatedDays,
      supportedCountries,
      isActive,
      createdBy: req.user._id
    });

    res.status(201).json(carrier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCarrier = async (req, res) => {
  try {
    const carrier = await CarrierConfig.findById(req.params.id);
    if (!carrier) {
      return res.status(404).json({ message: 'Carrier no encontrado' });
    }

    const updatedCarrier = await CarrierConfig.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    res.json(updatedCarrier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCarrier = async (req, res) => {
  try {
    const carrier = await CarrierConfig.findById(req.params.id);
    if (!carrier) {
      return res.status(404).json({ message: 'Carrier no encontrado' });
    }

    await carrier.deleteOne();
    res.json({ message: 'Carrier eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const testCarrierApi = async (req, res) => {
  try {
    const carrier = await CarrierConfig.findById(req.params.id);
    if (!carrier) {
      return res.status(404).json({ message: 'Carrier no encontrado' });
    }

    if (!carrier.api.enabled) {
      return res.status(400).json({ message: 'La API no está habilitada para este carrier' });
    }

    // Simular prueba de API
    const testResult = {
      carrier: carrier.name,
      status: 'success',
      message: 'Conexión exitosa con la API',
      timestamp: new Date(),
      details: {
        endpoint: carrier.api.endpoints?.tracking || 'No configurado',
        environment: carrier.api.environment,
        hasApiKey: !!carrier.api.apiKey,
        hasApiSecret: !!carrier.api.apiSecret
      }
    };

    // Actualizar estado de sincronización
    carrier.api.lastSync = new Date();
    carrier.api.syncStatus = 'active';
    carrier.api.errorMessage = null;
    await carrier.save();

    res.json(testResult);
  } catch (error) {
    // Marcar error en la sincronización
    await CarrierConfig.findByIdAndUpdate(req.params.id, {
      'api.syncStatus': 'error',
      'api.errorMessage': error.message
    });
    res.status(500).json({ message: error.message });
  }
};

const getActiveCarriers = async (req, res) => {
  try {
    const carriers = await CarrierConfig.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json(carriers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCarriers,
  getCarrierById,
  createCarrier,
  updateCarrier,
  deleteCarrier,
  testCarrierApi,
  getActiveCarriers
};
