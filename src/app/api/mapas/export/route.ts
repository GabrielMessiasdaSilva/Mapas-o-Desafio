import { PontoService } from "@/services/PontoService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mapaId = searchParams.get("mapaId");
    const format = searchParams.get("format");

    if (!mapaId || !format) {
      return NextResponse.json(
        { error: "mapaId e format são obrigatórios" },
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

    if (format === "pdf") {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.text("Mapa de Pontos", 14, 20);
      
      // Informações
      doc.setFontSize(12);
      doc.text(`Total de pontos: ${pontos.length}`, 14, 30);
      doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 14, 37);
      
      // Tabela
      let y = 50;
      doc.setFontSize(10);
      
      // Cabeçalho
      doc.setFont("bold");
      doc.text("Nome", 14, y);
      doc.text("Latitude", 70, y);
      doc.text("Longitude", 110, y);
      doc.text("Endereço", 150, y);
      
      y += 7;
      doc.setFont("normal");
      
      // Linha separadora
      doc.line(14, y - 2, 200, y - 2);
      
      // Dados
      pontos.forEach((ponto) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(ponto.nome.substring(0, 30), 14, y);
        doc.text(ponto.latitude.toFixed(5), 70, y);
        doc.text(ponto.longitude.toFixed(5), 110, y);
        doc.text((ponto.endereco || "-").substring(0, 25), 150, y);
        
        y += 7;
      });
      
      const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
      
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=mapa.pdf",
        },
      });
    }

    return NextResponse.json(
      { error: "Formato não suportado" },
      { status: 400 }
    );
  } catch (error: any) {
    const status = error.message.includes("permissão") ? 403 : 401;
    return NextResponse.json(
      { error: error.message || "Erro ao exportar mapa" },
      { status }
    );
  }
}
