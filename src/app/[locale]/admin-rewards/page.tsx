import { Trans } from "@lingui/macro";
import { withLinguiPage } from "@/app/withLingui";
import AdminRewards from "@/components/AdminRewards";
import Header from "@/components/Header";
import {Typography} from "@mui/material";

export default withLinguiPage(function Page() {
  return (
    <>
      <Header title={<Typography fontWeight="bold" fontSize="2.5rem" color="text.primary"><Trans>Add Rewards</Trans></Typography>} />
      <AdminRewards />
    </>
  );
});
