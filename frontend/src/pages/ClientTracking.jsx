import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiInfo, FiPlane, FiHome, FiArrowRight } from 'react-icons/fi';

const statusConfig = {
  'EN_CAMINO_MIAMI': { label: 'En Camino a Miami', color: 'bg-blue-100 text-blue-800', step: 1 },
  'RECIBIDO_MIAMI': { label: 'Recibido en Miami', color: 'bg-green-100 text-green-800', step: 2 },
  'EN_PROCESO': { label: 'En Proceso', color: 'bg-yellow-100 text-yellow-800', step: 2 },
  'EN_TRANSITO_CR': { label: 'En Tránsito a CR', color: 'bg-purple-100 text-purple-800', step: 3 },
  'EN_ADUANA': { label: 'En Aduana', color: 'bg-orange-100 text-orange-800', step: 4 },
  'EN_DISTRIBUCION': { label: 'En Distribución', color: 'bg-indigo-100 text-indigo-800', step: 5 },
  'ENTREGADO': { label: 'Entregado', color: 'bg-green-100 text-green-800', step: 6 },
  'DEVUELTO': { label: 'Devuelto', color: 'bg-red-100 text-red-800', step: 0 }
};

const carrierGuide = [
  { name: 'Amazon', format: 'TBA123456789000', description: 'Comienza con TBA', color: 'bg-orange-500' },
  { name: 'eBay', format: '940011189922...', description: 'Usa USPS (94...)', color: 'bg-blue-600' },
  { name: 'AliExpress', format: 'LP009383838383', description: 'Comienza con LP', color: 'bg-red-600' },
  { name: 'Temu', format: 'YT22383838383', description: 'Comienza con YT', color: 'bg-orange-600' },
  { name: 'Shein', format: '12345678901234', description: '14-16 dígitos', color: 'bg-black' },
  { name: 'UPS', format: '1Z999AA10123456784', description: 'Comienza con 1Z', color: 'bg-amber-700' },
  { name: 'FedEx', format: '123456789012', description: '12 dígitos', color: 'bg-purple-700' },
  { name: 'USPS', format: '9400111899223100000000', description: '94 + 20 dígitos', color: 'bg-blue-700' },
];

const TrackingAnimation = ({ status }) => {
  const currentStep = statusConfig[status]?.step || 0;
  
  const steps = [
    { id: 1, label: 'Tienda\nOnline', icon: '🛒' },
    { id: 2, label: 'Miami\nWarehouse', icon: '📦' },
    { id: 3, label: 'En\nTránsito', icon: '✈️' },
    { id: 4, label: 'Aduana\nCR', icon: '🛃' },
    { id: 5, label: 'Distribu-\nción', icon: '🚚' },
    { id: 6, label: 'Casillero\nWWL', icon: '🏠' }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between relative">
        {/* Línea de progreso de fondo */}
        <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 rounded-full z-0">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.max(0, ((currentStep - 1) / 5) * 100)}%` }}
          ></div>
        </div>

        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 transition-all duration-500 ${
              currentStep >= step.id 
                ? 'bg-white shadow-lg border-2 border-indigo-400 scale-110' 
                : 'bg-gray-100 border-2 border-gray-200'
            }`}>
              {step.icon}
            </div>
            <p className={`text-xs text-center font-medium whitespace-pre-line ${
              currentStep >= step.id ? 'text-indigo-700' : 'text-gray-400'
            }`}>
              {step.label}
            </p>
            {currentStep === step.id && (
              <div className="absolute -top-2 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
            )}
          </div>
        ))}

        {/* Avión animado */}
        {currentStep === 3 && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 animate-bounce">
            <span className="text-3xl">✈️</span>
          </div>
        )}
      </div>

      {/* Descripción del estado actual */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {currentStep === 1 && 'Tu paquete ha sido enviado desde la tienda'}
          {currentStep === 2 && 'Tu paquete está en nuestro almacén de Miami'}
          {currentStep === 3 && '✈️ Tu paquete está volando hacia Costa Rica'}
          {currentStep === 4 && 'Tu paquete está en trámites de aduana'}
          {currentStep === 5 && 'Tu paquete está en camino a tu dirección'}
          {currentStep === 6 && '¡Tu paquete ha sido entregado!'}
        </p>
      </div>
    </div>
  );
};

const ClientTracking = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState(false);

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

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchMode(false);
      setSelectedPackage(null);
      return;
    }
    
    const found = packages.find(pkg => 
      pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (found) {
      setSelectedPackage(found);
      setSearchMode(true);
    } else {
      toast.info('No se encontró un paquete con ese número de tracking');
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.store?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayPackages = searchMode && selectedPackage ? [selectedPackage] : filteredPackages;

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

      {/* Buscador de tracking */}
      <div className="card mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ingresa tu número de tracking (TBA..., LP..., YT..., 1Z...)..."
              className="input-field pl-10"
            />
          </div>
          <button onClick={handleSearch} className="btn-primary flex items-center gap-2">
            <FiSearch /> Rastrear
          </button>
          {searchMode && (
            <button 
              onClick={() => { setSearchMode(false); setSelectedPackage(null); setSearchTerm(''); }} 
              className="btn-secondary"
            >
              Ver Todos
            </button>
          )}
        </div>

        {/* Guía de formatos */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-medium text-blue-800 mb-2">Formatos de tracking por tienda:</p>
          <div className="flex flex-wrap gap-2">
            {carrierGuide.map((carrier) => (
              <button
                key={carrier.name}
                onClick={() => setSearchTerm(carrier.format)}
                className={`${carrier.color} text-white text-xs px-2 py-1 rounded-full hover:opacity-80 transition`}
              >
                {carrier.name}: {carrier.format}
              </button>
            ))}
          </div>
        </div>
      </div>

      {packages.length === 0 && !searchMode ? (
        <div className="card text-center py-12">
          <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tienes paquetes registrados</h3>
          <p className="text-gray-500 mb-4">
            Cuando realices una compra en USA, usa tu dirección de casillero en Miami.<br />
            Tu paquete aparecerá aquí cuando llegue a nuestro almacén.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayPackages.map((pkg) => {
            const statusInfo = statusConfig[pkg.status] || statusConfig['EN_CAMINO_MIAMI'];
            const isSelected = selectedPackage?._id === pkg._id;
            
            return (
              <div key={pkg._id}>
                {/* Animación de tracking */}
                {isSelected && (
                  <TrackingAnimation status={pkg.status} />
                )}

                <div 
                  className={`card hover:shadow-lg transition cursor-pointer ${isSelected ? 'ring-2 ring-indigo-400' : ''}`}
                  onClick={() => setSelectedPackage(isSelected ? null : pkg)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FiPackage className="text-wwl-blue text-xl" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{pkg.description || 'Paquete'}</h3>
                          <span className={`${statusInfo.color} px-2 py-0.5 rounded-full text-xs font-medium`}>
                            {statusInfo.label}
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

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Origen</p>
                          <p className="font-medium text-gray-800 flex items-center gap-2">
                            🛒 {pkg.origin?.city}, {pkg.origin?.state}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Destino</p>
                          <p className="font-medium text-gray-800 flex items-center gap-2">
                            🏠 Casillero WWL - San José, CR
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
                                index === 0 ? 'bg-indigo-500' : 'bg-gray-300'
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
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientTracking;
