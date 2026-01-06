import { db } from "@/lib/db";
import type { Usuario } from "@/types";

export class UsuarioRepository {
  static findByEmail(email: string): Usuario | null {
    const usuario = db
      .prepare("SELECT id, email, nome, criado_em FROM usuarios WHERE email = ?")
      .get(email) as Usuario | undefined;

    return usuario || null;
  }

  static findById(id: number): Usuario | null {
    const usuario = db
      .prepare("SELECT id, email, nome, criado_em FROM usuarios WHERE id = ?")
      .get(id) as Usuario | undefined;

    return usuario || null;
  }

  static findByEmailWithPassword(email: string) {
    return db
      .prepare("SELECT * FROM usuarios WHERE email = ?")
      .get(email) as { id: number; email: string; nome: string; senha: string } | undefined;
  }

  static create(email: string, nome: string, senhaHash: string): number {
    const result = db
      .prepare("INSERT INTO usuarios (email, nome, senha, criado_em) VALUES (?, ?, ?, ?)")
      .run(email, nome, senhaHash, new Date().toISOString());

    return result.lastInsertRowid as number;
  }
}
