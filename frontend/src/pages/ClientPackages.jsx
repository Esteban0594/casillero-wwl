import { useState } from 'react';
import { FiPackage, FiSearch, FiFilter, FiMapPin, FiCalendar } from 'react-icons/fi';

const ClientPackages = () => {
  const [filter, setFilter] = useState('all');

  const packages = [
    {
      id: 'WWL-001234',
      description: 'iPhone 15 Pro Max 256GB',
      origin: 'Miami, FL',
      destination: 'San José, Costa Rica',
      status: 'En Tránsito',
      statusColor: 'bg-yellow-100 text-yellow-800',
      date: '2024-01-15',
      tracking: '1Z999AA10123456784',
      weight: '0.5 kg',
      value: '$1,199.00'
    },
    {
      id: 'WWL-001235',
      description: 'MacBook Air M2 13"',
      origin: 'New York, NY',
      destination: 'San José, Costa Rica',
      status: 'En Aduana',
      statusColor: 'bg-blue-100 text-blue-800',
      date: '2024-01-14',
      tracking: '1Z999AA10123456785',
      weight: '1.2 kg',
      value: '$999.00'
    },
    {
      id: 'WWL-001236',
      description: 'AirPods Pro 2da Gen',
      origin: 'Los Angeles, CA',
      destination: 'San José, Costa Rica',
      status: 'Entregado',
      statusColor: 'bg-green-100 text-green-800',
      date: '2024-01-10',
      tracking: '1Z999AA10123456786',
      weight: '0.2 kg',
      value: '$249.00'
    },
    {
      id: 'WWL-001237',
      description: 'Nike Air Max 90',
      origin: 'Portland, OR',
      destination: 'San José, Costa Rica',
      status: 'Procesando',
      statusColor: 'bg-purple-100 text-purple-800',
      date: '2024-01-16',
      tracking: '1Z999AA10123456787',
      weight: '0.8 kg',
      value: '$130.00'
    },
    {
      id: 'WWL-001238',
      description: 'Samsung Galaxy S24 Ultra',
      origin: 'Houston, TX',
      destination: 'San José, Costa Rica',
      status: 'Entregado',
      statusColor: 'bg-green-100 text-green-800',
      date: '2024-01-08',
      tracking: '1Z999AA10123456788',
      weight: '0.4 kg',
      value: '$1,299.00'
    }
  ];

  const filteredPackages = filter === 'all' 
    ? packages 
    : packages.filter(pkg => {
        if (filter === 'transit') return pkg.status === 'En Tránsito';
        if (filter === 'customs') return pkg.status === 'En Aduana';
        if (filter === 'delivered') return pkg.status === 'Entregado';
        if (filter === 'processing') return pkg.status === 'Procesando';
        return true;
      });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis Paquetes</h1>
        <p className="text-gray-600">{packages.length} paquetes en total</p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar paquete..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'processing', label: 'Procesando' },
              { key: 'transit', label: 'En Tránsito' },
              { key: 'customs', label: 'En Aduana' },
              { key: 'delivered', label: 'Entregados' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === item.key
                    ? 'bg-wwl-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="card hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiPackage className="text-wwl-blue text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{pkg.description}</h3>
                  <p className="text-sm text-gray-500">ID: {pkg.id}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-xs" /> {pkg.origin}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-xs" /> {pkg.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Peso: {pkg.weight}</p>
                  <p className="font-medium text-gray-800">{pkg.value}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${pkg.statusColor}`}>
                  {pkg.status}
                </span>
                <button className="btn-secondary text-sm">
                  Ver Detalles
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Tracking: {pkg.tracking}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Destino:</span>
                  <span className="font-medium text-gray-700">{pkg.destination}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientPackages;
