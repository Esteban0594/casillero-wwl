import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiUsers, 
  FiPackage, 
  FiSettings, 
  FiLogOut, 
  FiHome,
  FiBarChart2,
  FiBell,
  FiShield,
  FiTruck,
  FiFileText,
  FiClipboard
} from 'react-icons/fi';

const AdminSidebar = () => {
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/usuarios', icon: <FiShield />, label: 'Usuarios' },
    { path: '/admin/clientes', icon: <FiUsers />, label: 'Clientes' },
    { path: '/admin/paquetes', icon: <FiPackage />, label: 'Paquetes' },
    { path: '/admin/carriers', icon: <FiTruck />, label: 'Carriers' },
    { path: '/admin/cotizaciones', icon: <FiClipboard />, label: 'Cotizaciones' },
    { path: '/admin/facturas', icon: <FiFileText />, label: 'Facturas' },
    { path: '/admin/reportes', icon: <FiBarChart2 />, label: 'Reportes' },
    { path: '/admin/notificaciones', icon: <FiBell />, label: 'Notificaciones' },
    { path: '/admin/configuracion', icon: <FiSettings />, label: 'Configuración' },
  ];

  return (
    <div className="min-h-screen bg-wwl-dark w-64 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center">
            <img src="/img/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Casillero WWL</h1>
            <p className="text-gray-400 text-xs">Panel Administrativo</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-wwl-blue rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.nombre?.charAt(0) || 'A'}
            </span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.nombre}</p>
            <p className="text-gray-400 text-xs">Administrador</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <FiLogOut className="text-lg" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
