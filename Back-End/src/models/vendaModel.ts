import { db } from "../database/db.js";
import { vendas } from "../database/schema.js";

export interface Venda {
  id?: number;
  nomeCliente: string;
  emailCliente?: string | null;
  telefoneCliente?: string | null;
  total?: number | string | null;
  status?: "pendente" | "confirmada" | "cancelada" | null;
}

const VendaModel = {
  listarTodas: async (): Promise<Venda[]> => {
    return await db.select().from(vendas);
  },

  criar: async (venda: Venda): Promise<Venda> => {
    const resultado = await db.insert(vendas).values({
      nomeCliente: venda.nomeCliente,
      emailCliente: venda.emailCliente,
      telefoneCliente: venda.telefoneCliente,
      total: venda.total != null ? String(venda.total) : undefined,
      status: venda.status ?? "pendente",
    });

    return {
      id: Number(resultado[0].insertId),
      ...venda,
    };
  },
};

export default VendaModel;