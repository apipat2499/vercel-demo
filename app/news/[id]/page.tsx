"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  // ✅ unwrap params ก่อนใช้
  const { id } = use(params);

  const [article, setArticle] = useState<any>(null);
  const [summary, setSummary] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const url = atob(decodeURIComponent(id));

    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle({ url, content: data.contents });
      })
      .catch((err) => console.error("❌ Error fetching article:", err));
  }, [id]);

  const summarizeWithAI = async () => {
    if (!article?.content) return;
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: article.content }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("❌ Summarization failed:", err);
    }
  };

  if (!article)
    return <p className="p-10 text-center text-gray-400">Loading article...</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto text-gray-100">
      <Link href="/" className="text-blue-400 hover:underline">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold my-4">🗞️ Article Detail</h1>
      <p className="text-sm opacity-70 mb-4 break-all">Source: {article.url}</p>

      <button
        onClick={summarizeWithAI}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
      >
        ✨ Summarize with AI
      </button>

      {summary && (
        <div className="mt-6 p-4 rounded-lg bg-gray-800">
          <h2 className="font-semibold text-lg mb-2">🧠 Summary:</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </main>
  );
}