import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiPlus, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const statusConfig = {
  'EN_CAMINO_MIAMI': { label: 'En Camino a Miami', color: 'bg-blue-100 text-blue-800' },
  'RECIBIDO_MIAMI': { label: 'Recibido en Miami', color: 'bg-green-100 text-green-800' },
  'EN_PROCESO': { label: 'En Proceso', color: 'bg-yellow-100 text-yellow-800' },
  'EN_TRANSITO_CR': { label: 'En Tránsito a CR', color: 'bg-purple-100 text-purple-800' },
  'EN_ADUANA': { label: 'En Aduana', color: 'bg-orange-100 text-orange-800' },
  'EN_DISTRIBUCION': { label: 'En Distribución', color: 'bg-indigo-100 text-indigo-800' },
  'ENTREGADO': { label: 'Entregado', color: 'bg-green-100 text-green-800' },
  'DEVUELTO': { label: 'Devuelto', color: 'bg-red-100 text-red-800' }
};

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    trackingNumber: '',
    clientEmail: '',
    casillero: '',
    description: '',
    store: '',
    weight: '',
    declaredValue: '',
    shippingMethod: 'STANDARD',
    notes: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data } = await axios.get('/api/packages');
      setPackages(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error al cargar paquetes');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPackage) {
        await axios.put(`/api/packages/${selectedPackage._id}/status`, {
          status: formData.status,
          location: formData.location,
          notes: formData.notes
        });
        toast.success('Estado del paquete actualizado');
      } else {
        await axios.post('/api/packages', formData);
        toast.success('Paquete registrado exitosamente');
      }
      setShowModal(false);
      setSelectedPackage(null);
      resetForm();
      fetchPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar solicitud');
    }
  };

  const handleReceived = async (id) => {
    try {
      await axios.put(`/api/packages/${id}/received`);
      toast.success('Paquete marcado como recibido en Miami');
      fetchPackages();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este paquete?')) {
      try {
        await axios.delete(`/api/packages/${id}`);
        toast.success('Paquete eliminado');
        fetchPackages();
      } catch (error) {
        toast.error('Error al eliminar paquete');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      trackingNumber: '',
      clientEmail: '',
      casillero: '',
      description: '',
      store: '',
      weight: '',
      declaredValue: '',
      shippingMethod: 'STANDARD',
      notes: ''
    });
  };

  const openEditModal = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      status: pkg.status,
      location: '',
      notes: ''
    });
    setShowModal(true);
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.client?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.client?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: packages.length,
    enCamino: packages.filter(p => p.status === 'EN_CAMINO_MIAMI').length,
    enMiami: packages.filter(p => p.status === 'RECIBIDO_MIAMI').length,
    enTransito: packages.filter(p => p.status === 'EN_TRANSITO_CR').length,
    entregados: packages.filter(p => p.status === 'ENTREGADO').length
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Paquetes</h1>
          <p className="text-gray-600">{packages.length} paquetes en total</p>
        </div>
        <button onClick={() => { resetForm(); setSelectedPackage(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <FiPlus /> Registrar Paquete
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.enCamino}</p>
          <p className="text-xs text-gray-500">En Camino</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{stats.enMiami}</p>
          <p className="text-xs text-gray-500">En Miami</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.enTransito}</p>
          <p className="text-xs text-gray-500">En Tránsito</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-700">{stats.entregados}</p>
          <p className="text-xs text-gray-500">Entregados</p>
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
              placeholder="Buscar por tracking, descripción o cliente..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPackages.map((pkg) => {
                const statusInfo = statusConfig[pkg.status] || statusConfig['EN_CAMINO_MIAMI'];
                return (
                  <tr key={pkg._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiPackage className="text-gray-400 mr-2" />
                        <span className="font-mono text-sm font-medium text-gray-900">{pkg.trackingNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{pkg.client?.nombre}</p>
                        <p className="text-xs text-gray-500">{pkg.casillero}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pkg.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{pkg.carrierName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pkg.createdAt).toLocaleDateString('es-CR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(pkg)} className="text-blue-600 hover:text-blue-900 mr-3" title="Actualizar estado">
                        <FiEdit2 />
                      </button>
                      {pkg.status === 'EN_CAMINO_MIAMI' && (
                        <button onClick={() => handleReceived(pkg._id)} className="text-green-600 hover:text-green-900 mr-3" title="Marcar recibido">
                          <FiCheckCircle />
                        </button>
                      )}
                      <button onClick={() => handleDelete(pkg._id)} className="text-red-600 hover:text-red-900" title="Eliminar">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedPackage ? 'Actualizar Estado' : 'Registrar Paquete'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedPackage ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Estado</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input-field"
                      required
                    >
                      {Object.entries(statusConfig).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="input-field"
                      placeholder="Ej: Miami, FL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="input-field"
                      rows="3"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tracking *</label>
                    <input
                      type="text"
                      value={formData.trackingNumber}
                      onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                      className="input-field"
                      placeholder="1Z999AA10123456784"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Se detectará automáticamente la empresa de envío</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email del Cliente o Casillero *</label>
                    <input
                      type="text"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="input-field"
                      placeholder="cliente@email.com o WWL-123456"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field"
                      placeholder="iPhone 15 Pro Max"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tienda de Origen</label>
                    <input
                      type="text"
                      value={formData.store}
                      onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                      className="input-field"
                      placeholder="Amazon, eBay, etc."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Peso (lbs)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="input-field"
                        placeholder="2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.declaredValue}
                        onChange={(e) => setFormData({ ...formData, declaredValue: e.target.value })}
                        className="input-field"
                        placeholder="500"
                      />
                    </div>
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
                </>
              )}
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  {selectedPackage ? 'Actualizar' : 'Registrar'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setSelectedPackage(null); }} className="btn-secondary flex-1">
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

export default AdminPackages;
