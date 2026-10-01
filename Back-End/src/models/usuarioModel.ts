import { eq } from "drizzle-orm";
import { db } from "../database/db.js";
import { usuarios } from "../database/schema.js";

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  papel?: "admin" | "artesa" | "cliente" | null;
}

const UsuarioModel = {
  buscarPorEmail: async (email: string): Promise<Usuario | null> => {
    const resultado = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email));

    return resultado[0] ?? null;
  },

  buscarPorId: async (id: string | number): Promise<Usuario | null> => {
    const resultado = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, Number(id)));

    return resultado[0] ?? null;
  },

  listarTodos: async (): Promise<Omit<Usuario, "senha">[]> => {
    const resultado = await db
      .select({
        id: usuarios.id,
        nome: usuarios.nome,
        email: usuarios.email,
        papel: usuarios.papel,
      })
      .from(usuarios);

    return resultado;
  },

  criar: async (usuario: Usuario): Promise<Usuario> => {
    const resultado = await db.insert(usuarios).values({
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
      papel: usuario.papel ?? "cliente",
    });

    return {
      id: Number(resultado[0].insertId),
      ...usuario,
    };
  },

  atualizar: async (
    id: string | number,
    usuario: { nome: string; email: string }
  ): Promise<boolean> => {
    const resultado = await db
      .update(usuarios)
      .set({
        nome: usuario.nome,
        email: usuario.email,
      })
      .where(eq(usuarios.id, Number(id)));

    return resultado[0].affectedRows > 0;
  },

  deletar: async (id: string | number): Promise<boolean> => {
    const resultado = await db
      .delete(usuarios)
      .where(eq(usuarios.id, Number(id)));

    return resultado[0].affectedRows > 0;
  },
};

export default UsuarioModel;