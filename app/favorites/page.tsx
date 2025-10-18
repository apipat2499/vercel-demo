"use client";
import { getFromLocal } from "@/components/utils";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import { useEffect, useState } from "react";

export default function Favorites() {
  const [favs, setFavs] = useState<any[]>([]);

  useEffect(() => {
    setFavs(getFromLocal("favorites"));
  }, []);

  return (
    <main className="p-6 min-h-screen">
      <Navbar />
      <h1 className="text-2xl font-bold mb-6">❤️ Favorite News</h1>

      {favs.length === 0 ? (
        <p className="text-center mt-20">No favorites yet.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {favs.map((a, i) => (
            <NewsCard key={i} article={a} />
          ))}
        </div>
      )}
    </main>
  );
}