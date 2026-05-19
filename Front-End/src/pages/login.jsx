import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/authContext';
import BarraNavegacao from '../componentes/barraNavegacao.jsx';
import Rodape from '../componentes/rodape.jsx';
import styles from './login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/usuarios/login', {
        email,
        senha: password
      });

      login(response.data.token);

      const payload = JSON.parse(atob(response.data.token.split('.')[1]));

      alert('Login realizado com sucesso!');

      if (payload.papel === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao tentar fazer login.');
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