import { db } from "@/lib/db";
import type { Ponto } from "@/types";

export class PontoRepository {
  static findAllByMapaId(mapaId: number): Ponto[] {
    return db
      .prepare("SELECT * FROM pontos WHERE mapa_id = ?")
      .all(mapaId) as Ponto[];
  }

  static findById(id: number): Ponto | null {
    const ponto = db
      .prepare("SELECT * FROM pontos WHERE id = ?")
      .get(id) as Ponto | undefined;

    return ponto || null;
  }

  static create(
    mapaId: number,
    nome: string,
    latitude: number,
    longitude: number,
    endereco?: string,
    altitude?: number
  ): number {
    const result = db
      .prepare(
        "INSERT INTO pontos (mapa_id, nome, latitude, longitude, endereco, altitude) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(mapaId, nome, latitude, longitude, endereco || null, altitude || null);

    return result.lastInsertRowid as number;
  }

  static delete(id: number): void {
    db.prepare("DELETE FROM pontos WHERE id = ?").run(id);
  }

  static deleteAllByMapaId(mapaId: number): void {
    db.prepare("DELETE FROM pontos WHERE mapa_id = ?").run(mapaId);
  }
}
