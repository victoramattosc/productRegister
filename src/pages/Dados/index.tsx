// /src/pages/Dados/index.tsx
import React, { useEffect, useState } from 'react';
import { dataCadastrador1, dataCadastrador2 } from "../Data/data";
import styles from "./Dados.module.scss";
import BarChat from '../BarChat'; 

interface Produto {
  data: string;
  produto: string;
}

interface DadosProps {
  cadastrador: string;
}

const DadosPage: React.FC<DadosProps> = ({ cadastrador }) => {
  const data = cadastrador === 'Cadastrador1' ? dataCadastrador1 : dataCadastrador2;
  const [quantidadeTotal, setQuantidadeTotal] = useState<number>(0);
  const [quantidadeAntes, setQuantidadeAntes] = useState<number>(0);
  const [quantidadeDepois, setQuantidadeDepois] = useState<number>(0);
  const [mediaAntes, setMediaAntes] = useState<number>(0);
  const [mediaDepois, setMediaDepois] = useState<number>(0);
  const [aumentoMedia, setAumentoMedia] = useState<number>(0);
  const [listaProdutosPorMes, setListaProdutosPorMes] = useState<{ mes: string, quantidade: number }[]>([]);
  const [mediaMensal, setMediaMensal] = useState<number>(0);

  useEffect(() => {
    const produtosComDatas: Produto[] = data;

    const quantidadeTotal = produtosComDatas.length;
    setQuantidadeTotal(quantidadeTotal);

    const mediaAntes = 10; // Apenas um exemplo, substitua pela lógica
    const mediaDepois = 12;
    setMediaAntes(mediaAntes);
    setMediaDepois(mediaDepois);

    const aumentoMedia = ((mediaDepois - mediaAntes) / mediaAntes) * 100;
    setAumentoMedia(aumentoMedia);

    const listaProdutosPorMesArray = produtosComDatas.map(produto => ({
      mes: produto.data.slice(0, 7),
      quantidade: 1,
    }));
    setListaProdutosPorMes(listaProdutosPorMesArray);
    setMediaMensal(listaProdutosPorMesArray.length);
  }, [cadastrador]);

  return (
    <div className={styles.all}>
      <h2>Métricas de Produtos Cadastrados</h2>
      <p>Total de Produtos: {quantidadeTotal}</p>
      <p>Média Antes: {mediaAntes}</p>
      <p>Média Depois: {mediaDepois}</p>
      <p>Aumento Percentual: {Math.round(aumentoMedia)}%</p>
      <div className={styles.chart}>
        <BarChat listaProdutosPorMes={listaProdutosPorMes} />
      </div>
    </div>
  );
};

export default DadosPage;
