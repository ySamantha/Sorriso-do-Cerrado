import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const conexao = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

conexao.getConnection()
  .then(() => console.log('Conectado ao banco de dados MySQL.'))
  .catch((err) => console.error('Erro ao conectar ao banco:', err));

export default conexao;
