import React, { useEffect, useState } from 'react';
import BarraNavegacao from '../componentes/barraNavegacao';
import Rodape from '../componentes/rodape';
import { authClient } from '../auth/auth-client';
import { useAuth } from '../auth/authContext';
import styles from './editarDados.module.css';

function EditarDados() {
  const { user } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setNome(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email !== user?.email) {
      const { error } = await authClient.changeEmail({
        newEmail: email,
        callbackURL: window.location.href,
      });

      if (error) {
        alert(error.message || 'Erro ao atualizar e-mail');
        return;
      }
    }

    const { error } = await authClient.updateUser({
      name: nome,
    });

    if (error) {
      alert(error.message || 'Erro ao atualizar dados');
      return;
    }

    alert('Dados atualizados com sucesso! Se solicitado, confirme a alteração do e-mail pelo link enviado.');
  };

  return (
    <>
      <BarraNavegacao />

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Editar Dados</h1>
          <p className={styles.subtitulo}>Atualize suas informações pessoais</p>

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
              placeholder="Novo e-mail"
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