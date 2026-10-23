import { eq } from "drizzle-orm";
import { db } from "../database/db.js";
import { user } from "../database/schema.js";

export const UsuarioModel = {
  buscarPorEmail: async (email: string) => {
    const resultado = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    return resultado[0] ?? null;
  },

  buscarPorId: async (id: string) => {
    const resultado = await db
      .select()
      .from(user)
      .where(eq(user.id, id));

    return resultado[0] ?? null;
  },

  listarTodos: async () => {
    return await db
      .select({
        id: user.id,
        nome: user.name,
        email: user.email,
        papel: user.papel,
      })
      .from(user);
  },

  deletar: async (id: string) => {
    const resultado = await db
      .delete(user)
      .where(eq(user.id, id));

    return resultado[0].affectedRows > 0;
  },
};

export default UsuarioModel;