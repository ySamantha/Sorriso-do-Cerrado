import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../auth/auth-client';
import BarraNavegacao from '../componentes/barraNavegacao';
import Rodape from '../componentes/rodape';
import styles from './login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const { data, error: err } = await signIn.email({
      email,
      password,
    });

    if (err) {
      setError(err.message || 'Erro ao tentar fazer login.');
    } else {
      alert('Login realizado com sucesso!');
      navigate('/');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <BarraNavegacao />
      <main style={{ padding: '2rem', flex: 1 }}>
        <div className={styles.formularioContainer}>
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className={styles.campoFormulario}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.campoFormulario}>
              <label>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className={styles.mensagemErro}>{error}</p>}
            <button className={styles.botaoSubmit} type="submit">
              Entrar
            </button>
            <Link to="/cadastro">
              <button type="button" className={styles.botaoCadastro}>
                Registrar
              </button>
            </Link>
          </form>
        </div>
      </main>
      <Rodape />
    </div>
  );
}

export default Login;