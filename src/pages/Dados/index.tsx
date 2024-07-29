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
  const [mediaAntes, setMediaAntes] = useState<number>(0);
  const [mediaDepois, setMediaDepois] = useState<number>(0);
  const [diasParaAtingirQuantidade, setDiasParaAtingirQuantidade] = useState<number>(0);
  const [eficiencia, setEficiencia] = useState<number>(0);
  const [aumentoMedia, setAumentoMedia] = useState<number>(0);
  const [aumentoTotal, setAumentoTotal] = useState<number>(0);
  const [diasCadastrando, setDiasCadastrando] = useState<number>(0);
  const [listaProdutosPorMes, setListaProdutosPorMes] = useState<string[]>([]);
  const [mediaMensal, setMediaMensal] = useState<number>(0);

  useEffect(() => {
    const calcularDiferencaDias = (dataInicio: string, dataFim: string) => {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      const diferencaMilissegundos = fim.getTime() - inicio.getTime();
      // Inclui o dia inicial e o dia final
      return Math.ceil(diferencaMilissegundos / (1000 * 60 * 60 * 24)) + 1;
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

    if (produtosComDatas.length === 0) {
      console.error('Nenhum produto encontrado nos dados.');
      return;
    }

    // Calcula a quantidade total de produtos cadastrados
    setQuantidadeTotal(produtosComDatas.length);

    // Define a data de referência e o número de dias para comparação
    const dataReferencia = '2024-06-03';
    const dataInicioAntes = '2024-05-09';
    const dataFimAntes = '2024-06-02';

    // Calcular o número de dias no período antes do GPT
    const diasPeriodoAntes = calcularDiferencaDias(dataInicioAntes, dataFimAntes);

    // Filtrar os produtos para os períodos antes e depois
    const produtosAntes = produtosComDatas.filter(item => item.data >= dataInicioAntes && item.data <= dataFimAntes);
    const produtosDepois = produtosComDatas.filter(item => item.data >= dataReferencia && item.data <= adicionarDias(dataReferencia, diasPeriodoAntes - 1));

    // Quantidade de produtos
    const quantidadeAntes = produtosAntes.length;
    const quantidadeDepois = produtosDepois.length;
    setQuantidadeAntes(quantidadeAntes);
    setQuantidadeDepois(quantidadeDepois);

    // Calcula a média de produtos por dia
    const calcularMedia = (produtos: Produto[], dias: number) => produtos.length / dias;

    const mediaAntes = calcularMedia(produtosAntes, diasPeriodoAntes);
    const dataFimDepois = adicionarDias(dataReferencia, diasPeriodoAntes - 1);
    const diasPeriodoDepois = calcularDiferencaDias(dataReferencia, dataFimDepois);
    const mediaDepois = calcularMedia(produtosDepois, diasPeriodoDepois);
    setMediaAntes(mediaAntes);
    setMediaDepois(mediaDepois);

    // Aumento percentual na média de produtos por dia
    const aumentoMedia = mediaAntes ? ((mediaDepois - mediaAntes) / mediaAntes) * 100 : 0;
    setAumentoMedia(aumentoMedia);

    // Aumento percentual no total de produtos cadastrados
    const aumentoTotal = quantidadeAntes ? ((quantidadeDepois - quantidadeAntes) / quantidadeAntes) * 100 : 0;
    setAumentoTotal(aumentoTotal);

    // Calcular quantos dias após o início do GPT foram necessários para atingir a quantidade de produtos de antes
    let produtosAcumulados = 0;
    let diasParaAtingirQuantidade = 0;

    for (const produto of produtosDepois) {
      produtosAcumulados++;
      diasParaAtingirQuantidade++;
      if (produtosAcumulados >= quantidadeAntes) break;
    }
    setDiasParaAtingirQuantidade(diasParaAtingirQuantidade);

    // Eficiência na obtenção de produtos comparando os períodos
    const eficiencia = diasParaAtingirQuantidade > 0 ? (diasPeriodoAntes / diasParaAtingirQuantidade) * 100 : 0;
    setEficiencia(eficiencia);

    // Calcula a quantidade de dias desde o primeiro até o último produto cadastrado
    const dataInicio = produtosComDatas[0].data;
    const dataFim = produtosComDatas[produtosComDatas.length - 1].data;
    const diasCadastrando = calcularDiferencaDias(dataInicio, dataFim);
    setDiasCadastrando(diasCadastrando);

    // Calcula a quantidade de produtos por mês
    const produtosPorMes = produtosComDatas.reduce((acc: { [mes: string]: number }, produto: Produto) => {
      const [ano, mes] = produto.data.split('-');
      const chaveMes = `${ano}-${mes}`;
      if (!acc[chaveMes]) acc[chaveMes] = 0;
      acc[chaveMes]++;
      return acc;
    }, {});

    // Exibe a quantidade de produtos por mês
    const listaProdutosPorMesArray = Object.entries(produtosPorMes).map(([mes, quantidade]) => `${mes}: ${quantidade} produto(s)`);
    setListaProdutosPorMes(listaProdutosPorMesArray);

    // Calcula e exibe a média de produtos cadastrados por mês
    const mediaProdutosPorMes = Object.values(produtosPorMes).reduce((total, qtd) => total + qtd, 0) / Object.keys(produtosPorMes).length;
    setMediaMensal(mediaProdutosPorMes);

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
        <p>Quantidade de Produtos antes do dia 03/06: {quantidadeAntes} em {diasPeriodoAntes} dias</p>
        <p>Quantidade de Produtos depois do dia 03/06: {quantidadeDepois} em {diasPeriodoDepois} dias</p>
        <p>Dias para atingir a quantidade de antes: {diasParaAtingirQuantidade}</p>
        <p>Média de Produtos por Dia antes do dia 03/06: {mediaAntes.toFixed(2)}</p>
        <p>Média de Produtos por Dia depois do dia 03/06: {mediaDepois.toFixed(2)}</p>
        <p>Aumento percentual na Média de Produtos por Dia: {aumentoMedia.toFixed(2)}%</p>
        <p>Aumento percentual no Total de Produtos Cadastrados: {aumentoTotal.toFixed(2)}%</p>
        <p>Melhora na eficiência de: {eficiencia.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default DadosPage;
