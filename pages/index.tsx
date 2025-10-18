import { useState, useEffect } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString());
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">🎨 Hello Playground</h1>
      <p className="text-lg mb-4">Let's play with Next.js + Tailwind CSS ⚡</p>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4 w-80">
        <h2 className="text-2xl font-semibold">Counter: {count}</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setCount(count - 1)}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
          >
            ➖ Decrease
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition"
          >
            ➕ Increase
          </button>
        </div>
      </div>

      <p className="mt-8 text-sm opacity-70">
        ⏰ Current time: <span className="font-mono">{time}</span>
      </p>

      <footer className="mt-10 text-xs opacity-50">
        Built with 💜 by <strong>apipat2499</strong>
      </footer>
    </main>
  );
}