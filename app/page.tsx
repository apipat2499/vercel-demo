"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import NotificationProvider from "@/providers/NotificationProvider";

const categories = ["general", "business", "technology", "sports", "health", "entertainment", "science"];

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [allArticles, setAllArticles] = useState<any[]>([]); // เก็บข่าวทั้งหมด
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(true);
  const [newsType, setNewsType] = useState<'international' | 'thai'>('thai');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      setCurrentPage(1); // รีเซ็ตหน้ากลับไปหน้า 1
      try {
        if (newsType === 'thai') {
          // ใช้ข่าวจริงเท่านั้น
          const res = await fetch('/api/thai-news-real?limit=50');
          const data = await res.json();
          setAllArticles(data.articles || []);
        } else {
          const res = await fetch(
            `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=100&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
          );
          const data = await res.json();
          setAllArticles(data.articles || []);
        }
      } catch (error) {
        console.error('Error loading news:', error);
        setAllArticles([]);
      }
      setLoading(false);
    }
    loadNews();
  }, [category, newsType]);

  // Update displayed articles based on current page
  useEffect(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    setArticles(allArticles.slice(startIndex, endIndex));
  }, [allArticles, currentPage]);

  const totalPages = Math.ceil(allArticles.length / articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NotificationProvider>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
        <div className="max-w-7xl mx-auto p-6">
          <Navbar />

          {/* Hero Section */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
              ข่าวสาร AI สรุปให้
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              ติดตามข่าวจากทั่วโลก พร้อมสรุปด้วยปัญญาประดิษฐ์
            </p>
          </div>

          {/* News Type Selection */}
          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => setNewsType('international')}
              className={`px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
                newsType === 'international'
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              🌍 ข่าวต่างประเทศ
            </button>
            <button
              onClick={() => setNewsType('thai')}
              className={`px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
                newsType === 'thai'
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              🇹🇭 ข่าวไทย
            </button>
          </div>


          {/* Categories for International News */}
          {newsType === 'international' && (
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
                    category === cat
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}


          {/* Loading State */}
          {loading ? (
            <div className="text-center mt-20">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 opacity-20"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold animate-pulse">กำลังโหลดข่าว...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center mt-20 p-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl">
              <div className="text-6xl mb-4">📰</div>
              <p className="text-gray-600 dark:text-gray-400 text-xl font-semibold mb-4">ไม่พบข่าวในหมวดหมู่นี้</p>
              {newsType === 'international' && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    💡 <strong>หมายเหตุ:</strong> NewsAPI free tier ไม่รองรับ production domain
                    <br />
                    กรุณาลองใช้ <strong>"ข่าวไทย"</strong> แทน ซึ่งดึงข้อมูลจริงจาก BBC Thai และแหล่งอื่นๆ
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  พบ <span className="font-bold text-blue-600 dark:text-blue-400">{allArticles.length}</span> ข่าว
                  {totalPages > 1 && (
                    <span className="ml-2">
                      (หน้า {currentPage} จาก {totalPages})
                    </span>
                  )}
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                {articles.map((a, i) => (
                  <NewsCard key={`${currentPage}-${i}`} article={a} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← ก่อนหน้า
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-110"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ถัดไป →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </NotificationProvider>
  );
}