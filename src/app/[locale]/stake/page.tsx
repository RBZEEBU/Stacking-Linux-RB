import Header from "@/components/Header";
import { Pools } from "@/components/Pools";
import { Trans } from "@lingui/macro";
import {Typography} from "@mui/material";

export default async function Page() {
  return (
    <>
      <Header title={<Typography fontWeight="bold" fontSize="2.5rem" color="text.primary"><Trans>Zeebu Staking</Trans></Typography>} />

      <div className="margin-top60">
        <Pools />
      </div>
     
    </>
  );
}
