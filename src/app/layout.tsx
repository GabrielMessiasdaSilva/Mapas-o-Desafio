import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        <header className="sticky top-0 z-50 border-b border-violet-900/40 bg-black/60 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span className="text-violet-400">●</span>
              Meus Mapas
            </h1>

            <span className="text-sm text-violet-300/70">
              Plataforma de Mapas 
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-12">
          {children}
        </main>

        <footer className="border-t border-violet-900/30 py-6 text-center text-sm text-violet-300/60">
          Feito com por Gabriel Messias para NerdMonster 
        </footer>
      </body>
    </html>
  );
}
