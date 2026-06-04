import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUsers, FiPackage, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    paquetesEnTransito: 0,
    paquetesEntregados: 0,
    ingresosMes: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/auth/users');
      setRecentUsers(data.slice(0, 5));
      setStats({
        totalClientes: data.length,
        paquetesEnTransito: 23,
        paquetesEntregados: 156,
        ingresosMes: 4500000
      });
      setLoading(false);
    } catch (error) {
      toast.error('Error al cargar datos');
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Clientes', value: stats.totalClientes, icon: <FiUsers />, color: 'bg-blue-500' },
    { title: 'En Tránsito', value: stats.paquetesEnTransito, icon: <FiPackage />, color: 'bg-yellow-500' },
    { title: 'Entregados', value: stats.paquetesEntregados, icon: <FiTrendingUp />, color: 'bg-green-500' },
    { title: 'Ingresos Mes', value: `₡${stats.ingresosMes.toLocaleString()}`, icon: <FiDollarSign />, color: 'bg-purple-500' }
  ];

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
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de administración de Casillero WWL</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Clientes Recientes</h2>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-wwl-blue rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{user.nombre.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user.nombre}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {[
              { action: 'Nuevo paquete recibido', user: 'María García', time: 'Hace 5 min' },
              { action: 'Paquete entregado', user: 'Juan Pérez', time: 'Hace 15 min' },
              { action: 'Nuevo cliente registrado', user: 'Carlos López', time: 'Hace 1 hora' },
              { action: 'Pago procesado', user: 'Ana Rodríguez', time: 'Hace 2 horas' },
              { action: 'Paquete en aduana', user: 'Roberto Sánchez', time: 'Hace 3 horas' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-wwl-blue rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
