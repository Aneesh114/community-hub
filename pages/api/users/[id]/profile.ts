import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import mongoose from 'mongoose';
import { User } from '../../../../models/User';
import { Post } from '../../../../models/Post';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let { id } = req.query;
  // normalize id to string when coming from query (could be array)
  if (Array.isArray(id)) {
    id = id[0];
  }
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  await dbConnect();

  try {
    // id can be username or ObjectID
    const query: any = { username: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or = [{ _id: id }, { username: id }];
    }
    const user = await User.findOne(query)
      .select('-passwordHash')
      .populate('followers', 'username')
      .populate('following', 'username');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'username');

    res.status(200).json({
      user,
      posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
