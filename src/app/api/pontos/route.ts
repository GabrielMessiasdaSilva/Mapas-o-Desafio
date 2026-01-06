import { PontoService } from "@/services/PontoService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mapaId = searchParams.get("mapaId");
    const format = searchParams.get("format");

    if (!mapaId) {
      return NextResponse.json(
        { error: "mapaId é obrigatório" },
        { status: 400 }
      );
    }

    const pontos = await PontoService.listarPontos(Number(mapaId));

    if (format === "geojson") {
      const geojson = {
        type: "FeatureCollection",
        features: pontos.map((p) => ({
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
        headers: {
          "Content-Disposition": "attachment; filename=mapa.geojson",
        },
      });
    }

    if (format === "csv") {
      const header = "nome,latitude,longitude,endereco,altitude\n";
      const rows = pontos
        .map(
          (p) =>
            `"${p.nome}",${p.latitude},${p.longitude},"${p.endereco || ""}",${p.altitude || ""}`
        )
        .join("\n");

      return new NextResponse(header + rows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=mapa.csv",
        },
      });
    }

    return NextResponse.json(pontos);
  } catch (error: any) {
    const status = error.message.includes("permissão") ? 403 : 401;
    return NextResponse.json(
      { error: error.message || "Erro ao listar pontos" },
      { status }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { mapaId, nome, latitude, longitude, endereco, altitude } = await req.json();

    if (!mapaId || !nome || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "mapaId, nome, latitude e longitude são obrigatórios" },
        { status: 400 }
      );
    }

    await PontoService.criarPonto(mapaId, nome, latitude, longitude, endereco, altitude);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error.message.includes("permissão") ? 403 : 401;
    return NextResponse.json(
      { error: error.message || "Erro ao criar ponto" },
      { status }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, mapaId } = await req.json();

    if (id) {
      await PontoService.excluirPonto(id);
    } else if (mapaId) {
      await PontoService.excluirTodosPontos(mapaId);
    } else {
      return NextResponse.json(
        { error: "ID ou mapaId obrigatório" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error.message.includes("permissão") ? 403 : 401;
    return NextResponse.json(
      { error: error.message || "Erro ao excluir ponto" },
      { status }
    );
  }
}
