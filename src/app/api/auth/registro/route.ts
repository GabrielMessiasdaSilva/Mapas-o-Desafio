import { AuthService } from "@/services/AuthService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, nome, senha } = await req.json();

    if (!email || !nome || !senha) {
      return NextResponse.json(
        { error: "Email, nome e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const usuario = await AuthService.register(email, nome, senha);

    return NextResponse.json({ usuario });
  } catch (error: any) {
    const status = error.message.includes("já cadastrado") ? 409 : 400;
    return NextResponse.json(
      { error: error.message || "Erro ao criar conta" },
      { status }
    );
  }
}
