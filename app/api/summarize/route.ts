import { NextResponse } from "next/server";
import * as cheerio from 'cheerio';
import Anthropic from '@anthropic-ai/sdk';

// Lazy initialize Claude only when needed (to avoid build errors)
let claude: Anthropic | null = null;

function getClaudeClient(): Anthropic {
  if (!claude && process.env.ANTHROPIC_API_KEY) {
    claude = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  if (!claude) {
    throw new Error('Claude API key not configured');
  }
  return claude;
}

// ฟังก์ชันตรวจสอบภาษา
function detectLanguage(text: string): 'thai' | 'english' {
  const thaiPattern = /[\u0E00-\u0E7F]/;
  return thaiPattern.test(text) ? 'thai' : 'english';
}

// ฟังก์ชันสรุปด้วย Claude AI
async function aiSummary(content: string, language: 'thai' | 'english'): Promise<string> {
  try {
    // ทำความสะอาดข้อความ
    const cleanText = content
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 15000); // Claude รองรับข้อความยาวกว่า

    const systemPrompt = language === 'thai'
      ? "คุณเป็นผู้ช่วยสรุปข่าวที่เชี่ยวชาญในการสรุปข่าวภาษาไทยให้กระชับและเข้าใจง่าย สรุปเป็น 3-4 ประโยค เน้นประเด็นสำคัญ"
      : "You are a professional news summarizer. Summarize concisely in 3-4 sentences, focusing on key points.";

    const userPrompt = language === 'thai'
      ? `กรุณาสรุปข่าวต่อไปนี้:\n\n${cleanText}`
      : `Please summarize this news article:\n\n${cleanText}`;

    const client = getClaudeClient();
    const message = await client.messages.create({
      model: "claude-3-5-haiku-20241022", // ใช้ Haiku (ถูกและเร็ว)
      max_tokens: 500,
      temperature: 0.5,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    const summary = message.content[0]?.type === 'text'
      ? message.content[0].text.trim()
      : '';

    return summary || (language === 'thai' ? 'ไม่สามารถสรุปข่าวได้' : 'Cannot summarize');
  } catch (error) {
    console.error('Claude AI Summary Error:', error);
    // Fallback to simple summary
    return simpleSummary(content, language);
  }
}

// ฟังก์ชันสรุปแบบง่าย (สำหรับ fallback)
function simpleSummary(content: string, language: 'thai' | 'english'): string {
  const cleanText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const sentences = cleanText.split(/[.!?।|]+/).filter(s => s.trim().length > 10);

  if (sentences.length === 0) {
    return language === 'thai' ? 'ไม่สามารถสรุปเนื้อหาได้' : 'Cannot summarize content';
  }

  const summaryLength = Math.min(3, Math.ceil(sentences.length * 0.3));
  const selectedSentences = sentences.slice(0, summaryLength);

  const summary = selectedSentences.join('. ').trim();

  const maxLength = language === 'thai' ? 400 : 300;
  return summary.length > maxLength
    ? summary.substring(0, maxLength) + '...'
    : summary;
}

// ฟังก์ชันดึงเนื้อหาจาก URL
async function fetchContentFromUrl(url: string) {
  try {
    console.log('📥 Fetching content from:', url);

    // ลองใช้ mock thai content ก่อน
    const mockContent = getMockThaiContent(url);
    if (mockContent) {
      console.log('✓ Using mock Thai content');
      return mockContent;
    }

    // ลองใช้ allorigins สำหรับ bypass CORS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 วินาที

    const response = await fetch(proxyUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }

    const data = await response.json();
    const html = data.contents || '';

    if (!html) {
      throw new Error('No HTML content received');
    }

    // ใช้ cheerio แยก content จาก HTML
    const $ = cheerio.load(html);

    // ลบ elements ที่ไม่ต้องการ
    $('script, style, nav, header, footer, aside, iframe, .advertisement, .ads, .sidebar, .social-share, .comments').remove();

    // ดึง content จาก tags ที่มีเนื้อหาหลัก
    let content = '';

    // วิธีที่ 1: ลองดึงจาก article tag
    if ($('article').length > 0) {
      const articleText = $('article p').map((i, el) => $(el).text()).get().join(' ');
      if (articleText.length > 200) {
        content = articleText;
      }
    }

    // วิธีที่ 2: ลองดึงจาก main tag
    if (!content && $('main').length > 0) {
      const mainText = $('main p').map((i, el) => $(el).text()).get().join(' ');
      if (mainText.length > 200) {
        content = mainText;
      }
    }

    // วิธีที่ 3: ลองดึงจาก content classes
    if (!content) {
      const contentText = $('.content, .article-content, .post-content, .entry-content, .story-body')
        .find('p')
        .map((i, el) => $(el).text())
        .get()
        .join(' ');
      if (contentText.length > 200) {
        content = contentText;
      }
    }

    // วิธีที่ 4: ดึงจาก paragraph ทั้งหมดที่มีเนื้อหายาวพอ
    if (!content) {
      const paragraphs = $('p')
        .filter((i, el) => {
          const text = $(el).text();
          return text.length > 50 && !text.includes('©') && !text.includes('Cookie');
        })
        .map((i, el) => $(el).text())
        .get()
        .slice(0, 10); // เอาแค่ 10 paragraph แรก

      content = paragraphs.join(' ');
    }

    // ทำความสะอาด content
    content = content
      .replace(/\s+/g, ' ') // ลบ whitespace เกิน
      .replace(/\n+/g, ' ') // แปลง newline เป็น space
      .replace(/\[.*?\]/g, '') // ลบ brackets
      .trim();

    if (content.length < 100) {
      throw new Error('Content too short');
    }

    console.log(`✓ Fetched ${content.length} characters`);
    return content;
  } catch (error: any) {
    console.error('❌ Error fetching content:', error.message);
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
    let description = "";

    try {
      const body = await req.json();
      content = body?.content || "";
      url = body?.url || "";
      language = body?.language || "";
      description = body?.description || ""; // เพิ่มการรับ description
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // ถ้ามี URL ให้ดึงเนื้อหาจาก URL
    if (url && !content) {
      const fetchedContent = await fetchContentFromUrl(url);
      if (fetchedContent) {
        content = fetchedContent;
      } else if (description) {
        // ถ้าดึงไม่ได้ ใช้ description แทน
        console.log('⚠️ Using description as fallback');
        content = description;
      }
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not fetch content. Please try again or the article may not be accessible." },
        { status: 400 }
      );
    }

    // ตรวจสอบภาษาอัตโนมัติถ้าไม่ได้ระบุ
    const detectedLang: 'thai' | 'english' = language === 'thai' || language === 'english'
      ? language
      : detectLanguage(content);

    // ใช้ AI สรุปข่าว
    const summary = await aiSummary(content, detectedLang);

    return NextResponse.json({
      summary,
      language: detectedLang,
      originalLength: content.length,
      summaryLength: summary.length,
      method: 'ai_summary' // บอกว่าใช้ AI สรุป
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