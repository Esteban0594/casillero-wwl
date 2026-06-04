const Invoice = require('../models/Invoice');
const User = require('../models/User');

const getInvoices = async (req, res) => {
  try {
    const { status, client, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (client) query.client = client;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const invoices = await Invoice.find(query)
      .populate('client', 'nombre email casillero tipoCuenta razonSocial cedulaJuridica')
      .populate('ticket', 'ticketNumber subject')
      .sort({ createdAt: -1 });
    
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client', 'nombre email casillero telefono cedula direccion tipoCuenta razonSocial cedulaJuridica emailFacturacion')
      .populate('ticket', 'ticketNumber subject status')
      .populate('packages', 'trackingNumber description')
      .populate('createdBy', 'nombre')
      .populate('updatedBy', 'nombre');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const { clientId, ticketId, items, taxPercent, customsFee, insurance, discount, dueDate, notes, internalNotes } = req.body;

    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    let subtotal = 0;
    const processedItems = items.map(item => {
      const total = item.quantity * item.unitPrice;
      subtotal += total;
      return { ...item, total };
    });

    const tax = subtotal * ((taxPercent || 13) / 100);
    const total = subtotal + tax + (customsFee || 0) + (insurance || 0) - (discount || 0);

    const invoice = await Invoice.create({
      client: clientId,
      ticket: ticketId,
      items: processedItems,
      subtotal,
      tax,
      taxPercent: taxPercent || 13,
      customsFee: customsFee || 0,
      insurance: insurance || 0,
      discount: discount || 0,
      total,
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes,
      internalNotes,
      status: 'PENDIENTE',
      createdBy: req.user._id
    });

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('client', 'nombre email casillero tipoCuenta razonSocial cedulaJuridica');

    res.status(201).json(populatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    ).populate('client', 'nombre email casillero tipoCuenta razonSocial');

    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const { paymentMethod, paymentReference } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    invoice.status = 'PAGADA';
    invoice.paidAt = new Date();
    invoice.paymentMethod = paymentMethod;
    invoice.paymentReference = paymentReference;
    invoice.updatedBy = req.user._id;

    await invoice.save();

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('client', 'nombre email casillero tipoCuenta razonSocial');

    res.json(populatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    invoice.status = 'ANULADA';
    invoice.updatedBy = req.user._id;
    await invoice.save();

    res.json({ message: 'Factura anulada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceStats = async (req, res) => {
  try {
    const total = await Invoice.countDocuments();
    const pendientes = await Invoice.countDocuments({ status: 'PENDIENTE' });
    const pagadas = await Invoice.countDocuments({ status: 'PAGADA' });
    const vencidas = await Invoice.countDocuments({ status: 'VENCIDA' });

    const totalMonto = await Invoice.aggregate([
      { $match: { status: 'PAGADA' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const pendienteMonto = await Invoice.aggregate([
      { $match: { status: 'PENDIENTE' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      total,
      pendientes,
      pagadas,
      vencidas,
      totalCobrado: totalMonto[0]?.total || 0,
      totalPendiente: pendienteMonto[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    if (invoice.status === 'PAGADA') {
      return res.status(400).json({ message: 'No se puede eliminar una factura pagada' });
    }

    await invoice.deleteOne();
    res.json({ message: 'Factura eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  markAsPaid,
  cancelInvoice,
  getInvoiceStats,
  deleteInvoice
};
