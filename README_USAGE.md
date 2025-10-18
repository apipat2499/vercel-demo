# 📰 ข่าวสาร AI สรุปให้ - Thai News Portal with AI Summarization

เว็บแอปพลิเคชันอ่านข่าวที่รวบรวมข่าวสารจากแหล่งต่างๆ ทั้งในและต่างประเทศ พร้อมระบบสรุปข่าวด้วยปัญญาประดิษฐ์ (AI) ที่ทันสมัย

## ✨ คุณสมบัติเด่น

### 🌍 ข่าวจากหลากหลายแหล่ง
- **ข่าวต่างประเทศ**: ดึงข่าวจาก NewsAPI.org ครอบคลุม 7 หมวดหมู่
  - ข่าวทั่วไป (General)
  - ธุรกิจ (Business)
  - เทคโนโลยี (Technology)
  - กีฬา (Sports)
  - สุขภาพ (Health)
  - บันเทิง (Entertainment)
  - วิทยาศาสตร์ (Science)

- **ข่าวไทย**: รวบรวมจากแหล่งข่าวชั้นนำในประเทศไทย
  - BBC Thai
  - ข่าวสด (Khaosod)
  - TNN ข่าว
  - ผู้จัดการออนไลน์ (Manager Online)
  - ไทยรัฐ (Thairath)
  - มติชน (Matichon)
  - โพสต์ทูเดย์ (Post Today)

### 🤖 ระบบสรุปข่าวด้วย AI
- สรุปข่าวอัตโนมัติด้วย OpenAI GPT-4o-mini
- รองรับทั้งภาษาไทยและภาษาอังกฤษ
- ตรวจจับภาษาอัตโนมัติ
- สรุปเนื้อหาให้กระชับ 3-4 ประโยค โดยเน้นประเด็นสำคัญ
- ระบบ Fallback หากเกิดข้อผิดพลาด จะใช้การสรุปแบบง่าย

### 🎨 UI/UX ที่สวยงามและทันสมัย
- ออกแบบด้วย Tailwind CSS 4
- Gradient สีสันสวยงาม
- Animation ที่ลื่นไหล
- รองรับ Dark Mode
- Responsive Design - ใช้งานได้บนทุกอุปกรณ์

### 💾 ระบบจัดการรายการโปรด
- บันทึกข่าวที่สนใจไว้ในรายการโปรด
- เก็บข้อมูลใน Local Storage
- เข้าถึงข่าวที่ชื่นชอบได้ง่าย

## 🚀 การติดตั้งและใช้งาน

### ความต้องการของระบบ
- Node.js 20+
- npm หรือ yarn

### การติดตั้ง

1. Clone repository
```bash
git clone <your-repo-url>
cd vercel-demo
```

2. ติดตั้ง dependencies
```bash
npm install
```

3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local` และเพิ่ม API Keys:
```env
NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

