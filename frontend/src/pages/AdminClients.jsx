import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiUserPlus } from 'react-icons/fi';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await axios.get('/api/auth/users');
      setClients(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error al cargar clientes');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await axios.delete(`/api/auth/users/${id}`);
        toast.success('Cliente eliminado');
        fetchClients();
      } catch (error) {
        toast.error('Error al eliminar cliente');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`/api/auth/users/${id}`, { activo: !currentStatus });
      toast.success('Estado actualizado');
      fetchClients();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const filteredClients = clients.filter(client =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.casillero?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
          <p className="text-gray-600">{clients.length} clientes registrados</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <FiUserPlus /> Nuevo Cliente
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o número de casillero..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Casillero</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-wwl-blue rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{client.nombre.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.nombre}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {client.casillero || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.telefono || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(client._id, client.activo)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {client.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(client.createdAt).toLocaleDateString('es-CR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FiEye />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Detalles del Cliente</h2>
            <div className="space-y-3">
              <p><strong>Nombre:</strong> {selectedClient.nombre}</p>
              <p><strong>Email:</strong> {selectedClient.email}</p>
              <p><strong>Teléfono:</strong> {selectedClient.telefono || 'N/A'}</p>
              <p><strong>Cédula:</strong> {selectedClient.cedula || 'N/A'}</p>
              <p><strong>Dirección:</strong> {selectedClient.direccion || 'N/A'}</p>
              <p><strong>Casillero:</strong> {selectedClient.casillero || 'N/A'}</p>
              <p><strong>Estado:</strong> {selectedClient.activo ? 'Activo' : 'Inactivo'}</p>
            </div>
            <button
              onClick={() => setSelectedClient(null)}
              className="btn-secondary w-full mt-4"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClients;
