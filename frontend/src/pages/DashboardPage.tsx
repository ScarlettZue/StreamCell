import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/MainLayout';
import { Users, Tv, DollarSign, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
    <MainLayout title="Dashboard General" subtitle="Métricas acumuladas y estado del inventario de Streamcell">
      <div className="space-y-8">
        {/* Tarjetas de KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase">Ingresos Totales</span>
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">{formatCurrency(metrics.totalRevenue)}</h3>
            <p className="text-xs text-slate-400 mt-2">{metrics.totalSalesCount} transacciones registradas</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase">Ganancia Neta</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-emerald-400">{formatCurrency(metrics.totalProfit)}</h3>
            <p className="text-xs text-slate-400 mt-2">Margen calculado en tiempo real</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Clientes</span>
              <div className="w-10 h-10 rounded-xl bg-brand-accent/20 text-brand-accent flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">{totalClients}</h3>
            {totalDebt > 0 ? (
              <p className="text-xs text-rose-400 mt-2 font-medium">Deuda por cobrar: {formatCurrency(totalDebt)}</p>
            ) : (
              <p className="text-xs text-emerald-400 mt-2 font-medium">Sin deudas pendientes</p>
            )}
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase">Stock Disponible</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Tv className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">{totalAvailable} perfiles</h3>
            <p className="text-xs text-slate-400 mt-2">Listos para vender en inventario</p>
          </div>
        </div>

        {/* Resumen Operativo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h4 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Estado del Sistema Streamcell</span>
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex justify-between py-2 border-b border-slate-800">
                <span>Base de Datos PostgreSQL (Supabase Cloud):</span>
                <span className="text-emerald-400 font-semibold">Conectado</span>
              </li>
              <li className="flex justify-between py-2 border-b border-slate-800">
                <span>Zona Horaria Oficial:</span>
                <span className="text-brand-300 font-semibold">America/Bogota (COT)</span>
              </li>
              <li className="flex justify-between py-2 border-b border-slate-800">
                <span>Generador WhatsApp con Saludo Horario:</span>
                <span className="text-emerald-400 font-semibold">Activo</span>
              </li>
              <li className="flex justify-between py-2">
                <span>Cifrado de Credenciales AES-256:</span>
                <span className="text-emerald-400 font-semibold">Activo</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Recordatorio de Operaciones</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recuerda que desde el panel de <strong className="text-slate-200">Alertas de Corte</strong> puedes generar
                los mensajes de WhatsApp preformateados con el saludo según la hora del día ("buenos días/tardes/noches") y
                retirar servicios registrando saldo deudor si el cliente se ha atrasado.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Streamcell v0.1.0</span>
              <span className="text-brand-400 font-semibold">Clean Architecture & DDD</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
