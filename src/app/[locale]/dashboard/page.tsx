// import { Trans } from "@lingui/macro";
import { withLinguiPage } from "@/app/withLingui";
import Dashboard from "@/components/dashboard";
// import Header from "@/components/Header";

export default withLinguiPage(function Page() {
    return (
        <>
            <Dashboard />
        </>
    );
});
