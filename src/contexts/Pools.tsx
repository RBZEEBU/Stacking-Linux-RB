import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { Pool__Type } from "@/types";

type StateType = {
  pools: Pool__Type[];
  isLoading: boolean;
};

const initialState: StateType = {
  pools: [],
  isLoading: true,
};

const usePoolsContext = (_initialState: StateType) => {
  const [state, setState] = useState(_initialState);

  const initPools = useCallback((value: Pool__Type[]) => {
    setState((prev) => ({ ...prev, pools: value }));
  }, []);

  const updatePool = useCallback((value: Pool__Type) => {
    setState((prev) => ({
      ...prev,
      pools: [...prev.pools.filter((pool) => pool.id !== value.id), value].sort(
        (a, b) => a.timestamp - b.timestamp,
      ),
    }));
  }, []);

  return {
    state,
    initPools,
    updatePool,
  };
};

type UsePoolsContextType = ReturnType<typeof usePoolsContext>;

const initialContextState: UsePoolsContextType = {
  state: initialState,

  initPools: (_value: Pool__Type[]) => {},
  updatePool: (_value: Pool__Type) => {},
};

export const PoolsContext =
  createContext<UsePoolsContextType>(initialContextState);

type ChildrenType = {
  children?: ReactNode | ReactElement[] | undefined;
};

export const PoolsProvider = ({ children }: ChildrenType): ReactElement => {
  const value = usePoolsContext(initialState);

  return (
    <PoolsContext.Provider value={value}>{children}</PoolsContext.Provider>
  );
};
