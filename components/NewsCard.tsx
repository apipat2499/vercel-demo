"use client";
import Link from "next/link";
import { toggleFavorite, getFromLocal } from "./utils";
import { useState, useEffect } from "react";

export default function NewsCard({ article }: { article: any }) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = getFromLocal("favorites");
    setFavorites(favs);
    setIsFav(favs.some((a: any) => a.url === article.url));
  }, [article]);

  const handleFav = () => {
    const updated = toggleFavorite(article);
    setFavorites(updated);
    setIsFav(updated.some((a: any) => a.url === article.url));
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white/60 dark:bg-gray-800/70 transition">
      <img
        src={article.urlToImage || "/vercel.svg"}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-5 flex flex-col justify-between h-60">
        <Link href={`/news/${encodeURIComponent(btoa(article.url))}`}>
          <h2 className="font-semibold text-lg hover:text-blue-500 transition line-clamp-2">
            {article.title}
          </h2>
        </Link>
        <p className="text-sm opacity-70 line-clamp-3">{article.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs opacity-50">{article.source?.name}</span>
          <button onClick={handleFav} className="text-xl">
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}