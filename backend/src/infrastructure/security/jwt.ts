import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtService {
  private static getSecret(): string {
    return process.env.JWT_SECRET || 'streamcell_super_secret_jwt_key_2026';
  }

  public static generateToken(payload: TokenPayload, expiresIn: string = '7d'): string {
    return jwt.sign(payload, this.getSecret(), { expiresIn } as jwt.SignOptions);
  }

  public static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.getSecret()) as TokenPayload;
  }
}
