import type { Metadata } from "next";
import { DM_Serif_Display, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brief Lab — AI Pre-Production Layer | HEXCODED",
  description:
    "AI pre-production companion tool. Turn vague product briefs into multiple creative concepts, shot lists, casting direction, and editable node-based workflows before spending a render.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col font-[family-name:var(--font-sans)] bg-[#F7F5F0] text-[#171717] antialiased selection:bg-[#EF432F]/15 selection:text-[#171717]">
        {children}
      </body>
    </html>
  );
}
