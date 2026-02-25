import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "Community Hub",
  description: "Niche micro-blogging with real-time brewing rooms",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
        <header className="border-b bg-white dark:bg-black p-4">
          <nav className="max-w-3xl mx-auto flex justify-between">
            <Link href="/" className="font-bold">
              Community Hub
            </Link>
            <div className="space-x-4">
              <Link href="/feed">Feed</Link>
              <Link href="/rooms">Rooms</Link>
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign Up</Link>
            </div>
          </nav>
        </header>
        <main className="max-w-3xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
