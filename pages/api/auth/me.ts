import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import { User } from '../../../models/User';
import { getUserIdFromReq } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  await dbConnect();
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.status(200).json(user);
}