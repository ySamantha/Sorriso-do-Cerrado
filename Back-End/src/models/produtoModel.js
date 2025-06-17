import conexao from '../database/conexao.js';

const ProdutoModel = {
  listarTodos: async () => {
    const [rows] = await conexao.query('SELECT * FROM produtos');
    return rows;
  },

  criar: async (produto) => {
    const { nome, descricao, preco, imagem_url } = produto;
    const sql = 'INSERT INTO produtos (nome, descricao, preco, imagem_url) VALUES (?, ?, ?, ?)';
    const [result] = await conexao.query(sql, [nome, descricao, preco, imagem_url]);
    return { id: result.insertId, ...produto };
  }
};

export default ProdutoModel;
