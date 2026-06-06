import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiFileText, FiDownload, FiRefreshCw, FiCheck, FiX, FiSend } from 'react-icons/fi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const COMPANY = {
  nombre: 'Aduana WWL SRL',
  cedulaJuridica: '3-102-875441',
  telefono: '(+506) 4070-1004',
  email: 'facturawwl@aduanawwl.com',
  direccion: 'Alajuela, San Antonio, Montecillos, Zona Franca Z, Bodega 3D'
};

const statusConfig = {
  'BORRADOR': { label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
  'ENVIADA': { label: 'Enviada', color: 'bg-blue-100 text-blue-800' },
  'ACEPTADA': { label: 'Aceptada', color: 'bg-green-100 text-green-800' },
  'RECHAZADA': { label: 'Rechazada', color: 'bg-red-100 text-red-800' },
  'FACTURADA': { label: 'Facturada', color: 'bg-purple-100 text-purple-800' },
  'EXPIRADA': { label: 'Expirada', color: 'bg-yellow-100 text-yellow-800' }
};

const currencySymbols = { 'USD': '$', 'CRC': '₡' };

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState('');
  const [exchangeRate, setExchangeRate] = useState(520);
  const [formData, setFormData] = useState({
    clientId: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    taxPercent: 13,
    discount: 0,
    notes: '',
    currency: 'USD',
    exchangeRate: 520,
    validUntil: ''
  });
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchQuotes();
    fetchClients();
    fetchExchangeRate();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data } = await axios.get('/api/quotes');
      setQuotes(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error al cargar cotizaciones');
      setLoading(false);
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

  const fetchExchangeRate = async () => {
    try {
      const { data } = await axios.get('/api/exchange/rate');
      if (data.success) {
        setExchangeRate(data.rate);
        setFormData(prev => ({ ...prev, exchangeRate: data.rate }));
      }
    } catch (error) {
      console.error('Error al obtener tipo de cambio');
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setFormData({ ...formData, clientId: client._id });
    setShowClientSearch(false);
    setClientSearch('');
  };

  const filteredClients = clients.filter(client =>
    client.nombre?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.cedula?.includes(clientSearch) ||
    client.telefono?.includes(clientSearch)
  );

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
    return { subtotal, tax, total: subtotal + tax - (formData.discount || 0) };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedQuote) {
        await axios.put(`/api/quotes/${selectedQuote._id}`, formData);
        toast.success('Cotización actualizada');
      } else {
        await axios.post('/api/quotes', formData);
        toast.success('Cotización creada');
      }
      setShowModal(false);
      setSelectedQuote(null);
      setSelectedClient(null);
      resetForm();
      fetchQuotes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar');
    }
  };

  const handleEdit = (quote) => {
    setSelectedQuote(quote);
    setSelectedClient(quote.client);
    setFormData({
      clientId: quote.client?._id,
      items: quote.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      taxPercent: quote.taxPercent,
      discount: quote.discount,
      notes: quote.notes || '',
      currency: quote.currency,
      exchangeRate: quote.exchangeRate,
      validUntil: quote.validUntil ? new Date(quote.validUntil).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleConvertToInvoice = async (quoteId) => {
    if (!window.confirm('¿Convertir esta cotización a factura?')) return;
    try {
      const { data } = await axios.post(`/api/quotes/${quoteId}/convert`);
      toast.success(`Factura ${data.invoice.invoiceNumber} creada exitosamente`);
      fetchQuotes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al convertir');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta cotización?')) return;
    try {
      await axios.delete(`/api/quotes/${id}`);
      toast.success('Cotización eliminada');
      fetchQuotes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/quotes/${id}/status`, { status });
      toast.success('Estado actualizado');
      fetchQuotes();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      taxPercent: 13,
      discount: 0,
      notes: '',
      currency: 'USD',
      exchangeRate: exchangeRate,
      validUntil: ''
    });
    setSelectedClient(null);
  };

  const generatePDF = (quote) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo
    const logoUrl = '/img/logo.png';
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      doc.addImage(img, 'PNG', 15, 10, 30, 30);
      generatePDFContent(doc, quote, pageWidth);
    };
    img.onerror = () => {
      generatePDFContent(doc, quote, pageWidth);
    };
    img.src = logoUrl;
  };

  const generatePDFContent = (doc, quote, pageWidth) => {
    // Encabezado empresa
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY.nombre, 50, 18);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cédula Jurídica: ${COMPANY.cedulaJuridica}`, 50, 24);
    doc.text(`Tel: ${COMPANY.telefono} | Email: ${COMPANY.email}`, 50, 29);
    doc.text(`Dirección: ${COMPANY.direccion}`, 50, 34);

    // Línea separadora
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.5);
    doc.line(15, 38, pageWidth - 15, 38);

    // Título COTIZACIÓN
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('COTIZACIÓN', pageWidth - 15, 18, { align: 'right' });
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`No: ${quote.quoteNumber}`, pageWidth - 15, 24, { align: 'right' });
    doc.text(`Fecha: ${new Date(quote.createdAt).toLocaleDateString('es-CR')}`, pageWidth - 15, 29, { align: 'right' });
    doc.text(`Válida hasta: ${quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('es-CR') : 'N/A'}`, pageWidth - 15, 34, { align: 'right' });

    // Datos del cliente
    let y = 48;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL CLIENTE', 15, y);
    y += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${quote.client?.nombre || 'N/A'}`, 15, y);
    y += 5;
    
    if (quote.client?.tipoCuenta === 'juridico') {
      doc.text(`Razón Social: ${quote.client?.razonSocial || 'N/A'}`, 15, y);
      y += 5;
      doc.text(`Cédula Jurídica: ${quote.client?.cedulaJuridica || 'N/A'}`, 15, y);
      y += 5;
    }
    
    doc.text(`Cédula: ${quote.client?.cedula || 'N/A'}`, 15, y);
    y += 5;
    doc.text(`Email: ${quote.client?.email || 'N/A'}`, 15, y);
    y += 5;
    doc.text(`Teléfono: ${quote.client?.telefono || 'N/A'}`, 15, y);
    y += 5;
    doc.text(`Casillero: ${quote.client?.casillero || 'N/A'}`, 15, y);
    y += 10;

    // Tabla de items
    const tableData = quote.items.map((item, index) => [
      index + 1,
      item.description,
      item.quantity,
      `${currencySymbols[quote.currency]}${item.unitPrice.toFixed(2)}`,
      `${currencySymbols[quote.currency]}${item.total.toFixed(2)}`
    ]);

    doc.autoTable({
      startY: y,
      head: [['#', 'Descripción', 'Cant.', 'Precio Unit.', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 20 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 }
      }
    });

    y = doc.lastAutoTable.finalY + 10;

    // Totales
    const totalsX = pageWidth - 80;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.text('Subtotal:', totalsX, y);
    doc.text(`${currencySymbols[quote.currency]}${quote.subtotal.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
    y += 5;
    
    doc.text(`IVA (${quote.taxPercent}%):`, totalsX, y);
    doc.text(`${currencySymbols[quote.currency]}${quote.tax.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
    y += 5;
    
    if (quote.discount > 0) {
      doc.text('Descuento:', totalsX, y);
      doc.text(`-${currencySymbols[quote.currency]}${quote.discount.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
      y += 5;
    }
    
    doc.setDrawColor(30, 64, 175);
    doc.line(totalsX, y, pageWidth - 15, y);
    y += 5;
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', totalsX, y);
    doc.text(`${currencySymbols[quote.currency]}${quote.total.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
    
    if (quote.currency === 'USD') {
      y += 5;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Equivalente: ₡${(quote.total * quote.exchangeRate).toFixed(2)} CRC`, pageWidth - 15, y, { align: 'right' });
    } else {
      y += 5;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Equivalente: $${(quote.total / quote.exchangeRate).toFixed(2)} USD`, pageWidth - 15, y, { align: 'right' });
    }

    y += 15;

    // Notas
    if (quote.notes) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('NOTAS:', 15, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const splitNotes = doc.splitTextToSize(quote.notes, pageWidth - 30);
      doc.text(splitNotes, 15, y);
      y += splitNotes.length * 5 + 5;
    }

    // Términos
    if (quote.terms) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const splitTerms = doc.splitTextToSize(quote.terms, pageWidth - 30);
      doc.text(splitTerms, 15, y);
    }

    // Pie de página
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`${COMPANY.nombre} | ${COMPANY.cedulaJuridica} | ${COMPANY.telefono}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Guardar PDF
    doc.save(`${quote.quoteNumber}.pdf`);
    toast.success('PDF descargado exitosamente');
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.client?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.client?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || quote.status === statusFilter;
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
          <h1 className="text-2xl font-bold text-gray-800">Cotizaciones</h1>
          <p className="text-gray-600">Gestiona las cotizaciones de clientes</p>
        </div>
        <button onClick={() => { resetForm(); setSelectedQuote(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <FiPlus /> Nueva Cotización
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número o cliente..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cotización</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Válida Hasta</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <tr key={quote._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{quote.quoteNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(quote.createdAt).toLocaleDateString('es-CR')}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{quote.client?.nombre}</p>
                    <p className="text-xs text-gray-500">{quote.client?.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900">{currencySymbols[quote.currency]}{quote.total?.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{quote.currency === 'USD' ? 'Dólares' : 'Colones'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[quote.status]?.color}`}>
                      {statusConfig[quote.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('es-CR') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => generatePDF(quote)} className="text-green-600 hover:text-green-900 mr-2" title="Descargar PDF">
                      <FiDownload />
                    </button>
                    {quote.status !== 'FACTURADA' && (
                      <>
                        <button onClick={() => handleEdit(quote)} className="text-blue-600 hover:text-blue-900 mr-2" title="Editar">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleConvertToInvoice(quote._id)} className="text-purple-600 hover:text-purple-900 mr-2" title="Convertir a Factura">
                          <FiFileText />
                        </button>
                        <button onClick={() => handleDelete(quote._id)} className="text-red-600 hover:text-red-900" title="Eliminar">
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                    {quote.status === 'FACTURADA' && quote.convertedToInvoice && (
                      <span className="text-xs text-purple-600">
                        → {quote.convertedToInvoice.invoiceNumber}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de crear/editar cotización */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedQuote ? 'Editar Cotización' : 'Nueva Cotización'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Buscador de cliente */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                {selectedClient ? (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{selectedClient.nombre}</p>
                      <p className="text-xs text-gray-500">{selectedClient.email} • {selectedClient.casillero}</p>
                    </div>
                    <button type="button" onClick={() => { setSelectedClient(null); setFormData({ ...formData, clientId: '' }); }} className="text-red-500">
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={clientSearch}
                        onChange={(e) => { setClientSearch(e.target.value); setShowClientSearch(true); }}
                        onFocus={() => setShowClientSearch(true)}
                        className="input-field pl-10"
                        placeholder="Buscar por nombre, cédula, email o teléfono..."
                      />
                    </div>
                    {showClientSearch && clientSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredClients.length > 0 ? (
                          filteredClients.map((client) => (
                            <div
                              key={client._id}
                              onClick={() => handleClientSelect(client)}
                              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                            >
                              <p className="font-medium text-gray-800">{client.nombre}</p>
                              <p className="text-xs text-gray-500">{client.email} • {client.cedula} • {client.telefono}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-gray-500 text-sm">No se encontraron clientes</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Moneda */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="input-field"
                  >
                    <option value="USD">🇺🇸 Dólares (USD)</option>
                    <option value="CRC">🇨🇷 Colones (CRC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cambio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.exchangeRate}
                    onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) || 1 })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items de Servicio</label>
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

              {/* Totales */}
              <div className="grid grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descuento</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Válida Hasta</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-wwl-blue">
                    {currencySymbols[formData.currency]}{calculateTotal().total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows="2"
                  placeholder="Notas adicionales..."
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  {selectedQuote ? 'Actualizar' : 'Crear Cotización'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setSelectedQuote(null); setSelectedClient(null); }} className="btn-secondary flex-1">
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

export default AdminQuotes;
