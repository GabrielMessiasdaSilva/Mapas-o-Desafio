import { AuthService } from "@/services/AuthService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, senha } = await req.json();

    if (!email || !senha) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const usuario = await AuthService.login(email, senha);

    return NextResponse.json({ usuario });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao fazer login" },
      { status: 401 }
    );
  }
}
