import { useCallback, useEffect, useState } from "react";
import { Address, parseAbi } from "viem";
import { readContract } from "@wagmi/core";
import { config } from "@/wagmiConfig";

type UseTokenBalanceHook__Type = {
  balance: bigint;
  fetch: () => Promise<void>;
};

const abi = parseAbi([
  "function balanceOf(address account) view returns (uint256)",
]);

export const useTokenBalance = ({
  token,
  address,
}: {
  token?: Address;
  address?: Address;
}): UseTokenBalanceHook__Type => {
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  const fetch = useCallback(async () => {
    if (!address) return;
    if (!token) return;

    const data = await readContract(config, {
      address: token,
      abi,
      functionName: "balanceOf",
      args: [address],
    });

    setBalance(data);
  }, [address, token]);

  useEffect(() => {
    fetch();
  }, [fetch, token, address]);

  return {
    balance,
    fetch,
  };
};
