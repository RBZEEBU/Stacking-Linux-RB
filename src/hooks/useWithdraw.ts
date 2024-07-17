import { useState } from "react";
import { writeContract } from "@wagmi/core";
import { Address, WaitForTransactionReceiptReturnType, parseAbi } from "viem";
import { config } from "@/wagmiConfig";
import { submitAction } from "@/lib/utils";

type UseWithdrawHook__Type = {
  withdraw: () => Promise<void>;
  loading: boolean;
};

const abi = parseAbi(["function withdraw() external"]);

export const useWithdraw = ({
  address,
  onPrompt,
  onSubmitted,
  onSuccess,
  onError,
}: {
  address: Address;
  onPrompt?: () => void;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (receipt: WaitForTransactionReceiptReturnType) => void;
  onError?: (err: unknown) => void;
}): UseWithdrawHook__Type => {
  const [loading, setLoading] = useState<boolean>(false);

  const withdraw = async () => {
    await submitAction(
      async () => {
        return await writeContract(config, {
          address,
          abi,
          functionName: "withdraw",
        });
      },
      {
        onPrompt: () => {
          setLoading(true);
          if (onPrompt) onPrompt();
        },
        onSubmitted,
        onSuccess: (receipt) => {
          setLoading(false);
          if (onSuccess) onSuccess(receipt);
        },
        onError: (err) => {
          setLoading(false);
          if (onError) onError(err);
        },
      },
    );
  };

  return {
    loading,
    withdraw,
  };
};
