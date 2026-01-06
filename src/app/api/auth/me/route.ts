import { AuthService } from "@/services/AuthService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const usuario = await AuthService.getCurrentUser();

    if (!usuario) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    return NextResponse.json({ usuario });
  } catch (error) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
}
