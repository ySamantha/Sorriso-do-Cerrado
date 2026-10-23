import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import BarraNavegacao from '../componentes/barraNavegacao';
import CartaoProduto from '../componentes/cards';
import Rodape from '../componentes/rodape';

import { imagens } from '../imagens';
import { useAuth } from '../auth/authContext';

import styles from './home.module.css';

interface Produto {
  id: number;
  nome: string;
  preco: string | number;
  imagemURL?: string;
}

interface Banner {
  id: number;
  titulo: string;
  imagemURL: string;
}

function Home() {
  const [produtosDestaque, setProdutosDestaque] = useState<Produto[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [favoritosIds, setFavoritosIds] = useState<number[]>([]);

  const { isAdmin, isAuthenticated } = useAuth();

  const carrosselRef = useRef<HTMLDivElement>(null);

  const navegarBanners = (direcao: number) => {
    const carrossel = carrosselRef.current;
    const primeiroBanner = carrossel?.querySelector<HTMLElement>(
      '[data-banner-card]',
    );
    const faixa = primeiroBanner?.parentElement;

    if (!carrossel || !primeiroBanner || !faixa) {
      return;
    }

    const espacamento = Number.parseFloat(getComputedStyle(faixa).columnGap) || 0;
    carrossel.scrollBy({
      left: direcao * (primeiroBanner.offsetWidth + espacamento),
      behavior: 'smooth',
    });
  };

  const buscarProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/produtos');
      setProdutosDestaque(response.data.slice(0, 3));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const buscarBanners = async () => {
    try {
      const response = await axios.get('http://localhost:3000/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Erro ao buscar banners:', error);
    }
  };

  const buscarFavoritos = async () => {
    if (isAuthenticated) {
      try {
        const response = await axios.get('http://localhost:3000/favoritos', {
          withCredentials: true,
        });

        setFavoritosIds(response.data.map((fav: Produto) => fav.id));
      } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
      }
    }
  };

  const alterarBanner = async (bannerId: number, arquivo: File) => {
    try {
      const formData = new FormData();
      formData.append('imagem', arquivo);

      await axios.put(`http://localhost:3000/banners/${bannerId}`, formData, {
        withCredentials: true,
      });

      await buscarBanners();
      alert('Banner atualizado com sucesso!');
    } catch (error: unknown) {
      console.error('Erro ao atualizar banner:', error);
      const mensagem = axios.isAxiosError(error)
        ? error.response?.data?.error
        : undefined;
      alert(mensagem || 'Erro ao atualizar banner.');
    }
  };

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      await buscarFavoritos();
      await buscarProdutos();
      await buscarBanners();
    };

    carregarDadosIniciais();
  }, [isAuthenticated]);

  return (
    <div className={styles.containerPaginaInicial}>
      <BarraNavegacao />

      <header className={styles.secaoPrincipal}>
        <img
          src={imagens.principal}
          alt="Banner principal"
          className={styles.imagemPrincipal}
        />

        <div className={styles.bannersContainer}>
          {banners.length > 0 && (
            <div
              className={styles.carrossel}
              ref={carrosselRef}
              role="region"
              aria-label="Banners em destaque"
              aria-roledescription="carrossel"
            >
              <div className={styles.faixaCarrossel}>
                {banners.map((banner) => (
                  <div
                    className={styles.banner}
                    key={banner.id}
                    data-banner-card
                  >
                    <img src={banner.imagemURL} alt={banner.titulo} />

                    {isAdmin && (
                      <>
                        <button
                          className={styles.botaoEditarBanner}
                          onClick={(event) =>
                            event.currentTarget.parentElement
                              ?.querySelector<HTMLInputElement>(
                                'input[type="file"]',
                              )
                              ?.click()
                          }
                        >
                          Editar
                        </button>

                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const arquivo = e.target.files?.[0];

                            if (arquivo) {
                              alterarBanner(banner.id, arquivo);
                            }
                            e.target.value = '';
                          }}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.controleCarrossel} ${styles.anterior}`}
                onClick={() => navegarBanners(-1)}
                aria-label="Rolar para os banners anteriores"
              >
                &#10094;
              </button>
              <button
                type="button"
                className={`${styles.controleCarrossel} ${styles.proximo}`}
                onClick={() => navegarBanners(1)}
                aria-label="Rolar para os próximos banners"
              >
                &#10095;
              </button>
            </>
          )}
        </div>
      </header>

      <main className={styles.conteudoGeral}>
        <section className={styles.secaoProdutosDestaque}>
          <h2>Produtos em Destaque</h2>

          <div className={styles.gradeProdutosDestaque}>
            {produtosDestaque.map((produto) => (
              <CartaoProduto
                key={produto.id}
                product={produto}
                favoritadoInicial={favoritosIds.includes(produto.id)}
              />
            ))}
          </div>
        </section>
      </main>

      <Rodape />
    </div>
  );
}

export default Home;