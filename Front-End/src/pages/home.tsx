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

  const { isAdmin } = useAuth();

  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

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
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const response = await axios.get(
          'http://localhost:3000/favoritos',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFavoritosIds(
          response.data.map((fav: Produto) => fav.id)
        );
      } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
      }
    }
  };

  const alterarBanner = async (
    bannerId: number,
    arquivo: File
  ) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Você precisa estar autenticado como administrador para alterar o banner.');
        return;
      }

      const formData = new FormData();
      formData.append('imagem', arquivo);

      await axios.put(
        `http://localhost:3000/banners/${bannerId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  }, []);

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
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={styles.banner}
            >
              <img
                src={banner.imagemURL}
                alt={banner.titulo}
              />

              {isAdmin && (
                <>
                  <button
                    className={styles.botaoEditarBanner}
                    onClick={() =>
                      inputRefs.current[banner.id]?.click()
                    }
                  >
                    Editar
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={(el) => {
                      inputRefs.current[banner.id] = el;
                    }}
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
      </header>

      <main className={styles.conteudoGeral}>
        <section className={styles.secaoProdutosDestaque}>
          <h2>Produtos em Destaque</h2>

          <div className={styles.gradeProdutosDestaque}>
            {produtosDestaque.map((produto) => (
              <CartaoProduto
                key={produto.id}
                product={produto}
                favoritadoInicial={favoritosIds.includes(
                  produto.id
                )}
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