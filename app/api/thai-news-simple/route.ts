import { NextResponse } from "next/server";

// Mock ข่าวไทยสำหรับทดสอบ
const MOCK_THAI_NEWS = [
  {
    title: "เทคโนโลยี AI กำลังเปลี่ยนแปลงอุตสาหกรรมไทย",
    description: "การใช้ปัญญาประดิษฐ์ในการผลิตและบริการกำลังเติบโตอย่างรวดเร็วในประเทศไทย โดยเฉพาะในภาคการเงิน การผลิต และการค้าปลีก บริษัทชั้นนำหลายแห่งเริ่มนำ AI มาใช้เพื่อเพิ่มประสิทธิภาพและลดต้นทุนการดำเนินงาน",
    url: "https://www.example.com/ai-technology-thailand-1",
    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
    publishedAt: new Date().toISOString(),
    source: { name: "เทคโนโลยีไทย" }
  },
  {
    title: "นโยบายพลังงานสะอาดไทยสู่ Net Zero",
    description: "รัฐบาลไทยเร่งขับเคลื่อนนโยบายพลังงานสะอาดเพื่อมุ่งสู่เป้าหมาย Net Zero ภายในปี 2065 โดยมีการลงทุนในโครงการพลังงานแสงอาทิตย์และพลังงานลมขนาดใหญ่ ตลอดจนส่งเสริมการใช้รถยนต์ไฟฟ้า",
    url: "https://www.example.com/clean-energy-thailand-2",
    urlToImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&h=300&fit=crop",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: { name: "ข่าวพลังงาน" }
  },
  {
    title: "การท่องเที่ยวไทยฟื้นตัวแข็งแกร่งในปี 2025",
    description: "อุตสาหกรรมการท่องเที่ยวไทยแสดงสัญญาณฟื้นตัวที่แข็งแกร่ง โดยมีนักท่องเที่ยวต่างชาติเข้ามาท่องเที่ยวเพิ่มขึ้นกว่า 25% เมื่อเทียบกับปีที่แล้ว รัฐบาลมีแผนส่งเสริมการท่องเที่ยวเชิงวัฒนธรรมและความยั่งยืน",
    url: "https://www.example.com/tourism-recovery-thailand-3",
    urlToImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: { name: "ข่าวท่องเที่ยว" }
  },
  {
    title: "การศึกษาไทยในยุคดิจิทัล: ความท้าทายและโอกาส",
    description: "ระบบการศึกษาไทยกำลังปรับตัวสู่ยุคดิจิทัล ด้วยการนำเทคโนโลยีใหม่ๆ เข้ามาใช้ในการเรียนการสอน รวมถึงการพัฒนาทักษะดิจิทัลให้กับนักเรียนและครู เพื่อเตรียมความพร้อมสำหรับอนาคต",
    url: "https://www.example.com/digital-education-thailand-4",
    urlToImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&h=300&fit=crop",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: { name: "ข่าวการศึกษา" }
  },
  {
    title: "เศรษฐกิจไทยเติบโตต่อเนื่องในไตรมาสที่ 3",
    description: "เศรษฐกิจไทยในไตรมาสที่ 3 ของปี 2025 เติบโตอย่างต่อเนื่องจากการส่งออกที่ฟื้นตัว การบริโภคภายในประเทศที่เพิ่มขึ้น และการลงทุนจากต่างประเทศที่ขยายตัว นักเศรษฐศาสตร์คาดการณ์ว่าจะมีการเติบโตต่อเนื่องในช่วงที่เหลือของปี",
    url: "https://www.example.com/economy-growth-thailand-5",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=300&fit=crop",
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    source: { name: "ข่าวเศรษฐกิจ" }
  },
  {
    title: "การพัฒนาระบบขนส่งสาธารณะในกรุงเทพฯ",
    description: "โครงการรถไฟฟ้าสายใหม่ในกรุงเทพมหานครกำลังก่อสร้างเพื่อแก้ไขปัญหาการจราจรและลดมลพิษ คาดว่าจะแล้วเสร็จภายในปี 2027 และจะช่วยเชื่อมต่อพื้นที่ต่างๆ ให้สะดวกสบายมากขึ้น",
    url: "https://www.example.com/public-transport-bangkok-6",
    urlToImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&h=300&fit=crop",
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    source: { name: "ข่าวคมนาคม" }
  },
  {
    title: "การพัฒนาเมืองอัจฉริยะในภูมิภาคตะวันออก",
    description: "โครงการพัฒนาเมืองอัจฉริยะ (Smart City) ในเขตพัฒนาพิเศษภาคตะวันออก (EEC) กำลังก้าวหน้าอย่างรวดเร็ว ด้วยการนำเทคโนโลยี IoT, 5G และ AI มาประยุกต์ใช้ในการบริหารจัดการเมือง",
    url: "https://www.example.com/smart-city-eec-7",
    urlToImage: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=500&h=300&fit=crop",
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    source: { name: "ข่าวเทคโนโลยี" }
  },
  {
    title: "อุตสาหกรรมอาหารไทยขยายตลาดโลก",
    description: "ผู้ประกอบการอาหารไทยเร่งขยายตลาดสู่ประเทศต่างๆ โดยเฉพาะในภูมิภาคเอเชียและยุโรป ด้วยกลยุทธ์ Soft Power ที่ส่งเสริมวัฒนธรรมอาหารไทยให้เป็นที่รู้จักมากขึ้น",
    url: "https://www.example.com/thai-food-export-8",
    urlToImage: "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=500&h=300&fit=crop",
    publishedAt: new Date(Date.now() - 25200000).toISOString(),
    source: { name: "ข่าวอาหาร" }
  },
  {
    title: "การพัฒนาวัคซีนและยารักษาโรคในไทย",
    description: "ศูนย์วิจัยทางการแพทย์ไทยประสบความสำเร็จในการพัฒนาวัคซีนและยารักษาโรคหลายชนิด รวมถึงการวิจัยเกี่ยวกับการรักษาโรคมะเร็งและโรคเรื้อรัง ซึ่งจะช่วยลดการพึ่งพาการนำเข้ายาจากต่างประเทศ",
    url: "https://www.example.com/medical-research-thailand-9",
    urlToImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=500&h=300&fit=crop",
    publishedAt: new Date(Date.now() - 28800000).toISOString(),
    source: { name: "ข่าวสาธารณสุข" }
  },
  {
    title: "โครงการอนุรักษ์ทะเลและสิ่งแวดล้อมไทย",
    description: "รัฐบาลเปิดตัวโครงการใหม่เพื่ออนุรักษ์ระบบนิเวศทางทะเลและลดขยะพลาสติก โดยร่วมมือกับชุมชนท้องถิ่นและภาคเอกชน เป้าหมายคือลดขยะทะเล 50% ภายใน 5 ปี",
    url: "https://www.example.com/marine-conservation-thailand-10",
    urlToImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop",
    publishedAt: new Date(Date.now() - 32400000).toISOString(),
    source: { name: "ข่าวสิ่งแวดล้อม" }
  },
  {
    title: "การพัฒนากีฬาและสุขภาพคนไทย",
    description: "กระทรวงกีฬาเปิดตัวแผนพัฒนากีฬาแห่งชาติ 2025-2030 เน้นการส่งเสริมการออกกำลังกายในชุมชน การพัฒนานักกีฬาสู่เวทีระดับโลก และการใช้กีฬาเป็นเครื่องมือการทูต",
    url: "https://www.example.com/sports-development-thailand-11",
    urlToImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    publishedAt: new Date(Date.now() - 36000000).toISOString(),
    source: { name: "ข่าวกีฬา" }
  },
  {
    title: "นวัตกรรมเกษตรแปรรูปของไทยสู่ตลาดโลก",
    description: "เกษตรกรไทยประยุกต์ใช้เทคโนโลยีใหม่ในการปลูกและแปรรูปผลิตภัณฑ์เกษตร โดยเฉพาะระบบ Smart Farming และการใช้ AI ในการวิเคราะห์ข้อมูลสภาพอากาศและดิน",
    url: "https://www.example.com/smart-farming-thailand-12",
    urlToImage: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=300&fit=crop",
    publishedAt: new Date(Date.now() - 39600000).toISOString(),
    source: { name: "ข่าวเกษตร" }
  }
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '12'); // เพิ่มเป็น 12 ข่าว
    
    const articles = MOCK_THAI_NEWS.slice(0, Math.min(limit, MOCK_THAI_NEWS.length));
    
    return NextResponse.json({
      status: 'ok',
      totalResults: articles.length,
      articles,
      source: 'mock_data'
    });
    
  } catch (error: any) {
    console.error('❌ Thai news simple error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }
    
    // หา article จาก URL
    const article = MOCK_THAI_NEWS.find(a => a.url === url);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // ส่งคืน content ที่ยาวขึ้นสำหรับการสรุป
    const extendedContent = article.description + " " + 
      "นี่คือเนื้อหาเพิ่มเติมของข่าวที่ช่วยให้เข้าใจประเด็นมากขึ้น ซึ่งรวมถึงการวิเคราะห์จากผู้เชี่ยวชาญ " +
      "สถิติที่เกี่ยวข้อง และผลกระทบที่อาจเกิดขึ้นในอนาคต การพัฒนาในด้านนี้มีความสำคัญต่อประเทศไทย " +
      "และจะส่งผลต่อประชาชนในหลายๆ ด้าน ทั้งในระยะสั้นและระยะยาว";
    
    return NextResponse.json({
      status: 'ok',
      article: {
        ...article,
        content: extendedContent
      }
    });
    
  } catch (error: any) {
    console.error('❌ Fetch article error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}