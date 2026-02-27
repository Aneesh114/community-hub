"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ bio: "", avatarUrl: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setForm({ bio: data.bio || "", avatarUrl: data.avatarUrl || "" });
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement profile update endpoint
    alert("Profile update endpoint coming soon!");
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-2">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Avatar URL</label>
          <input
            name="avatarUrl"
            value={form.avatarUrl}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}
