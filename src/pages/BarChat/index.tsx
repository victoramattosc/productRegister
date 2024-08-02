import React from 'react';
import styles from './BarChat.module.scss';

interface BarChatProps {
  produtosPorMes: { [mes: string]: number };
}

const BarChat: React.FC<BarChatProps> = ({ produtosPorMes }) => {
  const maxQuantidade = Math.max(...Object.values(produtosPorMes));
  
  return (
    <div className={styles.barChatContainer}>
      {Object.entries(produtosPorMes).map(([mes, quantidade]) => (
        <div key={mes} className={styles.barContainer}>
          <div 
            className={styles.bar} 
            style={{ height: `${(quantidade / maxQuantidade) * 100}%` }}
            title={`${quantidade} produto(s)`}
          ></div>
          <span className={styles.barLabel}>{mes}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChat;
