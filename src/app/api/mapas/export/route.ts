import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mapaId = searchParams.get("mapaId");
  const format = searchParams.get("format");

  if (!mapaId || !format) {
    return NextResponse.json(
      { error: "mapaId e format são obrigatórios" },
      { status: 400 }
    );
  }

  const pontos = db
    .prepare(
      "SELECT nome, latitude, longitude FROM pontos WHERE mapa_id = ?"
    )
    .all(mapaId);


  if (format === "geojson") {
    const geojson = {
      type: "FeatureCollection",
      features: pontos.map((p: any) => ({
        type: "Feature",
        properties: {
          nome: p.nome,
        },
        geometry: {
          type: "Point",
          coordinates: [p.longitude, p.latitude],
        },
      })),
    };

    return NextResponse.json(geojson, {
      headers: {
        "Content-Disposition": "attachment; filename=mapa.geojson",
      },
    });
  }

  if (format === "csv") {
    const header = "nome,latitude,longitude\n";
    const rows = pontos
      .map(
        (p: any) =>
          `"${p.nome}",${p.latitude},${p.longitude}`
      )
      .join("\n");

    const csv = header + rows;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=mapa.csv",
      },
    });
  }

  return NextResponse.json(
    { error: "Formato não suportado" },
    { status: 400 }
  );
}
