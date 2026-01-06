import { AuthService } from "@/services/AuthService";
import { NextResponse } from "next/server";

export async function POST() {
  await AuthService.clearSession();
  return NextResponse.json({ ok: true });
}
