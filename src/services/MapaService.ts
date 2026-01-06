import { MapaRepository } from "@/repositories/MapaRepository";
import { AuthService } from "./AuthService";

export class MapaService {
  static async listarMapas() {
    const usuario = await AuthService.requireAuth();
    return MapaRepository.findAllByUsuarioId(usuario.id);
  }

  static async criarMapa(nome: string) {
    const usuario = await AuthService.requireAuth();
    return MapaRepository.create(nome, usuario.id);
  }

  static async excluirMapa(id: number) {
    const usuario = await AuthService.requireAuth();

    if (!MapaRepository.belongsToUsuario(id, usuario.id)) {
      throw new Error("Sem permissão para excluir este mapa");
    }

    MapaRepository.delete(id);
  }

  static async verificarPermissao(mapaId: number) {
    const usuario = await AuthService.requireAuth();
    return MapaRepository.belongsToUsuario(mapaId, usuario.id);
  }
}
