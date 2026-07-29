import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/MainLayout';
import { AlertTriangle, MessageSquare, RefreshCw, UserX, Clock, CheckCircle2, Loader2, X, Send } from 'lucide-react';
import { accountService } from '../services/accountService';
import { whatsappService } from '../services/whatsappService';
import { subscriptionService } from '../services/subscriptionService';
import { formatDateCO, getDaysRemaining } from '../utils/formatters';
import { IProfileSubscription, IWhatsAppReminder } from '../types';

export const ExpirationsPage: React.FC = () => {
  const [selectedSub, setSelectedSub] = useState<IProfileSubscription | null>(null);

  // WhatsApp Modal State
  const [wspModalOpen, setWspModalOpen] = useState(false);
  const [reminderData, setReminderData] = useState<IWhatsAppReminder | null>(null);
  const [editedMessage, setEditedMessage] = useState('');

  // Revoke Modal State
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [withDebt, setWithDebt] = useState(false);
  const [debtAmount, setDebtAmount] = useState<number>(0);
  const [reason, setReason] = useState('');

  // Renew Modal State
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [saleCost, setSaleCost] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);

  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts,
  });

  const activeSubscriptions: IProfileSubscription[] = [];
  accounts?.forEach((acc) => {
    acc.profiles.forEach((prof) => {
      prof.subscriptions?.forEach((sub) => {
        if (sub.status === 'ACTIVE') {
          activeSubscriptions.push({
            ...sub,
            profile: {
              ...prof,
              account: acc,
            },
          });
        }
      });
    });
  });

  activeSubscriptions.sort(
    (a, b) => new Date(a.serviceEndDate).getTime() - new Date(b.serviceEndDate).getTime()
  );

  const whatsappMutation = useMutation({
    mutationFn: (sub: IProfileSubscription) =>
      whatsappService.generateReminder({
        clientName: sub.client?.name || 'Cliente',
        phone: sub.client?.phone || '',
        productName: `${sub.profile?.account?.product?.name} (${sub.profile?.profileName})`,
        dueDate: sub.serviceEndDate,
      }),
    onSuccess: (data) => {
      setReminderData(data);
      setEditedMessage(data.generatedMessage);
      setWspModalOpen(true);
    },
  });

  const revokeMutation = useMutation({
    mutationFn: () =>
      subscriptionService.revokeSubscription({
        subscriptionId: selectedSub!.id,
        withDebt,
        debtAmount,
        reason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setRevokeModalOpen(false);
      setSelectedSub(null);
    },
  });

  const renewMutation = useMutation({
    mutationFn: () =>
      subscriptionService.renewSubscription({
        subscriptionId: selectedSub!.id,
        saleCost,
        salePrice,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      setRenewModalOpen(false);
      setSelectedSub(null);
    },
  });

  const handleSendWhatsApp = () => {
    if (!reminderData) return;
    const encoded = encodeURIComponent(editedMessage);
    const url = `https://wa.me/${reminderData.phone}?text=${encoded}`;
    window.open(url, '_blank');
    setWspModalOpen(false);
  };

  return (
    <MainLayout title="Alertas de Vencimiento de Corte" subtitle="Gestión de notificaciones de WhatsApp con saludo horario y retiros con/sin deuda">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>Suscripciones Activas Próximas a Vencer</span>
          </h3>
        </div>

        {/* Tabla de Alertas */}
        <div className="glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Producto & Perfil</th>
                <th className="px-6 py-4">Credenciales</th>
                <th className="px-6 py-4">Fecha de Corte</th>
                <th className="px-6 py-4">Estado / Días</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Cargando alertas de vencimiento...
                  </td>
                </tr>
              ) : activeSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No hay suscripciones activas en este momento.
                  </td>
                </tr>
              ) : (
                activeSubscriptions.map((sub) => {
                  const daysLeft = getDaysRemaining(sub.serviceEndDate);
                  const isExpired = daysLeft <= 0;
                  const isWarning = daysLeft <= 3 && !isExpired;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {sub.client?.name}
                        <span className="block text-xs font-normal text-slate-500 dark:text-slate-400 font-mono">{sub.client?.phone}</span>
                      </td>

                      <td className="px-6 py-4 text-xs">
                        <span className="font-bold text-slate-900 dark:text-slate-200">{sub.profile?.account?.product?.name}</span>
                        <span className="block text-slate-500 dark:text-slate-400">{sub.profile?.profileName}</span>
                      </td>

                      <td className="px-6 py-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                        <span>{sub.profile?.account?.email}</span>
                        {sub.profile?.hasPin && <span className="block text-amber-700 dark:text-amber-300 font-bold">PIN: {sub.profile.pin}</span>}
                      </td>

                      <td className="px-6 py-4 text-xs font-bold text-slate-900 dark:text-white">{formatDateCO(sub.serviceEndDate)}</td>

                      <td className="px-6 py-4">
                        {isExpired ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Vencido hace {Math.abs(daysLeft)} días</span>
                          </span>
                        ) : isWarning ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Vence en {daysLeft} días</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{daysLeft} días restantes</span>
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => whatsappMutation.mutate(sub)}
                            className="p-2 bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl transition-all"
                            title="Enviar Recordatorio por WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setSaleCost(Number(sub.profile?.account?.product?.defaultCost || 0));
                              setSalePrice(Number(sub.profile?.account?.product?.defaultPrice || 0));
                              setRenewModalOpen(true);
                            }}
                            className="p-2 bg-brand-purple/20 text-brand-purple dark:text-brand-purple-light hover:bg-brand-purple/30 border border-brand-purple/30 rounded-xl transition-all"
                            title="Renovar (+30 días)"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setWithDebt(isExpired);
                              setDebtAmount(isExpired ? 5000 : 0);
                              setRevokeModalOpen(true);
                            }}
                            className="p-2 bg-rose-600/20 text-rose-700 dark:text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 rounded-xl transition-all"
                            title="Retirar Servicio (Con/Sin Deuda)"
                          >
                            <UserX className="w-4 h-4" />
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

        {/* Modal WhatsApp Editable */}
        {wspModalOpen && reminderData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-glass">
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Enviar Recordatorio por WhatsApp</span>
                </h3>
                <button onClick={() => setWspModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <p className="text-slate-600 dark:text-slate-400">Cliente: <strong className="text-slate-900 dark:text-white">{reminderData.clientName}</strong></p>
                  <p className="text-slate-600 dark:text-slate-400">Saludo Detectado (COT): <strong className="text-brand-purple dark:text-brand-purple-light">{reminderData.greeting}</strong></p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Mensaje Editable antes de enviar</label>
                  <textarea
                    rows={4}
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-sans"
                  ></textarea>
                </div>

                <div className="pt-3 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setWspModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSendWhatsApp}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 shadow-glow flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Abrir Chat de WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Retirar Servicio */}
        {revokeModalOpen && selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-glass">
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <UserX className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>Retirar Servicio de Perfil</span>
                </h3>
                <button onClick={() => setRevokeModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); revokeMutation.mutate(); }} className="space-y-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <p className="text-slate-600 dark:text-slate-400">Cliente: <strong className="text-slate-900 dark:text-white">{selectedSub.client?.name}</strong></p>
                  <p className="text-slate-600 dark:text-slate-400">Perfil: <strong className="text-brand-purple dark:text-brand-purple-light">{selectedSub.profile?.account?.product?.name} ({selectedSub.profile?.profileName})</strong></p>
                </div>

                <div className="space-y-3 p-3 bg-slate-100 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800">
                  <label className="flex items-center space-x-2 text-xs font-bold text-rose-700 dark:text-rose-300">
                    <input
                      type="checkbox"
                      checked={withDebt}
                      onChange={(e) => setWithDebt(e.target.checked)}
                      className="rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-rose-600"
                    />
                    <span>¿Registrar saldo deudor al cliente por atraso?</span>
                  </label>

                  {withDebt && (
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Monto de Deuda ($)</label>
                        <input
                          type="number"
                          step="500"
                          required
                          value={debtAmount}
                          onChange={(e) => setDebtAmount(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-rose-700 dark:text-rose-400 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Motivo del Retiro</label>
                        <input
                          type="text"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Atraso de días en pago de mensualidad"
                          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setRevokeModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={revokeMutation.isPending}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 flex items-center space-x-1"
                  >
                    {revokeMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirmar Retiro</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Renovar */}
        {renewModalOpen && selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-glass">
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-brand-purple" />
                  <span>Renovar Servicio (+30 Días)</span>
                </h3>
                <button onClick={() => setRenewModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); renewMutation.mutate(); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Costo Real ($)</label>
                    <input
                      type="number"
                      step="500"
                      required
                      value={saleCost}
                      onChange={(e) => setSaleCost(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Precio Cobrado ($)</label>
                    <input
                      type="number"
                      step="500"
                      required
                      value={salePrice}
                      onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setRenewModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={renewMutation.isPending}
                    className="px-5 py-2.5 rounded-xl bg-brand-gradient text-white text-xs font-semibold hover:bg-brand-gradient-hover shadow-glow flex items-center space-x-1"
                  >
                    {renewMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirmar Renovación</span>
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
