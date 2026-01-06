"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao criar conta");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setErro("Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-violet-900/40 bg-black/40 p-8 backdrop-blur">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">Criar conta</h1>
            <p className="mt-2 text-gray-400">
              Crie sua conta para começar a gerenciar seus mapas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {erro && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
                {erro}
              </div>
            )}

            <div>
              <label htmlFor="nome" className="mb-2 block text-sm text-gray-300">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full rounded-xl border border-violet-900/40 bg-black/60 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-violet-500"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-violet-900/40 bg-black/60 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-violet-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="senha" className="mb-2 block text-sm text-gray-300">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-violet-900/40 bg-black/60 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-violet-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-medium text-white transition hover:from-violet-500 hover:to-purple-500 disabled:opacity-50"
            >
              {carregando ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-medium text-violet-400 hover:text-violet-300"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
