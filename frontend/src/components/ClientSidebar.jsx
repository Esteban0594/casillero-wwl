import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { 
  FiHome, 
  FiPackage, 
  FiFileText, 
  FiUser, 
  FiLogOut,
  FiHelpCircle,
  FiMapPin,
  FiShoppingBag,
  FiDollarSign,
  FiBell
} from 'react-icons/fi';

const ClientSidebar = () => {
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/portal', icon: <FiHome />, label: 'Inicio' },
    { path: '/portal/tiendas', icon: <FiShoppingBag />, label: 'Tiendas' },
    { path: '/portal/calculadora', icon: <FiDollarSign />, label: 'Calculadora' },
    { path: '/portal/mis-paquetes', icon: <FiPackage />, label: 'Mis Paquetes' },
    { path: '/portal/rastreo', icon: <FiMapPin />, label: 'Rastreo' },
    { path: '/portal/facturas', icon: <FiFileText />, label: 'Facturas' },
    { path: '/portal/mi-cuenta', icon: <FiUser />, label: 'Mi Cuenta' },
    { path: '/portal/notificaciones', icon: <FiBell />, label: 'Notificaciones' },
    { path: '/portal/ayuda', icon: <FiHelpCircle />, label: 'Ayuda' },
  ];

  return (
    <div className="min-h-screen bg-white w-64 shadow-xl flex flex-col border-r border-gray-200">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-wwl-blue to-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center">
            <img src="/img/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Casillero WWL</h1>
            <p className="text-blue-200 text-xs">Mi Casillero</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-wwl-gold rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.nombre?.charAt(0) || 'C'}
            </span>
          </div>
          <div>
            <p className="text-gray-800 text-sm font-medium">{user?.nombre}</p>
            <p className="text-gray-500 text-xs">Casillero: {user?.casillero}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/portal'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                isActive
                  ? 'bg-wwl-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition duration-200 w-full"
        >
          <FiLogOut className="text-lg" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default ClientSidebar;
