"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type Usuario = {
  id: number;
  email: string;
  nome: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.usuario) {
          setUsuario(data.usuario);
        }
      });
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const isPublicRoute = pathname === "/login" || pathname === "/registro";

  if (isPublicRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-violet-900/40 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight hover:text-violet-400 transition">
          <span className="text-violet-400">●</span>
          Meus Mapas
        </Link>

        <div className="flex items-center gap-4">
          {usuario && (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-300">{usuario.nome}</p>
                <p className="text-xs text-gray-500">{usuario.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
