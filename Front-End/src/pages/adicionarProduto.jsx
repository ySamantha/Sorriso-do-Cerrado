import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BarraNavegacao from '../componentes/barraNavegacao.jsx';
import Rodape from '../componentes/rodape.jsx';
import styles from './login.module.css'; 

function AdicionarProduto() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [imagemURL, setImagemURL] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const novoProduto = { 
      nome, 
      descricao, 
      preco: parseFloat(preco),
      estoque: parseInt(estoque, 10),
      imagemURL 
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/produtos', novoProduto, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Produto adicionado com sucesso!');
      navigate('/admin');

    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      setError(err.response?.data?.message || 'Falha ao adicionar o produto.');
    }
  };

  return (
    <div>
      <BarraNavegacao />
      <main className="conteudo-geral" style={{ padding: '2rem' }}>
        <div className={styles.formularioContainer}>
          <form onSubmit={handleSubmit}>
            <h2>Adicionar Novo Produto</h2>

            <div className={styles.campoFormulario}>
              <label htmlFor="nome">Nome do Produto</label>
              <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className={styles.campoFormulario}>
              <label htmlFor="descricao">Descrição</label>
              <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="4"></textarea>
            </div>
            <div className={styles.campoFormulario}>
              <label htmlFor="preco">Preço </label>
              <input type="number" id="preco" value={preco} onChange={(e) => setPreco(e.target.value)} required step="0.01" />
            </div>
            <div className={styles.campoFormulario}>
              <label htmlFor="estoque">Estoque</label>
              <input type="number" id="estoque" value={estoque} onChange={(e) => setEstoque(e.target.value)} required />
            </div>
            <div className={styles.campoFormulario}>
              <label htmlFor="imagemURL">URL da Imagem</label>
              <input type="text" id="imagemURL" value={imagemURL} onChange={(e) => setImagemURL(e.target.value)} />
            </div>
            {error && <p className={styles.mensagemErro}>{error}</p>}
            <button type="submit" className={styles.botaoSubmit}>Salvar Produto</button>
          </form>
        </div>
      </main>
      <Rodape />
    </div>
  );
}

export default AdicionarProduto;