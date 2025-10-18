# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 Thai News Portal application that aggregates news from multiple Thai and international sources. The application features real-time news fetching from RSS feeds, AI-powered text summarization, and a favorites system with local storage.

**Key Technologies:**
- Next.js 15.5.6 with App Router
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4
- OpenAI API (for summarization)
- Cheerio (for web scraping)
- Framer Motion (for animations)

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Note:** There are no test or lint commands configured in this project.

## Architecture

### Project Structure

```
app/
├── api/                    # API Routes
│   ├── thai-news/         # Main Thai news fetcher (RSS-based)
│   ├── thai-news-real/    # Real Thai news scraper
│   ├── thai-news-simple/  # Mock Thai news for testing
│   ├── summarize/         # Text summarization endpoint
│   └── test-summarize/    # Summarization testing endpoint
├── news/[id]/             # Dynamic news detail page
├── favorites/             # Favorites page
├── settings/              # Settings page
├── about/                 # About page
├── layout.tsx             # Root layout (sets Thai lang attribute)
└── page.tsx               # Home page with news grid

components/
├── NewsCard.tsx           # Card component with summarize & favorite buttons
├── Navbar.tsx             # Navigation bar
├── Notification.tsx       # Individual notification component
├── NotificationContainer.tsx  # Notification system container
└── utils.ts               # Local storage utilities (favorites)

providers/
└── NotificationProvider.tsx  # Context provider for notifications

hooks/
└── useNotifications.ts    # Custom hook for notification system

styles/
└── globals.css            # Global styles (Tailwind imports)
```

### API Routes Architecture

All API routes are Next.js Route Handlers (using GET/POST exports):

1. **`/api/thai-news`** (GET/POST)
   - Primary Thai news endpoint using RSS feeds
   - Sources: BBC Thai, Khaosod, TNN Thai, Manager Online
   - GET: Fetches news list with fallback to mock data
   - POST: Fetches full article content from URL
   - Uses cheerio for HTML parsing
   - Implements timeout protection (10s)
   - Cache: 5 minutes revalidation

2. **`/api/thai-news-real`** and **`/api/thai-news-simple`**
   - Real vs. mock data sources for Thai news
   - User can toggle between these in the UI

3. **`/api/summarize`** (POST)
   - Accepts `{ url, content, language }` in request body
   - If URL provided, fetches content automatically
   - Uses simple extraction-based summarization (not AI)
   - Detects Thai vs. English content automatically
   - Falls back to mock content for known URLs

### Key Features

1. **Dual News System**
   - International news: NewsAPI.org (requires `NEXT_PUBLIC_NEWS_API_KEY`)
   - Thai news: Custom RSS scrapers (BBC Thai, Khaosod, TNN, Manager)

2. **Article Summarization**
   - Simple text extraction method (first N sentences)
   - Language detection for Thai/English
   - Integrated into NewsCard component

3. **Favorites System**
   - Stored in localStorage via `components/utils.ts`
   - Functions: `toggleFavorite()`, `getFromLocal()`, `saveToLocal()`
   - Persists across sessions

4. **Notification System**
   - Global provider pattern: `NotificationProvider` wraps the app
   - Custom hook: `useNotifications()` for triggering notifications
   - Toast-style notifications

### Data Flow

1. **Home Page (`app/page.tsx`)**
   - State: `newsType` (international/thai), `category`, `useRealNews`
   - Fetches news on mount and when filters change
   - International: Direct call to NewsAPI.org
   - Thai: API call to `/api/thai-news-real` or `/api/thai-news-simple`

2. **News Cards**
   - Each card manages its own summary state
   - On "summarize" click: POST to `/api/summarize` with article URL
   - Favorites toggled via localStorage utilities

3. **News Detail Page (`app/news/[id]/page.tsx`)**
   - ID is base64-encoded URL
   - Decodes ID to get original article URL

## Important Patterns

### URL Encoding
- News detail URLs use base64 encoding: `btoa(article.url)`
- Decode on detail page: `atob(encodedUrl)`

### Path Aliases
- `@/*` maps to project root (configured in `tsconfig.json`)
- Example: `import Navbar from "@/components/Navbar"`

### Environment Variables
- `NEXT_PUBLIC_NEWS_API_KEY`: Required for international news (NewsAPI.org)
- Stored in `.env.local`

### RSS Scraping Strategy
- Each source has a `selector` object defining CSS selectors
- Fallback chain: Try RSS → Mock data
- Always handles errors gracefully with empty arrays

### Thai Language Support
- Root HTML lang attribute set to `"th"` in `layout.tsx`
- Thai text detection regex: `/[\u0E00-\u0E7F]/`
- Date formatting uses `'th-TH'` locale

## Working with This Codebase

### Adding a New Thai News Source
1. Add source config to `THAI_NEWS_SOURCES` in `app/api/thai-news/route.ts`
2. Define `name`, `baseUrl`, `rssUrl`, and CSS `selector` object
3. The `fetchFromRSS()` function will automatically handle it

### Adding a New API Route
1. Create `route.ts` in `app/api/[route-name]/`
2. Export `GET` and/or `POST` async functions
3. Return responses using `NextResponse.json()`

### Modifying the Summarization Logic
- Current implementation: Simple extraction in `app/api/summarize/route.ts`
- To use AI: Integrate OpenAI API (already installed as dependency)
- The summarization API expects either `content` or `url` in POST body

### Common Gotchas
- News detail pages expect base64-encoded URLs in the route parameter
- All Thai news API routes include comprehensive error handling and fallbacks
- The app has both "real" and "mock" data modes for Thai news - check which mode is active
- LocalStorage operations should go through `components/utils.ts` helpers
