import React, { useState } from "react";
import styles from "./Anotacoes.module.scss";
import { FiTrash2, FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { data } from "../Data/data";

type Anotacao = {
  produto: string;
  data: string;
};

const Produtos = () => {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>(data);
  const [novaAnotacao, setNovaAnotacao] = useState<{ produto: string; data: Date }>({
    produto: "",
    data: new Date(),
  });
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const adicionarAnotacao = () => {
    if (novaAnotacao.produto.trim() !== "") {
      const novaAnotacaoFormatada = {
        produto: novaAnotacao.produto,
        data: novaAnotacao.data.toISOString().slice(0, 10),
      };
      setAnotacoes([...anotacoes, novaAnotacaoFormatada]);
      setNovaAnotacao({ produto: "", data: new Date() });
    }
  };

  const removerAnotacao = (index: number) => {
    if (mostrarTodos) {
      const novasAnotacoes = [...anotacoes];
      novasAnotacoes.splice(index, 1);
      setAnotacoes(novasAnotacoes);
    } else {
      const indiceReal = anotacoes.length - 5 + index;
      const novasAnotacoes = anotacoes.filter((_, i) => i !== indiceReal);
      setAnotacoes(novasAnotacoes);
    }
  };

  const formatarData = (dataISO: string) => {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano.slice(2)}`;
  };

  const produtosPorDia: { [data: string]: number } = {};
  anotacoes.forEach((item) => {
    const dataItem = item.data;
    if (produtosPorDia[dataItem]) {
      produtosPorDia[dataItem]++;
    } else {
      produtosPorDia[dataItem] = 1;
    }
  });

  const listaQuantidadesPorDia = Object.keys(produtosPorDia).map(
    (data) => `${formatarData(data)}: ${produtosPorDia[data]}`
  );

  return (
    <div className={styles.all}>
      <h2 className={styles.title}>
        Produtos Concluídos | Quantidade Total Atual : {anotacoes.length}
      </h2>

      <button
        onClick={() => setMostrarTodos(!mostrarTodos)}
        className={styles.botaoMostar}
      >
        {mostrarTodos ? (
          <FiMinusCircle color="#bc1b29" size={"20px"} />
        ) : (
          <FiPlusCircle color="#bc1b29" size={"20px"} />
        )}
      </button>

      <div className={styles.container}>
        <div className={styles.listContainer}>
          <ul className={styles.anotacaoList}>
            {mostrarTodos
              ? anotacoes.map((anotacao, index) => (
                  <li key={index} className={styles.anotacao}>
                    {`${anotacao.produto} - ${formatarData(anotacao.data)}`}
                    <button
                      onClick={() => removerAnotacao(index)}
                      className={styles.botaotrash}
                    >
                      <FiTrash2 color="red" />
                    </button>
                  </li>
                ))
              : anotacoes.slice(-5).map((anotacao, index) => (
                  <li key={index} className={styles.anotacao}>
                    {`${anotacao.produto} - ${formatarData(anotacao.data)}`}
                    <button
                      onClick={() => removerAnotacao(index)}
                      className={styles.botaotrash}
                    >
                      <FiTrash2 color="red" />
                    </button>
                  </li>
                ))}
          </ul>
        </div>
        <div className={styles.listContainer}>
          <ul className={styles.anotacaoList}>
            {mostrarTodos
              ? listaQuantidadesPorDia.map((item, index) => (
                  <li key={index} className={styles.anotacao}>
                    {item}
                  </li>
                ))
              : listaQuantidadesPorDia.slice(-6).map((item, index) => (
                  <li key={index} className={styles.anotacao}>
                    {item}
                  </li>
                ))}
          </ul>
        </div>
      </div>
      <div className={styles.inputdiv}>
        <input
          type="text"
          value={novaAnotacao.produto}
          onChange={(e) =>
            setNovaAnotacao({ ...novaAnotacao, produto: e.target.value })
          }
          placeholder="Adicione os produtos concluídos aqui"
          className={styles.input}
        />
        <DatePicker
          selected={novaAnotacao.data}
          onChange={(date) =>
            date && setNovaAnotacao({ ...novaAnotacao, data: date })
          }
          placeholderText="Selecione a data"
          dateFormat="dd/MM/yyyy"
          className={styles.dataPicker}
        />
        <button onClick={adicionarAnotacao} className={styles.botao}>
          <FiPlusCircle color="#bc1b29" size={"20px"} />
        </button>
      </div>
    </div>
  );
};

export default Produtos;
