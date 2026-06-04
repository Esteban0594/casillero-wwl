import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiInfo, FiBell } from 'react-icons/fi';

const statusConfig = {
  'EN_CAMINO_MIAMI': { label: 'En Camino a Miami', color: 'bg-blue-100 text-blue-800', icon: <FiTruck /> },
  'RECIBIDO_MIAMI': { label: 'Recibido en Miami', color: 'bg-green-100 text-green-800', icon: <FiCheckCircle /> },
  'EN_PROCESO': { label: 'En Proceso', color: 'bg-yellow-100 text-yellow-800', icon: <FiClock /> },
  'EN_TRANSITO_CR': { label: 'En Tránsito a CR', color: 'bg-purple-100 text-purple-800', icon: <FiTruck /> },
  'EN_ADUANA': { label: 'En Aduana', color: 'bg-orange-100 text-orange-800', icon: <FiPackage /> },
  'EN_DISTRIBUCION': { label: 'En Distribución', color: 'bg-indigo-100 text-indigo-800', icon: <FiTruck /> },
  'ENTREGADO': { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: <FiCheckCircle /> },
  'DEVUELTO': { label: 'Devuelto', color: 'bg-red-100 text-red-800', icon: <FiPackage /> }
};

const carrierGuide = [
  { name: 'Amazon', format: 'TBA123456789000', description: 'Comienza con TBA seguido de 12-15 dígitos', color: 'bg-orange-500' },
  { name: 'eBay', format: '940011189922...', description: 'Generalmente usa USPS (94 + 20 dígitos)', color: 'bg-blue-600' },
  { name: 'AliExpress', format: 'LP009383838383', description: 'Comienza con LP seguido de 10-14 dígitos', color: 'bg-red-600' },
  { name: 'Temu', format: 'YT22383838383', description: 'Comienza con YT seguido de 12-16 dígitos', color: 'bg-orange-600' },
  { name: 'Shein', format: '12345678901234', description: '14-16 dígitos o comienza con US', color: 'bg-black' },
  { name: 'UPS', format: '1Z999AA10123456784', description: 'Comienza con 1Z seguido de 16 caracteres', color: 'bg-amber-700' },
  { name: 'FedEx', format: '123456789012', description: '12, 15, 20 o 22 dígitos numéricos', color: 'bg-purple-700' },
  { name: 'USPS', format: '9400111899223100000000', description: '94/93/92 + 20-34 dígitos', color: 'bg-blue-700' },
  { name: 'DHL', format: '1234567890', description: '10-11 dígitos', color: 'bg-yellow-500' }
];

const ClientTracking = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data } = await axios.get('/api/packages/my-packages');
      setPackages(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error al cargar paquetes');
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.store?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Rastreo de Paquetes</h1>
        <p className="text-gray-600">Sigue el estado de tus envíos en tiempo real</p>
      </div>

      <div className="card mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-3">
          <FiInfo className="text-wwl-blue text-xl mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Guía de Números de Tracking</h3>
            <p className="text-sm text-gray-600 mb-3">
              Cada empresa de envío tiene su propio formato. Identifica tu tracking según la empresa:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {carrierGuide.map((carrier) => (
                <div key={carrier.name} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <span className={`${carrier.color} text-white text-xs font-bold px-2 py-1 rounded`}>
                    {carrier.name}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">{carrier.format}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {packages.length > 0 && (
        <div className="card mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número de tracking, descripción o tienda..."
              className="input-field pl-10"
            />
          </div>
        </div>
      )}

      {packages.length === 0 ? (
        <div className="card text-center py-12">
          <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tienes paquetes registrados</h3>
          <p className="text-gray-500 mb-4">
            Cuando realices una compra en USA, usa tu dirección de casillero en Miami.<br />
            Tu paquete aparecerá aquí cuando llegue a nuestro almacén.
          </p>
          <div className="inline-block p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Tu dirección de casillero:</p>
            <p className="font-mono text-wwl-blue font-semibold">
              Casillero WWL - Tu número de casillero
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPackages.map((pkg) => {
            const statusInfo = statusConfig[pkg.status] || statusConfig['EN_CAMINO_MIAMI'];
            return (
              <div 
                key={pkg._id} 
                className={`card hover:shadow-lg transition cursor-pointer ${selectedPackage?._id === pkg._id ? 'ring-2 ring-wwl-blue' : ''}`}
                onClick={() => setSelectedPackage(selectedPackage?._id === pkg._id ? null : pkg)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FiPackage className="text-wwl-blue text-xl" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{pkg.description || 'Paquete'}</h3>
                        <span className={`${statusInfo.color} px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-mono">{pkg.trackingNumber}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{pkg.carrierName}</span>
                        {pkg.store && <span>Tienda: {pkg.store}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {pkg.estimatedDelivery && (
                      <p>Estimado: {new Date(pkg.estimatedDelivery).toLocaleDateString('es-CR')}</p>
                    )}
                    <p className="text-xs">{new Date(pkg.createdAt).toLocaleDateString('es-CR')}</p>
                  </div>
                </div>

                {selectedPackage?._id === pkg._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Origen</p>
                        <p className="font-medium text-gray-800">
                          {pkg.origin?.city}, {pkg.origin?.state}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Destino</p>
                        <p className="font-medium text-gray-800">
                          {pkg.destination?.city}, {pkg.destination?.country}
                        </p>
                      </div>
                      {pkg.weight && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Peso</p>
                          <p className="font-medium text-gray-800">{pkg.weight} lbs</p>
                        </div>
                      )}
                      {pkg.declaredValue && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Valor Declarado</p>
                          <p className="font-medium text-gray-800">${pkg.declaredValue} {pkg.currency}</p>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Historial de Estados</p>
                      <div className="relative pl-4 border-l-2 border-gray-200 space-y-3">
                        {pkg.statusHistory?.slice().reverse().map((history, index) => (
                          <div key={index} className="relative">
                            <div className={`absolute -left-[21px] w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-wwl-blue' : 'bg-gray-300'
                            }`}></div>
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-800">
                                {statusConfig[history.status]?.label || history.status}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(history.date).toLocaleString('es-CR')}
                                {history.location && ` - ${history.location}`}
                              </p>
                              {history.notes && <p className="text-xs text-gray-600 mt-0.5">{history.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {pkg.carrier && (
                      <a 
                        href={`https://www.${pkg.carrier.toLowerCase()}.com/track?tracknum=${pkg.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm inline-flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiTruck /> Rastrear en {pkg.carrierName}
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientTracking;
