import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import { Message } from '../../../../models/Message';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  await dbConnect();
  try {
    const msgs = await Message.find({ room: id }).sort({ createdAt: 1 });
    res.status(200).json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
