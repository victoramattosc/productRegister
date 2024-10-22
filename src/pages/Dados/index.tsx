import React, { useEffect, useState } from 'react';
import { dataCadastrador1 } from '../Data/dataVictor';
import { dataCadastrador2 } from '../Data/dataCarlos';
import styles from "./Dados.module.scss";
import BarChat from '../BarChat';

interface Produto {
  data: string;
  produto: string;
}

interface DadosProps {
  cadastrador: string;  // Definindo a prop cadastrador
}

const DadosPage: React.FC<DadosProps> = ({ cadastrador }) => {
  const [quantidadeTotal, setQuantidadeTotal] = useState<number>(0);
  const [quantidadeAntes, setQuantidadeAntes] = useState<number>(0);
  const [quantidadeDepois, setQuantidadeDepois] = useState<number>(0);
  const [diasParaAtingirQuantidade, setDiasParaAtingirQuantidade] = useState<number>(0);
  const [mediaAntes, setMediaAntes] = useState<number>(0);
  const [mediaDepois, setMediaDepois] = useState<number>(0);
  const [aumentoMedia, setAumentoMedia] = useState<number>(0);
  const [aumentoTotal, setAumentoTotal] = useState<number>(0);
  const [eficiencia, setEficiencia] = useState<number>(0);
  const [listaProdutosPorMes, setListaProdutosPorMes] = useState<{ mes: string, quantidade: number }[]>([]);
  const [mediaMensal, setMediaMensal] = useState<number>(0);

  useEffect(() => {
    const data = cadastrador === 'Cadastrador1' ? dataCadastrador1 : dataCadastrador2;

    const produtosComDatas: Produto[] = data.map((item: { data: string, produto: string }) => ({
      data: item.data,
      produto: item.produto
    }));

    const calcularMedia = (produtosPorDia: { [data: string]: number }, datasFiltradas: string[]) => {
      if (datasFiltradas.length === 0) return 0;
      const totalProdutos = datasFiltradas.reduce((total, data) => total + produtosPorDia[data], 0);
      return totalProdutos / datasFiltradas.length;
    };

    const calcularPorcentagemAumento = (valorAntigo: number, valorNovo: number) => {
      if (valorAntigo === 0) return 0;
      const diferenca = valorNovo - valorAntigo;
      return (diferenca / valorAntigo) * 100;
    };

    const adicionarDias = (dataISO: string, dias: number) => {
      const date = new Date(dataISO);
      date.setDate(date.getDate() + dias);
      const ano = date.getFullYear();
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const dia = String(date.getDate()).padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
    };

    const dataReferencia = '2024-06-03';
    const produtosPorDia: { [data: string]: number } = {};
    produtosComDatas.forEach(item => {
      const dataItem = item.data;
      if (produtosPorDia[dataItem]) {
        produtosPorDia[dataItem]++;
      } else {
        produtosPorDia[dataItem] = 1;
      }
    });

    const dataInicioAntes = adicionarDias(dataReferencia, -25);
    const datasAntes = produtosComDatas.filter(item => item.data >= dataInicioAntes && item.data < dataReferencia).map(item => item.data);
    const quantidadeAntes = datasAntes.length;
    setQuantidadeAntes(quantidadeAntes);
    const mediaAntes = calcularMedia(produtosPorDia, datasAntes);
    setMediaAntes(Math.round(mediaAntes));

    const dataFimComparacao = adicionarDias(dataReferencia, 25);
    const datasDepois = produtosComDatas.filter(item => item.data >= dataReferencia && item.data <= dataFimComparacao).map(item => item.data);
    const quantidadeDepois = datasDepois.length;
    setQuantidadeDepois(quantidadeDepois);
    const mediaDepois = calcularMedia(produtosPorDia, datasDepois);
    setMediaDepois(Math.round(mediaDepois));

    const aumentoMedia = calcularPorcentagemAumento(mediaAntes, mediaDepois);
    setAumentoMedia(aumentoMedia);
    const aumentoTotal = calcularPorcentagemAumento(quantidadeAntes, quantidadeDepois);
    setAumentoTotal(aumentoTotal);

    let produtosAposChatGPT = 0;
    let diasParaAtingirQuantidade = 0;
    for (const data of datasDepois) {
      produtosAposChatGPT += produtosPorDia[data];
      diasParaAtingirQuantidade++;
      if (produtosAposChatGPT >= quantidadeAntes) break;
    }
    setDiasParaAtingirQuantidade(diasParaAtingirQuantidade);

    const eficiencia = (25 / diasParaAtingirQuantidade) * 100;
    setEficiencia(eficiencia);

    const produtosPorMes: { [mes: string]: number } = {};
    produtosComDatas.forEach(item => {
      const [ano, mes] = item.data.split('-');
      const chaveMes = `${ano}-${mes}`;
      if (produtosPorMes[chaveMes]) {
        produtosPorMes[chaveMes]++;
      } else {
        produtosPorMes[chaveMes] = 1;
      }
    });

    const listaProdutosPorMesArray = Object.entries(produtosPorMes).map(([mes, quantidade]) => ({
      mes,
      quantidade,
    }));
    setListaProdutosPorMes(listaProdutosPorMesArray);

    const mediaMensal = Object.values(produtosPorMes).reduce((total, quantidade) => total + quantidade, 0) / Object.keys(produtosPorMes).length;
    setMediaMensal(mediaMensal);

    const quantidadeTotal = produtosComDatas.length;
    setQuantidadeTotal(quantidadeTotal);
  }, [cadastrador]);

  const formatarData = (dataISO: string) => {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano.slice(2)}`;
  };

  const obterNomeMes = (dataISO: string) => {
    const [ano, mes] = dataISO.split('-');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[parseInt(mes) - 1]} de ${ano}`;
  };

  return (
    <div className={styles.all}>
      <h2 className={styles.title}>Métricas de Produtos Cadastrados</h2>
      <div className={styles.container}>
        <div className={styles.geral}>
          <h2>Geral:</h2>
          <p>Quantidade Total de Produtos: {quantidadeTotal}</p>
          <div>
            {listaProdutosPorMes.map((item, index) => (
                 <p key={index}>{obterNomeMes(item.mes)}: {item.quantidade} produto(s)</p>
            ))}
          </div>
          <p>Média de produtos cadastrados por mês: {mediaMensal.toFixed(2)}</p>
        </div>

        {/* Métricas GPT */}
        <div className={styles.adicional}></div>
        <h2>Métricas GPT:</h2>
        <p>Quantidade de Produtos antes do dia 03/06: 40 em 25 dias</p>
        <p>Quantidade de Produtos depois do dia 03/06: 109 em 25 dias</p>
        <p>Dias para atingir a quantidade de antes: 7</p>
        <p>Média de Produtos por Dia antes do dia 03/06: 3</p>
        <p>Média de Produtos por Dia depois do dia 03/06: 6</p>
        <p>Aumento percentual na Média de Produtos por Dia: 116%</p>
        <p>Aumento percentual no Total de Produtos Cadastrados: 173%</p>
        <p>Melhora na eficiência de: 357%</p>

        {/* Gráfico de Barras */}
        <div className={styles.chart}>
          <h2>Estatística Gráfica:</h2>
          <BarChat listaProdutosPorMes={listaProdutosPorMes} />
        </div>
      </div>
    </div>
  );
};

export default DadosPage;
