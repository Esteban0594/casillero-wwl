import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiPlus, FiEye, FiCheck, FiX, FiDollarSign, FiFileText, FiClock, FiAlertTriangle, FiDownload, FiRefreshCw } from 'react-icons/fi';

const statusConfig = {
  'BORRADOR': { label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
  'PENDIENTE': { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  'PAGADA': { label: 'Pagada', color: 'bg-green-100 text-green-800' },
  'VENCIDA': { label: 'Vencida', color: 'bg-red-100 text-red-800' },
  'CANCELADA': { label: 'Cancelada', color: 'bg-gray-100 text-gray-800' },
  'ANULADA': { label: 'Anulada', color: 'bg-red-100 text-red-800' }
};

const currencySymbols = {
  'USD': '$',
  'CRC': '₡'
};

const currencyNames = {
  'USD': 'Dólares (USD)',
  'CRC': 'Colones (CRC)'
};

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(520);
  const [exchangeSource, setExchangeSource] = useState('Cargando...');
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    taxPercent: 13,
    customsFee: 0,
    insurance: 0,
    discount: 0,
    dueDate: '',
    notes: '',
    currency: 'USD',
    exchangeRate: 520,
    facturaElectronica: false,
    facturaElectronicaInfo: {
      nombre: '',
      cedula: '',
      email: '',
      direccion: ''
    }
  });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'TRANSFERENCIA',
    paymentReference: ''
  });

  useEffect(() => {
    fetchInvoices();
    fetchStats();
    fetchClients();
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    setExchangeLoading(true);
    try {
      const { data } = await axios.get('/api/exchange/rate');
      if (data.success) {
        setExchangeRate(data.rate);
        setExchangeSource(data.source);
        setFormData(prev => ({ ...prev, exchangeRate: data.rate }));
      }
    } catch (error) {
      console.error('Error al obtener tipo de cambio');
    }
    setExchangeLoading(false);
  };

  const fetchInvoices = async () => {
    try {
      const { data } = await axios.get('/api/invoices');
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error al cargar facturas');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/invoices/stats');
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

  const handleClientChange = (clientId) => {
    const client = clients.find(c => c._id === clientId);
    setFormData({ 
      ...formData, 
      clientId,
      currency: client?.monedaPreferida || 'USD',
      facturaElectronica: client?.facturaElectronica || false,
      facturaElectronicaInfo: client?.facturaElectronicaInfo || formData.facturaElectronicaInfo
    });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * (formData.taxPercent / 100);
    return subtotal + tax + (formData.customsFee || 0) + (formData.insurance || 0) - (formData.discount || 0);
  };

  const calculateInOtherCurrency = () => {
    const total = calculateTotal();
    if (formData.currency === 'USD') {
      return total * formData.exchangeRate;
    } else {
      return total / formData.exchangeRate;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        totalInOtherCurrency: calculateInOtherCurrency()
      };
      await axios.post('/api/invoices', dataToSend);
      toast.success('Factura creada exitosamente');
      setShowModal(false);
      resetForm();
      fetchInvoices();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear factura');
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/invoices/${selectedInvoice._id}/pay`, paymentData);
      toast.success('Factura marcada como pagada');
      setShowPayModal(false);
      setSelectedInvoice(null);
      fetchInvoices();
      fetchStats();
    } catch (error) {
      toast.error('Error al procesar pago');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('¿Estás seguro de anular esta factura?')) {
      try {
        await axios.put(`/api/invoices/${id}/cancel`);
        toast.success('Factura anulada');
        fetchInvoices();
        fetchStats();
      } catch (error) {
        toast.error('Error al anular factura');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      taxPercent: 13,
      customsFee: 0,
      insurance: 0,
      discount: 0,
      dueDate: '',
      notes: '',
      currency: 'USD',
      exchangeRate: EXCHANGE_RATE,
      facturaElectronica: false,
      facturaElectronicaInfo: {
        nombre: '',
        cedula: '',
        email: '',
        direccion: ''
      }
    });
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || inv.status === statusFilter;
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
          <h1 className="text-2xl font-bold text-gray-800">Facturación</h1>
          <p className="text-gray-600">Gestiona las facturas de clientes</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <FiPlus /> Nueva Factura
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Facturas</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total || 0}</p>
            </div>
            <FiFileText className="text-2xl text-gray-400" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendientes || 0}</p>
            </div>
            <FiClock className="text-2xl text-yellow-400" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cobrado</p>
              <p className="text-2xl font-bold text-green-600">${(stats.totalCobrado || 0).toLocaleString()}</p>
            </div>
            <FiDollarSign className="text-2xl text-green-400" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Por Cobrar</p>
              <p className="text-2xl font-bold text-orange-600">${(stats.totalPendiente || 0).toLocaleString()}</p>
            </div>
            <FiAlertTriangle className="text-2xl text-orange-400" />
          </div>
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
              placeholder="Buscar por número de factura o cliente..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factura</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-Factura</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-gray-500">{new Date(invoice.createdAt).toLocaleDateString('es-CR')}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{invoice.client?.nombre}</p>
                    <p className="text-xs text-gray-500">
                      {invoice.client?.tipoCuenta === 'juridico' ? invoice.client?.razonSocial : invoice.client?.email}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900">
                      {currencySymbols[invoice.currency]}{invoice.total?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{currencyNames[invoice.currency]}</p>
                    {invoice.totalInOtherCurrency && (
                      <p className="text-xs text-gray-400">
                        ≈ {invoice.currency === 'USD' ? '₡' : '$'}{invoice.totalInOtherCurrency?.toFixed(2)}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[invoice.status]?.color}`}>
                      {statusConfig[invoice.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.facturaElectronica ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Sí
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('es-CR') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {invoice.status === 'PENDIENTE' && (
                      <button 
                        onClick={() => { setSelectedInvoice(invoice); setShowPayModal(true); }} 
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Registrar Pago"
                      >
                        <FiDollarSign />
                      </button>
                    )}
                    {invoice.status !== 'PAGADA' && invoice.status !== 'ANULADA' && (
                      <button 
                        onClick={() => handleCancel(invoice._id)} 
                        className="text-red-600 hover:text-red-900"
                        title="Anular"
                      >
                        <FiX />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de crear factura */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nueva Factura</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.nombre} - {client.casillero}
                      {client.tipoCuenta === 'juridico' ? ` (${client.razonSocial})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moneda *</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value, exchangeRate: exchangeRate })}
                    className="input-field"
                  >
                    <option value="USD">🇺🇸 Dólares (USD) - Recomendado</option>
                    <option value="CRC">🇨🇷 Colones (CRC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    Tipo de Cambio
                    <button 
                      type="button" 
                      onClick={fetchExchangeRate} 
                      className="text-wwl-blue text-xs flex items-center gap-1 hover:underline"
                      disabled={exchangeLoading}
                    >
                      <FiRefreshCw className={exchangeLoading ? 'animate-spin' : ''} /> Actualizar
                    </button>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.exchangeRate}
                    onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) || 1 })}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Fuente: {exchangeSource} • 1 USD = ₡{formData.exchangeRate}
                  </p>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.facturaElectronica}
                    onChange={(e) => setFormData({ ...formData, facturaElectronica: e.target.checked })}
                    className="rounded text-wwl-blue focus:ring-wwl-blue"
                  />
                  <span className="text-sm font-medium text-gray-700">Factura Electrónica (Hacienda)</span>
                </label>
              </div>

              {formData.facturaElectronica && (
                <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                  <p className="text-sm font-medium text-blue-800">Datos para Factura Electrónica</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Nombre o Razón Social</label>
                      <input
                        type="text"
                        value={formData.facturaElectronicaInfo.nombre}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          facturaElectronicaInfo: { ...formData.facturaElectronicaInfo, nombre: e.target.value }
                        })}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Cédula / Cédula Jurídica</label>
                      <input
                        type="text"
                        value={formData.facturaElectronicaInfo.cedula}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          facturaElectronicaInfo: { ...formData.facturaElectronicaInfo, cedula: e.target.value }
                        })}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.facturaElectronicaInfo.email}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          facturaElectronicaInfo: { ...formData.facturaElectronicaInfo, email: e.target.value }
                        })}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Dirección</label>
                      <input
                        type="text"
                        value={formData.facturaElectronicaInfo.direccion}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          facturaElectronicaInfo: { ...formData.facturaElectronicaInfo, direccion: e.target.value }
                        })}
                        className="input-field text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items de Facturación</label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="input-field flex-1"
                      placeholder="Descripción del servicio"
                      required
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="input-field w-20"
                      placeholder="Cant"
                      min="1"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="input-field w-32"
                      placeholder="Precio"
                      required
                    />
                    <span className="flex items-center text-sm font-medium w-24">
                      {currencySymbols[formData.currency]}{(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                    {formData.items.length > 1 && (
                      <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500">
                        <FiX />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={handleAddItem} className="text-wwl-blue text-sm flex items-center gap-1">
                  <FiPlus /> Agregar item
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IVA (%)</label>
                  <input
                    type="number"
                    value={formData.taxPercent}
                    onChange={(e) => setFormData({ ...formData, taxPercent: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aduana</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.customsFee}
                    onChange={(e) => setFormData({ ...formData, customsFee: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seguro</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.insurance}
                    onChange={(e) => setFormData({ ...formData, insurance: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descuento</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-wwl-blue">
                    {currencySymbols[formData.currency]}{calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Equivalente:</span>
                  <span>
                    {formData.currency === 'USD' ? '₡' : '$'}{calculateInOtherCurrency().toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows="2"
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Crear Factura
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de registrar pago */}
      {showPayModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Registrar Pago</h2>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Factura: {selectedInvoice.invoiceNumber}</p>
              <p className="text-lg font-bold">
                Total: {currencySymbols[selectedInvoice.currency]}{selectedInvoice.total?.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{currencyNames[selectedInvoice.currency]}</p>
            </div>
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  className="input-field"
                >
                  <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                  <option value="SINPE">SINPE Móvil</option>
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TARJETA">Tarjeta</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referencia de Pago</label>
                <input
                  type="text"
                  value={paymentData.paymentReference}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentReference: e.target.value })}
                  className="input-field"
                  placeholder="Número de referencia o comprobante"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <FiCheck /> Confirmar Pago
                </button>
                <button type="button" onClick={() => setShowPayModal(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;
