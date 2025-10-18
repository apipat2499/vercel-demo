"use client";
import Link from "next/link";
import { toggleFavorite, getFromLocal } from "./utils";
import { useState, useEffect } from "react";

export default function NewsCard({ article }: { article: any }) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isFav, setIsFav] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const handleSummarize = async () => {
    if (summary) {
      setShowSummary(!showSummary);
      return;
    }

    setLoadingSummary(true);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: article.url,
          description: article.description || article.excerpt || article.title, // ส่ง description เป็น fallback
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        setSummary(data.summary);
        setShowSummary(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        setSummary(errorData.error || "ไม่สามารถสรุปข่าวได้ กรุณาลองใหม่อีกครั้ง");
        setShowSummary(true);
      }
    } catch (error) {
      console.error('Error summarizing:', error);
      setSummary("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
      setShowSummary(true);
    }
    setLoadingSummary(false);
  };

  // ตรวจสอบว่าเป็นข่าวไทยหรือไม่
  const isThaiNews = article.source?.name === 'ไทยรัฐ' || 
                    article.source?.name === 'มติชน' || 
                    article.source?.name === 'ข่าวสด' || 
                    article.source?.name === 'โพสต์ทูเดย์' ||
                    /[\u0E00-\u0E7F]/.test(article.title || '');

  // Fallback images ที่สวยงาม
  const fallbackImages = [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=800&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop&q=80',
  ];

  const getImageUrl = () => {
    if (imageError) {
      // ใช้รูป fallback ตาม hash ของ title เพื่อให้แต่ละข่าวได้รูปไม่ซ้ำกัน
      const hash = article.title?.split('').reduce((acc: number, char: string) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0) || 0;
      return fallbackImages[Math.abs(hash) % fallbackImages.length];
    }
    return article.urlToImage || article.imageUrl || fallbackImages[0];
  };

  return (
    <div className="group rounded-2xl overflow-hidden bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl()}
          alt={article.title}
          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {isThaiNews && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
              <span className="text-sm">🇹🇭</span> ข่าวไทย
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <Link href={`/news/${encodeURIComponent(btoa(article.url))}`}>
          <h2 className="font-bold text-xl hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 line-clamp-2 mb-3 leading-tight">
            {article.title}
          </h2>
        </Link>
        
        <p className="text-sm opacity-70 line-clamp-3 mb-4 leading-relaxed">
          {(() => {
            const desc = article.description || article.excerpt || "ไม่มีคำอธิบาย";
            // ทำความสะอาด description อีกรอบเผื่อมีอะไรหลุดมา
            return desc
              .replace(/<[^>]+>/g, '')
              .replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'")
              .replace(/&[^;]+;/g, ' ')
              .replace(/\[…\]/g, '...')
              .replace(/\s+/g, ' ')
              .trim() || "ไม่มีคำอธิบาย";
          })()}
        </p>

        {/* แสดงสรุปข่าวถ้ามี */}
        {showSummary && summary && (
          <div className="mb-5 p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-xl border-l-4 border-gradient-to-b from-blue-500 to-purple-500 shadow-lg backdrop-blur-sm animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✨</span>
              <h4 className="font-bold text-base bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                สรุปข่าวด้วย AI
              </h4>
            </div>
            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-100 font-medium">{summary}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full">
              <span className="text-xs opacity-60">📰</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {article.source?.name || 'ไม่ทราบแหล่งที่มา'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSummarize}
              disabled={loadingSummary}
              className="relative group/btn text-xs bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-bold overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {loadingSummary ? (
                  <>
                    <span className="animate-spin text-base">⚡</span>
                    <span>กำลังสรุป...</span>
                  </>
                ) : summary ? (
                  <>
                    <span className="text-base">✨</span>
                    <span>{showSummary ? "ซ่อนสรุป" : "แสดงสรุป"}</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">🤖</span>
                    <span>สรุปด้วย AI</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
            </button>
            <button
              onClick={handleFav}
              className="text-2xl hover:scale-125 active:scale-95 transition-transform duration-200 p-2 hover:rotate-12"
              title={isFav ? "ลบออกจากรายการโปรด" : "เพิ่มในรายการโปรด"}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        {/* แสดงเวลาถ้ามี */}
        {article.publishedAt && (
          <div className="flex items-center gap-1.5 text-xs opacity-50 mt-3">
            <span>🕐</span>
            <span className="font-medium">
              {new Date(article.publishedAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}