import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { Recent_Transaction } from "@/types";

type StateType = {
  recentTransactions: Recent_Transaction[];
  isLoading: boolean;
};

const initialState: StateType = {
  recentTransactions: [],
  isLoading: true,
};

const useTransactionsContext = (_initialState: StateType) => {
  const [state, setState] = useState(_initialState);

  const initTransactions = useCallback((value: Recent_Transaction[]) => {
    setState((prev) => ({ ...prev, recentTransactions: value }));
  }, []);

  return {
    state,
    initTransactions,
  };
};

type UseTransactionsContextType = ReturnType<typeof useTransactionsContext>;

const initialContextState: UseTransactionsContextType = {
  state: initialState,

  initTransactions: (_value: Recent_Transaction[]) => {},
};

export const TransactionsContext =
  createContext<UseTransactionsContextType>(initialContextState);

type ChildrenType = {
  children?: ReactNode | ReactElement[] | undefined;
};

export const TransactionsProvider = ({
  children,
}: ChildrenType): ReactElement => {
  const value = useTransactionsContext(initialState);

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};
