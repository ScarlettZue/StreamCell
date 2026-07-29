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
 * Calcula los días restantes o de atraso para una fecha de vencimiento
 */
export const getDaysRemaining = (dueDateInput: string | Date): number => {
  const now = new Date();
  const dueDate = typeof dueDateInput === 'string' ? new Date(dueDateInput) : dueDateInput;
  const diffTime = dueDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
