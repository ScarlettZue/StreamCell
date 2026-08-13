import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/MainLayout';
import { UserPlus, Search, AlertCircle, Loader2, X, Edit2, Trash2, Eye } from 'lucide-react';
import { clientService } from '../services/clientService';
import { formatDateCO } from '../utils/formatters';
import { IClient } from '../types';
import { ClientDetailsModal } from '../components/ClientDetailsModal';

export const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CLIENTE' | 'DISTRIBUIDOR'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form & Selection State
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'CLIENTE' | 'DISTRIBUIDOR'>('CLIENTE');
  const [distributorId, setDistributorId] = useState<string>('');

  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', searchTerm, roleFilter],
    queryFn: () => clientService.getClients(searchTerm, roleFilter),
  });

  const { data: distributors } = useQuery({
    queryKey: ['distributors'],
    queryFn: () => clientService.getClients(undefined, 'DISTRIBUIDOR'),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: () => clientService.createClient(name, phone, role, distributorId || null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setModalError(err.response?.data?.message || 'Error al guardar el usuario. Verifica los datos.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => clientService.updateClient(selectedClient!.id, name, phone, role, distributorId || null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsEditModalOpen(false);
      setSelectedClient(null);
      resetForm();
    },
    onError: (err: any) => {
      setModalError(err.response?.data?.message || 'Error al actualizar el usuario. Inténtalo de nuevo.');
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

  const resetForm = () => {
    setName('');
    setPhone('');
    setRole('CLIENTE');
    setDistributorId('');
    setModalError(null);
  };

  const handleOpenDetails = (client: IClient) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, client: IClient) => {
    e.stopPropagation();
    setModalError(null);
    setSelectedClient(client);
    setName(client.name);
    setPhone(client.phone === '3000000000' ? '' : client.phone);
    setRole(client.role || 'CLIENTE');
    setDistributorId(client.distributorId || '');
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (e: React.MouseEvent, client: IClient) => {
    e.stopPropagation();
    setModalError(null);
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createMutation.isPending) return;
    setModalError(null);
    if (!name || !phone) return;
    createMutation.mutate();
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateMutation.isPending) return;
    setModalError(null);
    if (!selectedClient || !name) return;
    updateMutation.mutate();
  };

  return (
    <MainLayout
      title="Directorio de Usuarios"
      subtitle="Base de datos de clientes finales y distribuidores con consulta de cuentas, compras y deudas"
    >
      <div className="space-y-6">
        {/* Búsqueda, Filtro por Rol & Nuevo Usuario */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, celular o @usuario..."
                className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700/60 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-all shadow-sm"
              />
            </div>

            {/* Pestañas de Filtro por Rol */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  roleFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setRoleFilter('CLIENTE')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  roleFilter === 'CLIENTE'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Clientes
              </button>
              <button
                onClick={() => setRoleFilter('DISTRIBUIDOR')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  roleFilter === 'DISTRIBUIDOR'
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Distribuidores
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:opacity-95 transition-all flex-shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>

        {/* Tabla de Usuarios Limpia */}
        {/* Vista Escritorio: Tabla Completa */}
        <div className="hidden sm:block glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Celular / @Usuario</th>
                <th className="px-6 py-4">Fecha Registro</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Cargando directorio de usuarios...
                  </td>
                </tr>
              ) : clients?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
                    No se encontraron usuarios coincidentes.
                  </td>
                </tr>
              ) : (
                clients?.map((client) => {
                  const isMissingPhone = !client.phone || client.phone === '3000000000';
                  const isDistributor = client.role === 'DISTRIBUIDOR';

                  return (
                    <tr
                      key={client.id}
                      onClick={() => handleOpenDetails(client)}
                      className="hover:bg-purple-500/5 dark:hover:bg-purple-500/10 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                            {client.name ? client.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {client.name}
                            </span>
                            {client.distributor && (
                              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold block mt-0.5">
                                Dist.: {client.distributor.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase inline-block ${
                            isDistributor
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {isDistributor ? 'Distribuidor' : 'Cliente Final'}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs">
                        {isMissingPhone ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                            <AlertCircle className="w-3 h-3 inline mr-1" />
                            <span>Sin Celular</span>
                          </span>
                        ) : (
                          <span className="text-slate-700 dark:text-slate-200 font-medium">{client.phone}</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {formatDateCO(client.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenDetails(client)}
                            className="px-3 py-1.5 bg-purple-600/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 hover:bg-purple-600/20 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                            title="Ver Detalle e Historial"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detalle</span>
                          </button>

                          <button
                            onClick={(e) => handleOpenEdit(e, client)}
                            className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
                            title="Editar Datos del Usuario"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => handleOpenDelete(e, client)}
                            className="p-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-all"
                            title="Eliminar Usuario"
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

        {/* Vista Móvil: Tarjetas Táctiles */}
        <div className="sm:hidden space-y-3 pb-24">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Cargando directorio de usuarios...
            </div>
          ) : clients?.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
              No se encontraron usuarios coincidentes.
            </div>
          ) : (
            clients?.map((client) => {
              const isMissingPhone = !client.phone || client.phone === '3000000000';
              const isDistributor = client.role === 'DISTRIBUIDOR';

              return (
                <div
                  key={client.id}
                  onClick={() => handleOpenDetails(client)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center text-base shadow-sm flex-shrink-0">
                        {client.name ? client.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {client.name}
                        </h4>
                        {client.distributor && (
                          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold block">
                            Dist.: {client.distributor.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        isDistributor
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {isDistributor ? 'Distribuidor' : 'Cliente'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">
                      {isMissingPhone ? 'Sin celular' : client.phone}
                    </span>

                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenDetails(client)}
                        className="px-3 py-1.5 bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded-xl text-xs font-bold flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </button>

                      <button
                        onClick={(e) => handleOpenEdit(e, client)}
                        className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleOpenDelete(e, client)}
                        className="p-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Ver Detalle del Cliente con React Portal */}
        <ClientDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedClient(null);
          }}
          client={selectedClient}
        />

        {/* Modal Crear Usuario con React Portal */}
        {isCreateModalOpen &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <UserPlus className="w-5 h-5 text-purple-600" />
                    <span>Nuevo Usuario</span>
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Rol del Usuario</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'CLIENTE' | 'DISTRIBUIDOR')}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 font-medium"
                    >
                      <option value="CLIENTE">Cliente Final</option>
                      <option value="DISTRIBUIDOR">Distribuidor</option>
                    </select>
                  </div>

                  {role === 'CLIENTE' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Distribuidor Asociado (Opcional)
                      </label>
                      <select
                        value={distributorId}
                        onChange={(e) => setDistributorId(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 font-medium"
                      >
                        <option value="">-- Sin Distribuidor --</option>
                        {distributors?.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.phone})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Número de Celular o @Usuario</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 300 123 4567 o @usuario"
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
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center space-x-1"
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
                    <span>Editar Cliente</span>
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Rol del Usuario</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'CLIENTE' | 'DISTRIBUIDOR')}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 font-medium"
                    >
                      <option value="CLIENTE">Cliente Final</option>
                      <option value="DISTRIBUIDOR">Distribuidor</option>
                    </select>
                  </div>

                  {role === 'CLIENTE' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Distribuidor Asociado (Opcional)
                      </label>
                      <select
                        value={distributorId}
                        onChange={(e) => setDistributorId(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 font-medium"
                      >
                        <option value="">-- Sin Distribuidor --</option>
                        {distributors
                          ?.filter((d) => d.id !== selectedClient?.id)
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.phone})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Número de Celular o @Usuario</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 300 123 4567 o @usuario"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
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
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center space-x-1"
                    >
                      {updateMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Guardar Cambios</span>
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
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Trash2 className="w-5 h-5 text-rose-600" />
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
                    ¿Estás segura de que deseas eliminar al cliente <strong className="text-slate-900 dark:text-white">{selectedClient.name}</strong>?
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
                      className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 flex items-center space-x-1"
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
      </div>
    </MainLayout>
  );
};
