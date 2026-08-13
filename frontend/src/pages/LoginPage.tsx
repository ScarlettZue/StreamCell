import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al ingresar. Por favor verifica tus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Botón Flotante para cambiar Tema Oscuro / Claro */}
      <button
        onClick={toggleTheme}
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 1.5rem)' }}
        className="absolute right-6 p-3 rounded-2xl glass-panel border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm flex items-center space-x-2 text-xs font-semibold z-20"
        title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
      >
        {theme === 'dark' ? (
          <>
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Modo Claro</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-purple-600" />
            <span>Modo Oscuro</span>
          </>
        )}
      </button>

      {/* Resplandor de fondo Azul & Morado */}
      <div className="absolute w-[550px] h-[550px] bg-blue-500/15 dark:bg-blue-500/20 rounded-full blur-[140px] -top-20 -left-20 pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-500/15 dark:bg-purple-500/25 rounded-full blur-[140px] -bottom-20 -right-20 pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-glass border border-slate-200 dark:border-slate-800 relative z-10 animate-fade-in">
        {/* Header Logo Grande y Prominente sin recuadros ni bordes */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/logo/logo.png"
              alt="Streamcell Logo"
              className="h-28 w-auto object-contain filter drop-shadow-[0_8px_20px_rgba(139,92,246,0.35)] transition-transform hover:scale-105"
            />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-wide">Iniciar Sesión</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 flex items-center justify-center space-x-1.5">
            <span>Bienvenida a</span>
            <strong className="text-purple-600 dark:text-purple-400 font-bold">Streamcell</strong>
            <ShieldCheck className="w-4 h-4 text-blue-600 inline" />
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ingresa tus datos para acceder a la gestión de tu negocio</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-700 dark:text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@streamcell.com"
                className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Abriendo tu panel...</span>
              </>
            ) : (
              <span>Ingresar a Streamcell</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
