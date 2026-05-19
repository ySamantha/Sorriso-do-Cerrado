import { useState } from 'react';
import BarraNavegacao from '../componentes/barraNavegacao.jsx';
import Rodape from '../componentes/rodape.jsx';
import styles from './editarDados.module.css';

function EditarDados() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const resposta = await fetch('http://localhost:3000/usuarios/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nome, email })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.error);
        return;
      }

      alert('Dados atualizados com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar dados');
    }
  };

  return (
    <>
      <BarraNavegacao />

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Editar Dados</h1>
          <p className={styles.subtitulo}>
            Atualize suas informações pessoais
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>

            <input
              className={styles.input}
              type="text"
              placeholder="Novo nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <input
              className={styles.input}
              type="email"
              placeholder="Novo email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className={styles.botao} type="submit">
              Salvar alterações
            </button>

          </form>
        </div>
      </div>

      <Rodape />
    </>
  );
}

export default EditarDados;