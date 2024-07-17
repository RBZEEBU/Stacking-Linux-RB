import { type NextRequest } from "next/server";
import { CONFIG } from "@/config";
import { Subgraph } from "@/lib/subgraph";
import { Address } from "viem";
import { Pool__Type } from "@/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const account = searchParams.get("account")!.toLowerCase() as Address;
  const chainId = Number(searchParams.get("chainId"));

  if (!chainId) {
    return Response.json({ error: "missing chainId" }, { status: 422 });
  }

  const SUBGRAPH_URL = CONFIG.get(chainId)?.SUBGRAPH_URL!;
  const graph = new Subgraph(SUBGRAPH_URL);

  const veContract = CONFIG.get(chainId)?.VE_CONTRACT!;
  const balancerPoolContract = CONFIG.get(chainId)?.BALANCER_POOL_VE_CONTRACT!;
  const veSystems = await graph.getAllVeSystems([
    veContract,
    balancerPoolContract,
  ]);

  const locks = await graph.getLocksByUserId(account);

  const data = veSystems.map((veSystem): Pool__Type => {
    const userLock = locks.find(
      (lock) => lock.votingEscrow === veSystem.votingEscrow.address,
    );

    const id = veSystem.id;
    const address = veSystem.votingEscrow.address;
    const token = veSystem.bptTokenName;
    const tokenAddress = veSystem.bptToken;
    const tokenSymbol = veSystem.bptTokenSymbol;
    const name = veSystem.votingEscrow.name;
    const symbol = veSystem.votingEscrow.symbol;
    const decimals = veSystem.votingEscrow.decimals;
    const start = parseInt(userLock?.lockStart || "0");
    const end = parseInt(userLock?.unlockTime || "0");
    const duration = end - start;
    const yourStake = userLock?.totalLocked || "0";
    const stake = veSystem.votingEscrow.lockedAmount;
    const timestamp = parseInt(veSystem.blockTimestamp);
    const admin = veSystem.admin;
    const maxLockTime = parseInt(veSystem.votingEscrow.maxTime);

    return {
      id,
      address,
      token,
      tokenAddress,
      tokenSymbol,
      name,
      symbol,
      decimals,
      yourStake,
      stake,
      start,
      end,
      duration,
      staking: yourStake !== "0",
      apy: 0,
      rewardTokens: veSystem.rewardDistributor.rewardTokens,
      rewardDistributorAddress: veSystem.rewardDistributorAddress,
      timestamp,
      admin,
      maxLockTime,
    };
  });

  return Response.json({ data });
}
