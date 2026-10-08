import { asc, eq } from "drizzle-orm";
import { db } from "../database/db.js";
import { banners } from "../database/schema.js";

export interface Banner {
  id?: number;
  titulo?: string | null;
  imagemURL: string;
  link?: string | null;
  ordem?: number | null;
  ativo?: boolean | null;
}

const BannerModel = {
  listarTodos: async (): Promise<Banner[]> => {
    return await db
      .select()
      .from(banners)
      .orderBy(asc(banners.ordem));
  },

  listarAtivos: async (): Promise<Banner[]> => {
    return await db
      .select()
      .from(banners)
      .where(eq(banners.ativo, true))
      .orderBy(asc(banners.ordem));
  },

  buscarPorId: async (id: string | number): Promise<Banner | null> => {
    const resultado = await db
      .select()
      .from(banners)
      .where(eq(banners.id, Number(id)));

    return resultado[0] ?? null;
  },

  criar: async (banner: Banner): Promise<Banner> => {
    const { titulo, imagemURL, link, ordem } = banner;

    const resultado = await db.insert(banners).values({
      titulo,
      imagemURL,
      link,
      ordem: ordem ?? 0,
    });

    return {
      id: Number(resultado[0].insertId),
      ...banner,
    };
  },

  atualizar: async (
    id: string | number,
    dados: Partial<Banner>
  ): Promise<boolean> => {
    const bannerExistente = await db
      .select()
      .from(banners)
      .where(eq(banners.id, Number(id)));

    if (bannerExistente.length === 0) {
      return false;
    }

    await db
      .update(banners)
      .set(dados)
      .where(eq(banners.id, Number(id)));

    return true;
  },

  deletar: async (id: string | number): Promise<boolean> => {
    const resultado = await db
      .delete(banners)
      .where(eq(banners.id, Number(id)));

    return resultado[0].affectedRows > 0;
  },
};

export default BannerModel;