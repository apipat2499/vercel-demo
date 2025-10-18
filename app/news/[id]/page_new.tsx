"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  // ✅ unwrap params ก่อนใช้
  const { id } = use(params);

  const [article, setArticle] = useState<any>(null);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    if (!id) return;

    const url = atob(decodeURIComponent(id));
    setLoading(true);

    // ลองดึงจาก Thai news API ก่อน
    const tryThaiNews = async () => {
      try {
        const res = await fetch('/api/thai-news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.article) {
            setArticle({
              url,
              title: data.article.title,
              content: data.article.content,
              imageUrl: data.article.imageUrl,
              isThaiNews: true
            });
            setLoading(false);
            return true;
          }
        }
      } catch (error) {
        console.log('Not a Thai news URL, trying fallback...');
      }
      return false;
    };

    // ถ้าไม่ใช่ข่าวไทย ใช้ allorigins
    const tryFallback = async () => {
      try {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        setArticle({ 
          url, 
          content: data.contents,
          isThaiNews: false 
        });
      } catch (err) {
        console.error("❌ Error fetching article:", err);
        setArticle({ 
          url, 
          content: "ไม่สามารถโหลดเนื้อหาได้ กรุณาลองใหม่อีกครั้ง",
          isThaiNews: false 
        });
      }
      setLoading(false);
    };

    tryThaiNews().then(success => {
      if (!success) {
        tryFallback();
      }
    });
  }, [id]);

  const summarizeWithAI = async () => {
    if (!article?.content) return;
    setSummarizing(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: article.content,
          url: article.url 
        }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("❌ Summarization failed:", err);
      setSummary("เกิดข้อผิดพลาดในการสรุปข่าว กรุณาลองใหม่อีกครั้ง");
    }
    setSummarizing(false);
  };

  if (loading) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <div className="text-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข่าว...</p>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <div className="text-center mt-20">
          <p className="text-red-600">ไม่สามารถโหลดข่าวได้</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            ← กลับหน้าหลัก
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline flex items-center gap-2 mb-6">
        ← กลับหน้าหลัก
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title || "News image"}
            className="w-full h-64 object-cover"
          />
        )}
        
        <div className="p-6">
          {article.title && (
            <h1 className="text-3xl font-bold mb-4 leading-tight">
              {article.title}
              {article.isThaiNews && <span className="ml-3 text-sm bg-green-100 text-green-700 px-2 py-1 rounded">🇹🇭 ข่าวไทย</span>}
            </h1>
          )}

          <p className="text-sm text-gray-500 mb-6 break-all">
            แหล่งที่มา: {article.url}
          </p>

          <div className="flex gap-3 mb-6">
            <button
              onClick={summarizeWithAI}
              disabled={summarizing}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-wait"
            >
              {summarizing ? "⏳ กำลังสรุป..." : "✨ สรุปข่าวด้วย AI"}
            </button>
          </div>

          {summary && (
            <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500">
              <h2 className="font-semibold text-xl mb-4 text-blue-700 dark:text-blue-300">
                🧠 สรุปข่าวโดย AI
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {summary}
              </p>
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-4">เนื้อหาข่าว</h3>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}