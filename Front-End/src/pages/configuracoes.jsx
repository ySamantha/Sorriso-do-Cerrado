import { Link } from 'react-router-dom';
import { useAuth } from '../auth/authContext';

function Configuracoes() {
  const { isAdmin } = useAuth();

  return (
    <div style={{ padding: '30px' }}>
      <h1>Configurações</h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginTop: '20px'
        }}
      >
        <Link to="/editar-dados">
          Editar Dados
        </Link>

        <Link to="/mudar-senha">
          Mudar Senha
        </Link>

        {isAdmin && (
          <Link to="/admin">
            Painel Administrativo
          </Link>
        )}
      </div>
    </div>
  );
}

export default Configuracoes;