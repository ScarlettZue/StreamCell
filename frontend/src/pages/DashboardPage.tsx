import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/MainLayout';
import { Users, Tv, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, HeartHandshake, Sparkles } from 'lucide-react';
import { saleService } from '../services/saleService';
import { clientService } from '../services/clientService';
import { accountService } from '../services/accountService';
import { formatCurrency } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { data: salesData } = useQuery({
    queryKey: ['sales'],
    queryFn: saleService.getSales,
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
  });

  const { data: availableProfiles } = useQuery({
    queryKey: ['availableProfiles'],
    queryFn: accountService.getAvailableProfiles,
  });

  const totalClients = clients?.length || 0;
  const totalDebt = clients?.reduce((acc, c) => acc + Number(c.totalDebt), 0) || 0;
  const metrics = salesData?.metrics || { totalSalesCount: 0, totalRevenue: 0, totalProfit: 0 };
  const totalAvailable = availableProfiles?.length || 0;

  return (
    <MainLayout
      title="¡Hola, bienvenido a tu Dashboard! 👋"
      subtitle="Aquí tienes el resumen actualizado de las ventas, inventario y finanzas de Streamcell"
    >
      <div className="space-y-8">
        {/* Banner de Bienvenida Hogareño */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-blue/10 via-brand-purple/10 to-slate-100 dark:to-slate-900 border border-slate-200 dark:border-brand-purple/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-glass">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-purple" />
              <span>Estamos listos para hacer crecer tu negocio hoy</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Mantén el control de tus clientes, renueva los perfiles a tiempo y envía mensajes amables por WhatsApp en 1 clic.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-brand-blue dark:text-brand-blue-light flex items-center space-x-2 shadow-sm">
            <HeartHandshake className="w-4 h-4" />
            <span>Atención cercana & eficiente</span>
          </div>
        </div>

        {/* Tarjetas de KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ingresos Totales</span>
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(metrics.totalRevenue)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{metrics.totalSalesCount} transacciones registradas</p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ganancia Neta</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(metrics.totalProfit)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Margen calculado en tiempo real</p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Clientes</span>
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalClients}</h3>
            {totalDebt > 0 ? (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 font-bold">Por cobrar: {formatCurrency(totalDebt)}</p>
            ) : (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-semibold">¡Todos al día!</p>
            )}
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stock Disponible</span>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-brand-cyan/20 text-cyan-600 dark:text-brand-cyan flex items-center justify-center">
                <Tv className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalAvailable} perfiles</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Listos para asignar en inventario</p>
          </div>
        </div>

        {/* Resumen Operativo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Infraestructura Segura de Streamcell</span>
            </h4>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span>Base de Datos PostgreSQL (Supabase Cloud):</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Conectado & Sincronizado</span>
              </li>
              <li className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span>Zona Horaria Oficial:</span>
                <span className="text-brand-purple font-bold">America/Bogota (COT)</span>
              </li>
              <li className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span>Mensajes WhatsApp con Saludo Horario:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Habilitado</span>
              </li>
              <li className="flex justify-between py-2">
                <span>Cifrado de Credenciales & PINs:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">AES-256 Activo</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Gestión de Cobros & Calidez</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Recuerda que para mantener una relación cercana y amigable con tus clientes, el sistema genera mensajes
                predeterminados saludando según la hora del día (<em>"Buenos días"</em>, <em>"Buenas tardes"</em>, <em>"Buenas noches"</em>)
                y te permite editar el texto antes de enviarlo a WhatsApp.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Streamcell v0.1.0</span>
              <span className="text-brand-purple font-bold">Identidad Azul & Morado</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
