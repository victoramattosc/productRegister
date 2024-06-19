import React, { useEffect, useState } from 'react';
import { data } from '../Data/data';
import styles from "./Dados.module.scss";


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

    useEffect(() => {
        // Função para formatar data para dd/mm/aa
        const formatarData = (dataISO: string) => {
            const [ano, mes, dia] = dataISO.split('-');
            return `${dia}/${mes}/${ano.slice(2)}`;
        };

        // Função para calcular a diferença de dias entre duas datas
        const calcularDiferencaDias = (dataInicio: string, dataFim: string) => {
            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);
            const diferencaMilissegundos = fim.getTime() - inicio.getTime();
            const diferencaDias = diferencaMilissegundos / (1000 * 60 * 60 * 24);
            return Math.floor(diferencaDias);
        };

        // Função para calcular a média de produtos cadastrados por dia
        const calcularMedia = (produtosPorDia: { [data: string]: number }, dataReferencia: string, antes: boolean) => {
            const datasFiltradas = Object.keys(produtosPorDia).filter(data => {
                if (antes) {
                    return data < dataReferencia;
                } else {
                    return data >= dataReferencia;
                }
            });

            if (datasFiltradas.length === 0) {
                return 0;
            }

            const totalProdutos = datasFiltradas.reduce((total, data) => total + produtosPorDia[data], 0);
            return totalProdutos / datasFiltradas.length;
        };

        // Função para calcular a porcentagem de aumento
        const calcularPorcentagemAumento = (valorAntigo: number, valorNovo: number) => {
            const diferenca = valorNovo - valorAntigo;
            return (diferenca / valorAntigo) * 100;
        };

        // Calcula a quantidade total de produtos
        const quantidadeTotal = data.length;
        setQuantidadeTotal(quantidadeTotal);

        // Calcula a quantidade de produtos antes e depois de uma data de referência (exemplo: '2024-06-03')
        const quantidadeAntes = data.filter(item => item.data < '2024-06-03').length;
        const quantidadeDepois = data.filter(item => item.data >= '2024-06-03').length;
        setQuantidadeAntes(quantidadeAntes);
        setQuantidadeDepois(quantidadeDepois);

        // Calcula a quantidade de dias desde o primeiro até o último produto cadastrado
        const datas = data.map(item => item.data);
        const dataInicio = datas[0];
        const dataFim = datas[datas.length - 1];
        const diferencaDias = calcularDiferencaDias(dataInicio, dataFim);
        setDiasCadastrando(diferencaDias);

        // Calcula a quantidade de dias antes e depois da data de referência
        const diasAntes = calcularDiferencaDias(dataInicio, '2024-06-03') - 1;
        const diasDepois = calcularDiferencaDias('2024-06-03', dataFim) + 1;
        setDiasAntes(diasAntes);
        setDiasDepois(diasDepois);

        // Calcula a média de produtos cadastrados por dia antes e depois da data de referência
        const produtosPorDia: { [data: string]: number } = {};
        data.forEach(item => {
            const dataItem = item.data;
            if (produtosPorDia[dataItem]) {
                produtosPorDia[dataItem]++;
            } else {
                produtosPorDia[dataItem] = 1;
            }
        });

        const mediaAntes = calcularMedia(produtosPorDia, '2024-06-03', true);
        const mediaDepois = calcularMedia(produtosPorDia, '2024-06-03', false);
        setMediaAntes(Math.round(mediaAntes));
        setMediaDepois(Math.round(mediaDepois));

        // Calcula o aumento percentual na média de produtos por dia
        const aumentoMedia = calcularPorcentagemAumento(mediaAntes, mediaDepois);
        setAumentoMedia(aumentoMedia);

        // Calcula o aumento percentual no total de produtos cadastrados
        const totalAntesPorDia = quantidadeAntes / diasAntes;
        const totalDepoisPorDia = quantidadeDepois / diasDepois;
        const aumentoTotal = calcularPorcentagemAumento(totalAntesPorDia, totalDepoisPorDia);
        setAumentoTotal(aumentoTotal);
    }, []);

    return (
        <div className={styles.all}>
            <h2 className={styles.title}>
                Métricas de Produtos Cadastrados
            </h2>
            <div className={styles.container}>
                <p>Quantidade Total de Produtos: {quantidadeTotal}</p>
                <p>Quantidade de Produtos antes do dia 03/06: {quantidadeAntes} em {diasAntes} dias</p>
                <p>Quantidade de Produtos depois do dia 03/06: {quantidadeDepois} em {diasDepois} dias</p>
                <p>Média de Produtos por Dia antes do dia 03/06: {mediaAntes}</p>
                <p>Média de Produtos por Dia depois do dia 03/06: {mediaDepois}</p>
                <p>Aumento percentual na Média de Produtos por Dia: {aumentoMedia.toFixed(2)}%</p>
                <p>Aumento percentual no Total de Produtos Cadastrados: {aumentoTotal.toFixed(2)}%</p>
            </div>
        </div>
    );
};

export default DadosPage;
