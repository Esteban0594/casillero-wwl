const Quote = require('../models/Quote');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

const getQuotes = async (req, res) => {
  try {
    const { status, client, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (client) query.client = client;
    if (search) {
      query.$or = [
        { quoteNumber: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const quotes = await Quote.find(query)
      .populate('client', 'nombre email casillero telefono cedula tipoCuenta razonSocial cedulaJuridica')
      .populate('convertedToInvoice', 'invoiceNumber status')
      .sort({ createdAt: -1 });
    
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('client', 'nombre email casillero telefono cedula direccion tipoCuenta razonSocial cedulaJuridica emailFacturacion')
      .populate('convertedToInvoice', 'invoiceNumber status total')
      .populate('createdBy', 'nombre');
    
    if (!quote) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuote = async (req, res) => {
  try {
    const { clientId, items, taxPercent, discount, validUntil, notes, terms, currency, exchangeRate } = req.body;

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
    const total = subtotal + tax - (discount || 0);

    const validUntilDate = validUntil || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    const quote = await Quote.create({
      client: clientId,
      items: processedItems,
      subtotal,
      tax,
      taxPercent: taxPercent || 13,
      discount: discount || 0,
      total,
      currency: currency || 'USD',
      exchangeRate: exchangeRate || 520,
      validUntil: validUntilDate,
      notes,
      terms: terms || 'Cotización válida por 15 días. Precios sujetos a cambio sin previo aviso.',
      status: 'BORRADOR',
      createdBy: req.user._id
    });

    const populatedQuote = await Quote.findById(quote._id)
      .populate('client', 'nombre email casillero telefono cedula tipoCuenta razonSocial cedulaJuridica');

    res.status(201).json(populatedQuote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    if (quote.status === 'FACTURADA') {
      return res.status(400).json({ message: 'No se puede editar una cotización ya facturada' });
    }

    if (req.body.items) {
      let subtotal = 0;
      req.body.items = req.body.items.map(item => {
        const total = item.quantity * item.unitPrice;
        subtotal += total;
        return { ...item, total };
      });
      req.body.subtotal = subtotal;
      const tax = subtotal * ((req.body.taxPercent || quote.taxPercent) / 100);
      req.body.tax = tax;
      req.body.total = subtotal + tax - (req.body.discount || quote.discount || 0);
    }

    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    ).populate('client', 'nombre email casillero telefono cedula tipoCuenta razonSocial cedulaJuridica');

    res.json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const convertToInvoice = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).populate('client');
    
    if (!quote) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    if (quote.status === 'FACTURADA') {
      return res.status(400).json({ message: 'Esta cotización ya fue convertida a factura' });
    }

    const invoice = await Invoice.create({
      client: quote.client._id,
      items: quote.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      })),
      subtotal: quote.subtotal,
      tax: quote.tax,
      taxPercent: quote.taxPercent,
      discount: quote.discount,
      total: quote.total,
      currency: quote.currency,
      exchangeRate: quote.exchangeRate,
      status: 'PENDIENTE',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: `Factura generada desde cotización ${quote.quoteNumber}`,
      createdBy: req.user._id
    });

    quote.status = 'FACTURADA';
    quote.convertedToInvoice = invoice._id;
    quote.updatedBy = req.user._id;
    await quote.save();

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('client', 'nombre email casillero tipoCuenta razonSocial cedulaJuridica');

    res.json({ 
      message: 'Cotización convertida a factura exitosamente',
      invoice: populatedInvoice,
      quote: quote
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    quote.status = status;
    quote.updatedBy = req.user._id;
    await quote.save();

    const updatedQuote = await Quote.findById(quote._id)
      .populate('client', 'nombre email casillero telefono cedula tipoCuenta razonSocial');

    res.json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    if (quote.status === 'FACTURADA') {
      return res.status(400).json({ message: 'No se puede eliminar una cotización facturada' });
    }

    await quote.deleteOne();
    res.json({ message: 'Cotización eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  convertToInvoice,
  updateStatus,
  deleteQuote
};
