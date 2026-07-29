import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/MainLayout';
import { ShoppingBag, Plus, DollarSign, TrendingUp, Loader2, X } from 'lucide-react';
import { saleService } from '../services/saleService';
import { accountService } from '../services/accountService';
import { clientService } from '../services/clientService';
import { formatCurrency, formatDateCO } from '../utils/formatters';

export const SalesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [accountProfileId, setAccountProfileId] = useState('');
  const [unitCost, setUnitCost] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [startDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const queryClient = useQueryClient();

  const { data: salesInfo, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: saleService.getSales,
  });

  const { data: availableProfiles } = useQuery({
    queryKey: ['availableProfiles'],
    queryFn: accountService.getAvailableProfiles,
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
  });

  // Al seleccionar un perfil, precargar costo y precio predeterminados
  const handleProfileSelect = (profId: string) => {
    setAccountProfileId(profId);
    const prof = availableProfiles?.find((p) => p.id === profId);
    if (prof?.account?.product) {
      setUnitCost(Number(prof.account.product.defaultCost));
      setUnitPrice(Number(prof.account.product.defaultPrice));
    }
  };

  const createSaleMutation = useMutation({
    mutationFn: () =>
      saleService.createSale({
        clientId,
        accountProfileId,
        unitCost,
        unitPrice,
        serviceStartDate: startDate,
        serviceEndDate: endDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['availableProfiles'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setClientId('');
    setAccountProfileId('');
    setUnitCost(0);
    setUnitPrice(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !accountProfileId || unitPrice <= 0) return;
    createSaleMutation.mutate();
  };

  const metrics = salesInfo?.metrics || { totalSalesCount: 0, totalRevenue: 0, totalProfit: 0 };

  return (
    <MainLayout title="Ventas & Precios Dinámicos" subtitle="Registro de ventas directas con ajuste dinámico de costos y precios cobrados">
      <div className="space-y-6">
        {/* Banner de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Ventas Totales</span>
              <h4 className="text-xl font-bold text-white mt-1">{metrics.totalSalesCount} transacciones</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Ingresos Brutos</span>
              <h4 className="text-xl font-bold text-white mt-1">{formatCurrency(metrics.totalRevenue)}</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Ganancia Neta Total</span>
              <h4 className="text-xl font-bold text-emerald-400 mt-1">{formatCurrency(metrics.totalProfit)}</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white">Historial de Ventas</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl text-sm font-semibold shadow-glow hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Venta Rápida</span>
          </button>
        </div>

        {/* Tabla de Historial de Ventas */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Producto / Perfil</th>
                <th className="px-6 py-4">Costo Real</th>
                <th className="px-6 py-4">Precio Venta</th>
                <th className="px-6 py-4">Ganancia Neta</th>
                <th className="px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Cargando ventas...
                  </td>
                </tr>
              ) : salesInfo?.sales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No se han registrado ventas aún.
                  </td>
                </tr>
              ) : (
                salesInfo?.sales.map((sale) => {
                  const detail = sale.details?.[0];
                  return (
                    <tr key={sale.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-brand-300">{sale.code}</td>
                      <td className="px-6 py-4 font-semibold text-white">{sale.client?.name || 'Cliente'}</td>
                      <td className="px-6 py-4 text-xs">
                        <span className="font-bold text-slate-200">{detail?.profile?.account?.product?.name}</span>
                        <span className="text-slate-400 ml-1">({detail?.profile?.profileName})</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{formatCurrency(sale.totalCost)}</td>
                      <td className="px-6 py-4 text-xs font-bold text-white">{formatCurrency(sale.totalAmount)}</td>
                      <td className="px-6 py-4 text-xs font-bold text-emerald-400">{formatCurrency(sale.netProfit)}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{formatDateCO(sale.createdAt)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Venta Rápida */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-700 shadow-glass">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-brand-400" />
                  <span>Registrar Venta Rápida</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Cliente</label>
                  <select
                    required
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="">Selecciona un cliente...</option>
                    {clients?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Perfil Disponible en Inventario</label>
                  <select
                    required
                    value={accountProfileId}
                    onChange={(e) => handleProfileSelect(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="">Selecciona un perfil disponible...</option>
                    {availableProfiles?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.account?.product?.name} - {p.profileName} ({p.account?.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Precios Dinámicos */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Costo Real ($)</label>
                    <input
                      type="number"
                      step="500"
                      required
                      value={unitCost}
                      onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Precio Venta ($)</label>
                    <input
                      type="number"
                      step="500"
                      required
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Ganancia estimada */}
                <div className="flex justify-between items-center text-xs px-2 text-slate-400">
                  <span>Ganancia Neta Estimada:</span>
                  <span className="font-bold text-emerald-400 font-mono">{formatCurrency(unitPrice - unitCost)}</span>
                </div>

                <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createSaleMutation.isPending}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-semibold shadow-glow hover:opacity-95 flex items-center space-x-1"
                  >
                    {createSaleMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirmar Venta</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
