"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

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

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const loadPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
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
      <h2 className="text-2xl font-semibold mb-4">Feed</h2>
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
            <p className="font-bold">@{p.author.username}</p>
            <p>{p.content}</p>
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
