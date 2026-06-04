import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiTruck, FiCheck, FiX, FiSettings, FiLink, FiRefreshCw } from 'react-icons/fi';

const AdminCarriers = () => {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    website: '',
    trackingUrl: '',
    api: {
      enabled: false,
      provider: '',
      apiKey: '',
      apiSecret: '',
      accountNumber: '',
      environment: 'sandbox',
      endpoints: {
        tracking: '',
        rates: '',
        labels: '',
        pickup: ''
      }
    },
    pricing: {
      perPound: 0,
      customsFeePercent: 10,
      insurancePercent: 5,
      minCharge: 0
    },
    estimatedDays: {
      min: 7,
      max: 10
    },
    isActive: true
  });

  useEffect(() => {
    fetchCarriers();
  }, []);

  const fetchCarriers = async () => {
    try {
      const { data } = await axios.get('/api/carriers');
      setCarriers(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error al cargar carriers');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCarrier) {
        await axios.put(`/api/carriers/${selectedCarrier._id}`, formData);
        toast.success('Carrier actualizado exitosamente');
      } else {
        await axios.post('/api/carriers', formData);
        toast.success('Carrier creado exitosamente');
      }
      setShowModal(false);
      setSelectedCarrier(null);
      resetForm();
      fetchCarriers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar solicitud');
    }
  };

  const handleEdit = (carrier) => {
    setSelectedCarrier(carrier);
    setFormData({
      code: carrier.code,
      name: carrier.name,
      description: carrier.description || '',
      website: carrier.website || '',
      trackingUrl: carrier.trackingUrl || '',
      api: carrier.api || formData.api,
      pricing: carrier.pricing || formData.pricing,
      estimatedDays: carrier.estimatedDays || formData.estimatedDays,
      isActive: carrier.isActive
    });
    setShowModal(true);
  };

  const handleApiConfig = (carrier) => {
    setSelectedCarrier(carrier);
    setFormData({
      ...formData,
      api: carrier.api || formData.api
    });
    setShowApiModal(true);
  };

  const handleApiSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/carriers/${selectedCarrier._id}`, { api: formData.api });
      toast.success('Configuración de API actualizada');
      setShowApiModal(false);
      fetchCarriers();
    } catch (error) {
      toast.error('Error al actualizar API');
    }
  };

  const handleTestApi = async (carrierId) => {
    try {
      const { data } = await axios.post(`/api/carriers/${carrierId}/test`);
      toast.success(`API probada: ${data.message}`);
      fetchCarriers();
    } catch (error) {
      toast.error('Error al probar API');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este carrier?')) {
      try {
        await axios.delete(`/api/carriers/${id}`);
        toast.success('Carrier eliminado');
        fetchCarriers();
      } catch (error) {
        toast.error('Error al eliminar carrier');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      website: '',
      trackingUrl: '',
      api: {
        enabled: false,
        provider: '',
        apiKey: '',
        apiSecret: '',
        accountNumber: '',
        environment: 'sandbox',
        endpoints: {
          tracking: '',
          rates: '',
          labels: '',
          pickup: ''
        }
      },
      pricing: {
        perPound: 0,
        customsFeePercent: 10,
        insurancePercent: 5,
        minCharge: 0
      },
      estimatedDays: {
        min: 7,
        max: 10
      },
      isActive: true
    });
  };

  const filteredCarriers = carriers.filter(carrier =>
    carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Carriers</h1>
          <p className="text-gray-600">Configura las empresas de envío y sus APIs</p>
        </div>
        <button onClick={() => { resetForm(); setSelectedCarrier(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <FiPlus /> Nuevo Carrier
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar carrier..."
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCarriers.map((carrier) => (
          <div key={carrier._id} className="card hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  carrier.isActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <FiTruck className={`text-xl ${carrier.isActive ? 'text-wwl-blue' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{carrier.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{carrier.code}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                carrier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {carrier.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {carrier.description && (
              <p className="text-sm text-gray-600 mb-3">{carrier.description}</p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">API:</span>
                <span className={`flex items-center gap-1 ${carrier.api?.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {carrier.api?.enabled ? <FiCheck /> : <FiX />}
                  {carrier.api?.enabled ? 'Configurada' : 'No configurada'}
                </span>
              </div>
              {carrier.api?.enabled && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Estado:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    carrier.api?.syncStatus === 'active' ? 'bg-green-100 text-green-800' :
                    carrier.api?.syncStatus === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {carrier.api?.syncStatus === 'active' ? 'Conectado' :
                     carrier.api?.syncStatus === 'error' ? 'Error' : 'Inactivo'}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Precio/lb:</span>
                <span className="font-medium">${carrier.pricing?.perPound || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Envío:</span>
                <span className="font-medium">{carrier.estimatedDays?.min || 7}-{carrier.estimatedDays?.max || 10} días</span>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button onClick={() => handleEdit(carrier)} className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1">
                <FiEdit2 /> Editar
              </button>
              <button onClick={() => handleApiConfig(carrier)} className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1">
                <FiSettings /> API
              </button>
              <button onClick={() => handleDelete(carrier._id)} className="btn-danger text-sm px-3">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedCarrier ? 'Editar Carrier' : 'Nuevo Carrier'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="input-field"
                    placeholder="DHL"
                    required
                    disabled={!!selectedCarrier}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="input-field"
                    placeholder="https://www.dhl.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Tracking</label>
                  <input
                    type="url"
                    value={formData.trackingUrl}
                    onChange={(e) => setFormData({ ...formData, trackingUrl: e.target.value })}
                    className="input-field"
                    placeholder="https://www.dhl.com/track?num="
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio/lb ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pricing.perPound}
                    onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, perPound: parseFloat(e.target.value) || 0 } })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mín (días)</label>
                  <input
                    type="number"
                    value={formData.estimatedDays.min}
                    onChange={(e) => setFormData({ ...formData, estimatedDays: { ...formData.estimatedDays, min: parseInt(e.target.value) || 0 } })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Máx (días)</label>
                  <input
                    type="number"
                    value={formData.estimatedDays.max}
                    onChange={(e) => setFormData({ ...formData, estimatedDays: { ...formData.estimatedDays, max: parseInt(e.target.value) || 0 } })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  className="input-field"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  {selectedCarrier ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setSelectedCarrier(null); }} className="btn-secondary flex-1">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Configurar API - {selectedCarrier?.name}
            </h2>
            <form onSubmit={handleApiSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.api.enabled}
                    onChange={(e) => setFormData({ ...formData, api: { ...formData.api, enabled: e.target.checked } })}
                    className="rounded text-wwl-blue focus:ring-wwl-blue"
                  />
                  <span className="text-sm font-medium text-gray-700">Habilitar API</span>
                </label>
              </div>

              {formData.api.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor de API</label>
                    <select
                      value={formData.api.provider}
                      onChange={(e) => setFormData({ ...formData, api: { ...formData.api, provider: e.target.value } })}
                      className="input-field"
                    >
                      <option value="">Seleccionar proveedor</option>
                      <option value="dhl">DHL Express API</option>
                      <option value="fedex">FedEx Web Services</option>
                      <option value="ups">UPS Developer Kit</option>
                      <option value="usps">USPS Web Tools</option>
                      <option value="custom">API Personalizada</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <input
                        type="password"
                        value={formData.api.apiKey}
                        onChange={(e) => setFormData({ ...formData, api: { ...formData.api, apiKey: e.target.value } })}
                        className="input-field"
                        placeholder="Tu API Key"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Secret</label>
                      <input
                        type="password"
                        value={formData.api.apiSecret}
                        onChange={(e) => setFormData({ ...formData, api: { ...formData.api, apiSecret: e.target.value } })}
                        className="input-field"
                        placeholder="Tu API Secret"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Cuenta</label>
                    <input
                      type="text"
                      value={formData.api.accountNumber}
                      onChange={(e) => setFormData({ ...formData, api: { ...formData.api, accountNumber: e.target.value } })}
                      className="input-field"
                      placeholder="Número de cuenta del carrier"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ambiente</label>
                    <select
                      value={formData.api.environment}
                      onChange={(e) => setFormData({ ...formData, api: { ...formData.api, environment: e.target.value } })}
                      className="input-field"
                    >
                      <option value="sandbox">Sandbox (Pruebas)</option>
                      <option value="production">Producción</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Endpoints de la API</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Tracking</label>
                        <input
                          type="url"
                          value={formData.api.endpoints.tracking}
                          onChange={(e) => setFormData({ ...formData, api: { ...formData.api, endpoints: { ...formData.api.endpoints, tracking: e.target.value } } })}
                          className="input-field text-sm"
                          placeholder="https://api.carrier.com/v1/track"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Tarifas</label>
                        <input
                          type="url"
                          value={formData.api.endpoints.rates}
                          onChange={(e) => setFormData({ ...formData, api: { ...formData.api, endpoints: { ...formData.api.endpoints, rates: e.target.value } } })}
                          className="input-field text-sm"
                          placeholder="https://api.carrier.com/v1/rates"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>Nota:</strong> Las credenciales se almacenan de forma segura. 
                      Usa el ambiente Sandbox para pruebas antes de cambiar a Producción.
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Guardar Configuración
                </button>
                {formData.api.enabled && selectedCarrier && (
                  <button type="button" onClick={() => handleTestApi(selectedCarrier._id)} className="btn-secondary flex items-center gap-2">
                    <FiRefreshCw /> Probar
                  </button>
                )}
                <button type="button" onClick={() => setShowApiModal(false)} className="btn-secondary flex-1">
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

export default AdminCarriers;
