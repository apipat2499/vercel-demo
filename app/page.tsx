"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";

const categories = ["general", "business", "technology", "sports", "health", "entertainment", "science"];
const thaiSources = ["all", "thairath", "matichon", "khaosod", "posttoday"];

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(true);
  const [newsType, setNewsType] = useState<'international' | 'thai'>('international');
  const [thaiSource, setThaiSource] = useState("all");

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        if (newsType === 'thai') {
          // ดึงข่าวไทย
          const res = await fetch(`/api/thai-news?source=${thaiSource}&limit=12`);
          const data = await res.json();
          setArticles(data.articles || []);
        } else {
          // ดึงข่าวต่างประเทศ
          const res = await fetch(
            `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=12&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
          );
          const data = await res.json();
          setArticles(data.articles || []);
        }
      } catch (error) {
        console.error('Error loading news:', error);
        setArticles([]);
      }
      setLoading(false);
    }
    loadNews();
  }, [category, newsType, thaiSource]);

  return (
    <main className="p-6 min-h-screen">
      <Navbar />

      {/* เลือกประเภทข่าว */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setNewsType('international')}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            newsType === 'international' 
              ? "bg-blue-600 text-white shadow-md" 
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          🌍 ข่าวต่างประเทศ
        </button>
        <button
          onClick={() => setNewsType('thai')}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            newsType === 'thai' 
              ? "bg-green-600 text-white shadow-md" 
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          🇹🇭 ข่าวไทย
        </button>
      </div>

      {/* แสดงตัวเลือกตามประเภทข่าว */}
      {newsType === 'international' ? (
        <div className="flex gap-3 overflow-x-auto mb-8 pb-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full border whitespace-nowrap ${
                category === c ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              } transition`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto mb-8 pb-2">
          {thaiSources.map((source) => (
            <button
              key={source}
              onClick={() => setThaiSource(source)}
              className={`px-4 py-2 rounded-full border whitespace-nowrap ${
                thaiSource === source ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              } transition`}
            >
              {source === 'all' ? 'ทั้งหมด' : 
               source === 'thairath' ? 'ไทยรัฐ' :
               source === 'matichon' ? 'มติชน' :
               source === 'khaosod' ? 'ข่าวสด' :
               source === 'posttoday' ? 'โพสต์ทูเดย์' : source}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข่าว...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-600">ไม่พบข่าวในหมวดหมู่นี้</p>
        </div>
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


