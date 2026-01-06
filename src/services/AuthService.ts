import { cookies } from "next/headers";
import { UsuarioRepository } from "@/repositories/UsuarioRepository";
import { hash, compare } from "bcryptjs";

export class AuthService {
  static async getCurrentUser() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) return null;

    return UsuarioRepository.findById(Number(userId));
  }

  static async login(email: string, senha: string) {
    const usuario = UsuarioRepository.findByEmailWithPassword(email);

    if (!usuario) {
      throw new Error("Email ou senha inválidos");
    }

    const senhaValida = await compare(senha, usuario.senha).catch(() => {
      return senha === usuario.senha; // Fallback para senhas não hasheadas
    });

    if (!senhaValida) {
      throw new Error("Email ou senha inválidos");
    }

    await this.setSession(usuario.id);

    return {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
    };
  }

  static async register(email: string, nome: string, senha: string) {
    if (senha.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    const usuarioExistente = UsuarioRepository.findByEmail(email);
    if (usuarioExistente) {
      throw new Error("Email já cadastrado");
    }

    const senhaHash = await hash(senha, 10);
    const userId = UsuarioRepository.create(email, nome, senhaHash);

    await this.setSession(userId);

    return {
      id: userId,
      email,
      nome,
    };
  }

  static async setSession(userId: number) {
    const cookieStore = await cookies();
    cookieStore.set("user_id", String(userId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });
  }

  static async clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete("user_id");
  }

  static async requireAuth() {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error("Não autenticado");
    }
    return user;
  }
}
