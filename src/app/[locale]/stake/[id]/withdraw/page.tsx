import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import CustomBreadcrumbs from "@/components/Breadcrumbs";
import EarlyWithdraw from "@/components/EarlyWithdraw";
import Header from "@/components/Header";
import { mainTitle } from "@/consts";
import { withLinguiPage } from "@/app/withLingui";

export default withLinguiPage(async function Page({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const { i18n } = useLingui();

  const title = t(i18n)`Early Withdraw`;

  const breadcrumbItems = [
    { href: "/", title: mainTitle },
    { href: "", title: title },
  ];
  return (
    <>
      <Header title={title}>
        <CustomBreadcrumbs items={breadcrumbItems} />
      </Header>
      <EarlyWithdraw poolId={params.id} />
    </>
  );
});
