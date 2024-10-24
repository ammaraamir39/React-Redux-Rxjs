import React, { Component } from 'react';
import {
    Card,
    Icon,
    Tag,
    Radio,
    Slider,
    Checkbox,
    Row,
    Col,
    Input,
    Tooltip
} from 'antd';
import F from '../../../Functions';
import WizardFooter from './wizard-footer';
import UniversalWholeLife from "./images/icon-universal.svg";
import Term from "./images/icon-term.svg";
import Employer from "./images/icon-employer.svg";
import Other from "./images/icon-other.svg";
import { Translate } from 'react-translated';
import axios from 'axios';

const RadioGroup = Radio.Group;
const { TextArea } = Input;

class Step extends Component {
    state = {
        show_insurance_question: false,
        hasMortgageBroker: false
    }
    componentDidMount = () => {
        const { wizard } = this.props;
        let show_insurance_question = false;
        if (wizard.step_insurance_question !== null) {
            if (wizard.step_insurance_question === 3) {
                show_insurance_question = true;
            } else {
                show_insurance_question = false;
            }
        } else {
            if (wizard.home_mortgage_protection_toggle === "" || wizard.home_mortgage_protection_toggle === null) {
                show_insurance_question = true;
                this.props.updateField('step_insurance_question', 3);
            } else {
                show_insurance_question = false;
            }
        }
        this.setState({ show_insurance_question })

        let hasMortgageBroker = false;
        axios.get("/api/my_associations").then((res) => {
            for(var x in res.data) {
                const agency_users = res.data[x];
                for (var i = 0; i < agency_users.length; i++) {
                    if (agency_users[i].user_type === "MORTGAGE_BROKER") {
                        hasMortgageBroker = true;
                        break;
                    }
                }
            }
            this.setState({ hasMortgageBroker })
        })
    }
    rangeSliderFormatter = (val, marks) => {
        return (marks[val].val !== '') ? marks[val].val : '$0';
    }
    sliderValue = (val, marks) => {
        return marks[val].val;
    }
    get_second_value = (str) => {
        if (typeof str !== "undefined" && str !== "" && str !== null) {
            str = str.replace(/\$/g, "");
            str = str.replace(/,/g, "");
            let arr = str.split("-");
            let num;
            if (arr.length > 1) {
                num = arr[1] * 1;
                return num;
            } else {
                arr = str.split("+");
                if (arr.length > 1) {
                    num = arr[0] * 1;
                    return num;
                }
            }
        }
        return 0;
    }
    rangeToArray = (range) => {
        if (range !== "") {
            range = range.split('-');
            range[0] = parseInt(range[0].replace(/\$/g, '').replace(/,/g, ''), 10);
            range[1] = parseInt(range[1].replace(/\$/g, '').replace(/,/g, ''), 10);
            return range;
        } else {
            return [0, 0];
        }
    }
    render() {

        let { show_insurance_question } = this.state;
        const { wizard, updateField } = this.props;

        if ((wizard.home_mortgage_toggle === "1" || wizard.secondary_home_mortgage_toggle === "1") && show_insurance_question) {
            show_insurance_question = true;
        } else {
            show_insurance_question = false;
        }

        let rangeValues = ["", "$1-$10,000", "$10,001-$25,000", "$25,001-$50,000", "$50,001-$100,000", "$100,001-$150,000", "$150,001-$200,000", "$200,001-$250,000", "$250,001-$300,000", "$300,001-$350,000", "$350,001-$400,000", "$400,001-$450,000", "$450,001-$500,000", "$500,001-$600,000", "$600,001-$700,000", "$700,001-$800,000", "$800,001-$900,000", "$900,001-$1,000,000"];
        let v1, v2;
        for (let i = 1; i < 21; i++) {
            v2 = 1000000 + 100000 * i;
            v1 = v2 - 100000 + 1;
            rangeValues.push(F.dollar_format(v1)+'-'+F.dollar_format(v2));
        }
        rangeValues.push("$3,000,001-$4,000,000");
        rangeValues.push("$4,000,001-$5,000,000");

        let marks = {};
        for (let i=0, rangeLen=rangeValues.length; i<rangeLen; i++) {
            marks[parseInt((i/(rangeLen-1)) * 100, 10)] = {
                label: (i === rangeValues.length - 1) ? rangeValues[i] : (i === 0) ? '$0' : '',
                val: rangeValues[i]
            };
        }

        let mortgageRangeValues = [];
        let mortgageMarks = {};
        const home_market_value = this.get_second_value(wizard.home_market_value);
        for (let i=0, rangeLen=rangeValues.length; i<rangeLen; i++) {
            let value = this.get_second_value(rangeValues[i]);
            if (home_market_value >= value) {
                mortgageRangeValues.push(rangeValues[i]);
            }
        }

        for (let i=0, rangeLen=mortgageRangeValues.length; i<rangeLen; i++) {
            mortgageMarks[parseInt((i/(rangeLen-1)) * 100, 10)] = {
                label: (i === mortgageRangeValues.length - 1) ? rangeValues[i] : (i === 0) ? '$0' : '',
                val: rangeValues[i]
            };
        }

        let home_mortgage = 0;
        if (wizard.home_mortgage !== '') {
            for(let x in mortgageMarks) {
                if (mortgageMarks[x].val === wizard.home_mortgage) {
                    home_mortgage = parseInt(x, 10);
                }
            }
        }

        let home_mortgage_protection_benefit = 0;
        if (wizard.home_mortgage_protection_benefit !== '') {
            for(let x in marks) {
                if (marks[x].val === wizard.home_mortgage_protection_benefit) {
                    home_mortgage_protection_benefit = parseInt(x, 10);
                }
            }
        }

        let home_mortgage_protection_policy = [];
        if (wizard.home_mortgage_protection_policy !== '') {
            home_mortgage_protection_policy = JSON.parse(wizard.home_mortgage_protection_policy);
        }
        const home_mortgage_policy_type = [
            {
                name: "Universal/Whole-Life",
                icon: UniversalWholeLife,
                tip: "A life insurance policy that provides a death benefit that has the ability to be in-force for insured's lifetime. Usually has a policy cash value."
            },
            {
                name: "Term",
                icon: Term,
                tip: "A life insurance policy that provides a death benefit for a specific period of time. Usually 10,15, and 20 years."
            },
            {
                name: "Employer",
                icon: Employer,
                tip: "A life insurance policy that's provided by the employer to purchase with no medical requirements. Usually not enough to cover the insureds life insurance needs."
            },
            {
                name: "Other",
                icon: Other,
                tip: "Customer doesn't know what type of policy they have but knows they have a life policy."
            }
        ];

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Tag color="#87d068"><Translate text={wizard.status} /></Tag>
                        <Translate text={`Mortgage`} />
                    </div>
                }>
                    {this.state.hasMortgageBroker ? (
                        <div style={{marginBottom:20}}>
                            {wizard.home_toggle !== '1' ? (
                                <div>
                                    <Card title={<Translate text={`"Are you looking to purchase a new home within the next 12 months?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                        <RadioGroup value={wizard.mortgage_purchase_home} onChange={(e) => updateField('mortgage_purchase_home', e.target.value)}>
                                            <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                            <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                        </RadioGroup>
                                    </Card>
                                    {wizard.mortgage_purchase_home === 1 ? (
                                        <Card title={<Translate text={`"Would you like one of our representatives to contact you and review your current mortgage?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                            <RadioGroup value={wizard.mortgage_review} onChange={(e) => updateField('mortgage_review', e.target.value)}>
                                                <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                                <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                            </RadioGroup>
                                        </Card>
                                    ) : null}
                                </div>
                            ) : null}
                            {wizard.home_toggle === '1' ? (
                                <div>
                                    <Card title={<Translate text={`"Do you have a mortgage and, if so, what is the mortgage balance?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                        {wizard.home_market_value !== "" && wizard.home_market_value !== null ? (
                                            <Slider
                                                className="rangeSlider"
                                                marks={mortgageMarks}
                                                step={null}
                                                value={home_mortgage}
                                                included={false}
                                                tipFormatter={(val) => this.rangeSliderFormatter(val, mortgageMarks)}
                                                onChange={(val) => updateField('home_mortgage', this.sliderValue(val, mortgageMarks))}
                                            />
                                        ) : null}
                                        <div className="sliderValue center-align">{wizard.home_mortgage || <Translate text={`No Mortgage`} />}</div>
                                    </Card>
                                    {wizard.home_mortgage !== null && wizard.home_mortgage !== "" ? (
                                        <Card title={<Translate text={`"Have you had a mortgage review in the past 6-12 months?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                            <RadioGroup value={wizard.had_mortgage_review} onChange={(e) => updateField('had_mortgage_review', e.target.value)}>
                                                <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                                <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                            </RadioGroup>
                                        </Card>
                                    ) : null}
                                    {wizard.home_mortgage !== null && wizard.home_mortgage !== "" ? (
                                        <Card title={<Translate text={`"Are you looking to purchase a new home within the next 12 months?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                            <RadioGroup value={wizard.mortgage_purchase_home} onChange={(e) => updateField('mortgage_purchase_home', e.target.value)}>
                                                <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                                <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                            </RadioGroup>
                                        </Card>
                                    ) : null}
                                    {wizard.home_mortgage !== null && wizard.home_mortgage !== "" ? (
                                        <Card title={<Translate text={`"Would you like one of our representatives to contact you and review your current mortgage?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                            <RadioGroup value={wizard.mortgage_review} onChange={(e) => updateField('mortgage_review', e.target.value)}>
                                                <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                                <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                            </RadioGroup>
                                        </Card>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <Card title={<Translate text={`"Do you have a mortgage and, if so, what is the mortgage balance?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                            {wizard.home_market_value !== "" && wizard.home_market_value !== null ? (
                                <Slider
                                    className="rangeSlider"
                                    marks={mortgageMarks}
                                    step={null}
                                    value={home_mortgage}
                                    included={false}
                                    tipFormatter={(val) => this.rangeSliderFormatter(val, mortgageMarks)}
                                    onChange={(val) => updateField('home_mortgage', this.sliderValue(val, mortgageMarks))}
                                />
                            ) : null}
                            <div className="sliderValue center-align">{wizard.home_mortgage || <Translate text={`No Mortgage`} />}</div>
                        </Card>
                    )}
                    {show_insurance_question ? (
                        <Card title={<Translate text={`Life Insurance`} />} className="wizardBox wizardBoxBlue" type="inner" style={{textAlign:"center"}}>
                            <Card title={<Translate text={`"Is there life insurance or mortgage protection insurance to pay off the remaining balance of the mortgage should something happen to you? If so, what type of policy is it and what is the total death benefit payout value?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                <RadioGroup value={wizard.home_mortgage_protection_toggle} onChange={(e) => updateField('home_mortgage_protection_toggle', e.target.value)}>
                                    <Radio value="1" className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                    <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                </RadioGroup>
                            </Card>
                            {wizard.home_mortgage_protection_toggle === '1' ? (
                                <div>
                                    <Card type="inner" className="wizardBox">
                                        <Checkbox.Group
                                            className="radioIcons"
                                            value={home_mortgage_protection_policy}
                                            style={{ width: '100%' }}
                                            onChange={(checkedList) => updateField('home_mortgage_protection_policy', JSON.stringify(checkedList))}
                                        >
                                            <Row gutter={16}>
                                                {home_mortgage_policy_type.map((item, i) => {
                                                    return (
                                                        <Col key={i} md={6} span={24}>
                                                            <Tooltip placement="bottom" title={item.tip}>
                                                                <Checkbox value={item.name}>
                                                                    <div className="radioIconOption">
                                                                        <div className="icon"><img src={item.icon} alt={item.name} /></div>
                                                                        <div className="title"><Translate text={item.name} /></div>
                                                                    </div>
                                                                </Checkbox>
                                                            </Tooltip>
                                                        </Col>
                                                    )
                                                })}
                                            </Row>
                                        </Checkbox.Group>
                                    </Card>
                                    <Card title={<Translate text={`"What's the approximate death benefit?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                        <Slider
                                            className="rangeSlider"
                                            marks={marks}
                                            step={null}
                                            value={home_mortgage_protection_benefit}
                                            included={false}
                                            tipFormatter={(val) => this.rangeSliderFormatter(val, marks)}
                                            onChange={(val) => updateField('home_mortgage_protection_benefit', this.sliderValue(val, marks))}
                                        />
                                        <div className="sliderValue center-align">{wizard.home_mortgage_protection_benefit || '$0'}</div>
                                    </Card>
                                </div>
                            ) : null}
                        </Card>
                    ) : null}
                    <Card className="wizardBox center-align didYouKnowBox" type="inner">
                        <h2><Translate text={`DID YOU KNOW`} /></h2>
                        <p><Translate text={`"The equity in your home is the biggest asset most people have, and we need to protect this asset."`} /></p>
                    </Card>
                    <div className="pagination">
                        <a className={(wizard.stepIndex === 4) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 4)}>1</a>
                        <a className={(wizard.stepIndex === 5) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 5)}>2</a>
                        <a className={(wizard.stepIndex === 6) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 6)}>3</a>
                        <a className={(wizard.stepIndex === 7) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 7)}>4</a>
                        <a className={(wizard.stepIndex === 8) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 8)}>5</a>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
