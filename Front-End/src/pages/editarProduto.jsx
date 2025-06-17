import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BarraNavegacao from '../componentes/barraNavegacao.jsx';
import Rodape from '../componentes/rodape.jsx';
import styles from './editarProduto.module.css';

function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [imagemURL, setImagemURL] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/produtos/${id}`);
        const produto = response.data; 
        
        if (produto) {
          setNome(produto.nome);
          setDescricao(produto.descricao);
          setPreco(produto.preco);
          setEstoque(produto.estoque);
          setImagemURL(produto.imagemURL || '');
        } else {
            setError("Produto não encontrado.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados do produto:", err);
        setError("Não foi possível carregar os dados do produto.");
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const produtoAtualizado = { nome, descricao, preco: parseFloat(preco), estoque: parseInt(estoque, 10), imagemURL };

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/produtos/${id}`, produtoAtualizado, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Produto atualizado com sucesso!');
      navigate('/admin');
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      setError(err.response?.data?.message || 'Falha ao atualizar o produto.');
    }
  };

  if (loading) {
    return <div>A carregar...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>
      <BarraNavegacao />
      <main className="conteudo-geral" style={{ padding: '2rem' }}>
        <div className={styles.formularioContainer}>
          <form onSubmit={handleSubmit}>
            <h2>Editar Produto</h2>
            
            <div className={styles.campoFormulario}>
              <label htmlFor="nome">Nome do Produto</label>
              <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            
            <div className={styles.campoFormulario}>
              <label htmlFor="descricao">Descrição</label>
              <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="4"></textarea>
            </div>

            <div className={styles.campoFormulario}>
              <label htmlFor="preco">Preço</label>
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
            <button type="submit" className={styles.botaoSubmit}>Salvar Alterações</button>
          </form>
        </div>
      </main>
      <Rodape />
    </div>
  );
}

export default EditarProduto;