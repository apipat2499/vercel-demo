"use client";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="flex justify-between items-center mb-8">
      <Link href="/" className="text-3xl font-bold">
        🗞️ Smart News
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/favorites" className="hover:text-blue-500">
          ❤️ Favorites
        </Link>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-3 py-1 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}