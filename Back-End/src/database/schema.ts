import {
  mysqlTable,
  int,
  varchar,
  text,
  decimal,
  mysqlEnum,
  datetime,
  boolean,
  unique,
} from "drizzle-orm/mysql-core";

export const usuarios = mysqlTable("usuarios", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  senha: varchar("senha", { length: 255 }).notNull(),
  papel: mysqlEnum("papel", ["admin", "artesa", "cliente"]).default("cliente"),
});

export const produtos = mysqlTable("produtos", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  estoque: int("estoque").default(0),
  imagemURL: varchar("imagemURL", { length: 255 }),
});

export const vendas = mysqlTable("vendas", {
  id: int("id").autoincrement().primaryKey(),
  nomeCliente: varchar("nome_cliente", { length: 100 }).notNull(),
  emailCliente: varchar("email_cliente", { length: 100 }),
  telefoneCliente: varchar("telefone_cliente", { length: 20 }),
  data: datetime("data").default(new Date()),
  total: decimal("total", { precision: 10, scale: 2 }),
  status: mysqlEnum("status", ["pendente", "confirmada", "cancelada"]).default("pendente"),
});

export const itensVenda = mysqlTable("itens_venda", {
  id: int("id").autoincrement().primaryKey(),
  idVenda: int("id_venda")
    .notNull()
    .references(() => vendas.id, { onDelete: "cascade" }),
  idProduto: int("id_produto")
    .notNull()
    .references(() => produtos.id, { onDelete: "cascade" }),
  quantidade: int("quantidade").notNull(),
  precoUnitario: decimal("preco_unitario", { precision: 10, scale: 2 }).notNull(),
});

export const favoritos = mysqlTable(
  "favoritos",
  {
    id: int("id").autoincrement().primaryKey(),
    usuarioId: int("id_usuario")
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
    produtoId: int("id_produto")
      .notNull()
      .references(() => produtos.id, { onDelete: "cascade" }),
    data: datetime("data").default(new Date()),
  },
  (table) => ({
    uniqueFav: unique("unique_fav").on(table.usuarioId, table.produtoId),
  })
);

export const banners = mysqlTable("banners", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 100 }),
  imagemURL: varchar("imagemURL", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }),
  ativo: boolean("ativo").default(true),
  ordem: int("ordem").default(0),
});