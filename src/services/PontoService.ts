import { PontoRepository } from "@/repositories/PontoRepository";
import { MapaService } from "./MapaService";

export class PontoService {
  static async listarPontos(mapaId: number) {
    await MapaService.verificarPermissao(mapaId);
    return PontoRepository.findAllByMapaId(mapaId);
  }

  static async criarPonto(
    mapaId: number,
    nome: string,
    latitude: number,
    longitude: number,
    endereco?: string,
    altitude?: number
  ) {
    await MapaService.verificarPermissao(mapaId);
    return PontoRepository.create(mapaId, nome, latitude, longitude, endereco, altitude);
  }

  static async excluirPonto(id: number) {
    const ponto = PontoRepository.findById(id);
    if (!ponto) {
      throw new Error("Ponto não encontrado");
    }

    await MapaService.verificarPermissao(ponto.mapa_id);
    PontoRepository.delete(id);
  }

  static async excluirTodosPontos(mapaId: number) {
    await MapaService.verificarPermissao(mapaId);
    PontoRepository.deleteAllByMapaId(mapaId);
  }
}
