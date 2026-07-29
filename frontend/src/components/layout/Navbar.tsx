import React from 'react';
import { Clock, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  return (
    <header className="h-20 glass-panel border-b border-slate-800/80 sticky top-0 z-20 flex items-center justify-between px-8 ml-64">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-4">
        {/* Badge de Zona Horaria Colombia */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/70 border border-slate-700/50 text-xs text-slate-300">
          <Clock className="w-3.5 h-3.5 text-brand-400" />
          <span>Hora Colombia (COT - UTC-5)</span>
        </div>

        {/* Badge de Estatus de Seguridad */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Panel Seguro</span>
        </div>
      </div>
    </header>
  );
};
