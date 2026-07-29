import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Tv,
  AlertTriangle,
  ShoppingBag,
  LogOut,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Clientes & Deudas', path: '/clients', icon: Users },
    { name: 'Cuentas & Perfiles', path: '/accounts', icon: Tv },
    { name: 'Ventas & Precios', path: '/sales', icon: ShoppingBag },
    { name: 'Alertas de Corte', path: '/expirations', icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 glass-panel h-screen fixed left-0 top-0 z-30 flex flex-col justify-between p-4 border-r border-slate-800/80">
      <div>
        {/* Header con el Logo Oficial de Streamcell */}
        <div className="flex items-center space-x-3 px-2 py-4 mb-6 border-b border-slate-800/60">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border border-brand-purple/40 shadow-glow bg-slate-900 flex items-center justify-center p-1">
            <img src="/logo.png" alt="Logo Streamcell" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-brand-purple-light bg-clip-text text-transparent">
              Streamcell
            </h1>
            <span className="text-[11px] text-brand-purple-light font-medium flex items-center space-x-1">
              <span>Tu aliado digital</span>
              <HeartHandshake className="w-3 h-3 text-brand-blue-light" />
            </span>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-gradient text-white shadow-glow border border-white/10 font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Perfil del Usuario & Botón Salir */}
      <div className="border-t border-slate-800/60 pt-4 px-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple border border-white/20 flex items-center justify-center font-bold text-xs text-white shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-100 truncate">{user?.name || 'Administradora'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@streamcell.com'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
