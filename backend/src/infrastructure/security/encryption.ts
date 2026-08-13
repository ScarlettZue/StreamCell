import crypto from 'crypto';

export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-cbc';

  private static getKey(): Buffer {
    const rawKey = process.env.ENCRYPTION_KEY || 'streamcell_32_byte_secret_key_enc!';
    return crypto.scryptSync(rawKey, 'streamcell_salt', 32);
  }

  public static encrypt(text: string): string {
    if (!text) return text;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.getKey(), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  public static decrypt(cipherText: string): string {
    if (!cipherText || typeof cipherText !== 'string' || !cipherText.includes(':')) return cipherText;
    try {
      const [ivHex, encryptedText] = cipherText.split(':');
      if (!ivHex || !encryptedText) return cipherText;
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(this.ALGORITHM, this.getKey(), iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      return cipherText;
    }
  }
}
