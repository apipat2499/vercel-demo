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

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const url = atob(decodeURIComponent(id));
        console.log("Fetching article from URL:", url);
        
        // ลองใช้ thai-news-simple API ก่อน
        try {
          const response = await fetch("/api/thai-news-simple", {
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
          console.log("Thai API failed, trying allorigins");
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

  const summarizeWithAI = async () => {
    if (!article?.content && !article?.url) return;
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
    }
  };

  if (!article)
    return (
      <main className="p-6 max-w-3xl mx-auto text-gray-100">
        <Link href="/" className="text-blue-400 hover:underline">
          ← Back
        </Link>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading article...</p>
          </div>
        </div>
      </main>
    );

  return (
    <main className="p-6 max-w-3xl mx-auto text-gray-100">
      <Link href="/" className="text-blue-400 hover:underline">
        ← Back
      </Link>

      <article className="mt-6">
        <h1 className="text-3xl font-bold mb-4 text-white">
          {article.title || "บทความข่าว"}
        </h1>
        
        {article.description && (
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            {article.description}
          </p>
        )}
        
        <div className="mb-6">
          <button
            onClick={summarizeWithAI}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            ✨ สรุปข่าวด้วย AI
          </button>
        </div>

        {summary && (
          <div className="mb-6 p-4 rounded-lg bg-blue-900/20 border-l-4 border-blue-500">
            <h2 className="font-semibold text-lg mb-3 text-blue-300">🧠 สรุปข่าว:</h2>
            <p className="text-gray-200 leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <div className="text-gray-200 leading-7 text-base">
            {article.content ? 
              article.content.split('\n').map((paragraph: string, index: number) => {
                if (paragraph.trim() === '') return null;
                return (
                  <p key={index} className="mb-4 text-justify">
                    {paragraph.trim()}
                  </p>
                );
              }).filter(Boolean)
              : 
              <p className="text-gray-400 italic">ไม่มีเนื้อหาให้แสดง</p>
            }
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-500">
            <span className="font-medium">แหล่งที่มา:</span>{" "}
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline break-all"
            >
              {article.url}
            </a>
          </p>
        </div>
      </article>
    </main>
  );
}