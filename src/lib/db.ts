import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.resolve("db.sqlite");

// Cria o banco se não existir
if (!fs.existsSync(dbPath)) {
  const db = new Database(dbPath);

  // Tabela mapas
  db.prepare(`
    CREATE TABLE mapas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      criado_em TEXT NOT NULL
    )
  `).run();

  // Tabela pontos
  db.prepare(`
    CREATE TABLE pontos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mapa_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      endereco TEXT,
      altitude REAL,
      FOREIGN KEY (mapa_id) REFERENCES mapas(id) ON DELETE CASCADE
    )
  `).run();

  db.close();
}

export const db = new Database(dbPath);
