import React, { useState } from "react";
import { Row, Col, Container, FormGroup, Label, Input } from 'reactstrap';
import { numberFormat } from '@/helper';

const durationArray = [
    0,
    1,
    7,
    30,
    365
]

const durationString = [
    "",
    "Daily",
    "Weekly",
    "Monthly",
    "Yearly"
]

export default function Calculator(props: any) {

    // const [filterDuration, setfilterDurationType] = useState({ value: 6, label: getImageSpan(filterDurationType[5].label) });
    const [durationValue, setDurationValue] = useState(1);
    const [amount, setAmount] = useState(40000000);
    const { currentRate = 0 } = props;

    /* const handleChange = (option) => {
        // const { value = '' } = Object.assign({}, filterDuration);
        const object = {
            label: option.label,
            value: option.value
        }
        setfilterDurationType(object);
    }; */

    const onChangeValue = (value: number) => {
        setDurationValue(value);
    }

    const keyPress = (e: any) => {
        e = e || window.event;
        var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
        // console.log("charCode", charCode)
        var charStr = String.fromCharCode(charCode);
        if ([8, 46, 13, 9, 16, 37, 38, 39, 35, 40, 34, 97, 98, 99, 100, 101, 102, 103, 104, 105, 36, 96, 48, 110].indexOf(charCode) === -1 && !charStr.match(/^\d+$/)) {
            e.preventDefault();
        } else if (e.target.value !== undefined && typeof e.target.value === "string" && (e.target.value).length >= 15 && [8, 46, 35, 36, 37, 38, 39, 40].indexOf(charCode) === -1) {
            e.preventDefault();
        }
    }

    const onChangeAmount = (e: any) => {
        const inputValue = e.target.value.replace(/,/g, '');
        const numericValue = Number(inputValue);
        if (!isNaN(numericValue)) {
            setAmount(numericValue);
        }
    }

    return (
        <>
            <Container>
                <div className="calculatorreward">
                    <Row>
                        <Col md={12}>

                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <div className="rewardcalbox">
                                <Row>
                                    <Col md={8}>
                                        <div className='caltitle'>Calculator</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <FormGroup className='calfrmbox'>
                                            <Label for="amount">Enter Daily Invoice Amount</Label>
                                            <Input type="text" value={numberFormat(amount, 0)} name="amount" id="amount" placeholder="Enter Amount" maxLength={13} onKeyDown={keyPress}
                                                onChange={(e) => onChangeAmount(e)} />
                                            <span>$</span>
                                        </FormGroup>
                                        <FormGroup className='lockingrate mt-10'>
                                            <Label for="amount" className="label-class">Select Duration For Rewards</Label>
                                            <ul className="caldayslink">
                                                <li onClick={() => onChangeValue(1)} className={durationValue === 1 ? 'active' : ''}>Daily</li>
                                                <li onClick={() => onChangeValue(2)} className={durationValue === 2 ? 'active' : ''}>Weekly</li>
                                                <li onClick={() => onChangeValue(3)} className={durationValue === 3 ? 'active' : ''}>Monthly</li>
                                                <li onClick={() => onChangeValue(4)} className={durationValue === 4 ? 'active' : ''}>Yearly</li>
                                            </ul>
                                        </FormGroup>
                                        <FormGroup>
                                            <div className="calbtn">
                                                <Input type="submit" name="submit" value="Calculate" />
                                                <span>* Based on 1.4%</span>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <div className="cardProto">
                                            <Row className="m-0">
                                                <Col md={4}><img src={"/images/new-image/ProtocolYield.svg"} className="img-fluid" alt="zeebu" title="zeebu" /></Col>
                                                <Col md={8}>
                                                    <div className="carddetails">
                                                        <span><strong>$ {numberFormat(amount * 2 * durationArray[durationValue] / 100, 0)}</strong> (2%)</span>
                                                        <p>Protocol Yield</p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="cardProto">
                                            <Row className="m-0">
                                                <Col md={4}><img src={"/images/new-image/ProtocolReward.svg"} className="img-fluid" alt="zeebu" title="zeebu" /></Col>
                                                <Col md={8}>
                                                    <div className="carddetails">
                                                        <span><strong>$ {numberFormat(amount * 1.4 * durationArray[durationValue] / 100, 0)}</strong> (1.4%)</span>
                                                        <p>Protocol Rewards</p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="rewardcalbox">
                                <Row>
                                    <Col md={6}><div className='rewardtitle'>Protocol Rewards</div></Col>
                                    {/* <Col md={6}>
                                        <div className="mx-right">
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
                                        </div>
                                    </Col> */}
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <div className='rewarddetails mt-10'>
                                            <h3>Deployer (0.6%)</h3>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>Inv. Amount</td>
                                                        <td><strong>$ {numberFormat(amount * durationArray[durationValue], 0)}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Dollar</td>
                                                        <td><strong><img src={"/images/new-image/USDOX.svg"} alt="Zeebu Rewards" title="Zeebu Rewards" /> $ {numberFormat(amount * 0.6 * durationArray[durationValue] / 100, 0)}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td>ZBU</td>
                                                        <td><strong><img src={"/images/new-image/ZbuToken.svg"} alt="Zeebu Rewards" title="Zeebu Rewards" /> {numberFormat((amount * 0.6 * durationArray[durationValue] / 100) / currentRate, 0)} ZBU</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Duration</td>
                                                        <td><strong>{durationString[durationValue]}</strong></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='rewarddetails mt-20'>
                                            <h3>OLP (0.8%)</h3>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>Inv. Amount</td>
                                                        <td><strong>$ {numberFormat(amount * durationArray[durationValue], 0)}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Dollar</td>
                                                        <td><strong><img src={"/images/new-image/USDOX.svg"} alt="Zeebu Rewards" title="Zeebu Rewards" /> $ {numberFormat(amount * 0.8 * durationArray[durationValue] / 100, 0)}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td>ZBU</td>
                                                        <td><strong><img src={"/images/new-image/ZbuToken.svg"} alt="Zeebu Rewards" title="Zeebu Rewards" /> {numberFormat((amount * 0.8 * durationArray[durationValue] / 100) / currentRate, 0)} ZBU</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Duration</td>
                                                        <td><strong>{durationString[durationValue]}</strong></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </>
    )
}
