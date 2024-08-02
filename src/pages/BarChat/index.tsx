import React from 'react';
import styles from './BarChat.module.scss';

interface BarChatProps {
  listaProdutosPorMes: { mes: string, quantidade: number }[];
}

const BarChat: React.FC<BarChatProps> = ({ listaProdutosPorMes }) => {
  const maxQuantidade = Math.max(...listaProdutosPorMes.map(item => item.quantidade));
  
  return (
    <div className={styles.barChatContainer}>
      {listaProdutosPorMes.map((item) => (
        <div key={item.mes} className={styles.barContainer}>
          <div 
            className={styles.bar} 
            style={{ height: `${(item.quantidade / maxQuantidade) * 100}%` }}
            title={`${item.quantidade} produto(s)`}
          ></div>
          <span className={styles.barLabel}>{item.mes}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChat;
