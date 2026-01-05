import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mapaId = searchParams.get("mapaId");
  const format = searchParams.get("format");

  if (!mapaId) return NextResponse.json({ error: "mapaId obrigatório" }, { status: 400 });

  const pontos = db
    .prepare("SELECT * FROM pontos WHERE mapa_id = ?")
    .all(mapaId);

  if (format === "geojson") {
    const geojson = {
      type: "FeatureCollection",
      features: pontos.map((p: any) => ({
        type: "Feature",
        properties: {
          nome: p.nome,
          endereco: p.endereco,
          altitude: p.altitude,
        },
        geometry: {
          type: "Point",
          coordinates: [p.longitude, p.latitude],
        },
      })),
    };
    return NextResponse.json(geojson, {
      headers: { "Content-Disposition": "attachment; filename=mapa.geojson" },
    });
  }

  if (format === "csv") {
    const header = "nome,latitude,longitude,endereco,altitude\n";
    const rows = pontos
      .map((p: any) => `"${p.nome}",${p.latitude},${p.longitude},"${p.endereco}",${p.altitude}`)
      .join("\n");
    return new NextResponse(header + rows, {
      headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=mapa.csv" },
    });
  }

  return NextResponse.json(pontos);
}

export async function POST(req: Request) {
  const { mapaId, nome, latitude, longitude, endereco, altitude } = await req.json();

  db.prepare(
    "INSERT INTO pontos (mapa_id, nome, latitude, longitude, endereco, altitude) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(mapaId, nome, latitude, longitude, endereco, altitude);

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id, mapaId } = await req.json();

  if (id) {
    db.prepare("DELETE FROM pontos WHERE id = ?").run(id);
  } else if (mapaId) {
    db.prepare("DELETE FROM pontos WHERE mapa_id = ?").run(mapaId);
  } else {
    return new Response("ID ou mapaId obrigatório", { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
