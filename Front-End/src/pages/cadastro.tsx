import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../auth/auth-client';
import BarraNavegacao from '../componentes/barraNavegacao';
import styles from './cadastro.module.css';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await signUp.email({
      email,
      password: senha,
      name: nome,
    });

    if (error) {
      alert(error.message || 'Erro ao cadastrar');
    } else {
      alert('Usuário cadastrado com sucesso!');
      navigate('/login');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <BarraNavegacao />
      <main className="conteudo-geral" style={{ padding: '2rem' }}>
        <div className={styles.formularioContainer}>
          <form onSubmit={handleSubmit}>
            <h2>Registrar-se</h2>
            <div className={styles.campoFormulario}>
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className={styles.campoFormulario}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.campoFormulario}>
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.botaoSubmit}>
              Registrar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Cadastro;