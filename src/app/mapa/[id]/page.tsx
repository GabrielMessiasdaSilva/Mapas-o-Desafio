"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const Mapa = dynamic(() => import("@/components/Mapa"), {
  ssr: false,
});

type Ponto = {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
};

export default function MapaPage() {
  const params = useParams();
  const router = useRouter();
  const mapaId = params.id as string;

  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [novoPonto, setNovoPonto] = useState<{ lat: number; lng: number } | null>(null);
  const [nome, setNome] = useState("");
  const [search, setSearch] = useState("");

  // carregar pontos
  useEffect(() => {
    fetch(`/api/pontos?mapaId=${mapaId}`)
      .then((res) => res.json())
      .then(setPontos);
  }, [mapaId]);

  // filtro de pontos
  const pontosFiltrados = useMemo(() => {
    if (!search.trim()) return pontos;

    return pontos.filter((p) =>
      p.nome.toLowerCase().includes(search.toLowerCase())
    );
  }, [pontos, search]);

  function onAddPoint(lat: number, lng: number) {
    setNovoPonto({ lat, lng });
  }


  function exportar(format: "geojson" | "csv" | "pdf") {
    const url = `/api/mapas/export?mapaId=${mapaId}&format=${format}`;
    window.open(url, "_blank");
  }

  function compartilharWhatsApp() {
    // Usa URL de produção se configurada, senão usa a URL atual (em produção será automaticamente a URL do Vercel)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const mapaUrl = `${baseUrl}/mapa/${mapaId}`;
    const texto = `🗺️ Confira meu mapa com ${pontos.length} ponto${pontos.length !== 1 ? "s" : ""}!\n\n${mapaUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }

  async function salvarPonto() {
    if (!novoPonto || !nome.trim()) return;

    await fetch("/api/pontos", {
      method: "POST",
      body: JSON.stringify({
        mapaId,
        nome,
        latitude: novoPonto.lat,
        longitude: novoPonto.lng,
      }),
    });

    setNovoPonto(null);
    setNome("");
    location.reload();
  }

  async function excluirPonto(id: number) {
    await fetch("/api/pontos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    location.reload();
  }

  async function excluirTodos() {
    if (!confirm("Excluir todos os pontos?")) return;

    await fetch("/api/pontos", {
      method: "DELETE",
      body: JSON.stringify({ mapaId }),
    });
    location.reload();
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100">
      {/* MAPA */}
      <div className="relative flex-1">
        <Mapa pontos={pontos} onAddPoint={onAddPoint} />

        {!novoPonto && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-5 py-2 text-sm text-neutral-300 backdrop-blur">
            Clique no mapa para adicionar um ponto
          </div>
        )}
      </div>

      {/* SIDEBAR */}
      <aside className="flex w-[380px] flex-col border-l border-neutral-800 bg-neutral-900">
        {/* HEADER */}
        <div className="border-b border-neutral-800 px-6 py-5 space-y-3">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-neutral-400 hover:text-neutral-200"
          >
            ← Voltar para mapas
          </button>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Pontos do mapa
            </h2>
            <p className="text-sm text-neutral-400">
              {pontos.length} ponto{pontos.length !== 1 && "s"}
            </p>
          </div>

          {/* BUSCA */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar ponto..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-violet-500"
          />
        </div>

        {/* NOVO PONTO */}
        {novoPonto && (
          <div className="mx-4 mt-4 rounded-xl border border-violet-700/40 bg-violet-900/10 p-4">
            <h3 className="mb-3 font-medium text-violet-300">
              Novo ponto
            </h3>

            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do ponto"
              className="mb-3 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-violet-500"
            />

            <div className="mb-4 text-xs text-neutral-400">
              Lat {novoPonto.lat.toFixed(5)} · Lng {novoPonto.lng.toFixed(5)}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setNovoPonto(null)}
                className="flex-1 rounded-lg border border-neutral-700 py-2 text-sm hover:bg-neutral-800"
              >
                Cancelar
              </button>

              <button
                onClick={salvarPonto}
                className="flex-1 rounded-lg bg-violet-600 py-2 text-sm font-medium hover:bg-violet-500"
              >
                Salvar ponto
              </button>
            </div>
          </div>
        )}

        {/* LISTA */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {pontosFiltrados.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-700 p-6 text-center text-sm text-neutral-400">
              Nenhum ponto encontrado.
            </div>
          ) : (
            <ul className="space-y-2">
              {pontosFiltrados.map((p) => (
                <li
                  key={p.id}
                  className="group flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 hover:border-neutral-700"
                >
                  <span className="text-sm">{p.nome}</span>

                  <button
                    onClick={() => excluirPonto(p.id)}
                    className="text-xs text-neutral-400 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

<div className="border-t border-neutral-800 px-4 py-4 space-y-2">
  <p className="text-xs uppercase tracking-wide text-neutral-400">
    Exportar dados
  </p>

  <button
    onClick={() => exportar("geojson")}
    className="w-full rounded-lg border border-violet-500/40 bg-violet-500/10 py-2 text-sm text-violet-300 hover:bg-violet-500/20"
  >
    Exportar GeoJSON
  </button>

  <button
    onClick={() => exportar("csv")}
    className="w-full rounded-lg border border-neutral-700 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
  >
    Exportar CSV
  </button>

  <button
    onClick={() => exportar("pdf")}
    className="w-full rounded-lg border border-neutral-700 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
  >
    Exportar PDF
  </button>

  {pontos.length > 0 && (
    <button
      onClick={compartilharWhatsApp}
      className="w-full rounded-lg border border-green-500/40 bg-green-500/10 py-2 text-sm text-green-300 hover:bg-green-500/20 mt-2"
    >
      📱 Compartilhar no WhatsApp
    </button>
  )}
</div>


        {pontos.length > 0 && (
          <div className="border-t border-neutral-800 px-4 py-4">
            <button
              onClick={excluirTodos}
              className="w-full rounded-lg border border-red-500/40 bg-red-500/10 py-2 text-sm text-red-400 hover:bg-red-500/20"
            >
              Excluir todos os pontos
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
