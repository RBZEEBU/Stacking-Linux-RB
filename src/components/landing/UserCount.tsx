import React, { useState, useEffect } from "react";
import { Row, Col, Container } from 'reactstrap';
import Select/* , { components } */ from "react-select";
import HighchartsReact from "highcharts-react-official";
import Highcharts/* , { format } */ from 'highcharts';
import { callGetAPI, /* formatNumber, */ /* callPostAPI, */ numberFormat } from '../../helper';
import { /* topRecordsInTable, */ rpcUrl, zbuBurningAddress, ZBUContractAddress } from '@/consts';
import { ethers } from 'ethers';
import ZBUContractABI from "@/helper/ZeebuContractABI.json";
import Reward from "./Reward";

const filterDurationType = [
  { value: 1, label: "Daily", },
  { value: 2, label: "Weekly", },
  { value: 3, label: "Monthly", },
  { value: 4, label: "Yearly", },
  { value: 5, label: "Yesterday", },
  { value: 6, label: "Inception-to-date" },
];

const colourStyles = {
  option: (styles: any, { /* isFocused, */ isSelected }: any) => {
    return {
      ...styles,
      backgroundColor: /* isFocused */ isSelected ? "#BE8277" : null,
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
        e.target.src = `/images/new-image/ZeebuToken.svg` // default img
      }}
    />
    {label}
  </div>
}

const getNumberFromWei = (value: any) => {
  try {
    if (!value || value === '' || value.toString() === "0") {
      return 0;
    } else {
      const returnValue = ethers.utils.formatUnits(value.toString(), 18);
      return parseFloat(returnValue);
    }
  } catch (e) {
    console.log("error getNumberFromWei", e);
    return 0;
  }
}

