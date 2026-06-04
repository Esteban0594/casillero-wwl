import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiBell, FiCheck, FiTrash2, FiPackage, FiTruck, FiCheckCircle, FiDollarSign, FiInfo } from 'react-icons/fi';

const typeConfig = {
  'PAQUETE_RECIBIDO': { icon: <FiPackage />, color: 'bg-blue-100 text-blue-600' },
  'PAQUETE_EN_TRANSITO': { icon: <FiTruck />, color: 'bg-purple-100 text-purple-600' },
  'PAQUETE_EN_ADUANA': { icon: <FiInfo />, color: 'bg-orange-100 text-orange-600' },
  'PAQUETE_ENTREGADO': { icon: <FiCheckCircle />, color: 'bg-green-100 text-green-600' },
  'FACTURA_CREADA': { icon: <FiDollarSign />, color: 'bg-yellow-100 text-yellow-600' },
  'FACTURA_PAGADA': { icon: <FiCheckCircle />, color: 'bg-green-100 text-green-600' },
  'RECORDATORIO': { icon: <FiBell />, color: 'bg-gray-100 text-gray-600' },
  'SISTEMA': { icon: <FiInfo />, color: 'bg-blue-100 text-blue-600' }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error al cargar notificaciones');
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      toast.error('Error al marcar como leída');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('Todas marcadas como leídas');
    } catch (error) {
      toast.error('Error al marcar notificaciones');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      toast.error('Error al eliminar notificación');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <h1 className="text-2xl font-bold text-gray-800">Notificaciones</h1>
          <p className="text-gray-600">{unreadCount} sin leer</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn-secondary flex items-center gap-2">
            <FiCheck /> Marcar todas como leídas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center py-12">
          <FiBell className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tienes notificaciones</h3>
          <p className="text-gray-500">Aquí aparecerán las actualizaciones de tus paquetes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const typeInfo = typeConfig[notification.type] || typeConfig['SISTEMA'];
            return (
              <div 
                key={notification._id} 
                className={`card transition ${!notification.read ? 'border-l-4 border-l-wwl-blue bg-blue-50/30' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                    {typeInfo.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.createdAt).toLocaleString('es-CR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification._id)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Marcar como leída"
                          >
                            <FiCheck />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
