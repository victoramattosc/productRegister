// Produtos.tsx
import React, { useState } from "react";
import styles from "./Anotacoes.module.scss";
import { FiTrash2, FiPlusCircle } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDataContext } from "../context/DataContext"; // Usa o contexto

type Anotacao = {
  produto: string;
  data: string;
};

const Produtos = () => {
  const { dados } = useDataContext(); // Usa o contexto para obter os dados
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>(dados);
  const [novaAnotacao, setNovaAnotacao] = useState<{ produto: string; data: Date }>({
    produto: "",
    data: new Date(),
  });

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

  return (
    <div className={styles.all}>
      <h2 className={styles.title}>
        Produtos Concluídos | Quantidade Total Atual : {anotacoes.length}
      </h2>
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
