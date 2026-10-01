import { eq, and } from "drizzle-orm";
import { db } from "../database/db.js";
import { favoritos, produtos } from "../database/schema.js";

const FavoritoModel = {
  listarPorUsuario: async (usuarioId: number) => {
    return await db
      .select({
        id: produtos.id,
        nome: produtos.nome,
        descricao: produtos.descricao,
        preco: produtos.preco,
        estoque: produtos.estoque,
        imagemURL: produtos.imagemURL,
      })
      .from(favoritos)
      .innerJoin(produtos, eq(favoritos.produtoId, produtos.id))
      .where(eq(favoritos.usuarioId, usuarioId));
  },

  adicionar: async (usuarioId: number, produtoId: number) => {
    const existente = await db
      .select()
      .from(favoritos)
      .where(
        and(
          eq(favoritos.usuarioId, usuarioId),
          eq(favoritos.produtoId, produtoId)
        )
      );

    if (existente.length > 0) {
      return false;
    }

    await db.insert(favoritos).values({
      usuarioId,
      produtoId,
    });

    return true;
  },

  remover: async (usuarioId: number, produtoId: number) => {
    const resultado = await db
      .delete(favoritos)
      .where(
        and(
          eq(favoritos.usuarioId, usuarioId),
          eq(favoritos.produtoId, produtoId)
        )
      );

    return resultado[0].affectedRows > 0;
  },
};

export default FavoritoModel;