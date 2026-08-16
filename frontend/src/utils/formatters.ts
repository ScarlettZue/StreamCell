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
/**
 * Formatea una fecha a representación latina DD/MM/AAAA en hora de Colombia
 */
export const formatDateCO = (dateInput: string | Date): string => {
  if (!dateInput) return '-';
  if (typeof dateInput === 'string') {
    const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      return `${d}/${m}/${y}`;
    }
  }
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
 * Limpia y normaliza el número de teléfono o usuario de WhatsApp (@usuario)
 */
export const cleanPhoneNumber = (rawPhone: string): string => {
  if (!rawPhone) return '';
  const trimmed = rawPhone.trim();
  if (trimmed.startsWith('@') || /[a-zA-Z]/.test(trimmed)) {
    return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
  }
  let cleaned = trimmed.replace(/\D/g, '');
  if (cleaned.startsWith('57') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  }
  return cleaned || trimmed;
};

/**
 * Genera el enlace oficial de WhatsApp (soporta 57 + 10 dígitos o @usuario)
 */
export const buildWhatsAppLink = (phone: string, message?: string): string => {
  if (!phone) return '#';
  const trimmed = phone.trim();
  const encodedMsg = message ? `?text=${encodeURIComponent(message)}` : '';

  if (trimmed.startsWith('@') || /[a-zA-Z]/.test(trimmed)) {
    const username = trimmed.replace(/^@/, '');
    return `https://wa.me/${username}${encodedMsg}`;
  }

  const cleaned = cleanPhoneNumber(phone);
  const fullPhone = cleaned.length === 10 ? `57${cleaned}` : cleaned;
  return `https://wa.me/${fullPhone}${encodedMsg}`;
};

/**
 * Calcula los días restantes o de atraso para una fecha de vencimiento ajustada a hora de Colombia
 */
export const getDaysRemaining = (dueDateInput: string | Date): number => {
  if (!dueDateInput) return 0;

  const now = new Date();
  const nowStr = now.toLocaleDateString('sv-SE', { timeZone: 'America/Bogota' }); // 'YYYY-MM-DD'

  let dueStr = '';
  if (typeof dueDateInput === 'string') {
    const match = dueDateInput.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) {
      dueStr = match[1];
    } else {
      const d = new Date(dueDateInput);
      dueStr = isNaN(d.getTime()) ? '' : d.toLocaleDateString('sv-SE', { timeZone: 'America/Bogota' });
    }
  } else if (dueDateInput instanceof Date) {
    dueStr = isNaN(dueDateInput.getTime()) ? '' : dueDateInput.toLocaleDateString('sv-SE', { timeZone: 'America/Bogota' });
  }

  if (!dueStr) return 0;

  const [nY, nM, nD] = nowStr.split('-').map(Number);
  const [dY, dM, dD] = dueStr.split('-').map(Number);

  const dateNow = new Date(nY, nM - 1, nD);
  const dateDue = new Date(dY, dM - 1, dD);

  const diffTime = dateDue.getTime() - dateNow.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Suma una cantidad de días a una fecha (cadena YYYY-MM-DD/ISO o Date) sin traslación UTC a hora local.
 */
export const addDaysToDate = (dateInput: string | Date, days: number): Date => {
  if (!dateInput) return new Date();

  let y: number, m: number, d: number;
  if (typeof dateInput === 'string') {
    const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      y = parseInt(match[1], 10);
      m = parseInt(match[2], 10) - 1;
      d = parseInt(match[3], 10);
    } else {
      const parsed = new Date(dateInput);
      y = parsed.getFullYear();
      m = parsed.getMonth();
      d = parsed.getDate();
    }
  } else {
    y = dateInput.getFullYear();
    m = dateInput.getMonth();
    d = dateInput.getDate();
  }

  const result = new Date(y, m, d);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Formatea una fecha a formato largo latino (ej: "12 agosto de 2026")
 */
export const formatDateLongCO = (dateInput: string | Date): string => {
  if (!dateInput) return '-';
  let dateObj: Date;
  if (typeof dateInput === 'string') {
    const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    } else {
      dateObj = new Date(dateInput);
    }
  } else {
    dateObj = dateInput;
  }
  if (isNaN(dateObj.getTime())) return '-';

  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const month = monthNames[dateObj.getMonth()];
  return `${day} ${month} de ${year}`;
};

