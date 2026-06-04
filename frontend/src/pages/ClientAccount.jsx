import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiCreditCard, FiMapPin, FiSave, FiLock, FiEye, FiEyeOff, FiDollarSign, FiFileText } from 'react-icons/fi';
import axios from 'axios';

const ClientAccount = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    cedula: user?.cedula || '',
    direccion: user?.direccion || '',
    monedaPreferida: user?.monedaPreferida || 'USD',
    facturaElectronica: user?.facturaElectronica || false,
    facturaElectronicaInfo: {
      nombre: user?.facturaElectronicaInfo?.nombre || '',
      cedula: user?.facturaElectronicaInfo?.cedula || '',
      email: user?.facturaElectronicaInfo?.email || '',
      direccion: user?.facturaElectronicaInfo?.direccion || ''
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/auth/users/${user._id}`, formData);
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar perfil');
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await axios.put(`/api/auth/users/${user._id}`, { password: passwordData.newPassword });
      toast.success('Contraseña actualizada exitosamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Error al actualizar contraseña');
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mi Cuenta</h1>
        <p className="text-gray-600">Administra tu información personal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-wwl-blue rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-3xl font-bold">
                {user?.nombre?.charAt(0) || 'U'}
              </span>
            </div>
            <h2 className="font-semibold text-gray-800">{user?.nombre}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Casillero: {user?.casillero}
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'profile'
                  ? 'bg-wwl-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiUser />
              <span>Información Personal</span>
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'billing'
                  ? 'bg-wwl-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiDollarSign />
              <span>Facturación</span>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'password'
                  ? 'bg-wwl-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiLock />
              <span>Cambiar Contraseña</span>
            </button>
          </nav>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Información Personal</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="+506 8888-8888"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cédula
                  </label>
                  <div className="relative">
                    <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="1-1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección en Costa Rica
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-4 text-gray-400" />
                    <textarea
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="input-field pl-10"
                      rows="3"
                      placeholder="Tu dirección completa en Costa Rica"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FiSave />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Preferencias de Facturación</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Moneda Preferida</label>
                    <select
                      name="monedaPreferida"
                      value={formData.monedaPreferida}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="USD">🇺🇸 Dólares (USD) - Recomendado</option>
                      <option value="CRC">🇨🇷 Colones (CRC)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Esta será la moneda por defecto en tus facturas
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="facturaElectronica"
                        checked={formData.facturaElectronica}
                        onChange={(e) => setFormData({ ...formData, facturaElectronica: e.target.checked })}
                        className="rounded text-wwl-blue focus:ring-wwl-blue w-5 h-5"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Factura Electrónica</span>
                        <p className="text-xs text-gray-500">Activar para recibir facturas electrónicas válidas ante Hacienda</p>
                      </div>
                    </label>
                  </div>

                  {formData.facturaElectronica && (
                    <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                      <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
                        <FiFileText /> Datos para Factura Electrónica
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Nombre o Razón Social *</label>
                          <input
                            type="text"
                            value={formData.facturaElectronicaInfo.nombre}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              facturaElectronicaInfo: { ...formData.facturaElectronicaInfo, nombre: e.target.value }
                            })}
                            className="input-field text-sm"
                            placeholder="Nombre completo o empresa"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Cédula Física o Jurídica *</label>
                          <input
                            type="text"
                            value={formData.facturaElectronicaInfo.cedula}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              facturaElectronicaInfo: { ...formData.facturaElectronicaInfo, cedula: e.target.value }
                            })}
                            className="input-field text-sm"
                            placeholder="1-1234-5678 o 3-101-123456"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Email para Factura *</label>
                          <input
                            type="email"
                            value={formData.facturaElectronicaInfo.email}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              facturaElectronicaInfo: { ...formData.facturaElectronicaInfo, email: e.target.value }
                            })}
                            className="input-field text-sm"
                            placeholder="facturacion@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Dirección Fiscal *</label>
                          <input
                            type="text"
                            value={formData.facturaElectronicaInfo.direccion}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              facturaElectronicaInfo: { ...formData.facturaElectronicaInfo, direccion: e.target.value }
                            })}
                            className="input-field text-sm"
                            placeholder="Dirección completa"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-blue-600">
                        Estos datos son requeridos por Hacienda para la emisión de facturas electrónicas.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FiSave />
                        Guardar Preferencias
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Cambiar Contraseña</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña Actual
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="input-field pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="input-field pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="input-field pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FiSave />
                      Actualizar Contraseña
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientAccount;
