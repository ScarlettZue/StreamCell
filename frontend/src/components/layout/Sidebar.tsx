import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Tv,
  AlertTriangle,
  ShoppingBag,
  LogOut,
  Sparkles,
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
    <aside className="w-64 glass-panel h-screen fixed left-0 top-0 z-30 flex flex-col justify-between p-4 border-r border-slate-800">
      <div>
        {/* Logo */}
        <div className="flex items-center space-x-3 px-2 py-4 mb-6 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-accent flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-200 to-brand-300 bg-clip-text text-transparent">
              Streamcell
            </h1>
            <span className="text-xs text-brand-400 font-medium">Digital Store Manager</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 text-white border border-brand-500/40 shadow-glow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
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

      {/* User info & Logout */}
      <div className="border-t border-slate-800/60 pt-4 px-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-brand-700/50 border border-brand-500/40 flex items-center justify-center font-bold text-xs text-brand-200">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Administradora'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@streamcell.com'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
