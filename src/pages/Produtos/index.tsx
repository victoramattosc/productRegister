// /src/pages/Produtos/index.tsx
import React, { useState } from "react";
import styles from "./Produtos.module.scss";
import { FiTrash2, FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { dataCadastrador1, dataCadastrador2 } from "../Data/data"; 

type Anotacao = {
  produto: string;
  data: string;
};

interface ProdutosProps {
  cadastrador: string;
}

const Produtos: React.FC<ProdutosProps> = ({ cadastrador }) => {
  const data = cadastrador === 'Cadastrador1' ? dataCadastrador1 : dataCadastrador2; 
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
    const novasAnotacoes = [...anotacoes];
    novasAnotacoes.splice(index, 1);
    setAnotacoes(novasAnotacoes);
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
        <ul className={styles.anotacaoList}>
          {anotacoes.slice(-5).map((anotacao, index) => (
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
        <ul className={styles.anotacaoList}>
          {listaQuantidadesPorDia.slice(-6).map((item, index) => (
            <li key={index} className={styles.anotacao}>
              {item}
            </li>
          ))}
        </ul>
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
