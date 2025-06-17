import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { useCart } from '../context/carrinhoContext.jsx';
import BarraNavegacao from '../componentes/barraNavegacao.jsx';
import Rodape from '../componentes/rodape.jsx';
import styles from './carrinho.module.css';

function Carrinho() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [compraFinalizada, setCompraFinalizada] = useState(false);

  const precoTotal = cartItems.reduce((total, item) => {
    const precoNumerico = parseFloat(item.price) || 0;
    return total + (precoNumerico * item.quantity);
  }, 0);

  const handleFinalizarCompra = () => {
    setCompraFinalizada(true);
    clearCart(); 
  };

  return (
    <div>
      <BarraNavegacao />
      <main className={styles.conteudoGeralCarrinho}>
        <h2>Seu Carrinho de Compras</h2>

        {compraFinalizada ? (
          <div className={styles.mensagemSucesso}>
            <h3>Parabéns pela sua compra!</h3>
            <p>Obrigada por escolher o artesanato do Sorriso do Cerrado. O seu pedido foi registado.</p>
            <p>Para combinar os detalhes do pagamento e da entrega, por favor, entre em contato conosco através do WhatsApp.</p>
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.linkWhatsapp}
            >
              Contactar via WhatsApp
            </a>
            <Link to="/produtos" className={styles.botaoVoltar}>
              Continuar a comprar
            </Link>
          </div>
        ) : (
          <>
            {cartItems.length === 0 ? (
              <p>O seu carrinho está vazio.</p>
            ) : (
              <>
                <div className={styles.tabelaCarrinho}>
                  {cartItems.map(item => (
                    <div key={item.id} className={styles.itemCarrinho}>
                      <img src={item.imageUrl} alt={item.name} className={styles.imagemProdutoCarrinho} />
                      <div className={styles.infoProdutoCarrinho}>
                        <h3>{item.name}</h3>
                        <p>Quantidade: {item.quantity}</p>
                        <p>Preço: R$ {parseFloat(item.price).toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className={styles.botaoRemover}>
                        Remover
                      </button>
                    </div>
                  ))}
                </div>

                <div className={styles.resumoCarrinho}>
                  <h3>Total: R$ {precoTotal.toFixed(2)}</h3>
                  <button onClick={handleFinalizarCompra} className={styles.botaoFinalizar}>Finalizar Compra</button>
                  <button onClick={clearCart} className={styles.botaoLimpar}>Limpar Carrinho</button>
                </div>
              </>
            )}
          </>
        )}
      </main>
      <Rodape />
    </div>
  );
}

export default Carrinho;