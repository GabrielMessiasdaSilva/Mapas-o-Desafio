import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meus Mapas",
  description: "Gerenciador de mapas e pontos geográficos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          min-h-screen
          font-sans
          antialiased
          text-gray-100
          bg-gradient-to-br
          from-black
          via-[#1a0826]
          to-[#0f0218]
        `}
      >
        <Navbar />
        <main>
          {children}
        </main>

        <footer className="border-t border-violet-900/30 py-6 text-center text-sm text-violet-300/60">
          Feito por Gabriel Messias para NerdMonster 
        </footer>
      </body>
    </html>
  );
}
