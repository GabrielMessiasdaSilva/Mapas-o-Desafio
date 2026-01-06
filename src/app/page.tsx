"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Mapa = {
  id: number;
  nome: string;
  total_pontos: number;
};

export default function Home() {
  const router = useRouter();
  const [mapas, setMapas] = useState<Mapa[]>([]);

  useEffect(() => {
    fetch("/api/mapas", { cache: "no-store" })
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return [];
        }
        return res.json();
      })
      .then(setMapas);
  }, [router]);


  async function excluirMapa(id: number) {
    if (!confirm("Excluir este mapa e todos os pontos?")) return;

    await fetch("/api/mapas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setMapas((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-[#14061f] to-[#0b0212] text-gray-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-900/20 blur-[140px]" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-16">
        <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-sm text-violet-300">
          Plataforma de mapas
        </span>

        <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight">
          Visualize, organize e explore
          <span className="block bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
            seus mapas geográficos
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          Crie mapas personalizados, adicione pontos e visualize tudo em um
          ambiente moderno, rápido e intuitivo.
        </p>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-14 rounded-2xl border border-violet-900/40 bg-black/40 p-8 backdrop-blur">
          <h2 className="text-xl font-semibold">Criar novo mapa</h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const nome = new FormData(form).get("nome");

              await fetch("/api/mapas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome }),
              });

              form.reset();
              const res = await fetch("/api/mapas");
              setMapas(await res.json());
            }}
            className="mt-6 flex flex-col gap-4 sm:flex-row"
          >
            <input
              name="nome"
              required
              placeholder="Ex: Pontos turísticos de São Paulo"
              className="flex-1 rounded-xl border border-violet-900/40 bg-black/60 px-5 py-4 text-white placeholder-gray-500 outline-none focus:border-violet-500"
            />

            <button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 font-medium text-white">
              Criar mapa
            </button>
          </form>
        </div>

        <h2 className="mb-8 text-2xl font-semibold">Seus mapas</h2>

        {mapas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-violet-900/40 bg-black/30 p-16 text-center text-gray-400">
            Nenhum mapa criado ainda.
          </div>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* parte dos mapas*/}
            {mapas.map((mapa) => (
              <li
                key={mapa.id}
                className="group relative overflow-hidden rounded-2xl border border-violet-900/40 bg-black/40 p-6 transition hover:border-violet-500"
              >
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-violet-600/20 blur-2xl" />
                </div>

                <div className="relative flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{mapa.nome}</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {mapa.total_pontos} ponto
                      {mapa.total_pontos !== 1 && "s"}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Link
                      href={`/mapa/${mapa.id}`}
                      className="text-sm font-medium text-violet-400 hover:text-violet-300"
                    >
                      Abrir mapa →
                    </Link>

                    <button
                      onClick={() => excluirMapa(mapa.id)}
                      className="text-xs text-red-400 opacity-0 transition group-hover:opacity-100"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
