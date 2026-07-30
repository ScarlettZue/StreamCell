/**
 * Formatea un número a representación de moneda COP (Pesos Colombianos)
 */
export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$ 0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Formatea una fecha a representación latina DD/MM/AAAA en hora de Colombia
 */
export const formatDateCO = (dateInput: string | Date): string => {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-CO', {
    timeZone: 'America/Bogota',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Limpia el número de teléfono para guardar 10 dígitos sin prefijo
 */
export const cleanPhoneNumber = (rawPhone: string): string => {
  let cleaned = rawPhone.replace(/\D/g, '');
  if (cleaned.startsWith('57') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  }
  return cleaned;
};

/**
 * Genera el enlace oficial de WhatsApp anteponiendo dinámicamente el prefijo 57
 */
export const buildWhatsAppLink = (phone: string, message?: string): string => {
  const cleaned = cleanPhoneNumber(phone);
  const fullPhone = cleaned.length === 10 ? `57${cleaned}` : cleaned;
  const encodedMsg = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${fullPhone}${encodedMsg}`;
};

/**
 * Calcula los días restantes o de atraso para una fecha de vencimiento
 */
export const getDaysRemaining = (dueDateInput: string | Date): number => {
  const now = new Date();
  const dueDate = typeof dueDateInput === 'string' ? new Date(dueDateInput) : dueDateInput;
  const diffTime = dueDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
