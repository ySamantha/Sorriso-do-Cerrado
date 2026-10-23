import { db } from "../database/db.js";
import { categorias } from "../database/schema.js";

export interface Categoria {
    id?: number;
    nome: string;
}

const CategoriaModel = {
    listarTodas: async (): Promise<Categoria[]> => {
        return await db
            .select()
            .from(categorias);
    },
};

export default CategoriaModel;