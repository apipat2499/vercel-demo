import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "Stay hungry, stay foolish.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "The best way to predict the future is to invent it.",
  "Simplicity is the soul of efficiency.",
  "Dream big. Start small. Act now."
];

export default function Home() {
  const [count, setCount] = useState(0);
  const [dark, setDark] = useState(true);
  const [time, setTime] = useState("");
  const [quote, setQuote] = useState(quotes[0]);
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => setDark(!dark);
  const randomQuote = () => setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

  const spawnParticle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Math.random();

    setParticles([...particles, { x, y }]);
    setTimeout(() => setParticles((p) => p.slice(1)), 600);
  };

  return (
    <main
      className={`relative min-h-screen flex flex-col items-center justify-center transition-colors duration-700 ${
        dark
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white"
          : "bg-gradient-to-br from-yellow-100 via-pink-100 to-white text-gray-800"
      }`}
    >
      {/* Gradient animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-blue-500/10 blur-3xl"
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="absolute top-5 right-5">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-white/30 hover:bg-white/10 transition"
        >
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <motion.h1
        className="text-6xl font-extrabold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ✨ Vercel Playground ✨
      </motion.h1>

      <p className="text-lg opacity-80 mb-8 text-center max-w-md">
        A fun interactive demo using <strong>Next.js + Tailwind + Framer Motion</strong>
      </p>

      {/* Counter Card */}
      <motion.div
        className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 flex flex-col items-center space-y-4 w-80"
        whileHover={{ scale: 1.05 }}
      >
        <AnimatePresence mode="wait">
          <motion.h2
            key={count}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold"
          >
            Counter: {count}
          </motion.h2>
        </AnimatePresence>
        <div className="flex space-x-4">
          <button
            onClick={() => setCount(count - 1)}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
          >
            ➖
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition"
          >
            ➕
          </button>
        </div>
      </motion.div>

      {/* Time & Quote */}
      <div className="mt-10 text-center">
        <p className="text-xl font-mono mb-3">🕒 {time}</p>
        <motion.blockquote
          key={quote}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="italic opacity-90 text-lg max-w-md"
        >
          “{quote}”
        </motion.blockquote>
        <button
          onClick={randomQuote}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white"
        >
          🔄 New Quote
        </button>
      </div>

      {/* Particle Button */}
      <div className="mt-10 relative">
        <button
          onClick={spawnParticle}
          className="px-6 py-3 text-white bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full font-semibold shadow-lg hover:scale-105 transition"
        >
          🌟 Tap for Magic
        </button>
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-400 rounded-full"
            initial={{ opacity: 1, x: p.x, y: p.y, scale: 1 }}
            animate={{ opacity: 0, y: p.y - 40, scale: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </div>

      <footer className="mt-16 text-xs opacity-60">
        Built by <strong>apipat2499</strong> • Powered by Next.js & Tailwind ⚡
      </footer>
    </main>
  );
}