export interface WhatsAppTemplateData {
  clientName: string;
  phone: string;
  productName: string;
  dueDate: Date;
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
   * Formatea una fecha a la representación latina DD/MM/AAAA en hora de Colombia
   */
  public static formatDateColombia(date: Date): string {
    return date.toLocaleDateString('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Limpia y normaliza el número de celular para almacenar en la BD (10 dígitos colombianos sin prefijo 57)
   */
  public static normalizePhone(rawPhone: string): string {
    let cleaned = rawPhone.replace(/\D/g, '');
    if (cleaned.startsWith('57') && cleaned.length === 12) {
      cleaned = cleaned.substring(2);
    }
    return cleaned;
  }

  /**
   * Formatea el número con prefijo 57 para la URL oficial de WhatsApp (wa.me/57...)
   */
  public static formatForWhatsAppUrl(phone: string): string {
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

    const generatedMessage = `Hola ${greeting.toLowerCase()} ${data.clientName}, el día ${dueDateFormatted} terminó el mes de ${data.productName}, ¿deseas renovar el servicio?`;
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
