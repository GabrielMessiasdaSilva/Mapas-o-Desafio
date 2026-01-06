import { MapaService } from "@/services/MapaService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mapas = await MapaService.listarMapas();
    return NextResponse.json(mapas);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Não autenticado" },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { nome } = await req.json();

    if (!nome) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    await MapaService.criarMapa(nome);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao criar mapa" },
      { status: 401 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    await MapaService.excluirMapa(id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error.message.includes("permissão") ? 403 : 401;
    return NextResponse.json(
      { error: error.message || "Erro ao excluir mapa" },
      { status }
    );
  }
}
