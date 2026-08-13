import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/MainLayout';
import {
  Plus,
  Eye,
  EyeOff,
  Loader2,
  X,
  Search,
  Tv,
  Cpu,
  Sparkles,
  Layers,
  Edit2,
  Settings,
  Check,
  ShieldCheck,
  User,
  RefreshCw,
  Calendar,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react';
import { accountService, CreateAccountInput } from '../services/accountService';
import { productService } from '../services/productService';
import { clientService } from '../services/clientService';
import { formatDateCO, formatCurrency } from '../utils/formatters';
import { useToast } from '../components/common/Toast';
import { IProduct, IAccount } from '../types';
import { AccountNotificationModal } from '../components/AccountNotificationModal';

export const AccountsPage: React.FC = () => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [editingAccount, setEditingAccount] = useState<IAccount | null>(null);

  // Notification Modal State
  const [notificationAccount, setNotificationAccount] = useState<IAccount | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const [confirmingDeleteAccount, setConfirmingDeleteAccount] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [expandedAccounts, setExpandedAccounts] = useState<{ [key: string]: boolean }>({});

  const toggleAccountExpanded = (accId: string) => {
    setExpandedAccounts((prev) => ({
      ...prev,
      [accId]: !prev[accId],
    }));
  };

  // Búsqueda de clientes por perfil en creación
  const [clientSearchQueries, setClientSearchQueries] = useState<{ [key: number]: string }>({});
  const [openClientDropdowns, setOpenClientDropdowns] = useState<{ [key: number]: boolean }>({});

  // Búsqueda de clientes por perfil en edición
  const [editClientSearchQueries, setEditClientSearchQueries] = useState<{ [key: number]: string }>({});
  const [editOpenClientDropdowns, setEditOpenClientDropdowns] = useState<{ [key: number]: boolean }>({});

  // Filtros y Búsqueda Principal
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'STREAMING' | 'SOFTWARE' | 'IA'>('ALL');

  // Form State (Cuenta / Servicio Registro)
  const [productId, setProductId] = useState('');
  const [accountSaleMode, setAccountSaleMode] = useState<'BY_PROFILES' | 'FULL_ACCOUNT'>('BY_PROFILES');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  // Form State (Editar / Renovar Servicio)
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editProfiles, setEditProfiles] = useState<
    Array<{
      id?: string;
      profileName: string;
      hasPin: boolean;
      pin: string;
      isSold: boolean;
      clientId: string;
    }>
  >([]);

  // Form State (Plataforma / Producto Único)
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'STREAMING' | 'SOFTWARE' | 'IA'>('STREAMING');
  const [newProdType, setNewProdType] = useState<'MULTI_PROFILE' | 'FULL_ACCOUNT' | 'PERSONAL_INVITATION'>('MULTI_PROFILE');
  const [newProdCost, setNewProdCost] = useState<number>(30000);
  const [newProdPrice, setNewProdPrice] = useState<number>(12000);
  const [newProdFullPrice, setNewProdFullPrice] = useState<number>(45000);
  const [newProdProfilesCount, setNewProdProfilesCount] = useState<number>(5);

  // Perfiles en Creación
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

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
  });

  const selectedProduct = products?.find((p) => p.id === productId);

  // Al seleccionar producto o cambiar modo de venta, auto-generar perfiles
  useEffect(() => {
    if (!selectedProduct) return;

    if (accountSaleMode === 'FULL_ACCOUNT') {
      setProfiles([
        {
          profileName: 'Cuenta Completa (Todos los perfiles)',
          hasPin: false,
          pin: '',
          userEmail: '',
          spotifyUsername: '',
          familyAddress: '',
          isSold: false,
          clientId: '',
          salePrice: Number(selectedProduct.fullAccountPrice) || Number(selectedProduct.defaultPrice) * selectedProduct.profilesCount,
        },
      ]);
    } else {
      const count = selectedProduct.profilesCount || 1;
      const initialProfiles = Array.from({ length: count }, (_, i) => ({
        profileName: `Perfil ${i + 1}`,
        hasPin: false,
        pin: '',
        userEmail: '',
        spotifyUsername: '',
        familyAddress: '',
        isSold: false,
        clientId: '',
        salePrice: Number(selectedProduct.defaultPrice),
      }));
      setProfiles(initialProfiles);
    }
  }, [productId, accountSaleMode]);

  const createAccountMutation = useMutation({
    mutationFn: (data: CreateAccountInput) => accountService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['availableProfiles'] });
      setIsModalOpen(false);
      resetForm();
      showToast('¡Excelente! El nuevo servicio ha sido registrado exitosamente en StreamCell.', 'success', 'Servicio Registrado');
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || 'Ocurrió un inconveniente al registrar el servicio.', 'error', 'Error al Registrar');
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: async () => {
      if (!editingAccount) return;
      return accountService.updateAccount(editingAccount.id, {
        email: editEmail,
        password: editPassword,
        startDate: editStartDate,
        dueDate: editDueDate,
        notes: editNotes,
        profiles: editProfiles,
      });
    },
    onSuccess: (updatedAccount) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['availableProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['expirations'] });
      const targetAcc = updatedAccount || editingAccount;
      setEditingAccount(null);
      setConfirmingDeleteAccount(false);
      showToast('¡Excelente! El servicio se ha actualizado con éxito. Todos los cambios han sido guardados.', 'success', 'Servicio Actualizado');
      if (targetAcc) {
        setNotificationAccount(targetAcc);
        setIsNotificationModalOpen(true);
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'No te preocupes, intenta de nuevo.';
      showToast(`No se pudo guardar la actualización: ${msg}`, 'error', 'Error al Guardar');
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      if (!editingAccount) return;
      return accountService.deleteAccount(editingAccount.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['availableProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['expirations'] });
      setEditingAccount(null);
      setConfirmingDeleteAccount(false);
      showToast('El servicio ha sido eliminado del catálogo de StreamCell.', 'info', 'Servicio Eliminado');
    },
    onError: () => {
      showToast('No se pudo eliminar el servicio. Por favor intenta de nuevo.', 'error', 'Error al Eliminar');
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async () => {
      let catId = categories?.[0]?.id;
      if (!catId) {
        const newCat = await productService.createCategory('General', 'Categoría por defecto');
        catId = newCat.id;
      }
      return productService.createProduct({
        name: newProdName,
        categoryId: catId,
        productCategory: newProdCategory,
        type: newProdType,
        defaultCost: newProdCost,
        defaultPrice: newProdPrice,
        fullAccountPrice: newProdFullPrice,
        profilesCount: newProdProfilesCount,
      });
    },
    onSuccess: (newProd) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setProductId(newProd.id);
      setIsNewProductModalOpen(false);
      resetProductForm();
      showToast('Plataforma registrada correctamente en el catálogo.', 'success', 'Plataforma Guardada');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async () => {
      if (!editingProduct) return;
      return productService.updateProduct(editingProduct.id, {
        name: newProdName,
        productCategory: newProdCategory,
        type: newProdType,
        defaultCost: newProdCost,
        defaultPrice: newProdPrice,
        fullAccountPrice: newProdFullPrice,
        profilesCount: newProdProfilesCount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setEditingProduct(null);
      resetProductForm();
    },
  });

  const resetForm = () => {
    setProductId('');
    setEmail('');
    setPassword('');
    setNotes('');
    setAccountSaleMode('BY_PROFILES');
    setClientSearchQueries({});
    setOpenClientDropdowns({});
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

  const resetProductForm = () => {
    setNewProdName('');
    setNewProdCategory('STREAMING');
    setNewProdType('MULTI_PROFILE');
    setNewProdCost(30000);
    setNewProdPrice(12000);
    setNewProdFullPrice(45000);
    setNewProdProfilesCount(5);
    setEditingProduct(null);
  };

  const startEditingAccount = (acc: IAccount) => {
    setEditingAccount(acc);
    setConfirmingDeleteAccount(false);
    setEditEmail(acc.email);
    setEditPassword(acc.password || '');
    setEditStartDate(acc.startDate ? new Date(acc.startDate).toISOString().split('T')[0] : '');
    setEditDueDate(acc.dueDate ? new Date(acc.dueDate).toISOString().split('T')[0] : '');
    setEditNotes(acc.notes || '');

    const initialEditProfiles = (acc.profiles || []).map((prof: any) => {
      const activeSub = prof.subscriptions?.find((s: any) => s.status === 'ACTIVE');
      return {
        id: prof.id,
        profileName: prof.profileName,
        hasPin: prof.hasPin,
        pin: prof.pin || '',
        isSold: prof.status === 'SOLD',
        clientId: activeSub?.client?.id || '',
      };
    });
    setEditProfiles(initialEditProfiles);
    setEditClientSearchQueries({});
    setEditOpenClientDropdowns({});
  };

  const handleRenewDays = (days: number) => {
    const current = editDueDate ? new Date(editDueDate) : new Date();
    const nextDate = new Date(current.getTime() + days * 24 * 60 * 60 * 1000);
    setEditDueDate(nextDate.toISOString().split('T')[0]);
  };

  const startEditingProduct = (prod: IProduct) => {
    setEditingProduct(prod);
    setNewProdName(prod.name);
    setNewProdCategory((prod.productCategory as any) || 'STREAMING');
    setNewProdType(prod.type || 'MULTI_PROFILE');
    setNewProdCost(Number(prod.defaultCost) || 30000);
    setNewProdPrice(Number(prod.defaultPrice) || 12000);
    setNewProdFullPrice(Number(prod.fullAccountPrice) || 45000);
    setNewProdProfilesCount(prod.profilesCount || 5);
  };

  const handleAddProfileField = () => {
    const maxAllowed = selectedProduct?.profilesCount || 999;
    if (profiles.length >= maxAllowed) return;

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
    if (createAccountMutation.isPending) return;
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateAccountMutation.isPending) return;
    if (!editingAccount || !editEmail) return;
    updateAccountMutation.mutate();
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createProductMutation.isPending || updateProductMutation.isPending) return;
    if (!newProdName.trim()) return;

    if (editingProduct) {
      updateProductMutation.mutate();
    } else {
      createProductMutation.mutate();
    }
  };

  // Filtrar cuentas por categoría y término de búsqueda
  const filteredAccounts = accounts?.filter((acc) => {
    // Filtro por categoría
    const prodCategory = (acc.product?.productCategory as string) || 'STREAMING';
    if (selectedCategory !== 'ALL' && prodCategory !== selectedCategory) {
      return false;
    }

    // Filtro por término de búsqueda
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const matchEmail = acc.email.toLowerCase().includes(term);
    const matchProduct = acc.product?.name.toLowerCase().includes(term);
    const matchProfile = acc.profiles?.some(
      (p) => p.profileName.toLowerCase().includes(term)
    );

    return matchEmail || matchProduct || matchProfile;
  });

  return (
    <MainLayout
      title="Servicios & Cuentas Digitales"
      subtitle="Control de stock de cuentas madre, perfiles con PIN e invitaciones personales para Streaming, Software e IA"
    >
      <div className="space-y-6">
        {/* Encabezado y Botón Registrar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Catálogo e Inventario de Servicios
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filteredAccounts?.length || 0} servicio(s) registrado(s)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                resetProductForm();
                setIsNewProductModalOpen(true);
              }}
              className="flex items-center justify-center space-x-1.5 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Gestionar Plataformas</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:opacity-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Servicio</span>
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda y Pestañas de Categoría */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Campo de Búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar servicio por nombre, correo o perfil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Selector de Categorías */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${selectedCategory === 'ALL'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Todos</span>
            </button>

            <button
              onClick={() => setSelectedCategory('STREAMING')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${selectedCategory === 'STREAMING'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Streaming</span>
            </button>

            <button
              onClick={() => setSelectedCategory('SOFTWARE')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${selectedCategory === 'SOFTWARE'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Software</span>
            </button>

            <button
              onClick={() => setSelectedCategory('IA')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${selectedCategory === 'IA'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inteligencia Artificial</span>
            </button>
          </div>
        </div>

        {/* Cuentas Grid / Cards */}
        {isLoading ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
            Cargando servicios e inventario...
          </div>
        ) : filteredAccounts?.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-medium">
            No se encontraron servicios coincidentes con los filtros seleccionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-24 md:pb-6">
            {filteredAccounts?.map((acc) => {
              const categoryType = (acc.product?.productCategory as string) || 'STREAMING';
              const isExpanded = !!expandedAccounts[acc.id];
              const totalProf = acc.profiles?.length || 0;
              const availProf = acc.profiles?.filter((p) => p.status !== 'SOLD').length || 0;

              return (
                <div
                  key={acc.id}
                  className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:border-purple-500/50"
                >
                  {/* Cabecera del Cuadro de Cuenta (Click para Desplegar) */}
                  <div
                    onClick={() => toggleAccountExpanded(acc.id)}
                    className="cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 overflow-hidden">
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                          {acc.product?.name}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${categoryType === 'IA'
                            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                            : categoryType === 'SOFTWARE'
                              ? 'bg-blue-500/10 text-blue-600 border border-blue-500/30'
                              : 'bg-purple-500/10 text-purple-600 border border-purple-500/30'
                            }`}
                        >
                          {categoryType === 'IA' ? 'IA' : categoryType === 'SOFTWARE' ? 'Software' : 'Streaming'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotificationAccount(acc);
                            setIsNotificationModalOpen(true);
                          }}
                          className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1"
                          title="Notificar cambios de la cuenta por WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Notificar</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingAccount(acc);
                          }}
                          className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1"
                          title="Editar o Renovar Servicio"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                      </div>
                    </div>

                    {/* Email y Contraseña */}
                    <div className="bg-slate-100 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-mono font-medium truncate pr-1">
                          {acc.email}
                        </span>
                        {acc.password && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePasswordVisibility(acc.id);
                            }}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0 p-0.5"
                          >
                            {showPasswords[acc.id] ? (
                              <EyeOff className="w-3.5 h-3.5 text-purple-600" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                      {showPasswords[acc.id] && acc.password && (
                        <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 block mt-1 pt-1 border-t border-slate-200 dark:border-slate-800">
                          Clave: {acc.password}
                        </span>
                      )}
                    </div>

                    {/* Fila de Corte y Botón Toggle Perfiles */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800/60">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Corte</span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                          {formatDateCO(acc.dueDate)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold text-[11px] hover:bg-purple-500/20 transition-all">
                        <span>{totalProf} Perfiles ({availProf} Disp.)</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>

                  {/* Lista Desplegable de Perfiles (Se muestra sólo si isExpanded es true) */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-1">
                      <h5 className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Detalle de Perfiles ({totalProf})
                      </h5>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {acc.profiles?.map((prof) => {
                          const activeSub = prof.subscriptions?.find((s) => s.status === 'ACTIVE');

                          return (
                            <div
                              key={prof.id}
                              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                            >
                              <div className="min-w-0 pr-2">
                                <span className="font-bold text-slate-900 dark:text-white block truncate">
                                  {prof.profileName}
                                </span>
                                {prof.hasPin && (
                                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold block">
                                    PIN: {prof.pin}
                                  </span>
                                )}
                                {activeSub?.client && (
                                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex items-center space-x-1 mt-0.5 truncate">
                                    <User className="w-3 h-3 text-purple-500 shrink-0" />
                                    <span className="truncate">{activeSub.client.name}</span>
                                  </span>
                                )}
                              </div>

                              <div className="shrink-0">
                                {prof.status === 'SOLD' ? (
                                  <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/30">
                                    Asignado
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                                    Disponible
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Editar / Renovar Servicio & Perfiles (React Portal) */}
        {editingAccount &&
          createPortal(
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 animate-fade-in">
              <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-5 pb-20 md:pb-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                      <RefreshCw className="w-5 h-5 text-purple-600" />
                      <span>Editar Servicio & Perfiles</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Modifica datos de la cuenta madre ({editingAccount.product?.name}) y ajusta cada perfil individual.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingAccount(null);
                      setConfirmingDeleteAccount(false);
                    }}
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Correo de la Cuenta
                      </label>
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Contraseña de la Cuenta
                      </label>
                      <input
                        type="text"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  {/* Sección de Renovación de Fecha */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Fecha de Corte / Renovación</span>
                      </label>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleRenewDays(30)}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-extrabold shadow-sm transition-all"
                        >
                          +30 Días
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRenewDays(60)}
                          className="px-2.5 py-1 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-lg text-[10px] font-extrabold shadow-sm transition-all"
                        >
                          +60 Días
                        </button>
                      </div>
                    </div>

                    <input
                      type="date"
                      required
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Notas / Observaciones
                    </label>
                    <textarea
                      rows={2}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Notas internas de la cuenta..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  {/* Edición Interactiva de Perfiles */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        Editar Perfiles de la Cuenta ({editProfiles.length})
                      </h4>

                      <button
                        type="button"
                        onClick={() => {
                          setEditProfiles([
                            ...editProfiles,
                            {
                              profileName: `Perfil #${editProfiles.length + 1}`,
                              hasPin: false,
                              pin: '',
                              isSold: false,
                              clientId: '',
                            },
                          ]);
                        }}
                        className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Perfil</span>
                      </button>
                    </div>

                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {editProfiles.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold">Perfil #{idx + 1}</span>
                              {!p.id && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/30">
                                  Nuevo
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {!p.id && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditProfiles(editProfiles.filter((_, i) => i !== idx));
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  title="Quitar perfil nuevo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <label className="flex items-center space-x-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={p.hasPin}
                                  onChange={(e) => {
                                    const updated = [...editProfiles];
                                    updated[idx].hasPin = e.target.checked;
                                    setEditProfiles(updated);
                                  }}
                                  className="rounded bg-white dark:bg-slate-800 border-slate-300"
                                />
                                <span>¿Tiene PIN?</span>
                              </label>
                              {p.hasPin && (
                                <input
                                  type="text"
                                  placeholder="PIN (4 dígitos)"
                                  maxLength={6}
                                  value={p.pin}
                                  onChange={(e) => {
                                    const updated = [...editProfiles];
                                    updated[idx].pin = e.target.value;
                                    setEditProfiles(updated);
                                  }}
                                  className="w-24 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-mono"
                                />
                              )}
                            </div>
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder="Nombre del Perfil"
                              value={p.profileName}
                              onChange={(e) => {
                                const updated = [...editProfiles];
                                updated[idx].profileName = e.target.value;
                                setEditProfiles(updated);
                              }}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                            />
                          </div>

                          {/* Estado de venta y asignación de cliente */}
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={p.isSold}
                                onChange={(e) => {
                                  const updated = [...editProfiles];
                                  updated[idx].isSold = e.target.checked;
                                  if (!e.target.checked) {
                                    updated[idx].clientId = '';
                                  }
                                  setEditProfiles(updated);
                                }}
                                className="rounded text-purple-600"
                              />
                              <span>¿Perfil vendido?</span>
                            </label>

                            {p.isSold && (
                              <div className="relative flex-1">
                                <div className="relative">
                                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <input
                                    type="text"
                                    placeholder="Escribe nombre o teléfono del cliente..."
                                    value={
                                      editClientSearchQueries[idx] !== undefined
                                        ? editClientSearchQueries[idx]
                                        : clients?.find((c) => c.id === p.clientId)
                                          ? `${clients.find((c) => c.id === p.clientId)?.name} (${clients.find((c) => c.id === p.clientId)?.phone})`
                                          : ''
                                    }
                                    onFocus={() =>
                                      setEditOpenClientDropdowns((prev) => ({ ...prev, [idx]: true }))
                                    }
                                    onChange={(e) => {
                                      const query = e.target.value;
                                      setEditClientSearchQueries((prev) => ({ ...prev, [idx]: query }));
                                      setEditOpenClientDropdowns((prev) => ({ ...prev, [idx]: true }));
                                    }}
                                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                                  />
                                </div>

                                {editOpenClientDropdowns[idx] && (
                                  <div className="absolute z-50 left-0 right-0 mt-1 max-h-44 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 space-y-1">
                                    {clients
                                      ?.filter((c) => {
                                        const query = (editClientSearchQueries[idx] || '').toLowerCase();
                                        if (!query) return true;
                                        return c.name.toLowerCase().includes(query) || c.phone.includes(query);
                                      })
                                      .map((c) => (
                                        <button
                                          key={c.id}
                                          type="button"
                                          onClick={() => {
                                            const updated = [...editProfiles];
                                            updated[idx].clientId = c.id;
                                            setEditProfiles(updated);
                                            setEditClientSearchQueries((prev) => ({
                                              ...prev,
                                              [idx]: `${c.name} (${c.phone})`,
                                            }));
                                            setEditOpenClientDropdowns((prev) => ({ ...prev, [idx]: false }));
                                          }}
                                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center transition-all ${p.clientId === c.id
                                            ? 'bg-purple-600 text-white font-bold'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                                            }`}
                                        >
                                          <span className="font-bold">{c.name}</span>
                                          <span className="text-[11px] opacity-80 font-mono">{c.phone}</span>
                                        </button>
                                      ))}

                                    {clients?.filter((c) => {
                                      const query = (editClientSearchQueries[idx] || '').toLowerCase();
                                      if (!query) return true;
                                      return c.name.toLowerCase().includes(query) || c.phone.includes(query);
                                    }).length === 0 && (
                                        <div className="p-3 text-center text-xs text-slate-500">
                                          No se encontraron clientes con "{editClientSearchQueries[idx]}"
                                        </div>
                                      )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Acciones del Modal: Guardar + Cancelar + Eliminar (Centrados para Móvil) */}
                  <div className="pt-4 flex flex-col items-center justify-center space-y-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAccount(null);
                          setConfirmingDeleteAccount(false);
                        }}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all text-center border border-slate-200 dark:border-slate-800 sm:border-none"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        disabled={updateAccountMutation.isPending}
                        className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-950/40 flex items-center justify-center space-x-2 transition-all active:scale-95"
                      >
                        {updateAccountMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span>Guardar Cambios</span>
                      </button>
                    </div>

                    {/* Eliminar Servicio Centrado y Discreto */}
                    <div className="pt-1">
                      {!confirmingDeleteAccount ? (
                        <button
                          type="button"
                          onClick={() => setConfirmingDeleteAccount(true)}
                          className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar Servicio</span>
                        </button>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 p-2.5 bg-red-500/10 border border-red-500/30 rounded-2xl animate-in fade-in">
                          <div className="flex items-center space-x-1.5">
                            <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />
                            <span className="text-[11px] font-bold text-red-600 dark:text-red-400">¿Confirmas borrar este servicio?</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              disabled={deleteAccountMutation.isPending}
                              onClick={() => deleteAccountMutation.mutate()}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all flex items-center space-x-1"
                            >
                              {deleteAccountMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                              <span>Sí, Eliminar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingDeleteAccount(false)}
                              className="text-xs text-slate-500 underline hover:text-slate-800 dark:hover:text-slate-200 px-2"
                            >
                              No
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>,
            document.body
          )}

        {/* Modal Gestionar / Editar Plataformas (React Portal) */}
        {isNewProductModalOpen &&
          createPortal(
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 animate-fade-in">
              <div className="glass-panel w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-5 pb-20 md:pb-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-purple-600" />
                      <span>Configuración Única de Plataformas</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Registra una sola vez plataformas como Netflix o Disney+ asignando precios por perfil y por cuenta completa.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsNewProductModalOpen(false);
                      resetProductForm();
                    }}
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Selección / Editar Plataforma Registrada */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Plataformas Registradas ({products?.length || 0})
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${!editingProduct
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Crear Nueva Plataforma</span>
                    </button>

                    {products?.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => startEditingProduct(prod)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${editingProduct?.id === prod.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-500'
                          }`}
                      >
                        <Edit2 className="w-3 h-3 text-purple-400" />
                        <span>{prod.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formulario de Crear / Editar Plataforma */}
                <form onSubmit={handleProductSubmit} className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      {editingProduct ? `Editando Plataforma: ${editingProduct.name}` : 'Crear Nueva Plataforma Única'}
                    </h4>
                    {editingProduct && (
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
                      >
                        Cancelar edición
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Nombre de la Plataforma
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Netflix, Disney+, Canva Pro, ChatGPT"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Categoría
                      </label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                      >
                        <option value="STREAMING">Streaming (Películas/Música)</option>
                        <option value="SOFTWARE">Software (Herramientas/Sistemas)</option>
                        <option value="IA">Inteligencia Artificial (IA)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Número de Perfiles Max
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        required
                        value={newProdProfilesCount}
                        onChange={(e) => setNewProdProfilesCount(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  {/* Configuración Única de Precios ($ COP) */}
                  <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h5 className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      Configuración de Precios ($ COP)
                    </h5>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Costo Base de Adquisición (Cuenta Madre)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-xs font-extrabold text-slate-400">
                          $ COP
                        </span>
                        <input
                          type="number"
                          required
                          min={0}
                          step="any"
                          value={newProdCost}
                          onChange={(e) => setNewProdCost(Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-16 pr-4 py-2.5 text-xs font-mono font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        Costo de compra madre: {formatCurrency(newProdCost)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                          Precio Venta por Perfil / Pantalla
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-xs font-extrabold text-purple-600 dark:text-purple-400">
                            $ COP
                          </span>
                          <input
                            type="number"
                            required
                            min={0}
                            step="any"
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(Number(e.target.value))}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-16 pr-4 py-2.5 text-xs font-mono font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                          />
                        </div>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5 block font-semibold">
                          Por 1 perfil: {formatCurrency(newProdPrice)}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                          Precio Venta Cuenta Completa
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                            $ COP
                          </span>
                          <input
                            type="number"
                            required
                            min={0}
                            step="any"
                            value={newProdFullPrice}
                            onChange={(e) => setNewProdFullPrice(Number(e.target.value))}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-16 pr-4 py-2.5 text-xs font-mono font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                          />
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block font-semibold">
                          Cuenta entera: {formatCurrency(newProdFullPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewProductModalOpen(false);
                        resetProductForm();
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={createProductMutation.isPending || updateProductMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 flex items-center space-x-1.5 shadow-md"
                    >
                      {(createProductMutation.isPending || updateProductMutation.isPending) && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      <Check className="w-4 h-4" />
                      <span>{editingProduct ? 'Guardar Cambios' : 'Crear Plataforma'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body
          )}

        {/* Modal Registrar Nuevo Servicio con Selección de Modalidad (React Portal) */}
        {isModalOpen &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 animate-fade-in">
              <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass pb-24 md:pb-6">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Tv className="w-5 h-5 text-purple-600" />
                    <span>Registrar Nuevo Servicio / Cuenta Madre</span>
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Selección de Plataforma Única */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Plataforma / Servicio
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          resetProductForm();
                          setIsNewProductModalOpen(true);
                        }}
                        className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Gestionar Plataformas</span>
                      </button>
                    </div>

                    <select
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 font-semibold"
                    >
                      <option value="">Selecciona una plataforma...</option>
                      {products?.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} ({prod.productCategory === 'IA' ? 'IA' : prod.productCategory === 'SOFTWARE' ? 'Software' : 'Streaming'}) - Max {prod.profilesCount} perfiles
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selección de Modalidad de Venta para esta cuenta */}
                  {selectedProduct && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <label className="block text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        Modalidad de Comercialización de esta Cuenta
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAccountSaleMode('BY_PROFILES')}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${accountSaleMode === 'BY_PROFILES'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-purple-500'
                            }`}
                        >
                          <div className="font-extrabold text-xs flex items-center space-x-1.5">
                            <Layers className="w-4 h-4" />
                            <span>Venta por Perfiles Individuales</span>
                          </div>
                          <span className="text-[11px] opacity-90 mt-1 block">
                            Crea {selectedProduct.profilesCount} perfiles a {formatCurrency(selectedProduct.defaultPrice)} c/u
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAccountSaleMode('FULL_ACCOUNT')}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${accountSaleMode === 'FULL_ACCOUNT'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                            }`}
                        >
                          <div className="font-extrabold text-xs flex items-center space-x-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Venta Cuenta Completa</span>
                          </div>
                          <span className="text-[11px] opacity-90 mt-1 block">
                            Venta a 1 solo cliente por {formatCurrency(selectedProduct.fullAccountPrice || Number(selectedProduct.defaultPrice) * selectedProduct.profilesCount)}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Email de la Cuenta
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="cuenta@plataforma.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Contraseña (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Fecha de Compra
                      </label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Fecha de Vencimiento
                      </label>
                      <input
                        type="date"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  {/* Configuración Simplificada de Perfiles */}
                  <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        Configuración de Perfiles ({profiles.length})
                      </h4>
                      {accountSaleMode === 'BY_PROFILES' && (() => {
                        const maxAllowed = selectedProduct?.profilesCount || 999;
                        const isMaxReached = profiles.length >= maxAllowed;
                        return (
                          <button
                            type="button"
                            disabled={isMaxReached}
                            onClick={handleAddProfileField}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isMaxReached
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                                : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 hover:bg-purple-500/20'
                            }`}
                          >
                            {isMaxReached ? `Máximo alcanzado (${maxAllowed})` : '+ Añadir Perfil'}
                          </button>
                        );
                      })()}
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {profiles.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                            <span className="font-extrabold">Perfil #{idx + 1}</span>
                            <div className="flex items-center space-x-2">
                              <label className="flex items-center space-x-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={p.hasPin}
                                  onChange={(e) => {
                                    const updated = [...profiles];
                                    updated[idx].hasPin = e.target.checked;
                                    setProfiles(updated);
                                  }}
                                  className="rounded bg-white dark:bg-slate-800 border-slate-300"
                                />
                                <span>¿Tiene PIN?</span>
                              </label>
                              {p.hasPin && (
                                <input
                                  type="text"
                                  placeholder="PIN (4 dígitos)"
                                  maxLength={6}
                                  value={p.pin}
                                  onChange={(e) => {
                                    const updated = [...profiles];
                                    updated[idx].pin = e.target.value;
                                    setProfiles(updated);
                                  }}
                                  className="w-24 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-mono"
                                />
                              )}
                            </div>
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder="Nombre del Perfil (ej: Perfil 1, Pantalla Principal)"
                              value={p.profileName}
                              onChange={(e) => {
                                const updated = [...profiles];
                                updated[idx].profileName = e.target.value;
                                setProfiles(updated);
                              }}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                            />
                          </div>

                          {/* Venta rápida con Buscador Inteligente por Nombre o Teléfono */}
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={p.isSold}
                                onChange={(e) => {
                                  const updated = [...profiles];
                                  updated[idx].isSold = e.target.checked;
                                  if (!e.target.checked) {
                                    updated[idx].clientId = '';
                                  }
                                  setProfiles(updated);
                                }}
                                className="rounded text-purple-600"
                              />
                              <span>¿Perfil vendido?</span>
                            </label>

                            {p.isSold && (
                              <div className="relative flex-1">
                                <div className="relative">
                                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <input
                                    type="text"
                                    placeholder="Escribe el nombre o teléfono del cliente..."
                                    value={
                                      clientSearchQueries[idx] !== undefined
                                        ? clientSearchQueries[idx]
                                        : clients?.find((c) => c.id === p.clientId)
                                          ? `${clients.find((c) => c.id === p.clientId)?.name} (${clients.find((c) => c.id === p.clientId)?.phone})`
                                          : ''
                                    }
                                    onFocus={() =>
                                      setOpenClientDropdowns((prev) => ({ ...prev, [idx]: true }))
                                    }
                                    onChange={(e) => {
                                      const query = e.target.value;
                                      setClientSearchQueries((prev) => ({ ...prev, [idx]: query }));
                                      setOpenClientDropdowns((prev) => ({ ...prev, [idx]: true }));
                                    }}
                                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                                  />
                                </div>

                                {openClientDropdowns[idx] && (
                                  <div className="absolute z-50 left-0 right-0 mt-1 max-h-44 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 space-y-1">
                                    {clients
                                      ?.filter((c) => {
                                        const query = (clientSearchQueries[idx] || '').toLowerCase();
                                        if (!query) return true;
                                        return c.name.toLowerCase().includes(query) || c.phone.includes(query);
                                      })
                                      .map((c) => (
                                        <button
                                          key={c.id}
                                          type="button"
                                          onClick={() => {
                                            const updated = [...profiles];
                                            updated[idx].clientId = c.id;
                                            setProfiles(updated);
                                            setClientSearchQueries((prev) => ({
                                              ...prev,
                                              [idx]: `${c.name} (${c.phone})`,
                                            }));
                                            setOpenClientDropdowns((prev) => ({ ...prev, [idx]: false }));
                                          }}
                                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center transition-all ${p.clientId === c.id
                                            ? 'bg-purple-600 text-white font-bold'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                                            }`}
                                        >
                                          <span className="font-bold">{c.name}</span>
                                          <span className="text-[11px] opacity-80 font-mono">{c.phone}</span>
                                        </button>
                                      ))}

                                    {clients?.filter((c) => {
                                      const query = (clientSearchQueries[idx] || '').toLowerCase();
                                      if (!query) return true;
                                      return c.name.toLowerCase().includes(query) || c.phone.includes(query);
                                    }).length === 0 && (
                                        <div className="p-3 text-center text-xs text-slate-500">
                                          No se encontraron clientes con "{clientSearchQueries[idx]}"
                                        </div>
                                      )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={createAccountMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center space-x-1"
                    >
                      {createAccountMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Guardar Servicio Completo</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body
          )}

        {/* Modal Notificación Rápida por WhatsApp al Editar Cuentas */}
        <AccountNotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => {
            setIsNotificationModalOpen(false);
            setNotificationAccount(null);
          }}
          account={notificationAccount}
        />
      </div>
    </MainLayout>
  );
};
