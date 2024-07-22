import React, { useEffect, useState } from 'react';
import { data } from '../Data/data';
import styles from "./Dados.module.scss";

interface Produto {
  data: string;
  produto: string;
}

const DadosPage: React.FC = () => {
  const [quantidadeTotal, setQuantidadeTotal] = useState<number>(0);
  const [quantidadeAntes, setQuantidadeAntes] = useState<number>(0);
  const [quantidadeDepois, setQuantidadeDepois] = useState<number>(0);
  const [diasCadastrando, setDiasCadastrando] = useState<number>(0);
  const [diasAntes, setDiasAntes] = useState<number>(0);
  const [diasDepois, setDiasDepois] = useState<number>(0);
  const [aumentoTotal, setAumentoTotal] = useState<number>(0);
  const [aumentoMedia, setAumentoMedia] = useState<number>(0);
  const [mediaAntes, setMediaAntes] = useState<number>(0);
  const [mediaDepois, setMediaDepois] = useState<number>(0);
  const [diasParaAtingirQuantidade, setDiasParaAtingirQuantidade] = useState<number>(0);
  const [eficiencia, setEficiencia] = useState<number>(0);
  const [listaProdutosPorMes, setListaProdutosPorMes] = useState<string[]>([]);
  const [mediaMensal, setMediaMensal] = useState<number>(0);

  useEffect(() => {
    const calcularDiferencaDias = (dataInicio: string, dataFim: string) => {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      const diferencaMilissegundos = fim.getTime() - inicio.getTime();
      const diferencaDias = diferencaMilissegundos / (1000 * 60 * 60 * 24);
      return Math.floor(diferencaDias);
    };

    const calcularMedia = (produtosPorDia: { [data: string]: number }, datasFiltradas: string[]) => {
      if (datasFiltradas.length === 0) {
        return 0;
      }

      const totalProdutos = datasFiltradas.reduce((total, data) => total + produtosPorDia[data], 0);
      return totalProdutos / datasFiltradas.length;
    };

    const calcularPorcentagemAumento = (valorAntigo: number, valorNovo: number) => {
      const diferenca = valorNovo - valorAntigo;
      return (diferenca / valorAntigo) * 100;
    };

    const calcularProdutosPorMes = (produtosComDatas: Produto[]) => {
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

      return produtosPorMes;
    };

    const calcularMediaProdutosPorMes = (produtosPorMes: { [mes: string]: number }) => {
      const totalMeses = Object.keys(produtosPorMes).length;
      const totalProdutos = Object.values(produtosPorMes).reduce((total, quantidade) => total + quantidade, 0);

      return totalProdutos / totalMeses;
    };

    const obterNomeMes = (dataISO: string) => {
      const [ano, mes] = dataISO.split('-');
      const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return `${meses[parseInt(mes) - 1]} de ${ano}`;
    };

    const calcularListaProdutosPorMes = (produtosPorMes: { [mes: string]: number }) => {
      return Object.entries(produtosPorMes).map(
        ([mes, quantidade]) => `${obterNomeMes(mes)}: ${quantidade} produto(s)`
      );
    };

    const adicionarDias = (dataISO: string, dias: number) => {
      const date = new Date(dataISO);
      date.setDate(date.getDate() + dias);
      const ano = date.getFullYear();
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const dia = String(date.getDate()).padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
    };

    const produtosComDatas: Produto[] = data.map((item: { data: string, produto: string }) => ({
      data: item.data,
      produto: item.produto
    }));

    // Calcula a quantidade total de produtos
    const quantidadeTotal = produtosComDatas.length;
    setQuantidadeTotal(quantidadeTotal);

    // Define a data de referência e as datas limite de 25 dias antes e depois
    const dataReferencia = '2024-06-03';
    const dataLimiteAntes = adicionarDias(dataReferencia, -24);
    const dataLimiteDepois = adicionarDias(dataReferencia, 24);

    // Filtra as datas para os períodos antes e depois do GPT
    const datasAntes = produtosComDatas.filter(item => item.data >= dataLimiteAntes && item.data <= dataReferencia).map(item => item.data);
    const datasDepois = produtosComDatas.filter(item => item.data >= dataReferencia && item.data <= dataLimiteDepois).map(item => item.data);

    // Calcula a quantidade de produtos antes e depois de uma data de referência
    const quantidadeAntes = datasAntes.length;
    const quantidadeDepois = datasDepois.length;
    setQuantidadeAntes(quantidadeAntes);
    setQuantidadeDepois(quantidadeDepois);

    // Calcula a quantidade de dias desde o primeiro até o último produto cadastrado
    const datas = produtosComDatas.map(item => item.data);
    const dataInicio = datas[0];
    const dataFim = datas[datas.length - 1];
    const diferencaDias = calcularDiferencaDias(dataInicio, dataFim) + 1;
    setDiasCadastrando(diferencaDias);

    // Define os dias antes e depois
    setDiasAntes(datasAntes.length);
    setDiasDepois(datasDepois.length);

    // Calcula a média de produtos cadastrados por dia antes e depois da data de referência
    const produtosPorDia: { [data: string]: number } = {};
    produtosComDatas.forEach(item => {
      const dataItem = item.data;
      if (produtosPorDia[dataItem]) {
        produtosPorDia[dataItem]++;
      } else {
        produtosPorDia[dataItem] = 1;
      }
    });

    const mediaAntes = calcularMedia(produtosPorDia, datasAntes);
    const mediaDepois = calcularMedia(produtosPorDia, datasDepois);
    setMediaAntes(Math.round(mediaAntes));
    setMediaDepois(Math.round(mediaDepois));

    // Calcula o aumento percentual na média de produtos por dia
    const aumentoMedia = calcularPorcentagemAumento(mediaAntes, mediaDepois);
    setAumentoMedia(aumentoMedia);

    // Calcula o aumento percentual no total de produtos cadastrados
    const aumentoTotal = calcularPorcentagemAumento(quantidadeAntes, quantidadeDepois);
    setAumentoTotal(aumentoTotal);

    // Calcula a quantidade de produtos por mês
    const produtosPorMes = calcularProdutosPorMes(produtosComDatas);

    // Exibe a quantidade de produtos por mês
    const listaProdutosPorMesArray = calcularListaProdutosPorMes(produtosPorMes);
    setListaProdutosPorMes(listaProdutosPorMesArray);

    // Calcula e exibe a média de produtos cadastrados por mês
    const mediaProdutosPorMes = calcularMediaProdutosPorMes(produtosPorMes);
    setMediaMensal(mediaProdutosPorMes);

    // Calcula quantos dias depois do ChatGPT demorou para bater a quantidade de antes (quantidadeAntes)
    let produtosAposChatGPT = 0;
    let diasParaAtingirQuantidade = 0;

    for (const data of datasDepois) {
      produtosAposChatGPT += produtosPorDia[data];
      diasParaAtingirQuantidade++;
      if (produtosAposChatGPT >= quantidadeAntes) {
        break;
      }
    }

    setDiasParaAtingirQuantidade(diasParaAtingirQuantidade);

    // Calcula a eficiência (percentual baseado nos primeiros 25 dias antes e depois do GPT)
    const eficiencia = (25 / diasParaAtingirQuantidade) * 100;
    setEficiencia(eficiencia);

  }, []);

  return (
    <div className={styles.all}>
      <h2 className={styles.title}>
        Métricas de Produtos Cadastrados
      </h2>
      <div className={styles.container}>
        <div className={styles.geral}>
          <p>Quantidade Total de Produtos: {quantidadeTotal}</p>
          <div>
            {listaProdutosPorMes.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
          <p>Dias Cadastrando: {diasCadastrando}</p>
        </div>

        {/* Métricas GPT */}
        <div className={styles.adicional}></div>
        <h1>Métricas GPT:</h1>
        <p>Quantidade de Produtos antes do dia 03/06: {quantidadeAntes} em {diasAntes} dias</p>
        <p>Quantidade de Produtos depois do dia 03/06: {quantidadeDepois} em {diasDepois} dias</p>
        <p>Dias para atingir a quantidade de antes: {diasParaAtingirQuantidade}</p>
        <p>Média de Produtos por Dia antes do dia 03/06: {mediaAntes}</p>
        <p>Média de Produtos por Dia depois do dia 03/06: {mediaDepois}</p>
        <p>Aumento percentual na Média de Produtos por Dia:  {Math.round(aumentoMedia)}%</p>
        <p>Aumento percentual no Total de Produtos Cadastrados:  {Math.round(aumentoTotal)}%</p>
        <p>Melhora na eficiência de: {Math.round(eficiencia)}%</p>
      </div>
    </div>
  );
};

export default DadosPage;