**วิธีขอ API Keys:**
- NewsAPI: สมัครฟรีที่ [newsapi.org](https://newsapi.org/)
- OpenAI: สมัครที่ [platform.openai.com](https://platform.openai.com/)

4. รันเว็บแอปในโหมด Development
```bash
npm run dev
```

5. เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### การ Build สำหรับ Production
```bash
npm run build
npm start
```

## 📖 วิธีใช้งาน

### หน้าแรก (Home Page)
1. **เลือกประเภทข่าว**:
   - คลิก "🌍 ข่าวต่างประเทศ" เพื่อดูข่าวสากล
   - คลิก "🇹🇭 ข่าวไทย" เพื่อดูข่าวในประเทศ

2. **กรองข่าว** (สำหรับข่าวต่างประเทศ):
   - เลือกหมวดหมู่ที่สนใจ (General, Business, Technology, etc.)

3. **เลือกแหล่งข้อมูล** (สำหรับข่าวไทย):
   - "📰 ข่าวจริง" - ดึงข้อมูลจาก RSS Feeds จริง
   - "🧪 ข้อมูลทดสอบ" - ใช้ข้อมูลตัวอย่างสำหรับทดสอบ

### การสรุปข่าว
1. คลิกที่ปุ่ม **"🤖 สรุปด้วย AI"** ในการ์ดข่าว
2. รอสักครู่ระบบจะสรุปข่าวให้
3. คลิกอีกครั้งเพื่อซ่อน/แสดงสรุป

### การบันทึกข่าวโปรด
1. คลิกที่ไอคอน **🤍** (หัวใจ) ในการ์ดข่าว
2. ข่าวจะถูกบันทึกและไอคอนเปลี่ยนเป็น **❤️**
3. เข้าถึงรายการโปรดผ่าน Navigation Bar

### การอ่านข่าวฉบับเต็ม
1. คลิกที่หัวข้อข่าว
2. หน้ารายละเอียดจะแสดงเนื้อหาข่าวแบบเต็ม
3. ใช้ปุ่ม **"🤖 สรุปข่าวด้วย AI"** เพื่อสรุปบทความ
4. เปิด **"สรุปอัตโนมัติ"** เพื่อให้สรุปข่าวทันทีที่เข้าหน้า

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend**: Next.js 15.5.6 + React 19.1.0
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **AI**: OpenAI GPT-4o-mini
- **Web Scraping**: Cheerio
- **Language**: TypeScript 5

## 📁 โครงสร้างโปรเจค

```
vercel-demo/
├── app/
│   ├── api/
│   │   ├── thai-news/         # API สำหรับดึงข่าวไทย
│   │   ├── thai-news-real/    # ข่าวไทยจริงจาก RSS
│   │   ├── thai-news-simple/  # ข่าวไทยแบบ mock
│   │   └── summarize/         # API สรุปข่าวด้วย AI
│   ├── news/[id]/            # หน้ารายละเอียดข่าว
│   ├── favorites/            # หน้ารายการโปรด
│   └── page.tsx              # หน้าแรก
├── components/
│   ├── NewsCard.tsx          # Component การ์ดข่าว
│   ├── Navbar.tsx            # Navigation bar
│   └── Notification*.tsx     # ระบบแจ้งเตือน
└── providers/               # Context providers

```

## ⚡ ฟีเจอร์ขั้นสูง

### การสรุปข่าวด้วย AI
- ใช้ OpenAI GPT-4o-mini model
- จำกัดข้อความที่ส่งเข้า AI ที่ 8,000 ตัวอักษรเพื่อประหยัดค่าใช้จ่าย
- Temperature: 0.5 (สมดุลระหว่างความสร้างสรรค์และความแม่นยำ)
- Max tokens: 300 (สรุปกระชับ)

### การดึงข่าวไทย
- ดึงจาก RSS Feeds แบบ Real-time
- รองรับ Timeout Protection (10 วินาที)
- ระบบ Cache: 5 นาที
- Fallback เป็นข้อมูล Mock หากดึงไม่สำเร็จ

## 🐛 การแก้ปัญหา

### ข่าวไม่แสดง
- ตรวจสอบ `NEXT_PUBLIC_NEWS_API_KEY` ใน `.env.local`
- ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
- ลองรีสตาร์ท Development Server

### AI สรุปข่าวไม่ได้
- ตรวจสอบ `OPENAI_API_KEY` ใน `.env.local`
- ตรวจสอบว่ามี OpenAI Credits เพียงพอ
- ระบบจะ Fallback เป็นการสรุปแบบง่ายอัตโนมัติ

## 📝 License

MIT License

## 🙏 ขอบคุณ

- [Next.js](https://nextjs.org/)
- [OpenAI](https://openai.com/)
- [NewsAPI](https://newsapi.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- แหล่งข่าวไทยทุกแห่งที่อนุญาตให้ใช้ RSS Feeds

---

Made with ❤️ and ✨ AI
