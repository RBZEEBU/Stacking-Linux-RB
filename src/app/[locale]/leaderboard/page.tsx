// import { Trans } from "@lingui/macro";
import { withLinguiPage } from "@/app/withLingui";
import Leaderboard from "@/components/leaderboard";
// import Header from "@/components/Header";

export default withLinguiPage(function Page() {
    return (
        <>
            <Leaderboard />
        </>
    );
});
