const Ticket = require('../models/Ticket');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

const getTickets = async (req, res) => {
  try {
    const { status, category, priority, client, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (client) query.client = client;
    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(query)
      .populate('client', 'nombre email casillero tipoCuenta razonSocial')
      .populate('assignedTo', 'nombre')
      .populate('relatedInvoice', 'invoiceNumber status total')
      .sort({ createdAt: -1 });
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('client', 'nombre email casillero telefono cedula direccion tipoCuenta razonSocial cedulaJuridica')
      .populate('assignedTo', 'nombre email')
      .populate('relatedPackages', 'trackingNumber description status')
      .populate('relatedInvoice', 'invoiceNumber status total paidAt')
      .populate('messages.sender', 'nombre role')
      .populate('createdBy', 'nombre');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const { clientId, subject, description, category, priority, amount, relatedPackages } = req.body;

    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const ticket = await Ticket.create({
      client: clientId,
      subject,
      description,
      category: category || 'CONSULTA',
      priority: priority || 'MEDIA',
      amount: amount || 0,
      relatedPackages,
      status: 'ABIERTO',
      messages: [{
        sender: req.user._id,
        senderRole: 'admin',
        message: description
      }],
      createdBy: req.user._id
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('client', 'nombre email casillero tipoCuenta razonSocial');

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('client', 'nombre email casillero tipoCuenta razonSocial');

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    ticket.messages.push({
      sender: req.user._id,
      senderRole: req.user.role,
      message
    });

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('client', 'nombre email casillero')
      .populate('messages.sender', 'nombre role');

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    ticket.status = status;
    
    if (status === 'RESUELTO') {
      ticket.resolvedAt = new Date();
    } else if (status === 'CERRADO') {
      ticket.closedAt = new Date();
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('client', 'nombre email casillero tipoCuenta razonSocial');

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { paymentDate, invoiceId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    ticket.paymentVerified = true;
    ticket.paymentDate = paymentDate || new Date();
    ticket.status = 'RESUELTO';
    ticket.resolvedAt = new Date();

    if (invoiceId) {
      const invoice = await Invoice.findById(invoiceId);
      if (invoice) {
        invoice.status = 'PAGADA';
        invoice.paidAt = paymentDate || new Date();
        await invoice.save();
        ticket.relatedInvoice = invoiceId;
      }
    }

    ticket.messages.push({
      sender: req.user._id,
      senderRole: 'admin',
      message: `Pago verificado el ${new Date().toLocaleDateString('es-CR')}. Trámite resuelto.`
    });

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('client', 'nombre email casillero tipoCuenta razonSocial')
      .populate('relatedInvoice', 'invoiceNumber status total');

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateInvoice = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('client');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    if (!ticket.amount || ticket.amount <= 0) {
      return res.status(400).json({ message: 'El ticket no tiene un monto válido para facturar' });
    }

    const subtotal = ticket.amount;
    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    const invoice = await Invoice.create({
      client: ticket.client._id,
      ticket: ticket._id,
      items: [{
        description: ticket.subject,
        quantity: 1,
        unitPrice: subtotal,
        total: subtotal
      }],
      subtotal,
      tax,
      taxPercent: 13,
      total,
      status: 'PENDIENTE',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: `Factura generada desde ticket ${ticket.ticketNumber}`,
      createdBy: req.user._id
    });

    ticket.relatedInvoice = invoice._id;
    ticket.status = 'ESPERANDO_PAGO';
    ticket.messages.push({
      sender: req.user._id,
      senderRole: 'admin',
      message: `Factura ${invoice.invoiceNumber} generada por $${total.toFixed(2)}. Esperando pago del cliente.`
    });
    await ticket.save();

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('client', 'nombre email casillero tipoCuenta razonSocial cedulaJuridica');

    res.status(201).json({ invoice: populatedInvoice, ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketStats = async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const abiertos = await Ticket.countDocuments({ status: 'ABIERTO' });
    const enProceso = await Ticket.countDocuments({ status: 'EN_PROCESO' });
    const esperandoPago = await Ticket.countDocuments({ status: 'ESPERANDO_PAGO' });
    const resueltos = await Ticket.countDocuments({ status: 'RESUELTO' });
    const cerrados = await Ticket.countDocuments({ status: 'CERRADO' });

    res.json({
      total,
      abiertos,
      enProceso,
      esperandoPago,
      resueltos,
      cerrados
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  addMessage,
  updateStatus,
  verifyPayment,
  generateInvoice,
  getTicketStats,
  deleteTicket
};
