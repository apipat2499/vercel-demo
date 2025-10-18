import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

// แหล่งข่าวไทยที่เสถียร
const THAI_NEWS_SOURCES = {
  bbc_thai: {
    name: "BBC Thai",
    baseUrl: "https://www.bbc.com/thai",
    rssUrl: "https://feeds.bbci.co.uk/thai/rss.xml",
    selector: {
      title: "h1, .story-headline",
      content: ".story-body, article, p",
      image: ".story-image img, img",
    }
  },
  khaosod: {
    name: "ข่าวสด",
    baseUrl: "https://www.khaosod.co.th",
    rssUrl: "https://www.khaosod.co.th/feed",
    selector: {
      title: "h1, .entry-title",
      content: ".entry-content, .content",
      image: ".featured-image img, img",
    }
  },
  tnn_thai: {
    name: "TNN ข่าว",
    baseUrl: "https://www.tnnthailand.com",
    rssUrl: "https://www.tnnthailand.com/rss.xml",
    selector: {
      title: "h1, .title",
      content: ".content, .entry-content, p",
      image: ".featured-image img, img",
    }
  },
  manager: {
    name: "ผู้จัดการออนไลน์", 
    baseUrl: "https://mgronline.com",
    rssUrl: "https://mgronline.com/feed",
    selector: {
      title: "h1, .entry-title",
      content: ".entry-content, .content",
      image: ".featured-image img, img",
    }
  }
};

// ฟังก์ชันดึงข่าวจาก RSS
async function fetchFromRSS(source: any, limit: number = 10) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
    
    const response = await fetch(source.rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      signal: controller.signal,
      next: { revalidate: 300 } // cache 5 minutes
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xmlText = await response.text();
    const $ = cheerio.load(xmlText, { xmlMode: true });
    
    const articles: any[] = [];
    
    $('item').slice(0, limit).each((i, item) => {
      const $item = $(item);
      const title = $item.find('title').text().trim();
      const link = $item.find('link').text().trim();
      const description = $item.find('description').text().trim();
      const pubDate = $item.find('pubDate').text().trim();
      
      // หาภาพจาก enclosure หรือ media:content
      let imageUrl = '';
      const enclosure = $item.find('enclosure[type*="image"]');
      if (enclosure.length) {
        imageUrl = enclosure.attr('url') || '';
      } else {
        const mediaContent = $item.find('media\\:content, content');
        if (mediaContent.length) {
          imageUrl = mediaContent.attr('url') || '';
        }
      }
      
      if (title && link) {
        articles.push({
          title,
          description: description.replace(/<[^>]*>/g, ''), // ลบ HTML tags
          url: link,
          urlToImage: imageUrl,
          publishedAt: pubDate,
          source: {
            name: source.name
          }
        });
      }
    });
    
    return articles;
  } catch (error) {
    console.error(`Error fetching from ${source.name}:`, error);
    return [];
  }
}

