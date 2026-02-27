"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface User {
  _id: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  followers: any[];
  following: any[];
}

interface Post {
  _id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author: { username: string };
}

interface ProfileData {
  user: User;
  posts: Post[];
}

export default function UserProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [currentUser, setCurrentUser] = useState<{ username: string; id: string } | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get current user
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.username) {
            setCurrentUser({ username: data.username, id: data._id });
          }
        })
        .catch(() => console.error("failed to load current user"));
    }

    // fetch profile by id (username or ObjectID)
    fetch(`/api/users/${id}/profile`)
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setProfile(data);
          // check if current user follows this user
          if (currentUser) {
            setIsFollowing(
              data.user.followers.some((f: any) => f._id === currentUser.id)
            );
          }
        }
      })
      .catch(() => console.error("failed to load profile"))
      .finally(() => setLoading(false));
  }, [id, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${profile?.user._id}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.following);
      }
    } catch (err) {
      console.error("follow error", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>User not found</div>;

  const { user, posts } = profile;
  const isOwnProfile = currentUser?.username === user.username;

  return (
    <div>
      {/* Profile Header */}
      <div className="border-b pb-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {user.avatarUrl && (
              <Image
                src={user.avatarUrl}
                alt={user.username}
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">@{user.username}</h1>
              {user.bio && <p className="text-gray-600 dark:text-gray-400 mt-2">{user.bio}</p>}
              <div className="flex gap-6 mt-4 text-sm">
                <div>
                  <span className="font-bold">{posts.length}</span> Posts
                </div>
                <div>
                  <span className="font-bold">{user.followers.length}</span> Followers
                </div>
                <div>
                  <span className="font-bold">{user.following.length}</span> Following
                </div>
              </div>
            </div>
          </div>
          <div>
            {isOwnProfile ? (
              <Link
                href="/settings"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Profile
              </Link>
            ) : currentUser ? (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded ${
                  isFollowing
                    ? "bg-gray-300 dark:bg-gray-700 hover:bg-red-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } `}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            ) : (
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
                Login to Follow
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post._id} className="border p-4 rounded">
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2">{post.content}</p>
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt="post"
                    width={400}
                    height={300}
                    className="mt-3 rounded"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
