import { type NextRequest } from "next/server";
import { CONFIG } from "@/config";
import { Subgraph } from "@/lib/subgraph";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const searchParams = request.nextUrl.searchParams;
  const timestamp = searchParams.get("timestamp");
  const chainId = searchParams.get("chainId");

  if (!chainId) {
    return Response.json({ error: "missing chainId" }, { status: 422 });
  }

  const SUBGRAPH_URL = CONFIG.get(parseInt(chainId))?.SUBGRAPH_URL!;
  const graph = new Subgraph(SUBGRAPH_URL);

  if (!timestamp) {
    return Response.json({ data: [] });
  }

  const rewardDistributions = await graph.getRewardsByVeSystemId({
    id,
    timestamp,
  });

  const data = rewardDistributions.map(
    ({ id, rewardTimestamp, totalAmount, unclaimedAmount, token }) => ({
      id,
      token,
      totalAmount,
      unclaimedAmount,
      rewardTimestamp: Number(rewardTimestamp),
    }),
  );

  return Response.json({ data });
}
