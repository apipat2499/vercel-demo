"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NewsDetailProps {
  params: Promise<{ id: string }>;
}

export default function NewsDetail({ params }: NewsDetailProps) {
  const [id, setId] = useState<string>("");
  
  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  const [article, setArticle] = useState<any>(null);
  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [autoSummarize, setAutoSummarize] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const url = atob(decodeURIComponent(id));
        console.log("Fetching article from URL:", url);

        // ลองใช้ thai-news API ก่อน
        try {
          const response = await fetch("/api/thai-news", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.article) {
              setArticle(data.article);
              return;
            }
          }
        } catch (error) {
          console.log("Thai API failed, trying fallback");
        }

        // Fallback: ใช้ allorigins
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        setArticle({
          url,
          title: "บทความ",
          content: data.contents,
          description: "เนื้อหาจากเว็บไซต์"
        });
      } catch (err) {
        console.error("❌ Error fetching article:", err);
        // แสดง mock article หากดึงไม่ได้
        setArticle({
          url: atob(decodeURIComponent(id)),
          title: "ไม่สามารถโหลดบทความได้",
          content: "ขออภัย ไม่สามารถโหลดเนื้อหาบทความนี้ได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง",
          description: "เกิดข้อผิดพลาดในการโหลดข้อมูล"
        });
      }
    };

    fetchArticle();
  }, [id]);

  // Auto-summarize เมื่อโหลดบทความสำเร็จ
  useEffect(() => {
    if (article && autoSummarize && !summary) {
      summarizeWithAI();
    }
  }, [article, autoSummarize]);

  const summarizeWithAI = async () => {
    if (!article?.content && !article?.url) return;
    setLoadingSummary(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: article.url,
          content: article.content
        }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("❌ Summarization failed:", err);
      setSummary("ไม่สามารถสรุปข่าวได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoadingSummary(false);
    }
  };

  if (!article)
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
        <div className="max-w-4xl mx-auto p-6">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-lg transition-colors mb-8">
            ← กลับหน้าหลัก
          </Link>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 opacity-20"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold animate-pulse">กำลังโหลดบทความ...</p>
            </div>
          </div>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      <div className="max-w-4xl mx-auto p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-lg transition-colors mb-8">
          ← กลับหน้าหลัก
        </Link>

        <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {article.imageUrl && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          <div className="p-8 lg:p-12">
            <h1 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              {article.title || "บทความข่าว"}
            </h1>

            {article.description && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-medium">
                {article.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={summarizeWithAI}
                disabled={loadingSummary}
                className="relative group/btn bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loadingSummary ? (
                    <>
                      <span className="animate-spin text-xl">⚡</span>
                      <span>กำลังสรุป...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🤖</span>
                      <span>สรุปข่าวด้วย AI</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
              </button>

              <button
                onClick={() => setAutoSummarize(!autoSummarize)}
                className={`px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-md ${
                  autoSummarize
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {autoSummarize ? "✓ สรุปอัตโนมัติ" : "สรุปอัตโนมัติ"}
              </button>
            </div>

            {summary && (
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-2xl border-l-4 border-gradient-to-b from-blue-500 to-purple-500 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">✨</span>
                  <h2 className="font-black text-2xl bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                    สรุปข่าวด้วย AI
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-gray-800 dark:text-gray-100 font-medium">{summary}</p>
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 dark:text-gray-200 leading-8">
                {article.content ?
                  article.content.split('\n').map((paragraph: string, index: number) => {
                    if (paragraph.trim() === '') return null;
                    return (
                      <p key={index} className="mb-5 text-justify">
                        {paragraph.trim()}
                      </p>
                    );
                  }).filter(Boolean)
                  :
                  <p className="text-gray-400 dark:text-gray-500 italic">ไม่มีเนื้อหาให้แสดง</p>
                }
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-2xl">🔗</span>
                <div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">แหล่งที่มา:</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline break-all text-sm"
                  >
                    {article.url}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}