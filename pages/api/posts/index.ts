import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/dbConnect';
import { Post } from '../../../models/Post';
import { User } from '../../../models/User';
import { getUserIdFromReq } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { content, imageUrl } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }
    try {
      const post = new Post({ author: userId, content, imageUrl });
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'GET') {
    // Get feed: personalized if user asks for following, global otherwise
    try {
      const { type } = req.query;
      const token = req.headers.authorization?.split(' ')[1];
      let posts;

      const getAll = async () => {
        return Post.find({})
          .sort({ createdAt: -1 })
          .limit(50)
          .populate('author');
      };

      const getFollowing = async () => {
        if (!token) return getAll();
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
          const user = await User.findById(decoded.userId);
          console.log('User following list:', user?.following);
          console.log('Following count:', user?.following?.length);
          if (user?.following && user.following.length > 0) {
            console.log('Filtering posts by following:', user.following);
            const filtered = await Post.find({ author: { $in: user.following } })
              .sort({ createdAt: -1 })
              .limit(50)
              .populate('author');
            console.log('Filtered posts count:', filtered.length);
            return filtered;
          }
          console.log('No following, returning all');
          return getAll();
        } catch (err) {
          console.error('Error in getFollowing:', err);
          return getAll();
        }
      };

      if (type === 'all') {
        posts = await getAll();
      } else {
        // default to following feed
        posts = await getFollowing();
      }
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).end();
  }
}
