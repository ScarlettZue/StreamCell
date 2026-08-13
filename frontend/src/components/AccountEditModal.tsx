import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Edit2, X, Plus, Trash2, Loader2, Check, Key, Mail, Calendar, StickyNote } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IAccount } from '../types';
import { accountService } from '../services/accountService';

interface AccountEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: IAccount | null;
  onSaved?: (updatedAccount: IAccount) => void;
}

interface EditableProfile {
  id?: string;
  profileName: string;
  hasPin: boolean;
  pin: string;
  isSold: boolean;
}

export const AccountEditModal: React.FC<AccountEditModalProps> = ({
  isOpen,
  onClose,
  account,
  onSaved,
}) => {
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [profiles, setProfiles] = useState<EditableProfile[]>([]);

  useEffect(() => {
    if (account) {
      setEmail(account.email || '');
      setPassword(account.password || '');
      setStartDate(
        account.startDate ? new Date(account.startDate).toISOString().split('T')[0] : ''
      );
      setDueDate(
        account.dueDate ? new Date(account.dueDate).toISOString().split('T')[0] : ''
      );
      setNotes(account.notes || '');
      const profs: EditableProfile[] = (account.profiles || []).map((p) => ({
        id: p.id,
        profileName: p.profileName || '',
        hasPin: Boolean(p.pin),
        pin: p.pin || '',
        isSold: p.status === 'SOLD',
      }));
      setProfiles(profs);
    }
  }, [account]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!account) throw new Error('No hay cuenta seleccionada');
      const payload = {
        email,
        password,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        notes,
        profiles: profiles.map((p) => ({
          id: p.id,
          profileName: p.profileName,
          hasPin: Boolean(p.pin && p.pin.trim() !== ''),
          pin: p.pin,
          isSold: p.isSold,
        })),
      };
      return await accountService.updateAccount(account.id, payload);
    },
    onSuccess: (updatedAccount) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      onClose();
      if (onSaved) {
        onSaved(updatedAccount);
      }
    },
  });

  if (!isOpen || !account) return null;

  const handleAddProfile = () => {
    setProfiles([
      ...profiles,
      { profileName: `Perfil ${profiles.length + 1}`, hasPin: false, pin: '', isSold: false },
    ]);
  };

  const handleRemoveProfile = (index: number) => {
    setProfiles(profiles.filter((_, i) => i !== index));
  };

  const handleProfileChange = (
    index: number,
    field: keyof EditableProfile,
    value: any
  ) => {
    const updated = [...profiles];
    updated[index] = { ...updated[index], [field]: value };
    setProfiles(updated);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Editar Cuenta Madre & Perfiles
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Plataforma: {account.product?.name || 'Servicio Streaming'}
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

        {/* Form Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
          className="p-6 overflow-y-auto space-y-5 flex-1"
        >
          {/* Correo y Contraseña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>Correo de Acceso</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-mono font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-purple-500" />
                <span>Contraseña</span>
              </label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-mono font-medium focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Fecha Inicio</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Fecha de Vencimiento</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center space-x-1.5">
              <StickyNote className="w-3.5 h-3.5 text-slate-500" />
              <span>Notas de la Cuenta</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas opcionales..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Perfiles de la Cuenta */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Perfiles de la Cuenta ({profiles.length})
              </h4>
              <button
                type="button"
                onClick={handleAddProfile}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Perfil</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {profiles.map((prof, idx) => (
                <div
                  key={prof.id || idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Nombre del Perfil"
                      value={prof.profileName}
                      onChange={(e) =>
                        handleProfileChange(idx, 'profileName', e.target.value)
                      }
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
                    />
                    <input
                      type="text"
                      placeholder="PIN de 4 dígitos (opcional)"
                      maxLength={4}
                      value={prof.pin}
                      onChange={(e) => handleProfileChange(idx, 'pin', e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  {profiles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProfile(idx)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
                      title="Eliminar perfil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold hover:shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
