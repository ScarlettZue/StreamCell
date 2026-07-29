import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/MainLayout';
import { Plus, Eye, EyeOff, Loader2, X, Sparkles } from 'lucide-react';
import { accountService, CreateAccountInput } from '../services/accountService';
import { productService } from '../services/productService';
import { clientService } from '../services/clientService';
import { formatDateCO } from '../utils/formatters';

export const AccountsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  // Form State
  const [productId, setProductId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  // Perfiles / Cupos
  const [profiles, setProfiles] = useState<
    Array<{
      profileName: string;
      hasPin: boolean;
      pin: string;
      userEmail: string;
      spotifyUsername: string;
      familyAddress: string;
      isSold: boolean;
      clientId: string;
      saleCost?: number;
      salePrice?: number;
    }>
  >([
    {
      profileName: 'Perfil 1',
      hasPin: false,
      pin: '',
      userEmail: '',
      spotifyUsername: '',
      familyAddress: '',
      isSold: false,
      clientId: '',
    },
  ]);

  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts,
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
  });

  const createAccountMutation = useMutation({
    mutationFn: (data: CreateAccountInput) => accountService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['availableProfiles'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setProductId('');
    setEmail('');
    setPassword('');
    setNotes('');
    setProfiles([
      {
        profileName: 'Perfil 1',
        hasPin: false,
        pin: '',
        userEmail: '',
        spotifyUsername: '',
        familyAddress: '',
        isSold: false,
        clientId: '',
      },
    ]);
  };

  const handleAddProfileField = () => {
    setProfiles([
      ...profiles,
      {
        profileName: `Perfil ${profiles.length + 1}`,
        hasPin: false,
        pin: '',
        userEmail: '',
        spotifyUsername: '',
        familyAddress: '',
        isSold: false,
        clientId: '',
      },
    ]);
  };

  const togglePasswordVisibility = (accId: string) => {
    setShowPasswords((prev) => ({ ...prev, [accId]: !prev[accId] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !email) return;

    createAccountMutation.mutate({
      productId,
      email,
      password,
      startDate,
      dueDate,
      notes,
      profiles,
    });
  };

  return (
    <MainLayout title="Cuentas & Perfiles Digitales" subtitle="Control de stock de cuentas madre, perfiles con PIN e invitaciones personales">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white">Inventario de Cuentas Registradas</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl text-sm font-semibold shadow-glow hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nueva Cuenta</span>
          </button>
        </div>

        {/* Cuentas Grid / Cards */}
        {isLoading ? (
          <div className="text-center py-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            Cargando cuentas e inventario...
          </div>
        ) : accounts?.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl text-slate-400 border border-slate-800">
            No hay cuentas registradas en el inventario. Haz clic en "Registrar Nueva Cuenta" para comenzar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts?.map((acc) => (
              <div key={acc.id} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                      {acc.product?.category?.name || 'Streaming'}
                    </span>
                    <h4 className="text-lg font-extrabold text-white">{acc.product?.name}</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Corte:</span>
                    <p className="text-xs font-bold text-amber-400">{formatDateCO(acc.dueDate)}</p>
                  </div>
                </div>

                {/* Credenciales Cifradas Descifradas */}
                <div className="space-y-2 mb-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Correo:</span>
                    <span className="text-slate-200 font-bold">{acc.email}</span>
                  </div>
                  {acc.password && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Contraseña:</span>
                      <div className="flex items-center space-x-2">
                        <span>{showPasswords[acc.id] ? acc.password : '••••••••'}</span>
                        <button onClick={() => togglePasswordVisibility(acc.id)} className="text-slate-400 hover:text-white">
                          {showPasswords[acc.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Perfiles */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Perfiles / Cupos ({acc.profiles.length})</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {acc.profiles.map((p) => {
                      const isSold = p.status === 'SOLD';
                      const activeSub = p.subscriptions?.[0];
                      return (
                        <div
                          key={p.id}
                          className={`p-3 rounded-xl border text-xs ${
                            isSold
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          <div className="flex justify-between items-center font-bold">
                            <span>{p.profileName}</span>
                            <span>{isSold ? 'VENDIDO' : 'DISPONIBLE'}</span>
                          </div>
                          {p.hasPin && p.pin && <p className="text-[10px] text-slate-400 mt-1">PIN: <span className="font-mono text-white font-bold">{p.pin}</span></p>}
                          {p.familyAddress && <p className="text-[10px] text-slate-400 mt-1">Dirección: <span className="text-slate-200">{p.familyAddress}</span></p>}
                          {activeSub?.client && (
                            <p className="text-[10px] text-brand-300 mt-1 font-semibold">Cliente: {activeSub.client.name}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Registrar Cuenta (Wizard) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
            <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl border border-slate-700 shadow-glass my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                  <span>Registrar Nueva Cuenta & Perfiles</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Paso 1: Selección de Producto y Credenciales */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 border-b border-slate-800 pb-1">
                    Paso 1: Datos Principales de la Cuenta
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Producto / Servicio</label>
                    <select
                      required
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                    >
                      <option value="">Selecciona un producto del catálogo...</option>
                      {products?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Correo de la Cuenta</label>
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="cuenta@streamcell.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Contraseña (Opcional)</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Fecha Registro/Inicio</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Fecha de Corte (30 días)</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Paso 2: Configuración de Perfiles o Cupos */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400">
                      Paso 2: Perfiles / Cupos
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddProfileField}
                      className="px-3 py-1 bg-slate-800 text-brand-300 hover:bg-slate-700 rounded-lg text-xs font-semibold"
                    >
                      + Añadir Perfil
                    </button>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {profiles.map((p, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={p.profileName}
                            onChange={(e) => {
                              const updated = [...profiles];
                              updated[idx].profileName = e.target.value;
                              setProfiles(updated);
                            }}
                            placeholder="Nombre perfil"
                            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          />

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={p.hasPin}
                              onChange={(e) => {
                                const updated = [...profiles];
                                updated[idx].hasPin = e.target.checked;
                                setProfiles(updated);
                              }}
                              className="rounded bg-slate-800 border-slate-700 text-brand-500"
                            />
                            <span className="text-xs text-slate-300">¿Tiene PIN?</span>
                          </div>

                          {p.hasPin && (
                            <input
                              type="text"
                              maxLength={6}
                              value={p.pin}
                              onChange={(e) => {
                                const updated = [...profiles];
                                updated[idx].pin = e.target.value;
                                setProfiles(updated);
                              }}
                              placeholder="Clave PIN"
                              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                            />
                          )}
                        </div>

                        {/* Asignar vendido opcional */}
                        <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-4">
                          <label className="flex items-center space-x-2 text-xs text-amber-300">
                            <input
                              type="checkbox"
                              checked={p.isSold}
                              onChange={(e) => {
                                const updated = [...profiles];
                                updated[idx].isSold = e.target.checked;
                                setProfiles(updated);
                              }}
                            />
                            <span>¿Este perfil ya está vendido?</span>
                          </label>

                          {p.isSold && (
                            <select
                              value={p.clientId}
                              onChange={(e) => {
                                const updated = [...profiles];
                                updated[idx].clientId = e.target.value;
                                setProfiles(updated);
                              }}
                              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white flex-1"
                            >
                              <option value="">Seleccionar Cliente...</option>
                              {clients?.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name} ({c.phone})
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
                    disabled={createAccountMutation.isPending}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-semibold shadow-glow hover:opacity-95 flex items-center space-x-1"
                  >
                    {createAccountMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Guardar Cuenta Completa</span>
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