const UserCount = () => {

  const [filterDuration, setfilterDurationType] = useState({ value: 6, label: getImageSpan(filterDurationType[5].label) });
  // const [durationType, setDurationType] = useState(6);
  const [innvoiceStatistic, setInnvoiceStatistic] = useState({
    TotalInvoice: 0, TotalZeebu: 0, /* TotalRewards : 0, */ TotalBurns: 0, /* AvgRate : 0, */ TotalUSD: 0
  });
  const [totalMerchant, setTotalMerchant] = useState(0);
  const [zeebuRate, setZeebuRate] = useState(0);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    getInvoiceInformation(filterDuration.value);
    getZeebuRate();
    getChartDetail();
  }, [filterDuration]);

  const handleChange = (option: any) => {
    // const { value = '' } = Object.assign({}, filterDuration);
    const object = {
      label: option.label,
      value: option.value
    }
    setfilterDurationType(object);
  };

  const getInvoiceInformation = async (duration = 6) => {
    let statisticData = { TotalBurns: 0, TotalUSD: 0 } as any;
    const response = await callGetAPI('getInvoiceStatistic', { data: duration }) as any;
    // console.log("response", response)
    if (response?.data !== undefined) {
      statisticData = response?.data;
      // setInnvoiceStatistic(response?.data);
      const { TotalUSD = 0 } = statisticData;
      // console.log("displayNumber", displayNumber)
      if (document.getElementById("totalInvoiceValue") && duration === 6) {
        const displayNumber = TotalUSD > 0 ? (parseInt(TotalUSD.toString().substring(0, 2)) / 10) : 2;
        const element = document.getElementById("totalInvoiceValue") as any;
        element.innerText = (displayNumber + " Billion");
      }
    }
    // setDurationType(duration);

    try {
      const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const tokenContract = new ethers.Contract(ZBUContractAddress, ZBUContractABI, rpcProvider);
      const tokenBalance = await tokenContract.balanceOf(zbuBurningAddress);
      const parseBalance = getNumberFromWei(String(tokenBalance));
      statisticData.TotalBurns = parseBalance;
    } catch (error) {
      console.log("error fetching burning detail");
    }

    setInnvoiceStatistic(statisticData);
    getZeebuRate();
  }

  const getZeebuRate = async () => {

    const rateInfo = await callGetAPI("getZeebuRate") as any;
    if (rateInfo?.data !== undefined) {
      const { info = '' } = rateInfo?.data;
      setZeebuRate(numberFormat(info, 6));
    }

    const response = await callGetAPI("getTotalMerchant") as any;
    if (response.Counts !== undefined) {
      // console.log("data",data)
      if (![undefined, null, ""].includes(response.Counts.Total)) {
        setTotalMerchant(response.Counts.Total);
      }
    }

  }

  const getChartDetail = async (openPopup = false) => {
    if (!openPopup) {
      const { data = {} } = await callGetAPI("getRateChartData") as any;
      let chartDataArray: any = [];
      if (Array.isArray(data) && data.length > 0) {
        data.map((item) => {
          // chartDataArray.push([Math.floor(item[0] / 1000), parseFloat(item[1])]);
          chartDataArray.push([item[0], parseFloat(item[1])]);
          return item;
        });
      }

      const { data: marketData = {} } = await callGetAPI("getMarketData") as any;
      setChartData({ cData: chartDataArray, marketData: marketData.ZBU !== undefined && marketData.ZBU[0] !== undefined ? marketData.ZBU[0] : {} });
    } else {
      setChartData({ ...chartData });
    }
  }

  const { TotalInvoice = 0, TotalZeebu = 0, /* TotalRewards = 0, */ TotalBurns = 0, /* AvgRate = 0, */ TotalUSD = 0 } = innvoiceStatistic;
  const { cData = [] } = chartData as any;

  const alreadyBurned = 477861432;

  const optionChartSmall = {
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
      marginLeft: -12,
      marginRight: -12,
      marginBottom: 0,
      marginTop: -5,
      height: 136
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      lineWidth: 0,
      minorGridLineWidth: 0,
      lineColor: 'transparent',
      title: {
        text: ''
      },
      dateTimeLabelFormats: {
        //day: '%e %b' // Day format: "5 Jan"
        second: '%H:%M:%S'  // Minute format: "15:04"
      },
      gridLineColor: 'transparent',
      labels: {
        style: {
          color: '#fff'
        },
        enabled: false
      },
      minorTickLength: 0,
      tickLength: 0

    },
    yAxis: {
      title: {
        text: ''
      },
      gridLineColor: 'transparent',
      labels: {
        enabled: false
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        color: '#fff'
      }
    },
    tooltip: {
      pointFormat: '{series.name} <b>{point.y:,.0f}</b><br/>'
    },
    series: [{
      name: 'ZBU',
      data: cData,
      type: 'area',
      threshold: null,
      tooltip: {
        valueDecimals: 2,
      },
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [0, 'rgba(255, 255, 255, 0.41)'], // Start color at 51% opacity
          [1, 'rgba(255, 255, 255, 0)'] // End color at 0% opacity
        ]
      },
    }]
  }

  const totalYield = TotalUSD !== 0 ? (TotalUSD * 2 / 100) : 0;

  return (
    <>
      <Container>
        <div className="dashboardwaitlistbg">
          <div className="dashboardwaitlist">
            <div className="dashtitle">Dashboard</div>
            <Row>
              <Col md={12} className="mx-right">
                {/* <Select
                  className="tilldate"
                  value={filterDuration}
                  options={filterDuration}
                  onChange={handleChange}
                  styles={colourStyles}
                  components={{
                    Option,
                    SingleValue
                  }}
                /> */}
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
              <Col md={4}>
                <div className="cardrate">
                  <Row className="m-0">
                    <Col md={4}><img src={"/images/new-image/Totalnumberinvoicesettled.svg"} className="img-fluid" alt="zeebu" title="zeebu" /></Col>
                    <Col md={8}>
                      <div className="carddetails">
                        <span>{numberFormat(TotalInvoice, 0)}</span>
                        <p>Total Number of Invoice Settled</p>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="cardrate">
                  <Row className="m-0">
                    <Col md={4}><img src={"/images/new-image/TotalDollarVolumeSettlement.svg"} className="img-fluid" alt="zeebu" title="zeebu" /></Col>
                    <Col md={8}>
                      <div className="carddetails">
                        <span>{"$" + numberFormat(TotalUSD, 2)}</span>
                        <p>Total Dollar Volume of Settlements</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={3}>
                <div className="cardrate cardfull">
                  <Row className="m-0">
                    <Col md={12}><img src={"/images/new-image/TotalZBUused.svg"} className="img-fluid" alt="zeebu" title="zeebu" /></Col>
                    <Col md={12}>
                      <div className="carddetails">
                        <span>{numberFormat(TotalZeebu, 2)} ZBU</span>
                        <p>Total ZBU Used</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={5}>
                <div className="cardrate">
                  <Row className="m-0">
                    <Col md={4}>
                      <img src={"/images/new-image/zeebu-token-round.gif"} className="mx-auto" style={{ "width": "110px" }} alt="zeebu" title="zeebu" />
                    </Col>
                    <Col md={8}>
                      <div className="carddetails">
                        <span>{zeebuRate}</span>
                        <p>Current Rate</p>
                      </div>
                    </Col>
                    <Col md={12} className="ml-0 mr-0">
                      <HighchartsReact containerProps={{ style: { height: "100%" } }} highcharts={Highcharts} options={optionChartSmall} />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <div className="cardrate">
                  <Row className="m-0">
                    <Col md={4}><img src={"/images/new-image/Totalnumbermerchants.svg"} className="img-fluid" alt="zeebu" title="zeebu" /></Col>
                    <Col md={8}>
                      <div className="carddetails">
                        <span>{numberFormat(totalMerchant, 0)}</span>
                        <p>Total Number of Merchants</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={4}>
                <div className="cardrate">
                  <Row className="m-0">
                    <Col md={4}><img src={"/images/new-image/TotalZBUburned.svg"} className="img-fluid" alt="zeebu" title="zeebu" /></Col>
                    <Col md={8}>
                      <div className="carddetails">
                        <span>{numberFormat((TotalBurns + alreadyBurned), 2)} ZBU</span>
                        <p>Total ZBU burned</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={4}>
                <div className="cardrate">
                  <Row className="m-0">
                    <Col md={4}><img src={"/images/new-image/Fees.svg"} className="img-fluid" alt="zeebu" title="zeebu" /></Col>
                    <Col md={8}>
                      <div className="carddetails">
                        <span>$ {numberFormat(totalYield, 2)}</span>
                        <p>Protocol Yield</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
      <Reward currentRate={zeebuRate} />
    </>
  );
};

export default UserCount;