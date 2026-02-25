import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import { Post } from '../../../models/Post';
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
    // simple feed: latest posts
    try {
      const posts = await Post.find({}).sort({ createdAt: -1 }).limit(50).populate('author');
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).end();
  }
}
