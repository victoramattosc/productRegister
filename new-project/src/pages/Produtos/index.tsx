import React, { useState } from "react";
import styles from "./Anotacoes.module.scss";
import { FiTrash2, FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { data } from "../Data/data"; // Importando os dados de onde estão definidos

// Tipo para representar cada item na lista de anotações
type Anotacao = {
  produto: string;
  data: string; // A data é do tipo string conforme os dados importados
};

const Produtos = () => {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>(data); // Inicializa com os dados importados
  const [novaAnotacao, setNovaAnotacao] = useState<{ produto: string; data: Date }>({
    produto: "",
    data: new Date(), // Inicializa com a data atual
  });
  const [mostrarTodos, setMostrarTodos] = useState(false); // Estado para controlar se todos os produtos estão sendo mostrados

  const adicionarAnotacao = () => {
    if (novaAnotacao.produto.trim() !== "") {
      const novaAnotacaoFormatada = {
        produto: novaAnotacao.produto,
        data: novaAnotacao.data.toISOString().slice(0, 10), // Converte para string no formato YYYY-MM-DD
      };
      setAnotacoes([...anotacoes, novaAnotacaoFormatada]);
      setNovaAnotacao({ produto: "", data: new Date() }); // Limpa o estado após adicionar
    }
  };

  const removerAnotacao = (index: number) => {
    if (mostrarTodos) {
      // Remover item diretamente pelo índice na lista completa
      const novasAnotacoes = [...anotacoes];
      novasAnotacoes.splice(index, 1);
      setAnotacoes(novasAnotacoes);
    } else {
      // Encontrar o índice correto na lista filtrada dos últimos cinco itens
      const indiceReal = anotacoes.length - 5 + index;
      const novasAnotacoes = anotacoes.filter((_, i) => i !== indiceReal);
      setAnotacoes(novasAnotacoes);
    }
  };

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
          {mostrarTodos
            ? anotacoes.map((anotacao, index) => (
                <li key={index} className={styles.anotacao}>
                  {anotacao.produto} - {anotacao.data}
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
                  {anotacao.produto} - {anotacao.data}
                  <button
                    onClick={() => removerAnotacao(index)}
                    className={styles.botaotrash}
                  >
                    <FiTrash2 color="red" />
                  </button>
                </li>
              ))}
        </ul>
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
            className={styles.input}
          />
          <button onClick={adicionarAnotacao} className={styles.botao}>
            <FiPlusCircle color="#bc1b29" size={"20px"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Produtos;
