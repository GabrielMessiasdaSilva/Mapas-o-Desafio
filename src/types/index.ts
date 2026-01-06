export type Usuario = {
  id: number;
  email: string;
  nome: string;
  criado_em: string;
};

export type Mapa = {
  id: number;
  nome: string;
  usuario_id: number;
  criado_em: string;
  total_pontos?: number;
};

export type Ponto = {
  id: number;
  mapa_id: number;
  nome: string;
  latitude: number;
  longitude: number;
  endereco?: string;
  altitude?: number;
};
