import { db } from "@/lib/db";
import type { Mapa } from "@/types";

export class MapaRepository {
  static findAllByUsuarioId(usuarioId: number): Mapa[] {
    return db
      .prepare(`
        SELECT m.*, 
        (SELECT COUNT(*) FROM pontos p WHERE p.mapa_id = m.id) as total_pontos
        FROM mapas m
        WHERE m.usuario_id = ?
        ORDER BY m.criado_em DESC
      `)
      .all(usuarioId) as Mapa[];
  }

  static findById(id: number): Mapa | null {
    const mapa = db
      .prepare("SELECT * FROM mapas WHERE id = ?")
      .get(id) as Mapa | undefined;

    return mapa || null;
  }

  static create(nome: string, usuarioId: number): number {
    const result = db
      .prepare("INSERT INTO mapas (nome, usuario_id, criado_em) VALUES (?, ?, ?)")
      .run(nome, usuarioId, new Date().toISOString());

    return result.lastInsertRowid as number;
  }

  static delete(id: number): void {
    db.prepare("DELETE FROM pontos WHERE mapa_id = ?").run(id);
    db.prepare("DELETE FROM mapas WHERE id = ?").run(id);
  }

  static belongsToUsuario(mapaId: number, usuarioId: number): boolean {
    const mapa = db
      .prepare("SELECT usuario_id FROM mapas WHERE id = ?")
      .get(mapaId) as { usuario_id: number } | undefined;

    return mapa?.usuario_id === usuarioId;
  }
}
