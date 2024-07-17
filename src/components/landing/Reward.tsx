import React, { useEffect, useState } from "react";
import { Row, Col, Container } from 'reactstrap';
import Select/* , { components } */ from "react-select";
import { callGetAPI, /* callPostAPI, */ numberFormat } from '../../helper';
import Calculator from "./Calculator";

const filterDurationType = [
  { value: 1, label: "Daily" },
  { value: 2, label: "Weekly" },
  { value: 3, label: "Monthly" },
  { value: 4, label: "Yearly" },
  { value: 5, label: "Yesterday" },
  { value: 6, label: "Inception-to-date" },
];

const colourStyles = {
  option: (styles: object, { /* isFocused, */ isSelected }: any) => {
    return {
      ...styles,
      backgroundColor: /* isFocused || */ isSelected ? "#BE8277" : null,
      color: "#fff",
      borderRadius: "10px",
    };
  }
} as any;

const getImageSpan = (label = '') => {
  return <div>
    <img
      src={"/images/new-image/TillDate.svg"}
      style={{ width: 20, height: 20, marginRight: 10 }}
      alt={label}
      onError={(e: any) => {
        e.target.src = `/images/plandetails/ZeebuToken.svg` // default img
      }}
    />
    {label}
  </div>
}

const Reward = (props: any) => {

  const { currentRate = 0 } = props;
  const [filterDuration, setfilterDurationType] = useState({ value: 6, label: getImageSpan(filterDurationType[5].label) });
  const [waitlistStatistic, setWaitlistStatistic] = useState({
    totalCharge: 0, OLP: 0, Deployer: 0, totalChargeUSD: 0, OLPUSD: 0, DeployerUSD: 0
  });

  useEffect(() => {
    getRewardInformation(filterDuration.value);
  }, [filterDuration]);

  const handleChange = (option: any) => {
    // const { value = '' } = Object.assign({}, filterDuration);
    const object = {
      label: option.label,
      value: option.value
    }
    setfilterDurationType(object);
  };

  const getRewardInformation = async (duration = 6) => {

    let waitlistStatisticData = { totalCharge: 0, OLP: 0, Deployer: 0, totalChargeUSD: 0, OLPUSD: 0, DeployerUSD: 0 };
    const response = await callGetAPI('getInvoiceStatistic', { data: duration }) as { data: { TotalUSD: 0, TotalZeebu: 0 } };
    if (response?.data !== undefined) {
      const statisticData = response?.data;
      const { TotalUSD = 0, TotalZeebu = 0 } = statisticData;

      if (TotalUSD > 0) {
        waitlistStatisticData.totalCharge = TotalZeebu * 1.4 / 100;
        waitlistStatisticData.OLP = TotalZeebu * 0.8 / 100;
        waitlistStatisticData.Deployer = TotalZeebu * 0.6 / 100;

        waitlistStatisticData.totalChargeUSD = TotalUSD * 1.4 / 100;
        waitlistStatisticData.OLPUSD = TotalUSD * 0.8 / 100;
        waitlistStatisticData.DeployerUSD = TotalUSD * 0.6 / 100;
      }

    }

    /* let waitlistStatisticData = {};
    const response = await callGetAPI('getWaitlistStatistic', { data: duration });
    // console.log("response", response)
    if (response?.data !== undefined) {
      waitlistStatisticData = response?.data;
    } */
    setWaitlistStatistic(waitlistStatisticData);
  }

  const { totalCharge = 0, OLP = 0, Deployer = 0, totalChargeUSD = 0, OLPUSD = 0, DeployerUSD = 0 } = waitlistStatistic;
  // console.log("totalCharge", totalCharge)
  return (
    <>
      <Container>
        <div className="cardreward mt-20">
          <Row>
            <Col md={12} className="mx-right">
              <Select
                value={filterDuration}
                onChange={handleChange}
                options={filterDurationType.map((option, i) => ({
                  label: getImageSpan(option.label),
                  value: option.value
                }))}
                styles={colourStyles}
                className="tilldate"
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>

            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <div className="cardrewardtitle">
                <span>Protocol Rewards</span>
                <p>Earn rewards by building a trusted network within our ecosystem and receive a share of each transaction in the settlement process. </p>
                <img src={"/images/new-image/Rewards.svg"} alt="Zeebu Rewards" title="Zeebu Rewards" />
              </div>
            </Col>
            <Col md={3}>
              <div className="cardtotalreward">
                <div className="cardtotalbg">
                  <p>Total Rewards</p>
                  {currentRate > 0 && <strong>$ {numberFormat(totalChargeUSD, 2)}</strong>}
                  <span>{numberFormat(totalCharge, 3)} ZBU</span>
                </div>
              </div>
            </Col>
            <Col md={5}>
              <div className="plancard">
                <Row>
                  <Col md={6} xs={12}>
                    <span>Deployer</span>
                  </Col>
                  <Col md={6} xs={12}>
                    {currentRate > 0 && <div className="plancarddetails">
                      <img src={"/images/new-image/USDOX.svg"} alt="Zeebu Rewards" title="Zeebu Rewards" />
                      <strong>$ {numberFormat(DeployerUSD, 2)}</strong>
                    </div>}
                    <div className="plancarddetails">
                      <img src={"/images/new-image/ZbuToken.svg"} alt="Zeebu Rewards" title="Zeebu Rewards" />
                      <strong>{numberFormat(Deployer, 3)} ZBU</strong>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="plancard">
                <Row>
                  <Col md={6} xs={12}>
                    <span>OLP</span>
                  </Col>
                  <Col md={6} xs={12}>
                    {currentRate > 0 && <div className="plancarddetails">
                      <img src={"/images/new-image/USDOX.svg"} alt="Zeebu Rewards" title="Zeebu Rewards" />
                      <strong>$ {numberFormat(OLPUSD, 2)}</strong>
                    </div>}
                    {/* <div className="plancarddetails">
                      <img src={"/images/new-image/USDOX.svg"} alt="Zeebu Rewards" title="Zeebu Rewards" />
                      <strong>$ 84,320,987</strong>
                    </div> */}
                    <div className="plancarddetails">
                      <img src={"/images/new-image/ZbuToken.svg"} alt="Zeebu Rewards" title="Zeebu Rewards" />
                      <strong>{numberFormat(OLP, 3)} ZBU</strong>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
      <Calculator currentRate={currentRate} />
    </>
  );
};

export default Reward;