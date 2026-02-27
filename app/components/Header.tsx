"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // fetch current user
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.username) {
            setUser(data);
          }
        })
        .catch(() => {
          // token invalid, clear it
          localStorage.removeItem("token");
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <header className="border-b bg-white dark:bg-black p-4">
      <nav className="max-w-3xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold">
          Community Hub
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/feed">Feed</Link>
          <Link href="/rooms">Rooms</Link>
          {user ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                @{user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
