// app/layout.tsx
// import "./globals.css";
import "../styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Vercel Demo News",
  description: "Simple Next.js news site with Tailwind - Thai News Portal",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}