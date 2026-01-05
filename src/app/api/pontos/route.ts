// meus-mapas/src/app/api/pontos/route.ts

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mapaId = searchParams.get("mapaId");

  const pontos = db
    .prepare("SELECT * FROM pontos WHERE mapa_id = ?")
    .all(mapaId);

  return NextResponse.json(pontos);
}

export async function POST(req: Request) {
  const { mapaId, nome, latitude, longitude } = await req.json();

  db.prepare(
    `INSERT INTO pontos (mapa_id, nome, latitude, longitude)
     VALUES (?, ?, ?, ?)`
  ).run(mapaId, nome, latitude, longitude);

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const body = await req.json();

  // usando para excluir um ponto
  if (body.id) {
    db.prepare(
      "DELETE FROM pontos WHERE id = ?"
    ).run(body.id);

    return NextResponse.json({ ok: true });
  }

  // usando para excluir todos os pontos do mapa
  if (body.mapaId) {
    db.prepare(
      "DELETE FROM pontos WHERE mapa_id = ?"
    ).run(body.mapaId);

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: "Parâmetros inválidos" },
    { status: 400 }
  );
}
