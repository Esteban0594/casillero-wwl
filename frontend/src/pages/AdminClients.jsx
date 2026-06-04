import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiUser, FiLock, FiUnlock, FiShield, FiMail, FiPhone, FiCreditCard, FiMapPin, FiKey, FiEye, FiEyeOff } from 'react-icons/fi';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    cedula: '',
    tipoCuenta: 'personal',
    razonSocial: '',
    cedulaJuridica: '',
    direccion: ''
  });
  const [blockMotivo, setBlockMotivo] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await axios.get('/api/auth/users?role=cliente');
      setClients(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error al cargar clientes');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedClient) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await axios.put(`/api/auth/users/${selectedClient._id}`, updateData);
        toast.success('Cliente actualizado exitosamente');
      } else {
        await axios.post('/api/auth/create-client', formData);
        toast.success('Cliente creado exitosamente');
      }
      setShowModal(false);
      setSelectedClient(null);
      resetForm();
      fetchClients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar solicitud');
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setFormData({
      nombre: client.nombre,
      email: client.email,
      password: '',
      telefono: client.telefono || '',
      cedula: client.cedula || '',
      tipoCuenta: client.tipoCuenta || 'personal',
      razonSocial: client.razonSocial || '',
      cedulaJuridica: client.cedulaJuridica || '',
      direccion: client.direccion || ''
    });
    setShowModal(true);
  };

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/auth/users/${selectedClient._id}`);
      toast.success('Cliente eliminado exitosamente');
      setShowDeleteModal(false);
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar cliente');
    }
  };

  const handleBlockClick = (client) => {
    setSelectedClient(client);
    setBlockMotivo('');
    setShowBlockModal(true);
  };

  const handleBlock = async () => {
    try {
      if (selectedClient.bloqueado) {
        await axios.put(`/api/auth/users/${selectedClient._id}/unblock`);
        toast.success('Cliente desbloqueado exitosamente');
      } else {
        await axios.put(`/api/auth/users/${selectedClient._id}/block`, { motivo: blockMotivo });
        toast.success('Cliente bloqueado exitosamente');
      }
      setShowBlockModal(false);
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      toast.error('Error al actualizar estado del cliente');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      telefono: '',
      cedula: '',
      tipoCuenta: 'personal',
      razonSocial: '',
      cedulaJuridica: '',
      direccion: ''
    });
    setShowPassword(false);
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.casillero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.razonSocial?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !tipoFilter || client.tipoCuenta === tipoFilter;
    const matchesEstado = !estadoFilter || 
      (estadoFilter === 'activo' && client.activo && !client.bloqueado) ||
      (estadoFilter === 'inactivo' && !client.activo) ||
      (estadoFilter === 'bloqueado' && client.bloqueado);
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const stats = {
    total: clients.length,
    personal: clients.filter(c => c.tipoCuenta === 'personal').length,
    juridico: clients.filter(c => c.tipoCuenta === 'juridico').length,
    activos: clients.filter(c => c.activo && !c.bloqueado).length,
    bloqueados: clients.filter(c => c.bloqueado).length
  };

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
        <button onClick={() => { resetForm(); setSelectedClient(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <FiPlus /> Nuevo Cliente
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.personal}</p>
          <p className="text-xs text-gray-500">Personal</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.juridico}</p>
          <p className="text-xs text-gray-500">Jurídico</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
          <p className="text-xs text-gray-500">Activos</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-600">{stats.bloqueados}</p>
          <p className="text-xs text-gray-500">Bloqueados</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, email, casillero o razón social..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="input-field md:w-40"
          >
            <option value="">Todos</option>
            <option value="personal">Personal</option>
            <option value="juridico">Jurídico</option>
          </select>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="input-field md:w-40"
          >
            <option value="">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="bloqueado">Bloqueados</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Casillero</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        client.bloqueado ? 'bg-red-100' : client.tipoCuenta === 'juridico' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        <FiUser className={client.bloqueado ? 'text-red-600' : client.tipoCuenta === 'juridico' ? 'text-purple-600' : 'text-blue-600'} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{client.nombre}</p>
                        <p className="text-xs text-gray-500">{client.email}</p>
                        {client.tipoCuenta === 'juridico' && client.razonSocial && (
                          <p className="text-xs text-purple-500">{client.razonSocial}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.tipoCuenta === 'juridico' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {client.tipoCuenta === 'juridico' ? 'Jurídico' : 'Personal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{client.casillero || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-500">{client.telefono || '-'}</p>
                    <p className="text-xs text-gray-400">{client.cedula || '-'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {client.bloqueado ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <FiLock className="text-xs" /> Bloqueado
                      </span>
                    ) : client.activo ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(client.createdAt).toLocaleDateString('es-CR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(client)} className="text-blue-600 hover:text-blue-900 mr-2" title="Editar">
                      <FiEdit2 />
                    </button>
                    <button 
                      onClick={() => handleBlockClick(client)} 
                      className={`mr-2 ${client.bloqueado ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}`} 
                      title={client.bloqueado ? 'Desbloquear' : 'Bloquear'}
                    >
                      {client.bloqueado ? <FiUnlock /> : <FiLock />}
                    </button>
                    <button onClick={() => handleDeleteClick(client)} className="text-red-600 hover:text-red-900" title="Eliminar">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de crear/editar cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedClient ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cuenta *</label>
                <select
                  value={formData.tipoCuenta}
                  onChange={(e) => setFormData({ ...formData, tipoCuenta: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="personal">Personal</option>
                  <option value="juridico">Jurídico (Empresa)</option>
                </select>
              </div>

              {formData.tipoCuenta === 'juridico' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social *</label>
                    <input
                      type="text"
                      value={formData.razonSocial}
                      onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                      className="input-field"
                      placeholder="Nombre de la empresa"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cédula Jurídica *</label>
                    <input
                      type="text"
                      value={formData.cedulaJuridica}
                      onChange={(e) => setFormData({ ...formData, cedulaJuridica: e.target.value })}
                      className="input-field"
                      placeholder="3-101-123456"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedClient ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
                </label>
                <div className="relative">
                  <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field pl-10 pr-10"
                    required={!selectedClient}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="input-field pl-10"
                      placeholder="+506 8888-8888"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
                  <div className="relative">
                    <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.cedula}
                      onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                      className="input-field pl-10"
                      placeholder="1-1234-5678"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-4 text-gray-400" />
                  <textarea
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="input-field pl-10"
                    rows="2"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  {selectedClient ? 'Actualizar' : 'Crear Cliente'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setSelectedClient(null); }} className="btn-secondary flex-1">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FiTrash2 className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Eliminar Cliente</h3>
              <p className="text-gray-600 mb-1">
                ¿Estás seguro de eliminar a <strong>{selectedClient.nombre}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Esta acción no se puede deshacer. Se eliminarán todos sus datos del sistema.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de bloquear/desbloquear */}
      {showBlockModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                selectedClient.bloqueado ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {selectedClient.bloqueado ? (
                  <FiUnlock className="text-green-600 text-2xl" />
                ) : (
                  <FiLock className="text-yellow-600 text-2xl" />
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {selectedClient.bloqueado ? 'Desbloquear Cliente' : 'Bloquear Cliente'}
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedClient.bloqueado ? (
                  <>¿Deseas desbloquear a <strong>{selectedClient.nombre}</strong>?</>
                ) : (
                  <>¿Deseas bloquear a <strong>{selectedClient.nombre}</strong>?</>
                )}
              </p>
              {!selectedClient.bloqueado && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo del bloqueo</label>
                  <textarea
                    value={blockMotivo}
                    onChange={(e) => setBlockMotivo(e.target.value)}
                    className="input-field"
                    rows="2"
                    placeholder="Especifica el motivo..."
                  />
                </div>
              )}
              {selectedClient.bloqueado && selectedClient.motivoBloqueo && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-left">
                  <p className="text-xs text-gray-500">Motivo actual:</p>
                  <p className="text-sm text-gray-700">{selectedClient.motivoBloqueo}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setShowBlockModal(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button 
                  onClick={handleBlock} 
                  className={`flex-1 font-semibold py-2 px-4 rounded-lg transition ${
                    selectedClient.bloqueado 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  {selectedClient.bloqueado ? 'Sí, Desbloquear' : 'Sí, Bloquear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClients;
