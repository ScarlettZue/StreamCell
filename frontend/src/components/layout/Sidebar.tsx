import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Tv,
  AlertTriangle,
  Zap,
  TrendingUp,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Venta Rápida', path: '/sales', icon: Zap },
    { name: 'Flujo de Caja', path: '/cash-flow', icon: TrendingUp },
    { name: 'Usuarios', path: '/clients', icon: Users },
    { name: 'Servicios', path: '/accounts', icon: Tv },
    { name: 'Alertas de Corte', path: '/expirations', icon: AlertTriangle },
  ];

  return (
    <>
      {/* Backdrop para móvil cuando el menú desplegable está abierto */}
      {isOpen && (
        <div
          onClick={onClose}
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
        className={`w-64 glass-panel h-screen fixed left-0 top-0 z-50 flex flex-col justify-between p-4 border-r border-slate-200/80 dark:border-slate-800/80 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Header con el Logo Grande y Prominente */}
          <div className="flex items-center justify-between px-2 py-3 mb-4 border-b border-slate-200/80 dark:border-slate-800/60">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/logo/logo.png"
                alt="Streamcell Logo"
                className="h-12 w-auto object-contain flex-shrink-0 filter drop-shadow-[0_4px_12px_rgba(139,92,246,0.3)] transition-transform hover:scale-105"
              />
              <div>
                <h1 className="text-lg font-extrabold tracking-wider text-slate-900 dark:text-white">
                  Streamcell
                </h1>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold flex items-center space-x-1">
                  <span>Tu aliado digital</span>
                  <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </span>
              </div>
            </div>

            {/* Botón cerrar para móvil */}
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Menú de Navegación */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md font-bold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50 font-medium'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Perfil del Usuario & Botón Salir */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/60 pt-4 px-2 mb-16 md:mb-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 border border-white/20 flex items-center justify-center font-bold text-xs text-white shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {user?.name || 'Administradora'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || 'admin@streamcell.com'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
