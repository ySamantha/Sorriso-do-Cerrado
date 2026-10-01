import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'sorriso_mysql';
const DB_PORT = Number(process.env.DB_PORT) || 3306; // <--- Alterado para 3306
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_NAME = process.env.DB_NAME || 'sorrisodb';

const baseConexao = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10
});

export const criarBanco = async () => {
  await baseConexao.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``
  );
};

export const conexao = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

export default conexao;