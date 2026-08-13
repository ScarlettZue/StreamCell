import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import {
  Zap,
  Users,
  Tv,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight,
  Search,
  Loader2,
  X,
  UserPlus,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { saleService } from '../services/saleService';
import { clientService } from '../services/clientService';
import { accountService } from '../services/accountService';
import { formatCurrency, getDaysRemaining } from '../utils/formatters';
import { IProfileSubscription } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modal Venta Rápida
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [accountProfileId, setAccountProfileId] = useState('');
  const [unitCost, setUnitCost] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);

  // Buscadores de Cliente y Perfil
  const [clientSearch, setClientSearch] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [profileSearch, setProfileSearch] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Filtro de Clientes Nuevos (Día / Mes / Año)
  const [clientPeriod, setClientPeriod] = useState<'day' | 'month' | 'year'>('month');

  // Funciones Auxiliares de Fechas
  const getTodayStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const get30DaysLaterStr = (fromStr?: string) => {
    const baseDate = fromStr ? new Date(fromStr + 'T12:00:00') : new Date();
    const futureDate = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const yyyy = futureDate.getFullYear();
    const mm = String(futureDate.getMonth() + 1).padStart(2, '0');
    const dd = String(futureDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [startDate, setStartDate] = useState<string>(getTodayStr());
  const [endDate, setEndDate] = useState<string>(get30DaysLaterStr());

  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    setEndDate(get30DaysLaterStr(newStart));
  };

  // Queries
  const { data: salesInfo } = useQuery({
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

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts,
  });

  // Ventas de Hoy
  const todayStr = getTodayStr();
  const todaySales = salesInfo?.sales.filter((s) => {
    const d = new Date(s.createdAt);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}` === todayStr;
  }) || [];

  const todayRevenue = todaySales.reduce((acc, s) => acc + Number(s.totalAmount), 0);

  // Clientes Nuevos según periodo
  const now = new Date();
  const newClientsCount = clients?.filter((c) => {
    const d = new Date(c.createdAt);
    if (clientPeriod === 'day') {
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }
    if (clientPeriod === 'month') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    // year
    return d.getFullYear() === now.getFullYear();
  }).length || 0;

  // Extraer suscripciones vencidas/pendientes de corte
  const expiredSubscriptions: Array<{
    sub: IProfileSubscription;
    accountEmail: string;
    productName: string;
    profileName: string;
    pin?: string;
  }> = [];

  if (accounts) {
    const nowTime = new Date().getTime();
    for (const acc of accounts) {
      if (!acc.profiles) continue;
      for (const prof of acc.profiles) {
        if (!prof.subscriptions) continue;
        for (const sub of prof.subscriptions) {
          if (sub.status === 'ACTIVE') {
            const endDate = new Date(sub.serviceEndDate).getTime();
            if (endDate < nowTime) {
              expiredSubscriptions.push({
                sub,
                accountEmail: acc.email,
                productName: acc.product?.name || 'Streaming',
                profileName: prof.profileName,
                pin: prof.pin || undefined,
              });
            }
          }
        }
      }
    }
  }

  // Filtrado de dropdowns en modal
  const filteredClients = clients?.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.phone.includes(clientSearch)
  );

  const filteredProfiles = availableProfiles?.filter((p) => {
    const term = profileSearch.toLowerCase();
    const prodName = p.account?.product?.name?.toLowerCase() || '';
    const profName = p.profileName?.toLowerCase() || '';
    const email = p.account?.email?.toLowerCase() || '';
    return prodName.includes(term) || profName.includes(term) || email.includes(term);
  });

  const handleProfileSelect = (profId: string) => {
    setAccountProfileId(profId);
    const prof = availableProfiles?.find((p) => p.id === profId);
    if (prof?.account?.product) {
      const totalProfiles = prof.account.product.profilesCount || 1;
      const calculatedUnitCost = Math.round(Number(prof.account.product.defaultCost) / totalProfiles);
      setUnitCost(calculatedUnitCost);
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
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['cashFlowStats'] });
      setIsSaleModalOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setClientId('');
    setAccountProfileId('');
    setClientSearch('');
    setProfileSearch('');
    setIsClientDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    setUnitCost(0);
    setUnitPrice(0);
    const today = getTodayStr();
    setStartDate(today);
    setEndDate(get30DaysLaterStr(today));
  };

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !accountProfileId || unitPrice <= 0) return;
    createSaleMutation.mutate();
  };

  return (
    <MainLayout
      title="Dashboard General"
      subtitle="Panel ejecutivo optimizado para celular y control en tiempo real"
    >
      <div className="space-y-6">
        {/* Banner de Acceso Rápido Móvil */}
        <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              <span>Acceso Rápido a Ventas</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Registra nuevas ventas de inmediato desde cualquier dispositivo.
            </p>
          </div>

          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Venta Rápida</span>
          </button>
        </div>

        {/* Tarjetas KPIs Móviles y Ejecutivas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ventas del Día */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ventas de Hoy</span>
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {todaySales.length} <span className="text-xs font-normal text-slate-400">ventas</span>
              </h3>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                Recaudado: {formatCurrency(todayRevenue)}
              </p>
            </div>
          </div>

          {/* Clientes Nuevos con Selector de Periodo */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clientes Nuevos</span>
              <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                <UserPlus className="w-4 h-4" />
              </div>
            </div>

            {/* Selector Día / Mes / Año */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-[10px] font-bold mb-2">
              <button
                onClick={() => setClientPeriod('day')}
                className={`flex-1 py-1 rounded-lg transition-all ${clientPeriod === 'day'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                Día
              </button>
              <button
                onClick={() => setClientPeriod('month')}
                className={`flex-1 py-1 rounded-lg transition-all ${clientPeriod === 'month'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                Mes
              </button>
              <button
                onClick={() => setClientPeriod('year')}
                className={`flex-1 py-1 rounded-lg transition-all ${clientPeriod === 'year'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                Año
              </button>
            </div>

            <div className="mt-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {newClientsCount} <span className="text-xs font-normal text-slate-400">registrados</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {clientPeriod === 'day' && 'Registrados hoy'}
                {clientPeriod === 'month' && 'Registrados este mes'}
                {clientPeriod === 'year' && 'Registrados este año'}
              </p>
            </div>
          </div>

          {/* Cortes Pendientes */}
          <div
            onClick={() => navigate('/expirations')}
            className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden cursor-pointer hover:border-rose-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cortes Pendientes</span>
              <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {expiredSubscriptions.length} <span className="text-xs font-normal text-slate-400">vencidos</span>
              </h3>
              <p className="text-xs text-rose-500 font-bold mt-1 flex items-center">
                <span>Gestionar en Alertas de Corte</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </div>

          {/* Stock Disponible */}
          <div
            onClick={() => navigate('/accounts')}
            className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Disponible</span>
              <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-600 dark:text-cyan-400">
                <Tv className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {availableProfiles?.length || 0} <span className="text-xs font-normal text-slate-400">perfiles</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Listos para asignar en inventario</p>
            </div>
          </div>
        </div>

        {/* Widgets Dinámicos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Widget 1: Cortes Pendientes a Realizar */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Cortes Pendientes a Realizar</h3>
              </div>
              <button
                onClick={() => navigate('/expirations')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1"
              >
                <span>Ver Todos ({expiredSubscriptions.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {expiredSubscriptions.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ¡No hay cortes pendientes! Todas las cuentas están al día.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {expiredSubscriptions.slice(0, 5).map(({ sub, productName, profileName }) => {
                  const daysExpired = Math.abs(getDaysRemaining(sub.serviceEndDate));
                  return (
                    <div
                      key={sub.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <strong className="text-sm font-bold text-slate-900 dark:text-white">
                            {sub.client?.name || 'Cliente'}
                          </strong>
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px]">
                            Vencido hace {daysExpired} {daysExpired === 1 ? 'día' : 'días'}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">
                          Servicio: <strong className="text-purple-600 dark:text-purple-400">{productName}</strong> ({profileName})
                        </p>
                      </div>

                      <button
                        onClick={() => navigate('/expirations')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md transition-all self-start sm:self-auto"
                      >
                        Gestionar Corte
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Widget 2: Accesos Rápido a Secciones */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Navegación Rápida</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/sales')}
                className="p-4 bg-slate-100 dark:bg-slate-900/80 hover:bg-purple-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-left space-y-2 transition-all group"
              >
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 w-fit group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Venta Rápida</h4>
                  <p className="text-[10px] text-slate-400">Registrar ventas</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/cash-flow')}
                className="p-4 bg-slate-100 dark:bg-slate-900/80 hover:bg-purple-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-left space-y-2 transition-all group"
              >
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 w-fit group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Flujo de Caja</h4>
                  <p className="text-[10px] text-slate-400">Métricas de utilidad</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/clients')}
                className="p-4 bg-slate-100 dark:bg-slate-900/80 hover:bg-purple-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-left space-y-2 transition-all group"
              >
                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 w-fit group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Usuarios</h4>
                  <p className="text-[10px] text-slate-400">Directorio de clientes</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/accounts')}
                className="p-4 bg-slate-100 dark:bg-slate-900/80 hover:bg-purple-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-left space-y-2 transition-all group"
              >
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 w-fit group-hover:scale-110 transition-transform">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Servicios</h4>
                  <p className="text-[10px] text-slate-400">Inventario de cuentas</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Registrar Venta Rápida */}
        {isSaleModalOpen &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-glass">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Registrar Venta Rápida</span>
                  </h3>
                  <button onClick={() => setIsSaleModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitSale} className="space-y-4">
                  {/* Cliente Buscable */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Cliente (Escribe Nombre, Celular o @Usuario)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required={!clientId}
                        placeholder="Buscar cliente por teléfono..."
                        value={clientSearch}
                        onChange={(e) => {
                          setClientSearch(e.target.value);
                          setClientId('');
                          setIsClientDropdownOpen(true);
                        }}
                        onFocus={() => setIsClientDropdownOpen(true)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>

                    {isClientDropdownOpen && (
                      <div className="absolute z-[10000] left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredClients?.length === 0 ? (
                          <div className="p-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                            No se encontraron clientes
                          </div>
                        ) : (
                          filteredClients?.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setClientId(c.id);
                                setClientSearch(`${c.name} (${c.phone})`);
                                setIsClientDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-purple-50 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between"
                            >
                              <span className="text-sm font-medium text-slate-900 dark:text-white">{c.name}</span>
                              <span className="text-xs text-purple-600 dark:text-purple-400 font-mono font-bold">{c.phone}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Perfil Buscable */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Perfil / Cuenta (Escribe Plataforma, Perfil o Correo)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required={!accountProfileId}
                        placeholder="Buscar por plataforma o perfil..."
                        value={profileSearch}
                        onChange={(e) => {
                          setProfileSearch(e.target.value);
                          setAccountProfileId('');
                          setIsProfileDropdownOpen(true);
                        }}
                        onFocus={() => setIsProfileDropdownOpen(true)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>

                    {isProfileDropdownOpen && (
                      <div className="absolute z-[10000] left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredProfiles?.length === 0 ? (
                          <div className="p-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                            No hay perfiles disponibles
                          </div>
                        ) : (
                          filteredProfiles?.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                handleProfileSelect(p.id);
                                setProfileSearch(`${p.account?.product?.name || ''} - ${p.profileName} (${p.account?.email || ''})`);
                                setIsProfileDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-purple-50 dark:hover:bg-slate-800/80 transition-colors flex flex-col"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                  {p.account?.product?.name} - {p.profileName}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">
                                  {p.pin ? `PIN: ${p.pin}` : 'Sin PIN'}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                {p.account?.email}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Fechas de Servicio */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Fecha Inicio
                      </label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Fecha Vencimiento (+30d)
                      </label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Precios Dinámicos */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Costo Real ($)</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={unitCost}
                        onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Precio Venta ($)</label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs px-2 text-slate-500 dark:text-slate-400">
                    <span>Ganancia Neta Estimada:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{formatCurrency(unitPrice - unitCost)}</span>
                  </div>

                  <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsSaleModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={createSaleMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-lg flex items-center space-x-1"
                    >
                      {createSaleMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Confirmar Venta</span>
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
