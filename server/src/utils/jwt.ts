import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret) as JwtPayload;
}