export interface IAccountChangeMessageParams {
  platformName: string;
  productName: string;
  email: string;
  password: string;
  profileName: string;
  pin?: string;
  dueDate: string | Date;
}

/**
 * Construye el mensaje predeterminado de notificación por WhatsApp al modificar la cuenta madre
 */
export const buildAccountChangeWhatsAppMessage = (params: IAccountChangeMessageParams): string => {
  const formattedDate = formatDateLongCO(params.dueDate);
  const pinText = params.pin && params.pin.trim() !== '' ? params.pin : 'Sin PIN';
  return (
    `Se ha realizado un cambio en tu servicio de ${params.platformName}:\n` +
    `${params.productName}\n` +
    `Correo: ${params.email}\n` +
    `Contraseña: ${params.password}\n` +
    `Perfil: ${params.profileName}\n` +
    `Pin: ${pinText}\n` +
    `No compartir o cambiar contraseñas, evitar tener mas de un dispositivo conectado a su pantalla para evitar suspensión de la cuenta.\n` +
    `Válido hasta ${formattedDate}`
  );
};

export interface IRenewalMessageParams {
  productName: string;
  accountEmail?: string | null;
  accountPassword?: string | null;
  profileName?: string | null;
  pin?: string | null;
  durationDays?: number;
  dueDate: string | Date;
}

/**
 * Construye el mensaje oficial de confirmación de renovación de servicio por WhatsApp
 */
export const formatRenewalWhatsAppMessage = (params: IRenewalMessageParams): string => {
  const formattedDate = formatDateLongCO(params.dueDate);
  const durationText = params.durationDays ? ` X${params.durationDays} DIAS` : ' X30 DIAS';
  const serviceHeader = `${params.productName.toUpperCase()}${durationText}`;

  const lines: string[] = [
    'Te confirmo que se ha renovado tu servicio,',
    '',
    serviceHeader,
  ];

  if (params.accountEmail) {
    lines.push(`Correo: ${params.accountEmail}`);
  }
  if (params.accountPassword) {
    lines.push(`Contraseña: ${params.accountPassword}`);
  }
  if (params.profileName) {
    lines.push(`Perfil: ${params.profileName}`);
  }
  if (params.pin && params.pin.trim() !== '') {
    lines.push(`Pin: ${params.pin}`);
  }

  lines.push('No compartir o cambiar contraseñas, evitar tener mas de un dispositivo conectado a su pantalla para evitar suspensión de la cuenta.');
  lines.push(`Válido hasta ${formattedDate}`);

  return lines.join('\n');
};

export interface ISaleAssignmentMessageParams {
  productName: string;
  accountEmail?: string | null;
  accountPassword?: string | null;
  profileName?: string | null;
  pin?: string | null;
  durationDays?: number;
  dueDate: string | Date;
}

/**
 * Construye el mensaje oficial de asignación inicial de servicio por WhatsApp tras una venta
 */
export const formatSaleAssignmentWhatsAppMessage = (params: ISaleAssignmentMessageParams): string => {
  const formattedDate = formatDateLongCO(params.dueDate);
  const durationText = params.durationDays ? ` X${params.durationDays} DIAS` : ' X30 DIAS';
  const serviceHeader = `${params.productName.toUpperCase()}${durationText}`;

  const lines: string[] = [
    'Se te ha asignado el siguiente servicio:',
    '',
    serviceHeader,
  ];

  if (params.accountEmail) {
    lines.push(`Correo: ${params.accountEmail}`);
  }
  if (params.accountPassword) {
    lines.push(`Contraseña: ${params.accountPassword}`);
  }
  if (params.profileName) {
    lines.push(`Perfil: ${params.profileName}`);
  }
  if (params.pin && params.pin.trim() !== '') {
    lines.push(`Pin: ${params.pin}`);
  }

  lines.push('No compartir o cambiar contraseñas, evitar tener mas de un dispositivo conectado a su pantalla para evitar suspensión de la cuenta.');
  lines.push(`Válido hasta ${formattedDate}`);

  return lines.join('\n');
};


