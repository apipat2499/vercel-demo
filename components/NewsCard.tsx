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
          url: article.url  // ส่งแค่ URL ให้ API ไปดึง content เอง
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // เพิ่ม debug log
        setSummary(data.summary);
        setShowSummary(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        setSummary("ไม่สามารถสรุปข่าวได้ กรุณาลองใหม่อีกครั้ง");
        setShowSummary(true);
      }
    } catch (error) {
      console.error('Error summarizing:', error);
      setSummary("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
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

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white/90 dark:bg-gray-800/80 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-200/50 dark:border-gray-700/50">
      <img
        src={article.urlToImage || article.imageUrl || "/vercel.svg"}
        alt={article.title}
        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
      />
      <div className="p-5">
        <Link href={`/news/${encodeURIComponent(btoa(article.url))}`}>
          <h2 className="font-semibold text-lg hover:text-blue-500 transition-colors duration-200 line-clamp-2 mb-3 leading-snug">
            {article.title}
          </h2>
        </Link>
        
        <p className="text-sm opacity-70 line-clamp-3 mb-4 leading-relaxed">
          {article.description || article.excerpt || "ไม่มีคำอธิบาย"}
        </p>

        {/* แสดงสรุปข่าวถ้ามี */}
        {showSummary && summary && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-l-4 border-blue-500 shadow-sm">
            <h4 className="font-medium text-sm mb-2 text-blue-700 dark:text-blue-300 flex items-center">
              📝 สรุปข่าว
            </h4>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">{summary}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-60 font-medium">
              {article.source?.name || 'ไม่ทราบแหล่งที่มา'}
            </span>
            {isThaiNews && (
              <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-1 rounded-full font-medium">
                🇹🇭 ข่าวไทย
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSummarize}
              disabled={loadingSummary}
              className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md font-medium"
            >
              {loadingSummary ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin">⏳</span> กำลังสรุป...
                </span>
              ) : summary ? (
                showSummary ? "ซ่อนสรุป" : "แสดงสรุป"
              ) : (
                "สรุปข่าว"
              )}
            </button>
            <button 
              onClick={handleFav} 
              className="text-xl hover:scale-110 transition-transform duration-200 p-1"
              title={isFav ? "ลบออกจากรายการโปรด" : "เพิ่มในรายการโปรด"}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        {/* แสดงเวลาถ้ามี */}
        {article.publishedAt && (
          <div className="text-xs opacity-40 mt-2">
            {new Date(article.publishedAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  );
}