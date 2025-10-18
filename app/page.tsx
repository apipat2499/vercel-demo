"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import NotificationProvider from "@/providers/NotificationProvider";

const categories = ["general", "business", "technology", "sports", "health", "entertainment", "science"];
const thaiSources = ["all", "thairath", "matichon", "khaosod", "posttoday"];

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(true);
  const [newsType, setNewsType] = useState<'international' | 'thai'>('thai');
  const [thaiSource, setThaiSource] = useState("all");
  const [useRealNews, setUseRealNews] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        if (newsType === 'thai') {
          const apiEndpoint = useRealNews ? '/api/thai-news-real' : '/api/thai-news-simple';
          const res = await fetch(`${apiEndpoint}?limit=12`);
          const data = await res.json();
          setArticles(data.articles || []);
        } else {
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
  }, [category, newsType, thaiSource, useRealNews]);

  return (
    <NotificationProvider>
      <main className="p-6 min-h-screen">
        <Navbar />

        {/* News Type Selection */}
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

        {/* Real/Mock Data Toggle for Thai News */}
        {newsType === 'thai' && (
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium">แหล่งข้อมูล:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setUseRealNews(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  useRealNews 
                    ? "bg-green-600 text-white shadow-md" 
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                📰 ข่าวจริง
              </button>
              <button
                onClick={() => setUseRealNews(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  !useRealNews 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                🧪 ข้อมูลทดสอบ
              </button>
            </div>
            <span className="text-xs opacity-60 ml-2">
              {useRealNews ? "ดึงข่าวจาก BBC Thai และแหล่งอื่นๆ" : "ใช้ข้อมูลตัวอย่างสำหรับทดสอบ"}
            </span>
          </div>
        )}

        {/* Categories for International News */}
        {newsType === 'international' && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full transition ${
                  category === cat 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Thai Sources for Mock Data */}
        {newsType === 'thai' && !useRealNews && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-gray-600 dark:text-gray-400 py-2 px-2">แหล่งข่าว:</span>
            {thaiSources.map((source) => (
              <button
                key={source}
                onClick={() => setThaiSource(source)}
                className={`px-4 py-2 rounded-full transition ${
                  thaiSource === source 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {source === 'all' ? 'ทั้งหมด' : source}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
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
    </NotificationProvider>
  );
}