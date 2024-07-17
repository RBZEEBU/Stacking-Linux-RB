"use client";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Pool from "@/components/Pool";
import { usePools } from "@/hooks/usePools";
import { useAccount, useChainId } from "wagmi";
import { useEffect, useState } from "react";
import { Pool__Type } from "@/types";
import Loader from "./Loader";

export const Pools = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { fetchPools } = usePools({ account: address, chainId });
  const [pools, setPools] = useState<Pool__Type[]>([]);

  useEffect(() => {
    fetchPools().then((pools) => setPools(pools));

    const id = setInterval(() => {
      fetchPools().then((pools) => setPools(pools));
    }, 5000);
    return () => clearInterval(id);
  }, [fetchPools]);

  if (!pools.length) return <Loader />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          spacing={2}
          useFlexGap
          sx={{ width: "100%", display: { xs: "flex", sm: "flex" } }}
        >
          {pools.map((pool, index) => (
            <Pool pool={pool} key={index} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};
