import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import { User } from '../../../../models/User';
import { getUserIdFromReq } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const currentUserId = getUserIdFromReq(req);
  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (id === currentUserId) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  await dbConnect();

  try {
    const target = await User.findById(id);
    const current = await User.findById(currentUserId);
    if (!target || !current) {
      return res.status(404).json({ error: 'User not found' });
    }

    const already = current.following.includes(target._id);
    if (already) {
      // unfollow
      current.following = current.following.filter(
        (f) => !f.equals(target._id)
      ) as any;
      target.followers = target.followers.filter(
        (f) => !f.equals(current._id)
      ) as any;
    } else {
      current.following.push(target._id);
      target.followers.push(current._id);
    }
    await current.save();
    await target.save();

    res.status(200).json({ following: !already });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
