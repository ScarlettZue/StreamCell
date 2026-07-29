import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/MainLayout';
import { UserPlus, Search, DollarSign, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { clientService } from '../services/clientService';
import { formatCurrency, formatDateCO } from '../utils/formatters';
import { IClient } from '../types';

export const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [amountPaid, setAmountPaid] = useState<number>(0);

  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', searchTerm],
    queryFn: () => clientService.getClients(searchTerm),
  });

  const createMutation = useMutation({
    mutationFn: () => clientService.createClient(name, phone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsModalOpen(false);
      setName('');
      setPhone('');
    },
  });

  const payDebtMutation = useMutation({
    mutationFn: () => clientService.payDebt(selectedClient!.id, amountPaid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setPayModalOpen(false);
      setSelectedClient(null);
      setAmountPaid(0);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    createMutation.mutate();
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || amountPaid <= 0) return;
    payDebtMutation.mutate();
  };

  return (
    <MainLayout title="Gestión de Clientes & Deudas" subtitle="CRM simplificado de Streamcell con control de saldos pendientes">
      <div className="space-y-6">
        {/* Acciones e Insumos de Búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente por nombre, celular o ID (CLI-0001)..."
              className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-purple transition-all shadow-sm"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-md hover:opacity-95 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>

        {/* Tabla de Clientes */}
        <div className="glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">ID Cliente</th>
                <th className="px-6 py-4">Nombre Completo</th>
                <th className="px-6 py-4">Celular</th>
                <th className="px-6 py-4">Saldo Deudor</th>
                <th className="px-6 py-4">Fecha Registro</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Cargando clientes de Streamcell...
                  </td>
                </tr>
              ) : clients?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
                    No se encontraron clientes registrados. ¡Haz clic en "Nuevo Cliente" para agregar el primero!
                  </td>
                </tr>
              ) : (
                clients?.map((client) => {
                  const debt = Number(client.totalDebt);
                  return (
                    <tr key={client.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-brand-purple dark:text-brand-purple-light">{client.clientKey}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{client.name}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">{client.phone}</td>
                      <td className="px-6 py-4">
                        {debt > 0 ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{formatCurrency(debt)}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Al día</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{formatDateCO(client.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        {debt > 0 && (
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setAmountPaid(debt);
                              setPayModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 rounded-lg text-xs font-semibold transition-all"
                          >
                            Registrar Pago
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Nuevo Cliente */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-glass relative">
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-brand-purple" />
                  <span>Nuevo Cliente</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ana María Pérez"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Número de Celular</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 300 123 4567"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="pt-3 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-brand-gradient text-white text-xs font-semibold shadow-glow hover:bg-brand-gradient-hover flex items-center space-x-1"
                  >
                    {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Guardar Cliente</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Liquidar Deuda */}
        {payModalOpen && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-glass">
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  <span>Registrar Pago de Deuda</span>
                </h3>
                <button onClick={() => setPayModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePaySubmit} className="space-y-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <p className="text-slate-600 dark:text-slate-400">Cliente: <strong className="text-slate-900 dark:text-white">{selectedClient.name}</strong></p>
                  <p className="text-slate-600 dark:text-slate-400">Deuda actual: <strong className="text-rose-600 dark:text-rose-400">{formatCurrency(selectedClient.totalDebt)}</strong></p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Monto Pagado ($)</label>
                  <input
                    type="number"
                    min="1"
                    step="500"
                    required
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>

                <div className="pt-3 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setPayModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={payDebtMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 flex items-center space-x-1"
                  >
                    {payDebtMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirmar Pago</span>
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
