import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/MainLayout';
import {
  Zap,
  Plus,
  DollarSign,
  TrendingUp,
  Loader2,
  X,
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  MessageSquare,
} from 'lucide-react';
import { saleService } from '../services/saleService';
import { accountService } from '../services/accountService';
import { clientService } from '../services/clientService';
import { formatCurrency, formatDateCO, formatSaleAssignmentWhatsAppMessage } from '../utils/formatters';
import { ISale } from '../types';

export const SalesPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<ISale | null>(null);

  // Modal WhatsApp Pos-Venta
  const [saleSuccessModalOpen, setSaleSuccessModalOpen] = useState(false);
  const [saleWspPhone, setSaleWspPhone] = useState('');
  const [editedSaleMessage, setEditedSaleMessage] = useState('');
  const [copiedSaleSuccess, setCopiedSaleSuccess] = useState(false);

  // Formulario Venta Rápida
  const [clientId, setClientId] = useState('');
  const [accountProfileId, setAccountProfileId] = useState('');
  const [unitCost, setUnitCost] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);

  // Buscadores en Formulario Modal
  const [clientSearch, setClientSearch] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [profileSearch, setProfileSearch] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Formulario de Edición
  const [editCost, setEditCost] = useState<number>(0);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStartDate, setEditStartDate] = useState<string>('');
  const [editEndDate, setEditEndDate] = useState<string>('');
  const [editProfileId, setEditProfileId] = useState<string>('');

  // Búsqueda e Historial
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Filtrado de la tabla de ventas
  const filteredSales = salesInfo?.sales.filter((sale) => {
    const term = searchTerm.toLowerCase();
    const codeMatch = sale.code.toLowerCase().includes(term);
    const clientMatch = sale.client?.name.toLowerCase().includes(term);
    const detail = sale.details?.[0];
    const prodMatch = detail?.profile?.account?.product?.name?.toLowerCase().includes(term);
    const profMatch = detail?.profile?.profileName?.toLowerCase().includes(term);
    const emailMatch = detail?.profile?.account?.email?.toLowerCase().includes(term);
    return codeMatch || clientMatch || prodMatch || profMatch || emailMatch;
  });

  // Paginación
  const totalPages = Math.ceil((filteredSales?.length || 0) / itemsPerPage);
  const currentSales = filteredSales?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

  // Métrica Ventas de Hoy
  const todayStr = getTodayStr();
  const todaySalesList = salesInfo?.sales.filter((s) => {
    const d = new Date(s.createdAt);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}` === todayStr;
  }) || [];

  const todayRevenue = todaySalesList.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const todayProfit = todaySalesList.reduce((acc, s) => acc + Number(s.netProfit), 0);

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
    onSuccess: (createdSale) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['availableProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['cashFlowStats'] });
      setIsModalOpen(false);

      const detail = createdSale?.details?.[0];
      const clientPhone = createdSale?.client?.phone || '';
      const prodName = detail?.profile?.account?.product?.name || 'Servicio';
      const email = detail?.profile?.account?.email;
      const pass = detail?.profile?.account?.password;
      const profName = detail?.profile?.profileName;
      const pin = detail?.profile?.pin;
      const dueDateVal = endDate || get30DaysLaterStr(startDate);

      const msg = formatSaleAssignmentWhatsAppMessage({
        productName: prodName,
        accountEmail: email,
        accountPassword: pass,
        profileName: profName,
        pin: pin,
        dueDate: dueDateVal,
      });

      setSaleWspPhone(clientPhone);
      setEditedSaleMessage(msg);
      setSaleSuccessModalOpen(true);
      resetForm();
    },
  });

  const updateSaleMutation = useMutation({
    mutationFn: () =>
      saleService.updateSale(selectedSale!.id, {
        unitCost: editCost,
        unitPrice: editPrice,
        accountProfileId: editProfileId,
        serviceStartDate: editStartDate,
        serviceEndDate: editEndDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['availableProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['cashFlowStats'] });
      setEditModalOpen(false);
      setSelectedSale(null);
    },
  });

  const deleteSaleMutation = useMutation({
    mutationFn: () => saleService.deleteSale(selectedSale!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['availableProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['cashFlowStats'] });
      setDeleteModalOpen(false);
      setSelectedSale(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createSaleMutation.isPending) return;
    if (!clientId || !accountProfileId || unitPrice <= 0) return;
    createSaleMutation.mutate();
  };

  const handleEditClick = (sale: ISale) => {
    setSelectedSale(sale);
    const detail = sale.details?.[0];
    setEditCost(detail ? Number(detail.unitCost) : Number(sale.totalCost));
    setEditPrice(detail ? Number(detail.unitPrice) : Number(sale.totalAmount));

    const currentProfId = detail?.accountProfileId || '';
    setEditProfileId(currentProfId);

    const created = sale.createdAt ? new Date(sale.createdAt).toISOString().split('T')[0] : getTodayStr();
    setEditStartDate(created);
    setEditEndDate(get30DaysLaterStr(created));
    setEditModalOpen(true);
  };

  const handleDeleteClick = (sale: ISale) => {
    setSelectedSale(sale);
    setDeleteModalOpen(true);
  };

  return (
    <MainLayout title="Venta Rápida" subtitle="Registro express de ventas directas desde tu móvil o computador">
      <div className="space-y-6">
        {/* Banner Venta Rápida & Acceso Directo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
              <Zap className="w-7 h-7 text-amber-500 fill-amber-500" />
              <span>Venta Rápida</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Registro express de ventas directas desde tu móvil o computador.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Venta Rápida</span>
          </button>
        </div>

        {/* Resumen del Día de Hoy */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Ventas Hoy</span>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {todaySalesList.length} <span className="text-xs font-normal text-slate-400">registros</span>
              </h4>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Ingresos Hoy</span>
              <h4 className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">
                {formatCurrency(todayRevenue)}
              </h4>
            </div>
            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Ganancia Hoy</span>
              <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                {formatCurrency(todayProfit)}
              </h4>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Barra de Búsqueda de Ventas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Historial de Ventas</h3>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por código, cliente o producto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Tabla de Historial de Ventas - Escritorio */}
        <div className="hidden sm:block glass-panel rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Código</th>
                <th className="px-6 py-3.5">Cliente</th>
                <th className="px-6 py-3.5">Producto / Perfil</th>
                <th className="px-6 py-3.5">Costo Real</th>
                <th className="px-6 py-3.5">Precio Venta</th>
                <th className="px-6 py-3.5">Ganancia Neta</th>
                <th className="px-6 py-3.5">Fecha</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Cargando historial de ventas...
                  </td>
                </tr>
              ) : currentSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No se encontraron ventas registradas.
                  </td>
                </tr>
              ) : (
                currentSales.map((sale) => {
                  const detail = sale.details?.[0];
                  return (
                    <tr key={sale.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-xs font-bold text-purple-600 dark:text-purple-400">{sale.code}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">{sale.client?.name || 'Cliente'}</td>
                      <td className="px-6 py-3.5 text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{detail?.profile?.account?.product?.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 ml-1">({detail?.profile?.profileName})</span>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-mono">{formatCurrency(sale.totalCost)}</td>
                      <td className="px-6 py-3.5 text-xs font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(sale.totalAmount)}</td>
                      <td className="px-6 py-3.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{formatCurrency(sale.netProfit)}</td>
                      <td className="px-6 py-3.5 text-xs text-slate-500 dark:text-slate-400">{formatDateCO(sale.createdAt)}</td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleEditClick(sale)}
                            className="p-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-all"
                            title="Editar Venta"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(sale)}
                            className="p-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-all"
                            title="Eliminar Venta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Tarjetas de Ventas - Móvil */}
        <div className="sm:hidden space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Cargando historial de ventas...
            </div>
          ) : currentSales.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
              No se encontraron ventas.
            </div>
          ) : (
            currentSales.map((sale) => {
              const detail = sale.details?.[0];
              return (
                <div key={sale.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">#{sale.code}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm font-mono">{formatCurrency(sale.totalAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-sm">{sale.client?.name || 'Cliente'}</span>
                    <span className="text-[11px] text-slate-400">{formatDateCO(sale.createdAt)}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{detail?.profile?.account?.product?.name || 'Servicio'}</span>
                      <span className="text-[11px] text-slate-500 block">Perfil: {detail?.profile?.profileName || '-'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Ganancia Neta</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{formatCurrency(sale.netProfit)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleEditClick(sale)}
                      className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold flex items-center space-x-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(sale)}
                      className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Página {currentPage} de {totalPages} ({filteredSales?.length || 0} registros)
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Registrar Venta Rápida */}
        {isModalOpen &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-glass">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Registrar Venta Rápida</span>
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Cliente Buscable */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Cliente (Escribe Nombre, Celular o @Usuario)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required={!clientId}
                        placeholder="Buscar por cliente, teléfono..."
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
                        placeholder="Buscar por plataforma, perfil..."
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
                            No hay perfiles disponibles con esa búsqueda
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
                      onClick={() => setIsModalOpen(false)}
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

        {/* Modal Editar Venta */}
        {editModalOpen &&
          selectedSale &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-glass">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Edit2 className="w-5 h-5 text-blue-500" />
                    <span>Editar Venta #{selectedSale.code}</span>
                  </h3>
                  <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl text-xs space-y-1">
                    <p className="text-slate-600 dark:text-slate-400">Cliente: <strong className="text-slate-900 dark:text-white">{selectedSale.client?.name}</strong></p>
                    <p className="text-slate-600 dark:text-slate-400">Producto Actual: <strong className="text-purple-600 dark:text-purple-400">{selectedSale.details?.[0]?.profile?.account?.product?.name} ({selectedSale.details?.[0]?.profile?.profileName})</strong></p>
                  </div>

                  {/* Selector de Reasignación de Perfil / Cuenta */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Reasignar Cuenta / Perfil
                    </label>
                    <select
                      value={editProfileId}
                      onChange={(e) => setEditProfileId(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    >
                      <option value={selectedSale.details?.[0]?.accountProfileId || ''}>
                        [Actual] {selectedSale.details?.[0]?.profile?.account?.product?.name} ({selectedSale.details?.[0]?.profile?.profileName}) - {selectedSale.details?.[0]?.profile?.account?.email}
                      </option>
                      {availableProfiles
                        ?.filter((p) => p.id !== selectedSale.details?.[0]?.accountProfileId)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.account?.product?.name} ({p.profileName}) - {p.account?.email}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Fechas de Servicio */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Fecha Inicio Servicio</label>
                      <input
                        type="date"
                        value={editStartDate}
                        onChange={(e) => setEditStartDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Fecha Corte Servicio</label>
                      <input
                        type="date"
                        value={editEndDate}
                        onChange={(e) => setEditEndDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Costos y Precios */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Costo Real ($)</label>
                      <input
                        type="number"
                        step="any"
                        value={editCost}
                        onChange={(e) => setEditCost(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Precio Venta ($)</label>
                      <input
                        type="number"
                        step="any"
                        value={editPrice}
                        onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs px-1 text-slate-500">
                    <span>Nueva Ganancia Neta:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrency(editPrice - editCost)}
                    </span>
                  </div>

                  <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={updateSaleMutation.isPending}
                      onClick={() => updateSaleMutation.mutate()}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center space-x-1"
                    >
                      {updateSaleMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* Modal Confirmar Eliminación */}
        {deleteModalOpen &&
          selectedSale &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="glass-panel w-full max-w-sm p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-glass space-y-4">
                <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400">
                  <Trash2 className="w-6 h-6" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">¿Eliminar Venta #{selectedSale.code}?</h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Esta acción eliminará el registro de venta por <strong className="text-slate-900 dark:text-white">{formatCurrency(selectedSale.totalAmount)}</strong> del cliente <strong className="text-slate-900 dark:text-white">{selectedSale.client?.name}</strong> y ajustará el historial financiero.
                </p>

                <div className="pt-2 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={deleteSaleMutation.isPending}
                    onClick={() => deleteSaleMutation.mutate()}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md flex items-center space-x-1"
                  >
                    {deleteSaleMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirmar Eliminación</span>
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* Modal WhatsApp Pos-Venta */}
        {saleSuccessModalOpen &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
              <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-glass space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-emerald-500" />
                    <span>¡Venta Registrada! Enviar Credenciales</span>
                  </h3>
                  <button onClick={() => setSaleSuccessModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    La venta se guardó exitosamente. Puedes enviar las credenciales de acceso al cliente vía WhatsApp o copiarlas.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Mensaje de Asignación de Servicio (Editable)
                    </label>
                    <textarea
                      rows={9}
                      value={editedSaleMessage}
                      onChange={(e) => setEditedSaleMessage(e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-emerald-500 leading-relaxed shadow-inner"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(editedSaleMessage);
                      setCopiedSaleSuccess(true);
                      setTimeout(() => setCopiedSaleSuccess(false), 2000);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>{copiedSaleSuccess ? '¡Copiado!' : 'Copiar Texto'}</span>
                  </button>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setSaleSuccessModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cerrar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const encoded = encodeURIComponent(editedSaleMessage);
                        const cleanPhone = saleWspPhone.replace(/\D/g, '');
                        const fullPhone = cleanPhone.length === 10 ? `57${cleanPhone}` : cleanPhone;
                        const url = fullPhone ? `https://wa.me/${fullPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
                        window.open(url, '_blank');
                        setSaleSuccessModalOpen(false);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center space-x-1.5 transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Enviar por WhatsApp</span>
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
