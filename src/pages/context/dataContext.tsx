// DataContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { data as dataVictor } from '../Data/dataVictor';
import { data as dataCarlos } from '../Data/dataCarlos';

interface Produto {
  data: string;
  produto: string;
}

interface DataContextType {
  cadastrador: string;
  dados: Produto[];
  setCadastrador: (cadastrador: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cadastrador, setCadastrador] = useState<string>('Victor');
  const [dados, setDados] = useState<Produto[]>(dataVictor);

  useEffect(() => {
    if (cadastrador === 'Victor') {
      setDados(dataVictor);
    } else {
      setDados(dataCarlos);
    }
  }, [cadastrador]);

  return (
    <DataContext.Provider value={{ cadastrador, dados, setCadastrador }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
