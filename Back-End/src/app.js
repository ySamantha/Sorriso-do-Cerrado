import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conexao from './database/conexao.js';
import produtosRoutes from './routes/produtos.js';
import usuariosRoutes from './routes/usuarios.js';
import vendasRoutes from './routes/vendas.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173' 
}));

app.use(express.json());

app.use('/produtos', produtosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/vendas', vendasRoutes); 

app.get('/', (req, res) => {
  res.send('API do Sorriso do Cerrado está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
