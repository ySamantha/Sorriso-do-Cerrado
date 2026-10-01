import { drizzle } from "drizzle-orm/mysql2";
import conexao from "./conexao.js";

export const db = drizzle(conexao);