import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import {
  X,
  MessageSquare,
  Calendar,
  Phone,
  Tv,
  CheckCircle2,
  ShoppingBag,
  Loader2,
  Users
} from 'lucide-react';
import { clientService } from '../services/clientService';
import { formatCurrency, formatDateCO, buildWhatsAppLink } from '../utils/formatters';
import { IClient, ISale } from '../types';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: IClient | null;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'sales' | 'debts' | 'subClients'>('services');

  const { data: fullClient, isLoading } = useQuery({
    queryKey: ['clientDetails', client?.id],
    queryFn: () => clientService.getClientById(client!.id),
    enabled: !!client?.id && isOpen,
  });

  if (!isOpen || !client) return null;

  const displayClient = fullClient || client;
  const subscriptions = displayClient.subscriptions || [];
  const sales = displayClient.sales || [];
  const debts = displayClient.debts || [];
  const subClients = displayClient.subClients || [];
  const activeSubsCount = subscriptions.filter((s) => s.status === 'ACTIVE').length;
  const totalDebt = Number(displayClient.totalDebt || 0);
  const isDistributor = displayClient.role === 'DISTRIBUIDOR';

  const whatsappUrl = buildWhatsAppLink(
    displayClient.phone,
    `Hola ${displayClient.name}, te contactamos de Streamcell respecto a tu servicio de streaming.`
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-[10000] w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all my-6 max-h-[90vh] flex flex-col">
        {/* Header con Perfil del Cliente */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 border border-white/20 flex items-center justify-center font-extrabold text-xl text-white shadow-lg flex-shrink-0">
              {displayClient.name ? displayClient.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {displayClient.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    isDistributor
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {isDistributor ? 'Distribuidor' : 'Cliente Final'}
                </span>
              </div>
              <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-blue-500" />
                  <span>{displayClient.phone}</span>
                </span>
                <span className="flex items-center space-x-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" />
                  <span>Registrado el {formatDateCO(displayClient.createdAt)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center">
            {/* Botón Chat WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all shadow-md flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Directo</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas Clave */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-6 bg-slate-100/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Servicios Activos
            </p>
            <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{activeSubsCount}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Total Suscripciones
            </p>
            <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 flex items-center space-x-1.5">
              <Tv className="w-5 h-5 text-blue-500" />
              <span>{subscriptions.length}</span>
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Saldo Deudor
            </p>
            <p className={`text-xl font-extrabold flex items-center space-x-1.5 ${totalDebt > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              <span>{formatCurrency(totalDebt)}</span>
            </p>
          </div>
        </div>

        {/* Pestañas de Navegación del Historial */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 bg-white dark:bg-slate-900 overflow-x-auto">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'services'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Cuentas & Perfiles ({subscriptions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'sales'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Historial Compras ({sales.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('debts')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'debts'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${totalDebt > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span>Deudas ({debts.length})</span>
          </button>
          {isDistributor && (
            <button
              onClick={() => setActiveTab('subClients')}
              className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'subClients'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes Asignados ({subClients.length})</span>
            </button>
          )}
        </div>

        {/* Contenido Dinámico del Historial */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[50vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-xs font-medium">Cargando historial detallado...</span>
            </div>
          ) : activeTab === 'services' ? (
            subscriptions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Tv className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
                <p className="text-xs font-semibold">Este cliente no posee suscripciones o perfiles asignados actualmente.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {subscriptions.map((sub) => {
                  const product = sub.profile?.account?.product;
                  const account = sub.profile?.account;
                  const profile = sub.profile;
                  const isActive = sub.status === 'ACTIVE';

                  return (
                    <div
                      key={sub.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-slate-50 dark:bg-slate-800/50 border-purple-500/30'
                          : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">
                            <Tv className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {product?.name || 'Servicio de Streaming'}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Perfil: <strong className="text-slate-700 dark:text-slate-300">{profile?.profileName || 'Perfil standard'}</strong>
                            </p>
                          </div>
                        </div>

                        <span
                          className={`self-start sm:self-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isActive ? 'Activo' : 'Finalizado / Expirado'}
                        </span>
                      </div>

                      {/* Detalles del Perfil & Credenciales */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">Correo de la Cuenta</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                            {account?.email || '-'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">PIN de Perfil</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white block">
                            {profile?.hasPin && profile.pin ? profile.pin : 'Sin PIN'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">Fechas de Servicio</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300 block">
                            {formatDateCO(sub.serviceStartDate)} — {formatDateCO(sub.serviceEndDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : activeTab === 'sales' ? (
            sales.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
                <p className="text-xs font-semibold">No se encontraron ventas registradas para este cliente.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sales.map((sale: ISale) => (
                  <div
                    key={sale.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Venta #{sale.code}</span>
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatCurrency(sale.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700/60 pt-2">
                      <span>Fecha: {formatDateCO(sale.createdAt)}</span>
                      <span>Ganancia: {formatCurrency(sale.netProfit)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : activeTab === 'debts' ? (
            debts.length === 0 && totalDebt === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-60 text-emerald-500" />
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">¡Este usuario no tiene deudas pendientes!</p>
                <p className="text-[11px] text-slate-500 mt-1">Todos los pagos se encuentran al día.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block uppercase">Saldo Total Deudor</span>
                    <span className="text-xl font-extrabold text-rose-700 dark:text-rose-300">{formatCurrency(totalDebt)}</span>
                  </div>
                  <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-sm">
                    Pendiente de Pago
                  </span>
                </div>

                {debts.map((d) => (
                  <div key={d.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{d.reason || 'Suscripción o días pendientes'}</p>
                      <p className="text-[11px] text-slate-500">{formatDateCO(d.createdAt)}</p>
                    </div>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{formatCurrency(Number(d.amount))}</span>
                  </div>
                ))}
              </div>
            )
          ) : (
            subClients.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
                <p className="text-xs font-semibold">Este distribuidor no posee clientes finales asignados actualmente.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {subClients.map((sc) => {
                  const scDebt = Number(sc.totalDebt || 0);
                  const scWhatsapp = buildWhatsAppLink(sc.phone, `Hola ${sc.name}, te contactamos de Streamcell.`);

                  return (
                    <div
                      key={sc.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                          {sc.name ? sc.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{sc.name}</span>
                          <span className="text-[11px] text-slate-500 font-medium">{sc.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {scDebt > 0 ? (
                          <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[11px] font-bold">
                            Deuda: {formatCurrency(scDebt)}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                            Al día
                          </span>
                        )}

                        <a
                          href={scWhatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all flex items-center space-x-1"
                          title="Chatear por WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
