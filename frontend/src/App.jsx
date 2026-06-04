import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminClients from './pages/AdminClients';
import AdminPackages from './pages/AdminPackages';
import AdminUsers from './pages/AdminUsers';
import AdminCarriers from './pages/AdminCarriers';
import AdminInvoices from './pages/AdminInvoices';
import ClientPortal from './pages/ClientPortal';
import ClientPackages from './pages/ClientPackages';
import ClientStores from './pages/ClientStores';
import ClientTracking from './pages/ClientTracking';
import ClientInvoices from './pages/ClientInvoices';
import ClientAccount from './pages/ClientAccount';
import ClientHelp from './pages/ClientHelp';
import ClientCalculator from './pages/ClientCalculator';
import Notifications from './pages/Notifications';
import AdminSidebar from './components/AdminSidebar';
import ClientSidebar from './components/ClientSidebar';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/portal" />;
  }

  return children;
};

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/usuarios" element={<AdminUsers />} />
          <Route path="/clientes" element={<AdminClients />} />
          <Route path="/paquetes" element={<AdminPackages />} />
          <Route path="/carriers" element={<AdminCarriers />} />
          <Route path="/facturas" element={<AdminInvoices />} />
          <Route path="/reportes" element={<div className="p-6"><h1 className="text-2xl font-bold">Reportes</h1><p className="text-gray-600">Próximamente...</p></div>} />
          <Route path="/notificaciones" element={<div className="p-6"><h1 className="text-2xl font-bold">Notificaciones</h1><p className="text-gray-600">Próximamente...</p></div>} />
          <Route path="/configuracion" element={<div className="p-6"><h1 className="text-2xl font-bold">Configuración</h1><p className="text-gray-600">Próximamente...</p></div>} />
        </Routes>
      </div>
    </div>
  );
};

const ClientLayout = () => {
  return (
    <div className="flex">
      <ClientSidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<ClientPortal />} />
          <Route path="/tiendas" element={<ClientStores />} />
          <Route path="/calculadora" element={<ClientCalculator />} />
          <Route path="/mis-paquetes" element={<ClientPackages />} />
          <Route path="/rastreo" element={<ClientTracking />} />
          <Route path="/facturas" element={<ClientInvoices />} />
          <Route path="/mi-cuenta" element={<ClientAccount />} />
          <Route path="/notificaciones" element={<Notifications />} />
          <Route path="/ayuda" element={<ClientHelp />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/*"
              element={
                <ProtectedRoute>
                  <ClientLayout />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
