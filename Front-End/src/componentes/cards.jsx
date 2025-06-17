import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/carrinhoContext';
import styles from './cards.module.css';

function CartaoProduto({ product }) { 
  const { addToCart } = useCart();

  const handleAddToCart = (event) => {
    event.preventDefault();
    
    addToCart({
        id: product.id,
        name: product.nome, 
        price: product.preco, 
        imageUrl: product.imagemURL,
      });
  };

  const precoNumerico = parseFloat(product.preco) || 0;

  return (
    <Link to={`/produto/${product.id}`} className={styles.cartaoProdutoLink}>
      <div className={styles.cartaoProduto}> 
        <img src={product.imagemURL || ''} alt={product.nome} className={styles.cartaoProdutoImagem} />
        <h3 className={styles.cartaoProdutoNome}>{product.nome}</h3>
        <p className={styles.cartaoProdutoPreco}>R$ {precoNumerico.toFixed(2)}</p>
        
        <button onClick={handleAddToCart} className={styles.botaoAdicionar}>
          Adicionar ao Carrinho
        </button>
      </div>
    </Link>
  );
}

export default CartaoProduto;