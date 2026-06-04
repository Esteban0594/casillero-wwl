import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiPhone, FiCreditCard, FiMapPin } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    cedula: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const result = await register({
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      cedula: formData.cedula,
      direccion: formData.direccion
    });

    if (result.success) {
      toast.success('¡Registro exitoso! Bienvenido a Casillero WWL');
      navigate('/portal');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wwl-blue via-blue-800 to-wwl-dark flex items-center justify-center p-4">
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-32 h-32 bg-white rounded-3xl shadow-2xl p-2 flex items-center justify-center">
            <img 
              src="/img/logo.png" 
              alt="Casillero WWL" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Casillero WWL</h1>
          <p className="text-blue-200 text-sm">By Aduana WWL</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Crear Cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-4 text-gray-400" />
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Tu dirección en Costa Rica"
                  rows="2"
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-wwl-blue focus:ring-wwl-blue mt-1"
                required
              />
              <span className="ml-2 text-sm text-gray-600">
                Acepto los{' '}
                <a href="#" className="text-wwl-blue hover:underline">Términos y Condiciones</a>
                {' '}y la{' '}
                <a href="#" className="text-wwl-blue hover:underline">Política de Privacidad</a>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-wwl-blue font-semibold hover:underline">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
