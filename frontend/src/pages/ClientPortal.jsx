import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiShoppingBag } from 'react-icons/fi';

const ClientPortal = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Mis Paquetes', value: 3, icon: <FiPackage />, color: 'bg-blue-500' },
    { title: 'En Tránsito', value: 2, icon: <FiTruck />, color: 'bg-yellow-500' },
    { title: 'Entregados', value: 12, icon: <FiCheckCircle />, color: 'bg-green-500' },
    { title: 'Pendientes', value: 1, icon: <FiClock />, color: 'bg-purple-500' }
  ];

  const recentPackages = [
    {
      id: 'WWL-001234',
      description: 'iPhone 15 Pro Max',
      origin: 'Miami, FL',
      status: 'En Tránsito',
      statusColor: 'bg-yellow-100 text-yellow-800',
      date: '2024-01-15',
      tracking: '1Z999AA10123456784'
    },
    {
      id: 'WWL-001235',
      description: 'MacBook Air M2',
      origin: 'New York, NY',
      status: 'En Aduana',
      statusColor: 'bg-blue-100 text-blue-800',
      date: '2024-01-14',
      tracking: '1Z999AA10123456785'
    },
    {
      id: 'WWL-001236',
      description: 'AirPods Pro',
      origin: 'Los Angeles, CA',
      status: 'Entregado',
      statusColor: 'bg-green-100 text-green-800',
      date: '2024-01-10',
      tracking: '1Z999AA10123456786'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          ¡Bienvenido, {user?.nombre?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">Tu número de casillero: <span className="font-semibold text-wwl-blue">{user?.casillero}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-8 bg-gradient-to-r from-wwl-blue to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FiShoppingBag className="text-2xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">¡Compra en tus tiendas favoritas!</h2>
              <p className="text-blue-100 text-sm">Accede directamente a Amazon, Shein, eBay y más</p>
            </div>
          </div>
          <Link
            to="/portal/tiendas"
            className="bg-white text-wwl-blue px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Ver Tiendas
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Mis Paquetes Recientes</h2>
          <div className="space-y-4">
            {recentPackages.map((pkg) => (
              <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiPackage className="text-wwl-blue" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{pkg.description}</p>
                      <p className="text-sm text-gray-500">ID: {pkg.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${pkg.statusColor}`}>
                    {pkg.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FiMapPin /> {pkg.origin}
                  </span>
                  <span>Tracking: {pkg.tracking}</span>
                  <span>{pkg.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Dirección de tu Casillero</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Envía tus paquetes a:</p>
            <p className="font-medium text-gray-800">{user?.nombre}</p>
            <p className="text-sm text-gray-600">Casillero: {user?.casillero}</p>
            <p className="text-sm text-gray-600">1234 NW 78th Ave</p>
            <p className="text-sm text-gray-600">Miami, FL 33126</p>
            <p className="text-sm text-gray-600">United States</p>
          </div>
          <button className="btn-primary w-full">Copiar Dirección</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">¿Cómo funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Recibe tu dirección', description: 'Te asignamos un casillero en Miami para recibir tus compras.' },
            { step: '2', title: 'Compra en USA', description: 'Usa tu dirección de casillero al hacer compras en tiendas online.' },
            { step: '3', title: 'Recibe en Costa Rica', description: 'Nosotros nos encargamos de traer tu paquete a Costa Rica.' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-wwl-blue rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
