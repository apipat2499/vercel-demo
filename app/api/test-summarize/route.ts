import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Test summarize endpoint",
    sampleData: {
      thaiContent: "นี่คือข่าวทดสอบภาษาไทย เกี่ยวกับการพัฒนาเทคโนโลยีใหม่ในประเทศไทย ซึ่งจะช่วยให้ประชาชนมีความสะดวกสบายมากขึ้น การพัฒนานี้เป็นผลมาจากความร่วมมือของหลายภาคส่วน รวมถึงภาครัฐและเอกชน ที่ต้องการยกระดับคุณภาพชีวิตของคนไทย",
      englishContent: "This is a test news article about new technology development in Thailand. The development aims to improve the convenience of Thai people. This development is the result of cooperation between various sectors, including government and private sectors, who want to improve the quality of life of Thai people."
    }
  });
}

export async function POST(req: Request) {
  try {
    const { content, url, language } = await req.json();
    
    // ส่งต่อไป summarize API
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, url, language }),
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      apiResponse: data,
      requestData: { content: content?.substring(0, 100) + '...', url, language }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}