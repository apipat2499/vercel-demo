"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";

const categories = ["general", "business", "technology", "sports", "health", "entertainment", "science"];

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=12&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
      );
      const data = await res.json();
      setArticles(data.articles || []);
      setLoading(false);
    }
    loadNews();
  }, [category]);

  return (
    <main className="p-6 min-h-screen">
      <Navbar />

      <div className="flex gap-3 overflow-x-auto mb-8 pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full border ${
              category === c ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
            } transition`}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center mt-20 animate-pulse">⏳ Loading...</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <NewsCard key={i} article={a} />
          ))}
        </div>
      )}
    </main>
  );
}


