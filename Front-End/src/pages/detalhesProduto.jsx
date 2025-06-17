
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/carrinhoContext.jsx';
import BarraNavegacao from '../componentes/barraNavegacao.jsx';
import Rodape from '../componentes/rodape.jsx';
import styles from './detalhesProduto.module.css'; 

function DetalheProduto() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/produtos/${id}`);
        setProduto(response.data);
      } catch (err) {
        setError("Não foi possível carregar os dados do produto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduto();
  }, [id]);

  const handleAddToCart = () => {
    if (produto) {
      const produtoParaAdicionar = {
        id: produto.id,
        name: produto.nome,
        price: produto.preco,
        imageUrl: produto.imagemURL,
      };
      addToCart(produtoParaAdicionar);
    }
  };

  if (loading) return <div>A carregar...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <BarraNavegacao />
      <main className="conteudo-geral" style={{ padding: '2rem' }}>
        {produto && (
          <div className={styles.detalheProdutoContainer}>
            <img src={produto.imagemURL} alt={produto.nome} className={styles.detalheProdutoImagem} />
            <div className={styles.detalheProdutoInfo}>
              <h1>{produto.nome}</h1>
              <p className={styles.detalheProdutoPreco}>R$ {produto.preco}</p>
              <p className={styles.detalheProdutoDescricao}>{produto.descricao}</p>
              <button onClick={handleAddToCart} className={styles.botaoComprar}>Adicionar ao Carrinho</button>
            </div>
          </div>
        )}
      </main>
      <Rodape />
    </div>
  );
}

export default DetalheProduto;