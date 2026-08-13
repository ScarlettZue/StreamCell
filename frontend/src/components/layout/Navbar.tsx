import React from 'react';
import { Clock, ShieldCheck, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle, onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)', paddingBottom: '0.75rem' }}
      className="glass-panel border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 ml-0 md:ml-64 transition-all duration-300 min-h-[4rem] sm:min-h-[5rem]"
    >
      <div className="flex items-center space-x-3">
        {/* Botón menú hamburguesa en móvil */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Botón Alternar Modo Oscuro / Claro */}
        <button
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm flex items-center space-x-1.5 text-xs font-semibold"
          title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-purple-600" />
              <span className="hidden md:inline">Modo Oscuro</span>
            </>
          )}
        </button>

        {/* Badge de Zona Horaria Colombia */}
        <div className="hidden lg:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/50 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Hora Colombia (COT)</span>
        </div>

        {/* Badge de Estatus de Seguridad */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Panel Seguro</span>
        </div>
      </div>
    </header>
  );
};
