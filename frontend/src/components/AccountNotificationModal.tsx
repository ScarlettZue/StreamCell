import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Send, X, Copy, Check, MessageSquare, ShieldAlert, User } from 'lucide-react';
import { IAccount, IAccountProfile, IProfileSubscription } from '../types';
import { buildWhatsAppLink, buildAccountChangeWhatsAppMessage } from '../utils/formatters';

interface AccountNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: IAccount | null;
}

interface ActiveUserProfileItem {
  profile: IAccountProfile;
  subscription: IProfileSubscription;
  clientName: string;
  clientPhone: string;
  dueDate: string;
}

export const AccountNotificationModal: React.FC<AccountNotificationModalProps> = ({
  isOpen,
  onClose,
  account,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen || !account) return null;

  // Extraer perfiles activos que tienen un cliente asignado
  const activeItems: ActiveUserProfileItem[] = [];

  (account.profiles || []).forEach((prof) => {
    const activeSub = (prof.subscriptions || []).find(
      (sub) => sub.status === 'ACTIVE' && sub.client
    );
    if (activeSub && activeSub.client) {
      activeItems.push({
        profile: prof,
        subscription: activeSub,
        clientName: activeSub.client.name,
        clientPhone: activeSub.client.phone,
        dueDate: activeSub.serviceEndDate || account.dueDate,
      });
    }
  });

  const platformName = account.product?.name || 'Servicio Streaming';
  const productName = `${platformName.toUpperCase()} 1 PANTALLA X30 DIAS`;

  const handleCopyMessage = (msg: string, idx: number) => {
    navigator.clipboard.writeText(msg);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Notificar Cambio de Credenciales
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {account.product?.name} ({account.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeItems.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto opacity-80" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No hay usuarios activos ocupando perfiles en esta cuenta en este momento.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Los cambios en la cuenta madre fueron guardados correctamente. Los datos quedan actualizados para futuras asignaciones.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-800 dark:text-blue-200 flex items-start space-x-2.5">
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <span>
                  Se han detectado <strong>{activeItems.length}</strong> usuario(s) activo(s) en esta cuenta. Haz clic en <strong>Enviar por WhatsApp</strong> para enviar rápidamente los accesos actualizados a cada uno.
                </span>
              </div>

              <div className="space-y-4">
                {activeItems.map((item, idx) => {
                  const message = buildAccountChangeWhatsAppMessage({
                    platformName: account.product?.name || 'Servicio Streaming',
                    productName,
                    email: account.email,
                    password: account.password || '',
                    profileName: item.profile.profileName,
                    pin: item.profile.pin || undefined,
                    dueDate: item.dueDate,
                  });

                  const whatsappUrl = buildWhatsAppLink(item.clientPhone, message);

                  return (
                    <div
                      key={item.subscription.id || idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 transition-all hover:border-blue-500/40"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.clientName}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            ({item.clientPhone})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                            Perfil: {item.profile.profileName}
                          </span>
                          {item.profile.pin && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              PIN: {item.profile.pin}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Vista Previa del Mensaje */}
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                        {message}
                      </div>

                      {/* Botones de Acción */}
                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          onClick={() => handleCopyMessage(message, idx)}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center space-x-1.5 transition-colors"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar Texto</span>
                            </>
                          )}
                        </button>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition-all hover:scale-[1.02]"
                        >
                          <Send className="w-4 h-4" />
                          <span>Enviar por WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Listo / Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
