import { type NextRequest } from "next/server";
import { CONFIG } from "@/config";
import { Subgraph } from "@/lib/subgraph";
import { Address } from "viem";
import { Recent_Transaction, Recent_Transaction_Enum } from "@/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const account = searchParams.get("account")!.toLowerCase() as Address;
  const chainId = Number(searchParams.get("chainId"));
  const limit = Number(searchParams.get("limit")) || 100;

  if (!chainId) {
    return Response.json({ error: "missing chainId" }, { status: 422 });
  }

  const SUBGRAPH_URL = CONFIG.get(chainId)?.SUBGRAPH_URL!;
  const graph = new Subgraph(SUBGRAPH_URL);

  const userWithRecentTransactions = await graph.getRecentTransactionsByUser(
    account,
    limit,
  );

  const data: Recent_Transaction[] = [];
  if (!userWithRecentTransactions) {
    return Response.json({ data });
  }

  userWithRecentTransactions.locks &&
    userWithRecentTransactions.locks.forEach((lock) => {
      data.push({
        id: lock.id,
        timestamp: parseInt(lock.timestamp),
        type: Recent_Transaction_Enum.LOCK,
        tx: lock.tx,
        lockType: lock.type,
      });
    });

  userWithRecentTransactions.userRewardClaims &&
    userWithRecentTransactions.userRewardClaims.forEach((claim) => {
      data.push({
        id: claim.id,
        timestamp: parseInt(claim.claimTimestamp),
        type: Recent_Transaction_Enum.REWARD_CLAIM,
        tx: claim.txHash,
        token: claim.token,
      });
    });

  data.sort((a, b) => b.timestamp - a.timestamp);
  return Response.json({ data });
}
