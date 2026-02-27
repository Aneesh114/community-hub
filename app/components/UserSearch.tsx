"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      // Search for user by username
      const res = await fetch(`/api/users/${searchQuery}/profile`);
      if (res.ok) {
        router.push(`/users/${searchQuery}`);
        setSearchQuery("");
      } else {
        alert("User not found");
      }
    } catch (err) {
      console.error("Search error", err);
      alert("Error searching for user");
    } finally {
      setSearching(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
      />
      <button
        type="submit"
        disabled={searching}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {searching ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
