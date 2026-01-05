import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const mapas = db
    .prepare(`
      SELECT m.*, 
      (SELECT COUNT(*) FROM pontos p WHERE p.mapa_id = m.id) as total_pontos
      FROM mapas m
    `)
    .all();

  return NextResponse.json(mapas);
}

export async function POST(req: Request) {
  const { nome } = await req.json();

  db.prepare(
    "INSERT INTO mapas (nome, criado_em) VALUES (?, ?)"
  ).run(nome, new Date().toISOString());

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return new Response("ID inválido", { status: 400 });
  }

  // para apagar os pontos do mapa
  db.prepare(
    "DELETE FROM pontos WHERE mapa_id = ?"
  ).run(id);

  // para apagar o mapa
  db.prepare(
    "DELETE FROM mapas WHERE id = ?"
  ).run(id);

  return Response.json({ ok: true });
}
