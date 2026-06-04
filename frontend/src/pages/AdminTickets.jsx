import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiPlus, FiMessageSquare, FiCheck, FiDollarSign, FiFileText, FiClock, FiAlertTriangle, FiUser, FiPackage } from 'react-icons/fi';

const statusConfig = {
  'ABIERTO': { label: 'Abierto', color: 'bg-blue-100 text-blue-800' },
  'EN_PROCESO': { label: 'En Proceso', color: 'bg-yellow-100 text-yellow-800' },
  'ESPERANDO_CLIENTE': { label: 'Esperando Cliente', color: 'bg-orange-100 text-orange-800' },
  'ESPERANDO_PAGO': { label: 'Esperando Pago', color: 'bg-purple-100 text-purple-800' },
  'RESUELTO': { label: 'Resuelto', color: 'bg-green-100 text-green-800' },
  'CERRADO': { label: 'Cerrado', color: 'bg-gray-100 text-gray-800' }
};

const priorityConfig = {
  'BAJA': { label: 'Baja', color: 'bg-gray-100 text-gray-800' },
  'MEDIA': { label: 'Media', color: 'bg-blue-100 text-blue-800' },
  'ALTA': { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  'URGENTE': { label: 'Urgente', color: 'bg-red-100 text-red-800' }
};

const categoryConfig = {
  'FACTURACION': 'Facturación',
  'PAQUETE': 'Paquete',
  'ENVIO': 'Envío',
  'ADUANA': 'Aduana',
  'PAGO': 'Pago',
  'RECLAMO': 'Reclamo',
  'CONSULTA': 'Consulta',
  'OTRO': 'Otro'
};

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [clients, setClients] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [formData, setFormData] = useState({
    clientId: '',
    subject: '',
    description: '',
    category: 'CONSULTA',
    priority: 'MEDIA',
    amount: 0
  });

  useEffect(() => {
    fetchTickets();
    fetchStats();
    fetchClients();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data } = await axios.get('/api/tickets');
      setTickets(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error al cargar tickets');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/tickets/stats');
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas');
    }
  };

  const fetchClients = async () => {
    try {
      const { data } = await axios.get('/api/auth/users?role=cliente');
      setClients(data);
    } catch (error) {
      console.error('Error al cargar clientes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tickets', formData);
      toast.success('Ticket creado exitosamente');
      setShowModal(false);
      resetForm();
      fetchTickets();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear ticket');
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await axios.put(`/api/tickets/${ticketId}/status`, { status: newStatus });
      toast.success('Estado actualizado');
      fetchTickets();
      fetchStats();
      if (selectedTicket?._id === ticketId) {
        fetchTicketDetail(ticketId);
      }
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleAddMessage = async (ticketId) => {
    if (!newMessage.trim()) return;
    try {
      await axios.post(`/api/tickets/${ticketId}/message`, { message: newMessage });
      setNewMessage('');
      fetchTicketDetail(ticketId);
    } catch (error) {
      toast.error('Error al enviar mensaje');
    }
  };

  const handleVerifyPayment = async (ticketId) => {
    try {
      await axios.put(`/api/tickets/${ticketId}/verify-payment`);
      toast.success('Pago verificado y ticket resuelto');
      fetchTickets();
      fetchStats();
      fetchTicketDetail(ticketId);
    } catch (error) {
      toast.error('Error al verificar pago');
    }
  };

  const handleGenerateInvoice = async (ticketId) => {
    try {
      const { data } = await axios.post(`/api/tickets/${ticketId}/generate-invoice`);
      toast.success(`Factura ${data.invoice.invoiceNumber} generada exitosamente`);
      fetchTickets();
      fetchTicketDetail(ticketId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al generar factura');
    }
  };

  const fetchTicketDetail = async (ticketId) => {
    try {
      const { data } = await axios.get(`/api/tickets/${ticketId}`);
      setSelectedTicket(data);
    } catch (error) {
      toast.error('Error al cargar detalle');
    }
  };

  const openTicketDetail = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailModal(true);
    fetchTicketDetail(ticket._id);
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      subject: '',
      description: '',
      category: 'CONSULTA',
      priority: 'MEDIA',
      amount: 0
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.client?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-wwl-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tickets de Soporte</h1>
          <p className="text-gray-600">Gestiona trámites y consultas de clientes</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <FiPlus /> Nuevo Ticket
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total || 0}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.abiertos || 0}</p>
          <p className="text-xs text-gray-500">Abiertos</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.enProceso || 0}</p>
          <p className="text-xs text-gray-500">En Proceso</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.esperandoPago || 0}</p>
          <p className="text-xs text-gray-500">Esperando Pago</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{stats.resueltos || 0}</p>
          <p className="text-xs text-gray-500">Resueltos</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número, asunto o cliente..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="">Todos los estados</option>
            {Object.entries(statusConfig).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asunto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openTicketDetail(ticket)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{ticket.ticketNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString('es-CR')}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{ticket.client?.nombre}</p>
                    <p className="text-xs text-gray-500">{ticket.client?.casillero}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 truncate max-w-[200px]">{ticket.subject}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-gray-600">{categoryConfig[ticket.category]}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[ticket.priority]?.color}`}>
                      {priorityConfig[ticket.priority]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[ticket.status]?.color}`}>
                      {statusConfig[ticket.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ticket.amount > 0 && (
                      <p className="text-sm font-bold text-gray-900">${ticket.amount.toFixed(2)}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openTicketDetail(ticket); }} 
                      className="text-wwl-blue hover:text-blue-900"
                    >
                      <FiMessageSquare />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de crear ticket */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nuevo Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.nombre} - {client.casillero}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asunto *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    {Object.entries(categoryConfig).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field"
                  >
                    {Object.entries(priorityConfig).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">Crear Ticket</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de detalle del ticket */}
      {showDetailModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedTicket.ticketNumber}</h2>
                <p className="text-gray-600">{selectedTicket.subject}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Cliente</p>
                <p className="font-medium">{selectedTicket.client?.nombre}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Estado</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[selectedTicket.status]?.color}`}>
                  {statusConfig[selectedTicket.status]?.label}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Prioridad</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[selectedTicket.priority]?.color}`}>
                  {priorityConfig[selectedTicket.priority]?.label}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Monto</p>
                <p className="font-bold">{selectedTicket.amount > 0 ? `$${selectedTicket.amount.toFixed(2)}` : '-'}</p>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTicket.status === 'ABIERTO' && (
                <button onClick={() => handleStatusChange(selectedTicket._id, 'EN_PROCESO')} className="btn-secondary text-sm">
                  Iniciar Proceso
                </button>
              )}
              {selectedTicket.status === 'EN_PROCESO' && selectedTicket.amount > 0 && !selectedTicket.relatedInvoice && (
                <button onClick={() => handleGenerateInvoice(selectedTicket._id)} className="btn-primary text-sm flex items-center gap-1">
                  <FiFileText /> Generar Factura
                </button>
              )}
              {selectedTicket.status === 'ESPERANDO_PAGO' && (
                <button onClick={() => handleVerifyPayment(selectedTicket._id)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                  <FiCheck /> Verificar Pago
                </button>
              )}
              {selectedTicket.status !== 'RESUELTO' && selectedTicket.status !== 'CERRADO' && (
                <button onClick={() => handleStatusChange(selectedTicket._id, 'RESUELTO')} className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">
                  Marcar Resuelto
                </button>
              )}
            </div>

            {selectedTicket.relatedInvoice && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Factura: {selectedTicket.relatedInvoice.invoiceNumber} - 
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    selectedTicket.relatedInvoice.status === 'PAGADA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedTicket.relatedInvoice.status}
                  </span>
                </p>
              </div>
            )}

            {/* Mensajes */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Historial de Mensajes</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedTicket.messages?.map((msg, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    msg.senderRole === 'admin' ? 'bg-blue-50 ml-4' : 'bg-gray-50 mr-4'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${msg.senderRole === 'admin' ? 'text-blue-600' : 'text-gray-600'}`}>
                        {msg.sender?.nombre || 'Usuario'} ({msg.senderRole === 'admin' ? 'Admin' : 'Cliente'})
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleString('es-CR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nuevo mensaje */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="input-field flex-1"
                placeholder="Escribe un mensaje..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddMessage(selectedTicket._id)}
              />
              <button 
                onClick={() => handleAddMessage(selectedTicket._id)}
                className="btn-primary px-4"
              >
                <FiMessageSquare />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
