"use client";

import { useEffect, useState, Fragment } from "react";
import { useAccount } from "wagmi";
import { useLingui } from "@lingui/react";
// import Register from "@/components/register";
import Loader from "@/components/Loader";
import { getUserDetail } from "@/helper/commonUtils";
import { useRouter } from "next/navigation";
import { Row, Col } from 'reactstrap';
import RegistrationForm from "@/components/landing/RegistrationForm";
import UserCount from "./UserCount";
import Calculator from "./Calculator";
import FAQ from "./FAQ";

const Landing = (props: any) => {

    const { i18n } = useLingui();
    const router = useRouter();
    const [loading, setLoading] = useState<Boolean>(true);
    const { address } = useAccount();

    useEffect(() => {
        // console.log("address", address)
        setLoading(true);
        if (address) {
            checkUserExists(address);
        } else {
            setLoading(false);
        }
    }, [address])

    const checkUserExists = async (userAddress: string) => {
        const userDetail: any = await getUserDetail(userAddress, true);
        if (![undefined, null, ""].includes(userDetail.email)) {
            router.push("/dashboard");
        } else {
            setLoading(false);
        }
    }

    return (
        <>
            {loading && <Loader />}
            <Row>
                <Col md={12}>
                    <div className='zeebuadd'>
                        <h2><span id="totalInvoiceValue">2 Billion</span> Reasons to Celebrate Our Settlement Success!</h2>
                    </div>
                </Col>
            </Row>
            <Fragment>
                <div className='signupprocess'>
                    <Row>
                        <Col md={4} lg={4} xl={6}>
                            <div className='cardleftpanel'>
                                <div className='cardleftdetails'>
                                    <h1>Get exclusive access to Zeebu Protocol & </h1><span>Earn Rewards!</span>
                                    <p>Experience the symphony of Staking, Liquidity, decentralized settlements & Rewards.</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={8} lg={8} xl={6}>
                            <RegistrationForm />
                            {/* {isSuspended && <BlockUser />} */}
                        </Col>
                        <UserCount />
                        {/* <Calculator /> */}
                        <FAQ />
                    </Row>
                </div>
            </Fragment>
        </>
    );
};
export default Landing;