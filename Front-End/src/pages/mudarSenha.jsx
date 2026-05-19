import { useState } from 'react';
import BarraNavegacao from '../componentes/barraNavegacao.jsx';
import Rodape from '../componentes/rodape.jsx';
import styles from './mudarSenha.module.css';

function MudarSenha() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      alert('Senhas não coincidem');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const resposta = await fetch('http://localhost:3000/usuarios/mudar-senha', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          senhaAtual,
          novaSenha
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.error);
        return;
      }

      alert('Senha alterada com sucesso');

      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');

    } catch (error) {
      alert('Erro ao alterar senha');
    }
  };

  return (
    <>
      <BarraNavegacao />

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Mudar senha</h1>
          <p className={styles.subtitulo}>Atualize sua senha de acesso</p>

          <form onSubmit={handleSubmit} className={styles.form}>

            <input
              className={styles.input}
              type="password"
              placeholder="Senha atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />

            <input
              className={styles.input}
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />

            <input
              className={styles.input}
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />

            <button className={styles.botao} type="submit">
              Alterar senha
            </button>

          </form>
        </div>
      </div>

      <Rodape />
    </>
  );
}

export default MudarSenha;