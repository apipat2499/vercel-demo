import { NextResponse } from "next/server";
import * as cheerio from 'cheerio';

// ฟังก์ชันตรวจสอบภาษา
function detectLanguage(text: string): 'thai' | 'english' {
  const thaiPattern = /[\u0E00-\u0E7F]/;
  return thaiPattern.test(text) ? 'thai' : 'english';
}

// ฟังก์ชันสรุปแบบง่าย
function simpleSummary(content: string, language: 'thai' | 'english'): string {
  // ทำความสะอาดข้อความ
  const cleanText = content
    .replace(/<[^>]*>/g, '') // ลบ HTML tags
    .replace(/\s+/g, ' ') // ลบ whitespace เกิน
    .trim();

  // แบ่งเป็นประโยค
  const sentences = cleanText.split(/[.!?।|]+/).filter(s => s.trim().length > 10);
  
  if (sentences.length === 0) {
    return language === 'thai' ? 'ไม่สามารถสรุปเนื้อหาได้' : 'Cannot summarize content';
  }

  // เลือกประโยคแรกๆ เป็นสรุป
  const summaryLength = Math.min(3, Math.ceil(sentences.length * 0.3));
  const selectedSentences = sentences.slice(0, summaryLength);
  
  const summary = selectedSentences.join('. ').trim();
  
  // จำกัดความยาว
  const maxLength = language === 'thai' ? 400 : 300;
  return summary.length > maxLength 
    ? summary.substring(0, maxLength) + '...'
    : summary;
}

// ฟังก์ชันดึงเนื้อหาจาก URL
async function fetchContentFromUrl(url: string) {
  try {
    // ใช้ allorigins สำหรับ bypass CORS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }
    
    const data = await response.json();
    const html = data.contents || '';
    
    // ใช้ cheerio แยก content จาก HTML
    const $ = cheerio.load(html);
    
    // ลบ elements ที่ไม่ต้องการ
    $('script, style, nav, header, footer, aside, .advertisement, .ads, .sidebar').remove();
    
    // ดึง content จาก tags ที่มีเนื้อหาหลัก
    let content = '';
    
    // ลองดึงจาก article tag ก่อน
    if ($('article').length > 0) {
      content = $('article').text();
    }
    // ถ้าไม่มี ลองดึงจาก main tag
    else if ($('main').length > 0) {
      content = $('main').text();
    }
    // ถ้าไม่มี ลองดึงจาก div ที่มี content class
    else if ($('.content, .article-content, .post-content, .entry-content').length > 0) {
      content = $('.content, .article-content, .post-content, .entry-content').first().text();
    }
    // สุดท้ายให้ดึงจาก body แต่กรอง paragraph ที่มีเนื้อหายาว
    else {
      const paragraphs = $('p').filter((i, el) => $(el).text().length > 50);
      content = paragraphs.map((i, el) => $(el).text()).get().join(' ');
    }
    
    // ทำความสะอาด content
    content = content
      .replace(/\s+/g, ' ')  // ลบ whitespace เกิน
      .replace(/\n+/g, ' ')  // แปลง newline เป็น space
      .trim();
    
    return content;
    
  } catch (error) {
    console.error('Error fetching content from URL:', error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    // ✅ ป้องกัน JSON parse error
    let content = "";
    let url = "";
    let language = "";
    
    try {
      const body = await req.json();
      content = body?.content || "";
      url = body?.url || "";
      language = body?.language || "";
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // ถ้ามี URL ให้ดึงเนื้อหาจาก URL
    if (url && !content) {
      const fetchedContent = await fetchContentFromUrl(url);
      if (!fetchedContent) {
        return NextResponse.json(
          { error: "Could not fetch content from URL" },
          { status: 400 }
        );
      }
      content = fetchedContent;
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'content' field or URL" },
        { status: 400 }
      );
    }

    // ตรวจสอบภาษาอัตโนมัติถ้าไม่ได้ระบุ
    const detectedLang: 'thai' | 'english' = language === 'thai' || language === 'english' 
      ? language 
      : detectLanguage(content);
    
    // ใช้การสรุปแบบง่าย
    const summary = simpleSummary(content, detectedLang);

    return NextResponse.json({ 
      summary,
      language: detectedLang,
      originalLength: content.length,
      summaryLength: summary.length,
      method: 'simple_extraction' // บอกว่าใช้วิธีสรุปแบบง่าย
    });
  } catch (error: any) {
    console.error("❌ summarize error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}