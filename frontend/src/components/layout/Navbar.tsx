import React from 'react';
import { Clock, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-20 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-20 flex items-center justify-between px-8 ml-64 transition-colors duration-300">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-3">
        {/* Botón Alternar Modo Oscuro / Claro */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm flex items-center space-x-2 text-xs font-semibold"
          title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-brand-purple" />
              <span className="hidden sm:inline">Modo Oscuro</span>
            </>
          )}
        </button>

        {/* Badge de Zona Horaria Colombia */}
        <div className="hidden md:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/50 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <Clock className="w-3.5 h-3.5 text-brand-blue" />
          <span>Hora Colombia (COT)</span>
        </div>

        {/* Badge de Estatus de Seguridad */}
        <div className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Panel Seguro</span>
        </div>
      </div>
    </header>
  );
};
