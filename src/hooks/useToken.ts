import { useCallback, useEffect, useState } from "react";
import { Address, WaitForTransactionReceiptReturnType, parseAbi } from "viem";
import { readContract, writeContract, multicall } from "@wagmi/core";
import { config } from "@/wagmiConfig";
import { submitAction } from "@/lib/utils";

type UseTokenHook__Type = {
  allowance: bigint;
  approve: () => Promise<void>;
  fetchAllowance: () => Promise<void>;
  loading: boolean;
  balance: bigint;
  fetchBalance: () => Promise<void>;
};

const abi = parseAbi([
  "function approve(address spender, uint256 amount) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
]);

export const useToken = ({
  token,
  owner,
  spender,
  amount = BigInt(0),
  onPrompt,
  onSubmitted,
  onSuccess,
  onError,
}: {
  token: Address;
  owner?: Address;
  spender: Address;
  amount?: bigint;
  onPrompt?: () => void;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (receipt: WaitForTransactionReceiptReturnType) => void;
  onError?: (err: unknown) => void;
}): UseTokenHook__Type => {
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [loading, setLoading] = useState<boolean>(false);

  const approve = async () => {
    await submitAction(
      async () => {
        return await writeContract(config, {
          address: token,
          abi,
          functionName: "approve",
          args: [spender, amount],
        });
      },
      {
        onPrompt: () => {
          setLoading(true);
          if (onPrompt) onPrompt();
        },
        onSubmitted,
        onSuccess: async (receipt) => {
          setLoading(false);
          await fetchAllowance();
          if (onSuccess) onSuccess(receipt);
        },
        onError: (err) => {
          setLoading(false);
          if (onError) onError(err);
        },
      },
    );
  };

  const fetchBalance = useCallback(async () => {
    if (!owner) return;

    const data = await getTokenBalance(token, owner);

    setBalance(data);
  }, [owner, token]);

  const fetchAllowance = useCallback(async () => {
    if (!token || !owner || !spender) return;

    const data = await readContract(config, {
      address: token,
      abi,
      functionName: "allowance",
      args: [owner, spender],
    });

    setAllowance(data);
  }, [owner, spender, token]);

  useEffect(() => {
    fetchAllowance();
    fetchBalance();
  }, [fetchAllowance, fetchBalance]);

  return {
    allowance,
    balance,
    approve,
    fetchAllowance,
    fetchBalance,
    loading,
  };
};

export const getTokenBalance = async (address: Address, owner: Address) =>
  (await readContract(config, {
    address,
    abi,
    functionName: "balanceOf",
    args: [owner],
  })) as bigint;

export const getTokenDetails = async (address: Address) =>
  multicall(config, {
    allowFailure: false,
    contracts: [
      {
        address,
        abi,
        functionName: "name",
      },
      { address, abi, functionName: "symbol" },
      { address, abi, functionName: "decimals" },
    ],
  }) as Promise<[string, string, number]>;
