"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Post {
  _id: string;
  author: { username: string };
  content: string;
  imageUrl?: string;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [feedType, setFeedType] = useState<'all' | 'following'>('following');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load posts', err);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = undefined;
    if (file) {
      const form = new FormData();
      form.append('file', file);
      const upl = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await upl.json();
      imageUrl = data.url;
    }
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content, imageUrl }),
    });
    setContent('');
    setFile(null);
    loadPosts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Feed</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFeedType('following')}
            className={`px-4 py-2 rounded ${
              feedType === 'following'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setFeedType('all')}
            className={`px-4 py-2 rounded ${
              feedType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800'
            }`}
          >
            All Posts
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2"
        />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Post
        </button>
      </form>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p._id} className="border p-4">
            <Link href={`/users/${p.author.username}`} className="font-bold text-blue-600 hover:underline">
              @{p.author.username}
            </Link>
            <p className="mt-2">{p.content}</p>
            {p.imageUrl && (
              <Image
                src={p.imageUrl}
                alt="post"
                width={500}
                height={300}
                className="max-w-full mt-2"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
