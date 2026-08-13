export interface WhatsAppTemplateData {
  clientName: string;
  phone: string;
  productName: string;
  dueDate: Date | string;
}

export interface WhatsAppMessageResult {
  greeting: string;
  clientName: string;
  phone: string;
  productName: string;
  dueDateFormatted: string;
  generatedMessage: string;
  whatsappUrl: string;
}

export class WhatsAppDomainService {
  /**
   * Obtiene la hora actual formateada en hora de Colombia (America/Bogota)
   */
  public static getColombiaHour(date: Date = new Date()): number {
    const colombiaTimeStr = date.toLocaleString('en-US', {
      timeZone: 'America/Bogota',
      hour: 'numeric',
      hour12: false,
    });
    return parseInt(colombiaTimeStr, 10);
  }

  /**
   * Genera el saludo según la franja horaria colombiana
   */
  public static getGreetingByTime(date: Date = new Date()): string {
    const hour = this.getColombiaHour(date);
    if (hour >= 5 && hour < 12) {
      return 'Buenos días';
    } else if (hour >= 12 && hour < 19) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }

  /**
   * Formatea una fecha a la representación latina DD/MM/AAAA sin desfasamiento UTC
   */
  public static formatDateColombia(dateInput: Date | string): string {
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

    const isoMatch = date.toISOString().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, y, m, d] = isoMatch;
      return `${d}/${m}/${y}`;
    }

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Limpia y normaliza el número de celular o usuario de WhatsApp (@usuario) para almacenar en la BD
   */
  public static normalizePhone(rawPhone: string): string {
    const trimmed = rawPhone.trim();
    if (trimmed.startsWith('@') || /[a-zA-Z]/.test(trimmed)) {
      return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
    }
    let cleaned = trimmed.replace(/\D/g, '');
    if (cleaned.startsWith('57') && cleaned.length === 12) {
      cleaned = cleaned.substring(2);
    }
    return cleaned || trimmed;
  }

  /**
   * Formatea el número con prefijo 57 o usuario de WhatsApp para la URL (wa.me/57... o wa.me/usuario)
   */
  public static formatForWhatsAppUrl(phone: string): string {
    const trimmed = phone.trim();
    if (trimmed.startsWith('@') || /[a-zA-Z]/.test(trimmed)) {
      return trimmed.replace(/^@/, '');
    }
    const cleaned = this.normalizePhone(phone);
    if (cleaned.length === 10) return `57${cleaned}`;
    return cleaned;
  }

  /**
   * Construye el resultado completo y el enlace wa.me
   */
  public static generateReminder(data: WhatsAppTemplateData): WhatsAppMessageResult {
    const greeting = this.getGreetingByTime();
    const dueDateFormatted = this.formatDateColombia(data.dueDate);
    const cleanPhone = this.normalizePhone(data.phone);
    const phoneForUrl = this.formatForWhatsAppUrl(data.phone);

    const generatedMessage = `Hola ${greeting.toLowerCase()}, el día ${dueDateFormatted} terminó el mes de ${data.productName}, ¿deseas renovar el servicio?`;
    const encodedMessage = encodeURIComponent(generatedMessage);
    const whatsappUrl = `https://wa.me/${phoneForUrl}?text=${encodedMessage}`;

    return {
      greeting,
      clientName: data.clientName,
      phone: cleanPhone,
      productName: data.productName,
      dueDateFormatted,
      generatedMessage,
      whatsappUrl,
    };
  }
}
