import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

export function getUserIdFromReq(req: NextApiRequest): string | null {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2) return null;
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}
