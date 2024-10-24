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
    Tooltip
} from 'antd';
import F from '../../../Functions';
import WizardFooter from './wizard-footer';
import { Translate } from 'react-translated';

import UniversalWholeLife from "./images/icon-universal.svg";
import Term from "./images/icon-term.svg";
import Employer from "./images/icon-employer.svg";
import Other from "./images/icon-other.svg";

import IRAs from './images/bfile-ira.svg';
import Annuities from './images/bfile-annuties.svg';
import SavingsAccounts from './images/bfile-savings-account.svg';
import CDs from './images/bfile-cd.svg';
import BrokerageAccounts from './images/bfile-brokerage-account.svg';
import Cryptocurrency from './images/icon-crypto.svg';
import None from './images/bfile-no.svg';


const RadioGroup = Radio.Group;

class Step extends Component {
    state = {
        show_insurance_question: false
    }
    componentDidMount = () => {
        const { wizard } = this.props;
        let show_insurance_question = false;
        if (wizard.step_insurance_question !== null) {
            if (wizard.step_insurance_question === 5) {
                show_insurance_question = true;
            } else {
                if (wizard.home_mortgage_protection_toggle === '' || wizard.home_mortgage_protection_toggle === null) {
                    show_insurance_question = true;
                    this.props.updateField('step_insurance_question', 5);
                } else {
                    show_insurance_question = false;
                }
            }
        } else {
            show_insurance_question = true;
            this.props.updateField('step_insurance_question', 5);
        }
        this.setState({ show_insurance_question })
    }
    rangeSliderFormatter = (val, marks) => {
        return (marks[val].val !== '') ? marks[val].val : '$0';
    }
    sliderValue = (val, marks) => {
        return marks[val].val;
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

        let asset_total_value = 0;
        if (wizard.asset_total_value !== '') {
            for(let x in marks) {
                if (marks[x].val === wizard.asset_total_value) {
                    asset_total_value = parseInt(x, 10);
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

        let asset_accounts = [];
        if (wizard.asset_accounts !== '') {
            asset_accounts = JSON.parse(wizard.asset_accounts);
            if (!asset_accounts) {
                asset_accounts = [];
            }
        }

        const asset_accounts_items = [
            {
                name: "IRA's",
                icon: IRAs,
                tip: "Individual Retirement Plan that is usually funded by rolling over a retirement plan from a previous employer. Traditional IRA's are taxable when funds are taken out during retirement. Roth IRA's are not taxable when funds are taken out at retirement."
            },
            {
                name: "Annuities",
                icon: Annuities,
                tip: "Insurance contracts that people use for guaranteed income in the future."
            },
            {
                name: "Savings Accounts",
                icon: SavingsAccounts,
                tip: "An account usually held at bank. Interest paid on funds are usually higher than a checking account."
            },
            {
                name: "CD's",
                icon: CDs,
                tip: "A certificate of deposit that the bank issues to customers for a specific interest rate on the funds. The customer has to keep the funds in the CD for the term issued by the bank."
            },
            {
                name: "Brokerage Accounts",
                icon: BrokerageAccounts,
                tip: "An account established by a customer to purchase mutual funds or stocks."
            },
            {
                name: "Cryptocurrency",
                icon: Cryptocurrency,
                tip: "Cryptocurrency"
            },
            {
                name: "None",
                icon: None,
                tip: ""
            }
        ]

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
                        <Translate text={`Protecting What You Save`} />
                    </div>
                }>
                    <Card title={<Translate text={`"Do you or anyone in the household own any of the following type of accounts?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                        <Checkbox.Group
                            className="radioIcons"
                            value={asset_accounts}
                            style={{ width: '100%' }}
                            onChange={(checkedList) => {
                                if (checkedList.length > 0 && checkedList[checkedList.length - 1] === 'None') {
                                    updateField('asset_accounts', JSON.stringify(['None']))
                                } else {
                                    if (checkedList.indexOf('None') >= 0) {
                                        checkedList.splice(checkedList.indexOf('None'), 1);
                                    }
                                    updateField('asset_accounts', JSON.stringify(checkedList))
                                }
                            }}
                        >
                            <Row gutter={16}>
                                {asset_accounts_items.map((item, i) => {
                                    return (
                                        <Col key={i} md={6} span={24}>
                                            {item.tip !== "" ? (
                                                <Tooltip placement="bottom" title={item.tip}>
                                                    <Checkbox value={item.name}>
                                                        <div className="radioIconOption">
                                                            <div className="icon"><img src={item.icon} alt={item.name} /></div>
                                                            <div className="title"><Translate text={item.name} /></div>
                                                        </div>
                                                    </Checkbox>
                                                </Tooltip>
                                            ) : (
                                                <Checkbox value={item.name}>
                                                    <div className="radioIconOption">
                                                        <div className="icon"><img src={item.icon} alt={item.name} /></div>
                                                        <div className="title"><Translate text={item.name} /></div>
                                                    </div>
                                                </Checkbox>
                                            )}
                                        </Col>
                                    )
                                })}
                            </Row>
                        </Checkbox.Group>
                    </Card>
                    {asset_accounts.length > 0 && asset_accounts.indexOf('None') < 0 ? (
                        <Card title={<Translate text={`"What is the approximate total value of these accounts?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                            <Slider
                                className="rangeSlider"
                                marks={marks}
                                step={null}
                                value={asset_total_value}
                                included={false}
                                tipFormatter={(val) => this.rangeSliderFormatter(val, marks)}
                                onChange={(val) => updateField('asset_total_value', this.sliderValue(val, marks))}
                            />
                            <div className="sliderValue center-align">{wizard.asset_total_value || '$0'}</div>
                        </Card>
                    ) : null}
                    {show_insurance_question ? (
                        <Card title={<Translate text={`Life Insurance`} />} className="wizardBox wizardBoxBlue" type="inner" style={{textAlign:"center"}}>
                            <Card title={<Translate text={`"Does anyone in the household own life insurance to pay for final expenses or debt repayment and, if so, what type of policy is it and what is the total death benefit?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                <RadioGroup value={wizard.home_mortgage_protection_toggle} onChange={(e) => updateField('home_mortgage_protection_toggle', e.target.value)}>
                                    <Radio value="1" className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                    <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                                </RadioGroup>
                            </Card>
                            {wizard.home_mortgage_protection_toggle === '1' ? (
                                <div>
                                    <Card title={<Translate text={`"What type of policy do you have?"`} />} type="inner" className="wizardBox">
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
                                    <Card title={<Translate text={`"What is the death benefit?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
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
                        <p><Translate text={`"If you do not have sufficient liability coverage to protect your assets, your assets may be subject to being liened, garnished or attached in a lawsuit."`} /></p>
                    </Card>
                    <div className="pagination">
                        <a className={(wizard.stepIndex === 11) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 11)}>1</a>
                        <a className={(wizard.stepIndex === 12) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 12)}>2</a>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
