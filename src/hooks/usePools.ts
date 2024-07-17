import { Pool__Type } from "@/types";
import { useCallback } from "react";
import { Address } from "viem";

type UsePoolsHook__Type = {
  fetchPools: () => Promise<Pool__Type[]>;
  fetchPool: (id: string) => Promise<Pool__Type>;
};

export const usePools = ({
  account,
  chainId,
}: {
  account?: Address;
  chainId: number;
}): UsePoolsHook__Type => {
  const fetchPools = useCallback(async () => {
    const resp = await fetch(
      `/api/pools?account=${account ?? ""}&chainId=${chainId}`,
    );
    const { data } = await resp.json();

    return data as Pool__Type[];
  }, [account, chainId]);

  const fetchPool = useCallback(
    async (id: string) => {
      const resp = await fetch(
        `/api/pools/${id}?account=${account ?? ""}&chainId=${chainId}`,
      );
      const { data } = await resp.json();

      return data as Pool__Type;
    },
    [account, chainId],
  );

  return {
    fetchPools,
    fetchPool,
  };
};
