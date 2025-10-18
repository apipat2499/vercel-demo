'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับหน้าหลัก
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">เกี่ยวกับ Smart News</h1>
          <p className="text-gray-300 text-lg">แพลตฟอร์มข่าวที่ทันสมัยสำหรับคนไทย</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* About Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">📰 เกี่ยวกับแพลตฟอร์ม</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Smart News คือแพลตฟอร์มข่าวที่ออกแบบมาเพื่อคนไทยโดยเฉพาะ 
                ด้วยเทคโนโลยีที่ทันสมัยและการออกแบบที่ใช้งานง่าย
              </p>
              <p>
                เราเก็บรวบรวมข่าวสารจากแหล่งข้อมูลที่น่าเชื่อถือทั้งในและต่างประเทศ 
                มาแสดงผลในรูปแบบที่สวยงามและอ่านง่าย
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">✨ คุณสมบัติเด่น</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🇹🇭</span>
                  <h3 className="text-lg font-semibold text-white">ข่าวไทยแท้ๆ</h3>
                </div>
                <p className="text-gray-300 ml-8">
                  รวบรวมข่าวจากแหล่งข้อมูลไทยที่น่าเชื่อถือ เช่น BBC Thai และสื่อออนไลน์ชั้นนำ
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌍</span>
                  <h3 className="text-lg font-semibold text-white">ข่าวสากล</h3>
                </div>
                <p className="text-gray-300 ml-8">
                  ติดตามข่าวโลกจาก NewsAPI ครอบคลุมหลากหลายหมวดหมู่
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🤖</span>
                  <h3 className="text-lg font-semibold text-white">สรุปข่าวอัตโนมัติ</h3>
                </div>
                <p className="text-gray-300 ml-8">
                  เทคโนโลยีสรุปข่าวด้วย AI ช่วยให้อ่านข่าวได้เร็วขึ้น
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📱</span>
                  <h3 className="text-lg font-semibold text-white">รองรับทุกอุปกรณ์</h3>
                </div>
                <p className="text-gray-300 ml-8">
                  ใช้งานได้สะดวกทั้งบนมือถือ แท็บเล็ต และคอมพิวเตอร์
                </p>
              </div>
            </div>
          </div>

          {/* Technology Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">⚡ เทคโนโลยี</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <h3 className="font-semibold text-white">Next.js 13+</h3>
                <p className="text-gray-400 text-sm">React Framework</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎨</div>
                <h3 className="font-semibold text-white">Tailwind CSS</h3>
                <p className="text-gray-400 text-sm">Responsive Design</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📡</div>
                <h3 className="font-semibold text-white">RSS & API</h3>
                <p className="text-gray-400 text-sm">Real-time News</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">📧 ติดต่อเรา</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                หากมีข้อเสนอแนะหรือพบปัญหาการใช้งาน สามารถติดต่อเราได้ที่:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>contact@smartnews.th</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🌐</span>
                  <span>www.smartnews.th</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💻</span>
                  <span>GitHub: /smart-news-thailand</span>
                </div>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center text-gray-400 space-y-2">
            <p>Smart News Thailand v2.0</p>
            <p>สร้างด้วย ❤️ เพื่อคนไทย</p>
            <p className="text-sm">© 2025 Smart News. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}