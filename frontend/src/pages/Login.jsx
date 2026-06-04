import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blockedInfo, setBlockedInfo] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBlockedInfo(null);

    const result = await login(email, password);

    if (result.success) {
      toast.success('¡Bienvenido!');
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    } else {
      if (result.blocked) {
        setBlockedInfo({
          message: result.message,
          motivo: result.motivo
        });
      } else {
        toast.error(result.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background con gradiente profesional */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"></div>
      
      {/* Patrón de líneas de logística */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="logistics" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* Líneas de ruta */}
              <path d="M0 50 Q25 30 50 50 T100 50" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="5,5"/>
              <path d="M50 0 Q30 25 50 50 T50 100" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="5,5"/>
              {/* Puntos de destino */}
              <circle cx="50" cy="50" r="2" fill="white" opacity="0.5"/>
              <circle cx="0" cy="50" r="1.5" fill="white" opacity="0.3"/>
              <circle cx="100" cy="50" r="1.5" fill="white" opacity="0.3"/>
              <circle cx="50" cy="0" r="1.5" fill="white" opacity="0.3"/>
              <circle cx="50" cy="100" r="1.5" fill="white" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#logistics)"/>
        </svg>
      </div>

      {/* Elementos decorativos flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Avión 1 */}
        <div className="absolute top-20 left-10 animate-float-slow">
          <svg className="w-16 h-16 text-blue-400 opacity-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
        
        {/* Avión 2 */}
        <div className="absolute top-40 right-20 animate-float-medium">
          <svg className="w-12 h-12 text-blue-300 opacity-15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>

        {/* Camión 1 */}
        <div className="absolute bottom-32 left-20 animate-float-medium">
          <svg className="w-14 h-14 text-blue-400 opacity-15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>

        {/* Camión 2 */}
        <div className="absolute bottom-20 right-10 animate-float-slow">
          <svg className="w-10 h-10 text-blue-300 opacity-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>

        {/* Paquete 1 */}
        <div className="absolute top-60 left-1/4 animate-float-fast">
          <svg className="w-8 h-8 text-blue-300 opacity-15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
          </svg>
        </div>

        {/* Paquete 2 */}
        <div className="absolute top-80 right-1/3 animate-float-medium">
          <svg className="w-6 h-6 text-blue-200 opacity-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H5V7h7v10zm7 0h-5V7h5v10z"/>
          </svg>
        </div>

        {/* Líneas de ruta animadas */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 300 Q200 250 400 300 T800 250 T1200 300 T1600 250" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="2">
            <animate attributeName="d" dur="10s" repeatCount="indefinite" values="M0 300 Q200 250 400 300 T800 250 T1200 300 T1600 250;M0 280 Q200 330 400 280 T800 330 T1200 280 T1600 330;M0 300 Q200 250 400 300 T800 250 T1200 300 T1600 250"/>
          </path>
          <path d="M0 400 Q300 350 600 400 T1200 350" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="1.5">
            <animate attributeName="d" dur="12s" repeatCount="indefinite" values="M0 400 Q300 350 600 400 T1200 350;M0 380 Q300 430 600 380 T1200 430;M0 400 Q300 350 600 400 T1200 350"/>
          </path>
        </svg>

        {/* Grid de puntos decorativos */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Contenido principal */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-40 h-40 bg-white rounded-3xl shadow-2xl p-3 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/img/logo.png" 
              alt="Casillero WWL" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Casillero WWL</h1>
          <p className="text-blue-200 text-lg font-light">By Aduana WWL</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="w-8 h-0.5 bg-blue-400"></span>
            <span className="text-blue-300 text-xs uppercase tracking-widest">Logística Internacional</span>
            <span className="w-8 h-0.5 bg-blue-400"></span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-wwl-blue focus:ring-wwl-blue"
                />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <a href="#" className="text-sm text-wwl-blue hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg font-semibold"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {blockedInfo && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="text-red-600 text-xl mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800">Cuenta Bloqueada</h4>
                  <p className="text-sm text-red-700 mt-1">{blockedInfo.message}</p>
                  {blockedInfo.motivo && (
                    <p className="text-xs text-red-600 mt-2">Motivo: {blockedInfo.motivo}</p>
                  )}
                  <p className="text-xs text-red-600 mt-2">
                    Contacta a soporte: soporte@casillerowl.com
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-wwl-blue font-semibold hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500 mb-4">O continúa con</p>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 hover:bg-gray-50 transition shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 hover:bg-gray-50 transition shadow-sm">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-blue-200/60 text-sm">
            © 2024 Casillero WWL By Aduana WWL
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="text-blue-300/40 text-xs">Miami</span>
            <span className="text-blue-400/60">✈</span>
            <span className="text-blue-300/40 text-xs">Costa Rica</span>
          </div>
        </div>
      </div>

      {/* Animaciones CSS personalizadas */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Login;
