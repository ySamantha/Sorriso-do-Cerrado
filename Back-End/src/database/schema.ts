import {
  mysqlTable,
  varchar,
  text,
  int,
  boolean,
  datetime,
  mysqlEnum,
  decimal,
  unique,
} from "drizzle-orm/mysql-core";

// ==========================================
// TABELAS DO BETTER AUTH
// ==========================================

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: datetime("created_at").notNull(),
  updatedAt: datetime("updated_at").notNull(),
  papel: mysqlEnum("papel", ["admin", "artesa", "cliente"]).default("cliente"),
});

export const usuarios = user;

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: datetime("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: datetime("created_at").notNull(),
  updatedAt: datetime("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: datetime("access_token_expires_at"),
  refreshTokenExpiresAt: datetime("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: datetime("created_at").notNull(),
  updatedAt: datetime("updated_at").notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: datetime("expires_at").notNull(),
  createdAt: datetime("created_at"),
  updatedAt: datetime("updated_at"),
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
    usuarioId: varchar("id_usuario", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
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