// ฟังก์ชันดึงเนื้อหาเต็มของข่าว
async function fetchFullArticle(url: string, source: any) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // ลบ scripts และ styles
    $('script, style, nav, header, footer, .ad, .advertisement').remove();
    
    const title = $(source.selector.title).first().text().trim();
    
    // รวบรวมเนื้อหาจากหลาย selector
    let content = '';
    $(source.selector.content).each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 20) { // เฉพาะข้อความที่ยาวพอ
        content += text + '\n\n';
      }
    });
    
    // หาภาพ
    let imageUrl = '';
    const img = $(source.selector.image).first();
    if (img.length) {
      imageUrl = img.attr('src') || img.attr('data-src') || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = new URL(imageUrl, source.baseUrl).href;
      }
    }
    
    return {
      title: title || 'ไม่พบหัวข้อ',
      content: content.trim() || 'ไม่สามารถดึงเนื้อหาได้',
      imageUrl
    };
    
  } catch (error) {
    console.error(`Error fetching article ${url}:`, error);
    return {
      title: 'เกิดข้อผิดพลาด',
      content: 'ไม่สามารถดึงเนื้อหาได้ กรุณาลองใหม่อีกครั้ง',
      imageUrl: ''
    };
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sourceParam = searchParams.get('source') || 'all';
    const limitParam = parseInt(searchParams.get('limit') || '10');
    const limit = Math.min(limitParam, 50); // จำกัดไม่เกิน 50 ข่าว
    
    let articles: any[] = [];
    
    if (sourceParam === 'all') {
      // ดึงจากทุกแหล่ง พร้อม fallback
      const promises = Object.entries(THAI_NEWS_SOURCES).map(([name, source]) => 
        fetchFromRSS(source, Math.ceil(limit / Object.keys(THAI_NEWS_SOURCES).length))
          .catch(error => {
            console.error(`Error fetching from ${name}:`, error);
            return []; // return empty array on error
          })
      );
      
      const results = await Promise.allSettled(promises);
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          articles.push(...result.value);
        } else {
          console.error('Promise failed:', result.reason);
        }
      });
      
      // เรียงตามวันที่และจำกัดจำนวน
      articles = articles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, limit);
        
    } else if (THAI_NEWS_SOURCES[sourceParam as keyof typeof THAI_NEWS_SOURCES]) {
      // ดึงจากแหล่งที่ระบุ
      const source = THAI_NEWS_SOURCES[sourceParam as keyof typeof THAI_NEWS_SOURCES];
      try {
        articles = await fetchFromRSS(source, limit);
      } catch (error) {
        console.error(`Error fetching from ${sourceParam}:`, error);
        // fallback: return mock data หรือ empty array
        articles = [];
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid source. Available: ' + Object.keys(THAI_NEWS_SOURCES).join(', ') + ', all' },
        { status: 400 }
      );
    }
    
    // ถ้าไม่มีข่าวเลย ให้ fallback data
    if (articles.length === 0) {
      articles = [
        {
          title: "การพัฒนาเทคโนโลยีปัญญาประดิษฐ์ในประเทศไทย",
          description: "รัฐบาลไทยมีนโยบายสนับสนุนการพัฒนาเทคโนโลยี AI เพื่อยกระดับขีดความสามารถในการแข่งขันของประเทศในยุคดิจิทัล โดยเน้นการนำ AI มาใช้ในภาคการศึกษา สาธารณสุข และเกษตรกรรม",
          url: "https://example.com/ai-development-thailand",
          urlToImage: "/vercel.svg",
          publishedAt: new Date().toISOString(),
          source: { name: "ข่าวเทคโนโลยี" }
        },
        {
          title: "นโยบายพลังงานสะอาดและการลดการปล่อยคาร์บอน",
          description: "การศึกษาใหม่พบว่าการลงทุนในพลังงานหมุนเวียนของไทยกำลังเติบโตอย่างต่อเนื่อง โดยเฉพาะพลังงานแสงอาทิตย์และพลังงานลม ซึ่งจะช่วยลดการพึ่งพาพลังงานฟอสซิล",
          url: "https://example.com/renewable-energy-thailand",
          urlToImage: "/vercel.svg", 
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: "ข่าวพลังงาน" }
        },
        {
          title: "การท่องเที่ยวไทยฟื้นตัวหลังโควิด-19",
          description: "สถิติการท่องเที่ยวไทยในไตรมาสล่าสุดแสดงให้เห็นถึงการฟื้นตัวที่แข็งแกร่ง โดยเฉพาะนักท่องเที่ยวจากเอเชียและยุโรป รัฐบาลมีแผนส่งเสริมการท่องเที่ยวเชิงวัฒนธรรมและธรรมชาติ",
          url: "https://example.com/tourism-recovery-thailand",
          urlToImage: "/vercel.svg",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: "ข่าวท่องเที่ยว" }
        }
      ];
    }
    
    return NextResponse.json({
      status: 'ok',
      totalResults: articles.length,
      articles,
      sources: Object.keys(THAI_NEWS_SOURCES)
    });
    
  } catch (error: any) {
    console.error('❌ Thai news error:', error);
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
    const { url, source } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }
    
    // หาแหล่งที่เหมาะสมจาก URL
    let selectedSource = null;
    if (source && THAI_NEWS_SOURCES[source as keyof typeof THAI_NEWS_SOURCES]) {
      selectedSource = THAI_NEWS_SOURCES[source as keyof typeof THAI_NEWS_SOURCES];
    } else {
      // ลองหาจาก URL
      for (const [key, src] of Object.entries(THAI_NEWS_SOURCES)) {
        if (url.includes(src.baseUrl.replace('https://', ''))) {
          selectedSource = src;
          break;
        }
      }
    }
    
    if (!selectedSource) {
      return NextResponse.json(
        { error: 'Unsupported news source' },
        { status: 400 }
      );
    }
    
    const article = await fetchFullArticle(url, selectedSource);
    
    return NextResponse.json({
      status: 'ok',
      article
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