import React from 'react';
import styles from './rodape.module.css';

function Rodape() { 
  return (
    <footer className={styles.rodape}> 
      <p>&copy; {new Date().getFullYear()} Sorriso do Cerrado. Todos os direitos reservados.</p>
    </footer>
  );
}

export default Rodape;