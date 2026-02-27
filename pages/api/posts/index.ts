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
    // Get feed: personalized if user is logged in, global otherwise
    try {
      const token = req.headers.authorization?.split(' ')[1];
      let posts;

      if (token) {
        // personalized feed: only posts from users I follow
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
          const user = await User.findById(decoded.userId);
          if (user?.following.length > 0) {
            posts = await Post.find({ author: { $in: user.following } })
              .sort({ createdAt: -1 })
              .limit(50)
              .populate('author');
          } else {
            // no following, show all
            posts = await Post.find({})
              .sort({ createdAt: -1 })
              .limit(50)
              .populate('author');
          }
        } catch (err) {
          // invalid token, show global feed
          posts = await Post.find({})
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('author');
        }
      } else {
        // global feed
        posts = await Post.find({})
          .sort({ createdAt: -1 })
          .limit(50)
          .populate('author');
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
