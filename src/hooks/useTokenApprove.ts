import { useCallback, useEffect, useState } from "react";
import { Address, WaitForTransactionReceiptReturnType, parseAbi } from "viem";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/wagmiConfig";
import { submitAction } from "@/lib/utils";

type UseTokenApproveHook__Type = {
  allowance: bigint;
  approve: (amount: bigint) => Promise<void>;
  fetchAllowance: () => Promise<void>;
  loading: boolean;
};

const abi = parseAbi([
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
]);

export const useTokenApprove = ({
  token,
  owner,
  spender,
  onPrompt,
  onSubmitted,
  onSuccess,
  onError,
}: {
  token?: Address;
  owner?: Address;
  spender?: Address;
  onPrompt?: () => void;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (receipt: WaitForTransactionReceiptReturnType) => void;
  onError?: (err: unknown) => void;
}): UseTokenApproveHook__Type => {
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [loading, setLoading] = useState<boolean>(false);

  const approve = async (amount: bigint) => {
    if (!token) return;
    if (!spender) return;

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

  const fetchAllowance = useCallback(async () => {
    if (!owner) return;
    if (!token) return;
    if (!spender) return;

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
  }, [fetchAllowance]);

  return {
    allowance,
    approve,
    fetchAllowance,
    loading,
  };
};
