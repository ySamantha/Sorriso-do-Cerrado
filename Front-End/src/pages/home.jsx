import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarraNavegacao from '../componentes/barraNavegacao.jsx';
import CartaoProduto from '../componentes/cards.jsx';
import Rodape from '../componentes/rodape.jsx';
import { imagens } from '../imagens';
import styles from './home.module.css';

function Home() {
  const [produtosDestaque, setProdutosDestaque] = useState([]);

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/produtos');
        setProdutosDestaque(response.data.slice(0, 3));
      } catch (error) {
        console.error("Erro ao buscar produtos em destaque:", error);
      }
    };
    buscarProdutos();
  }, []);

  return (
    <div className={styles.containerPaginaInicial}>
      <BarraNavegacao />
      <header className={styles.secaoPrincipal}>
        <img 
            src={imagens.principal} 
            alt="Mesa de madeira com artesanato ao fundo de uma paisagem do Cerrado" 
            className={styles.imagemPrincipal}
        />
      </header>
      <main className={styles.conteudoGeral}>
        <section className={styles.secaoProdutosDestaque}>
          <h2>Produtos em Destaque</h2>
          <div className={styles.gradeProdutosDestaque}>
            {produtosDestaque.map(produto => (
              <CartaoProduto key={produto.id} product={produto} />
            ))}
          </div>
        </section>
      </main>
      <Rodape />
    </div>
  );
}

export default Home;