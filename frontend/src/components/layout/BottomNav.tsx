import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Tv,
  ShoppingBag,
  AlertTriangle,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { name: 'Inicio', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Usuarios', path: '/clients', icon: Users },
    { name: 'Servicios', path: '/accounts', icon: Tv },
    { name: 'Ventas', path: '/sales', icon: ShoppingBag },
    { name: 'Alertas', path: '/expirations', icon: AlertTriangle },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[9990] bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-1 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-bold transition-all duration-150 ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="mt-0.5 truncate max-w-[64px]">{item.name}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
