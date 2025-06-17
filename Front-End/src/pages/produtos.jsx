import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarraNavegacao from '../componentes/barraNavegacao.jsx';
import Rodape from '../componentes/rodape.jsx';
import CartaoProduto from '../componentes/cards.jsx';
import styles from './produtos.module.css';

function Produtos() {
  const [listaDeProdutos, setListaDeProdutos] = useState([]);
  const [termoDeBusca, setTermoDeBusca] = useState('');

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/produtos');
        setListaDeProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar os produtos:", error);
      }
    };
    buscarProdutos();
  }, []);

  const produtosFiltrados = listaDeProdutos.filter(produto => 
    produto.nome.toLowerCase().includes(termoDeBusca.toLowerCase())
  );

  return (
    <div>
      <BarraNavegacao />
      <main className={styles.conteudoGeral}>
        <section className={styles.secaoProdutosDestaque}>
          <h2>Nosso Catálogo</h2>
          <p>Explore todos os nossos produtos feitos à mão com carinho.</p>
          
          <input 
            type="text"
            className={styles.campoBusca}
            placeholder="Buscar por nome..."
            value={termoDeBusca}
            onChange={e => setTermoDeBusca(e.target.value)}
          />
          
          <div className={styles.gradeProdutosDestaque}>
            {produtosFiltrados.map(produto => (
              <CartaoProduto key={produto.id} product={produto} />
            ))}
          </div>
        </section>
      </main>
      <Rodape />
    </div>
  );
}

export default Produtos;