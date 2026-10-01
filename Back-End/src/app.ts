import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { migrate } from 'drizzle-orm/mysql2/migrator'; // <--- 1. IMPORTAR MIGRATE

import produtosRoutes from './routes/produtos.js';
import usuariosRoutes from './routes/usuarios.js';
import vendasRoutes from './routes/vendas.js';
import uploadRoutes from './routes/upload.js';
import bannersRoutes from './routes/banners.js';
import favoritosRoutes from './routes/favoritos.js';

import conexao, { criarBanco } from './database/conexao.js';
import { db } from './database/db.js'; // <--- 2. IMPORTAR DB
import { criarAdminPadrao, criarBannersPadrao } from './database/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use('/produtos', produtosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/vendas', vendasRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/banners', bannersRoutes);
app.use('/upload', uploadRoutes);
app.use('/favoritos', favoritosRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API do Sorriso do Cerrado está funcionando!');
});

const esperarMySQL = async () => {
  for (let i = 0; i < 30; i++) {
    try {
      await conexao.query('SELECT 1');
      console.log('MySQL conectado ✔');
      return;
    } catch (err) {
      console.log('Aguardando MySQL no container...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('MySQL não respondeu a tempo');
};

async function inicializarServidor() {
  try {
    await esperarMySQL();
    await criarBanco();

    // <--- 3. CRIA AS TABELAS AUTOMATICAMENTE USANDO AS MIGRATIONS DO DRIZZLE
    console.log('⏳ Executando migrations do Drizzle...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Tabelas criadas com sucesso!');

    await criarAdminPadrao();
    await criarBannersPadrao();
    console.log('✅ Banco de dados e seeds inicializados com sucesso!');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor HTTP rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao inicializar o servidor:', err);
  }
}

inicializarServidor();

export default app;