import { eq } from "drizzle-orm";
import { db } from "../database/db.js";
import { produtos } from "../database/schema.js";

export interface Produto {
  id?: number;
  nome: string;
  descricao?: string | null;
  preco: number | string;
  estoque: number | null;
  imagemURL?: string | null;
}

const ProdutoModel = {
  listarTodos: async (): Promise<Produto[]> => {
    return await db.select().from(produtos);
  },

  buscarPorId: async (id: string | number): Promise<Produto | null> => {
    const resultado = await db
      .select()
      .from(produtos)
      .where(eq(produtos.id, Number(id)));

    return resultado[0] ?? null;
  },

  criar: async (produto: Produto): Promise<Produto> => {
    const { nome, descricao, preco, estoque, imagemURL } = produto;

    const resultado = await db.insert(produtos).values({
      nome,
      descricao,
      preco: String(preco),
      estoque,
      imagemURL,
    });

    return {
      id: Number(resultado[0].insertId),
      ...produto,
    };
  },

  atualizar: async (
    id: string | number,
    produto: Produto
  ): Promise<boolean> => {
    const { nome, descricao, preco, estoque, imagemURL } = produto;

    const resultado = await db
      .update(produtos)
      .set({
        nome,
        descricao,
        preco: String(preco),
        estoque,
        imagemURL,
      })
      .where(eq(produtos.id, Number(id)));

    return resultado[0].affectedRows > 0;
  },

  deletar: async (id: string | number): Promise<boolean> => {
    const resultado = await db
      .delete(produtos)
      .where(eq(produtos.id, Number(id)));

    return resultado[0].affectedRows > 0;
  },
};

export default ProdutoModel;