// Home.tsx
import React, { useState } from 'react';
import Dados from "./Dados";
import Produtos from "./Produtos";
import styles from "./Home.module.scss";

export function Home() {
  const [cadastradorAtivo, setCadastradorAtivo] = useState<string>('Cadastrador1');

  const handleTrocaCadastrador = (novoCadastrador: string) => {
    setCadastradorAtivo(novoCadastrador);
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1>Product Register - {cadastradorAtivo}</h1>
      </div>

      <div className={styles.cadastradorButtons}>
        <button onClick={() => handleTrocaCadastrador('Cadastrador1')}>Cadastrador 1</button>
        <button onClick={() => handleTrocaCadastrador('Cadastrador2')}>Cadastrador 2</button>
      </div>

      <div className={styles.content}>
        <div className={styles.group}>
          <div className={styles.anotacoes}>
            <Produtos cadastrador={cadastradorAtivo} />
          </div>

          <div className={styles.dados}>
            <Dados cadastrador={cadastradorAtivo} />
          </div>
        </div>
      </div>
    </main>
  );
}
