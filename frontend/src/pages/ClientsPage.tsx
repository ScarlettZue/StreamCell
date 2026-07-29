import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/MainLayout';
import { UserPlus, Search, DollarSign, AlertCircle, CheckCircle2, Loader2, X, Edit2, Trash2 } from 'lucide-react';
import { clientService } from '../services/clientService';
import { formatCurrency, formatDateCO } from '../utils/formatters';
import { IClient } from '../types';

export const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form State
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amountPaid, setAmountPaid] = useState<number>(0);

  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', searchTerm],
    queryFn: () => clientService.getClients(searchTerm),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: () => clientService.createClient(name, phone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setModalError(err.response?.data?.message || 'Error al guardar el cliente. Verifica los datos.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => clientService.updateClient(selectedClient!.id, name, phone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsEditModalOpen(false);
      setSelectedClient(null);
      resetForm();
    },
    onError: (err: any) => {
      setModalError(err.response?.data?.message || 'Error al actualizar el cliente. Intentalo de nuevo.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => clientService.deleteClient(selectedClient!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
    },
    onError: (err: any) => {
      setModalError(err.response?.data?.message || 'Error al eliminar el cliente.');
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
    onError: (err: any) => {
      setModalError(err.response?.data?.message || 'Error al procesar el pago.');
    },
  });

  const resetForm = () => {
    setName('');
    setPhone('');
    setModalError(null);
  };

  const handleOpenEdit = (client: IClient) => {
    setModalError(null);
    setSelectedClient(client);
    setName(client.name);
    setPhone(client.phone === '3000000000' ? '' : client.phone);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (client: IClient) => {
    setModalError(null);
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!name || !phone) return;
    createMutation.mutate();
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!selectedClient || !name) return;
    updateMutation.mutate();
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!selectedClient || amountPaid <= 0) return;
    payDebtMutation.mutate();
  };

  return (
    <MainLayout title="Gestión de Clientes & Deudas" subtitle="CRM completo de Streamcell: crear, buscar, editar, liquidar deudas y eliminar clientes">
      <div className="space-y-6">
        {/* Búsqueda y Acciones */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, celular o ID (ej: CLI-0004)..."
              className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-all shadow-sm"
            />
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
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
                    No se encontraron clientes coincidentes.
                  </td>
                </tr>
              ) : (
                clients?.map((client) => {
                  const debt = Number(client.totalDebt);
                  const isMissingPhone = !client.phone || client.phone === '3000000000';

                  return (
                    <tr key={client.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-purple-600 dark:text-purple-400">{client.clientKey}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{client.name}</td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {isMissingPhone ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                            <AlertCircle className="w-3 h-3 inline mr-1" />
                            <span>Sin Celular</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-300">{client.phone}</span>
                        )}
                      </td>
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
                        <div className="flex items-center justify-end space-x-2">
                          {debt > 0 && (
                            <button
                              onClick={() => {
                                setModalError(null);
                                setSelectedClient(client);
                                setAmountPaid(debt);
                                setPayModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 rounded-lg text-xs font-semibold transition-all"
                              title="Registrar Abono o Pago"
                            >
                              Pagar
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(client)}
                            className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
                            title="Editar Datos del Cliente"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenDelete(client)}
                            className="p-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-all"
                            title="Eliminar Cliente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Crear Cliente con React Portal */}
        {isCreateModalOpen &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <UserPlus className="w-5 h-5 text-purple-600" />
                    <span>Nuevo Cliente</span>
                  </h3>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {modalError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Ana María Pérez"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
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
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="pt-3 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold shadow-md hover:opacity-95 flex items-center space-x-1"
                    >
                      {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Guardar Cliente</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body
          )}

        {/* Modal Editar Cliente con React Portal */}
        {isEditModalOpen &&
          selectedClient &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Edit2 className="w-5 h-5 text-purple-600" />
                    <span>Editar Cliente ({selectedClient.clientKey})</span>
                  </h3>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {modalError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Número de Celular</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 312 662 2931"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 font-mono"
                    />
                  </div>

                  <div className="pt-3 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold shadow-md hover:opacity-95 flex items-center space-x-1"
                    >
                      {updateMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Actualizar Cliente</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body
          )}

        {/* Modal Eliminar Cliente con React Portal */}
        {isDeleteModalOpen &&
          selectedClient &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-2">
                    <Trash2 className="w-5 h-5" />
                    <span>Eliminar Cliente</span>
                  </h3>
                  <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {modalError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    ¿Estás segura de que deseas eliminar al cliente <strong className="text-slate-900 dark:text-white">{selectedClient.name}</strong> ({selectedClient.clientKey})?
                    Esta acción no se puede deshacer.
                  </p>

                  <div className="pt-3 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate()}
                      disabled={deleteMutation.isPending}
                      className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 flex items-center space-x-1"
                    >
                      {deleteMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Confirmar Eliminación</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* Modal Liquidar Deuda con React Portal */}
        {payModalOpen &&
          selectedClient &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    <span>Registrar Pago de Deuda</span>
                  </h3>
                  <button onClick={() => setPayModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {modalError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <form onSubmit={handlePaySubmit} className="space-y-4">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
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
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
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
            </div>,
            document.body
          )}
      </div>
    </MainLayout>
  );
};
