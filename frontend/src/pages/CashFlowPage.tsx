import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/MainLayout';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { saleService } from '../services/saleService';
import { formatCurrency } from '../utils/formatters';

export const CashFlowPage: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<'month' | 'today'>('month');

  const {
    data: stats,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['cashFlowStats'],
    queryFn: () => saleService.getCashFlowStats(),
  });

  return (
    <MainLayout title="Flujo de Caja & Reportes Financieros" subtitle="Control de ganancias netas, ingresos brutos y análisis comparativo de rendimiento.">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              <span>Flujo de Caja & Reportes Financieros</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Control de ganancias netas, ingresos brutos y análisis comparativo de rendimiento.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Toggle Mes vs Hoy */}
            <div className="bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setTimePeriod('month')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timePeriod === 'month'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Mes Actual
              </button>
              <button
                onClick={() => setTimePeriod('today')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timePeriod === 'today'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Ventas de Hoy
              </button>
            </div>

            <button
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
              title="Actualizar Datos"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading || isRefetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
            <p className="text-xs text-slate-500">Cargando métricas de flujo de caja...</p>
          </div>
        ) : (
          <>
            {/* Tarjetas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Ingresos Brutos */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {timePeriod === 'month' ? 'Ingresos Brutos (Mes)' : 'Ingresos Brutos (Hoy)'}
                  </span>
                  <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {formatCurrency(
                      timePeriod === 'month'
                        ? stats?.currentMonth.revenue || 0
                        : stats?.today.revenue || 0
                    )}
                  </h3>
                  {timePeriod === 'month' && (
                    <div className="flex items-center space-x-1 mt-2 text-xs">
                      {(stats?.growth.revenuePercent || 0) >= 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />+{stats?.growth.revenuePercent}%
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center">
                          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />{stats?.growth.revenuePercent}%
                        </span>
                      )}
                      <span className="text-slate-400">vs mes anterior</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ganancia Neta Total */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {timePeriod === 'month' ? 'Ganancia Neta (Mes)' : 'Ganancia Neta (Hoy)'}
                  </span>
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatCurrency(
                      timePeriod === 'month'
                        ? stats?.currentMonth.profit || 0
                        : stats?.today.profit || 0
                    )}
                  </h3>
                  {timePeriod === 'month' && (
                    <div className="flex items-center space-x-1 mt-2 text-xs">
                      {(stats?.growth.profitPercent || 0) >= 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />+{stats?.growth.profitPercent}%
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center">
                          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />{stats?.growth.profitPercent}%
                        </span>
                      )}
                      <span className="text-slate-400">vs mes anterior</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Transacciones Totales */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {timePeriod === 'month' ? 'Ventas Totales (Mes)' : 'Ventas Totales (Hoy)'}
                  </span>
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {timePeriod === 'month'
                      ? stats?.currentMonth.count || 0
                      : stats?.today.count || 0}{' '}
                    <span className="text-sm font-normal text-slate-500">ventas</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">Transacciones procesadas</p>
                </div>
              </div>

              {/* Costo Total Invertido */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Inversión / Costo Real
                  </span>
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {formatCurrency(stats?.currentMonth.cost || 0)}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">Costo acumulado del mes</p>
                </div>
              </div>
            </div>

            {/* Resumen Diario vs Mensual */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tarjeta de Resumen Hoy */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Resumen del Día de Hoy</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Ventas de Hoy</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{stats?.today.count || 0}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Ingresos de Hoy</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      {formatCurrency(stats?.today.revenue || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">Ganancia Neta Hoy</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrency(stats?.today.profit || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparativa Mes a Mes */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Desglose e Histórico Mensual</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Ordenado por periodo</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Mes</th>
                        <th className="py-2.5 px-3">Ventas</th>
                        <th className="py-2.5 px-3">Ingresos Brutos</th>
                        <th className="py-2.5 px-3">Ganancia Neta</th>
                        <th className="py-2.5 px-3">Margen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {stats?.monthlyHistory.map((item, idx) => {
                        const margin = item.revenue > 0 ? Math.round((item.profit / item.revenue) * 100) : 0;
                        return (
                          <tr key={`${item.year}-${item.month}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                              {item.label}
                              {idx === 0 && (
                                <span className="ml-2 px-2 py-0.5 text-[10px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md">
                                  En Curso
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                              {item.count}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                              {formatCurrency(item.revenue)}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(item.profit)}
                            </td>
                            <td className="py-3 px-3 font-bold">
                              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
                                {margin}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};
