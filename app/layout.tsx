import "./globals.css";
import { ReactNode } from "react";
import Header from "./components/Header";

export const metadata = {
  title: "Community Hub",
  description: "Niche micro-blogging with real-time brewing rooms",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
        <Header />
        <main className="max-w-3xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
