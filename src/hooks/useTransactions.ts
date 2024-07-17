import { TransactionsContext } from "@/contexts/Transactions";
import { Recent_Transaction } from "@/types";
import { useCallback, useContext } from "react";
import { Address } from "viem";

type UseTransactionsHook__Type = {
  recentTransactions: Recent_Transaction[];
  fetchTransactions: () => void;
};

export const useTransactions = ({
  account,
  chainId,
}: {
  account?: Address;
  chainId: number;
}): UseTransactionsHook__Type => {
  const {
    state: { recentTransactions },
    initTransactions,
  } = useContext(TransactionsContext);
  const fetchTransactions = useCallback(async () => {
    const resp = await fetch(
      `/api/transactions?account=${account}&chainId=${chainId}`,
    );
    const { data } = await resp.json();

    initTransactions(data);
  }, [account, initTransactions, chainId]);

  return {
    recentTransactions,
    fetchTransactions,
  };
};
