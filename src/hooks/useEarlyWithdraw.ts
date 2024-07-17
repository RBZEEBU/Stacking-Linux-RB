import { useCallback, useState } from "react";
import { writeContract, multicall } from "@wagmi/core";
import { Address, WaitForTransactionReceiptReturnType, parseAbi } from "viem";
import { config } from "@/wagmiConfig";
import { panic, submitAction } from "@/lib/utils";

export type CalculateEarlyUnlockPenaltyReturn__Type = {
  penalty: bigint;
  userAmount: bigint;
  lockedAmount: bigint;
  penaltyRatio: number;
};

export type UseWithdrawEarlyHook__Type = {
  withdrawEarly: () => Promise<void>;
  calculateEarlyUnlockPenalty: (
    timestamp: number,
  ) => Promise<CalculateEarlyUnlockPenaltyReturn__Type>;
  loading: boolean;
};

const abi = parseAbi([
  "function withdraw_early() external",
  "function early_unlock() external view returns (bool)",
  "function penalty_k() external view returns (uint256)",
  "function prev_penalty_k() external view returns (uint256)",
  "function penalty_upd_ts() external view returns (uint256)",
  "function locked(address owner) external view returns (int128 amount,uint256 end,uint256 start)",
]);

export const useWithdrawEarly = ({
  account,
  address,
  onPrompt,
  onSubmitted,
  onSuccess,
  onError,
}: {
  account: Address | undefined;
  address: Address;
  onPrompt?: () => void;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (receipt: WaitForTransactionReceiptReturnType) => void;
  onError?: (err: unknown) => void;
}): UseWithdrawEarlyHook__Type => {
  const [loading, setLoading] = useState<boolean>(false);

  const withdrawEarly = async () => {
    await submitAction(
      async () => {
        return await writeContract(config, {
          address,
          abi,
          functionName: "withdraw_early",
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

  const calculateEarlyUnlockPenalty = useCallback(
    async function (
      timestamp: number,
    ): Promise<CalculateEarlyUnlockPenaltyReturn__Type> {
      if (!account) {
        panic("Account not provided");
      }

      const [earlyUnlock, locked, penaltyK, prevPenaltyK, penaltyUpdTs] =
        await multicall(config, {
          allowFailure: false,
          contracts: [
            {
              address,
              abi,
              functionName: "early_unlock",
            },
            {
              address,
              abi,
              functionName: "locked",
              args: [account!],
            },
            {
              address,
              abi,
              functionName: "penalty_k",
            },
            {
              address,
              abi,
              functionName: "prev_penalty_k",
            },
            {
              address,
              abi,
              functionName: "penalty_upd_ts",
            },
          ],
        });

      // Check if early unlock is enabled
      const lockedAmount = locked[0];
      const lockEnd = locked[1];
      const lockStart = locked[2];

      // Check if the lock has expired
      //if (timestamp >= lockEnd) {
      //  throw new Error("Lock has expired");
      //}

      // Calculate time left and total lock time
      const timeLeft = lockEnd - BigInt(Math.trunc(timestamp));
      const timeTotal = lockEnd - lockStart;

      // Calculate the penalty
      const penalty =
        (lockedAmount * timeLeft * penaltyK) / (timeTotal * BigInt(100_00));
      const finalPenalty = penalty < lockedAmount ? penalty : lockedAmount;

      // Calculate the amount the user will receive after penalty
      const userAmount = lockedAmount - finalPenalty;
      const penaltyRatio =
        Number((finalPenalty * BigInt(10000)) / lockedAmount) / 10000;

      return {
        lockedAmount,
        penalty: finalPenalty,
        userAmount,
        penaltyRatio,
      };
    },
    [account, address],
  );

  return {
    loading,
    withdrawEarly,
    calculateEarlyUnlockPenalty,
  };
};
