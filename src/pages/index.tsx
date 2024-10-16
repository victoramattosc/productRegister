import { DataProvider } from './context/DataContext';
import Dados from './components/DadosPage';
import Produtos from './components/Produtos';

import styles from "./Home.module.scss";


export function Home() {

  <link rel="icon" href="../assets/GM.png" />;

  return (
    <DataProvider>
    <main className={styles.main}>
      <div className={styles.title}>
        <h1>Product Register</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.group}>

          {/* Lado dos Produtos */}
          <div className={styles.anotacoes}>
            <Produtos />
          </div>

          {/* Lado dos Dados */}
          <div className={styles.dados}>
            <Dados />
          </div>
        </div>
      </div>
    </main>
    </DataProvider>

  );
}
