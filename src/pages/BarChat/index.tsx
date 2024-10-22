import React from 'react';
import styles from './BarChat.module.scss';

interface BarChatProps {
  listaProdutosPorMes: { mes: string, quantidade: number }[];
}

const obterNomeMes = (dataISO: string) => {
  const [ano, mes] = dataISO.split('-');
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${meses[parseInt(mes) - 1]} de ${ano}`;
};

const BarChat: React.FC<BarChatProps> = ({ listaProdutosPorMes }) => {
  // Garantimos que a maior quantidade seja maior que zero para evitar divisões por zero
  const maxQuantidade = Math.max(1, ...listaProdutosPorMes.map(item => item.quantidade));

  return (
    <div className={styles.barChatContainer}>
      {listaProdutosPorMes.map((item) => (
        <div key={item.mes} className={styles.barContainer}>
          <div 
            className={styles.bar} 
            style={{ height: `${(item.quantidade / maxQuantidade) * 100}%` }}
            title={`${item.quantidade} produto(s)`} 
          ></div>
          <span className={styles.barLabel}>{obterNomeMes(item.mes)}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChat;
