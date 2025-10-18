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
  const [useRealNews, setUseRealNews] = useState(true); // เพิ่ม state สำหรับเลือกข่าวจริง/mock

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        if (newsType === 'thai') {
          // ดึงข่าวไทย - เลือกระหว่างจริงและ mock
          const apiEndpoint = useRealNews ? '/api/thai-news-real' : '/api/thai-news-simple';
          const res = await fetch(`${apiEndpoint}?limit=12`);
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
  }, [category, newsType, thaiSource, useRealNews]); // เพิ่ม useRealNews ใน dependency

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

      {/* Toggle สำหรับเลือกข่าวจริง/mock (เฉพาะข่าวไทย) */}
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
    </NotificationProvider>
    </main>
  );
}


