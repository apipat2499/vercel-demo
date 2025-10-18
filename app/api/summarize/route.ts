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
    // ลองใช้ thai-news-real API ก่อน
    try {
      const response = await fetch('/api/thai-news-real', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.article?.content) {
          return data.article.content;
        }
      }
    } catch (error) {
      console.log('Real Thai API failed, trying direct fetch');
    }
    
    // ลองใช้ mock thai content
    const mockContent = getMockThaiContent(url);
    if (mockContent) {
      return mockContent;
    }
    
    // Fallback: ใช้ allorigins สำหรับ bypass CORS
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

// ฟังก์ชันสำหรับ mock content
function getMockThaiContent(url: string): string | null {
  const mockData: { [key: string]: string } = {
    "https://www.example.com/ai-technology-thailand-1": "การใช้ปัญญาประดิษฐ์ในการผลิตและบริการกำลังเติบโตอย่างรวดเร็วในประเทศไทย โดยเฉพาะในภาคการเงิน การผลิต และการค้าปลีก บริษัทชั้นนำหลายแห่งเริ่มนำ AI มาใช้เพื่อเพิ่มประสิทธิภาพและลดต้นทุนการดำเนินงาน ธนาคารต่างๆ ใช้ AI ในการวิเคราะห์ความเสี่ยงและการให้บริการลูกค้า ในขณะที่โรงงานผลิตนำ AI มาใช้ในการควบคุมคุณภาพและการบำรุงรักษาเครื่องจักร การพัฒนาทักษะด้าน AI ของบุคลากรไทยจึงเป็นสิ่งสำคัญเพื่อรองรับการเปลี่ยนแปลงนี้",
    
    "https://www.example.com/clean-energy-thailand-2": "รัฐบาลไทยเร่งขับเคลื่อนนโยบายพลังงานสะอาดเพื่อมุ่งสู่เป้าหมาย Net Zero ภายในปี 2065 โดยมีการลงทุนในโครงการพลังงานแสงอาทิตย์และพลังงานลมขนาดใหญ่ ตลอดจนส่งเสริมการใช้รถยนต์ไฟฟ้า โครงการโซลาร์ฟาร์มในภาคตะวันออกเฉียงเหนือจะเป็นหนึ่งในโครงการพลังงานสะอาดที่ใหญ่ที่สุดในภูมิภาคเอเชียตะวันออกเฉียงใต้ นอกจากนี้ยังมีแผนพัฒนาเทคโนโลยีการจัดเก็บพลังงานและระบบกริดอัจฉริยะเพื่อรองรับการใช้พลังงานหมุนเวียนในอนาคต",
    
    "https://www.example.com/tourism-recovery-thailand-3": "อุตสาหกรรมการท่องเที่ยวไทยแสดงสัญญาณฟื้นตัวที่แข็งแกร่ง โดยมีนักท่องเที่ยวต่างชาติเข้ามาท่องเที่ยวเพิ่มขึ้นกว่า 25% เมื่อเทียบกับปีที่แล้ว รัฐบาลมีแผนส่งเสริมการท่องเที่ยวเชิงวัฒนธรรมและความยั่งยืน การท่องเที่ยวเชิงอาหารและการท่องเที่ยวเชิงสุขภาพเป็นจุดขายสำคัญที่ดึงดูดนักท่องเที่ยวคุณภาพสูง โครงการ Soft Power ของไทยในการส่งเสริมวัฒนธรรมไทยผ่านภาพยนตร์ ดนตรี และอาหารไทยช่วยสร้างภาพลักษณ์ที่ดีและเพิ่มความน่าสนใจของประเทศไทยในสายตานักท่องเที่ยวทั่วโลก",

    "https://www.example.com/digital-education-thailand-4": "ระบบการศึกษาไทยกำลังปรับตัวสู่ยุคดิจิทัล ด้วยการนำเทคโนโลยีใหม่ๆ เข้ามาใช้ในการเรียนการสอน โรงเรียนและมหาวิทยาลัยต่างๆ เริ่มใช้ระบบการเรียนรู้ออนไลน์ แอพพลิเคชั่นการศึกษา และ AI ในการปรับหลักสูตรให้เหมาะกับผู้เรียนแต่ละคน การพัฒนาทักษะดิจิทัลให้กับครูและนักเรียนจึงเป็นสิ่งจำเป็น เพื่อให้สามารถแข่งขันในตลาดงานยุคใหม่ได้",

    "https://www.example.com/economy-growth-thailand-5": "เศรษฐกิจไทยในไตรมาสที่ 3 ของปี 2025 เติบโตอย่างต่อเนื่องจากการส่งออกที่ฟื้นตัว การบริโภคภายในประเทศที่เพิ่มขึ้น และการลงทุนจากต่างประเทศที่ขยายตัว ภาคอุตสาหกรรมยานยนต์และอิเล็กทรอนิกส์เป็นแรงขับเคลื่อนสำคัญ ขณะที่ภาคบริการและการท่องเที่ยวฟื้นตัวดี นักเศรษฐศาสตร์คาดการณ์ว่าจะมีการเติบโตต่อเนื่องในช่วงที่เหลือของปี",

    "https://www.example.com/public-transport-bangkok-6": "โครงการรถไฟฟ้าสายใหม่ในกรุงเทพมหานครกำลังก่อสร้างเพื่อแก้ไขปัญหาการจราจรและลดมลพิษ รถไฟฟ้าสายสีชมพูและสีเหลืองจะเชื่อมต่อพื้นที่ชานเมืองเข้ากับใจกลางเมือง คาดว่าจะแล้วเสร็จภายในปี 2027 และจะช่วยลดเวลาเดินทางและการใช้รถยนต์ส่วนตัว ซึ่งจะช่วยลดมลพิษและปรับปรุงคุณภาพชีวิตของประชาชน"
  };
  
  return mockData[url] || null;
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