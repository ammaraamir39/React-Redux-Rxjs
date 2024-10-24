import React, { Component } from 'react';
import {
    Card,
    Tag,
    Radio,
    Icon,
    Slider,
    Checkbox,
    Row,
    Col,
    Input,
    Select,
    Tooltip
} from 'antd';
import F from '../../../Functions';
import WizardFooter from './wizard-footer';
import Employed from './images/bfile-employed.svg';
import Homemaker from './images/bfile-housemaker.svg';
import Disabled from './images/bfile-disabled.svg'
import Retired from './images/bfile-retirement.svg';
import Unemployed from './images/bfile-user.svg';
import Icon401K from './images/bfile-condominium.svg';
import Icon403b from './images/bfile-403b.svg';
import Icon457 from './images/bfile-457.svg';
import IconPensionFund from './images/icon-pensionfund.svg';
import { Translate } from 'react-translated';

const RadioGroup = Radio.Group;
const Option = Select.Option;

class Step extends Component {
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
    updateEmploymentStatus = (val) => {
        const { updateField } = this.props;

        if (val === 'Employed') {
            updateField('employed_toggle', '1');
            updateField('employed_retired_disabled', null);
        } else {
            updateField('employed_toggle', '0');
            updateField('employed_retired_disabled', val);
        }
    }
    render() {

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

        let asset_preservation_value = 0;
        if (wizard.asset_preservation_value !== '') {
            for(let x in marks) {
                if (marks[x].val === wizard.asset_preservation_value) {
                    asset_preservation_value = parseInt(x, 10);
                }
            }
        }

        let asset_401k_accounts = [];
        if (wizard.asset_401k_accounts !== '') {
            asset_401k_accounts = JSON.parse(wizard.asset_401k_accounts);
        }

        let employment_status = '';
        if (wizard.employed_toggle === '1') {
            employment_status = 'Employed';
        }
        if (wizard.employed_toggle === '0') {
            employment_status = 'Unemployed';

            if (wizard.employed_retired_disabled === 'Disabled') {
                employment_status = 'Disabled';
            }
            if (wizard.employed_retired_disabled === 'Homemaker') {
                employment_status = 'Homemaker';
            }
            if (wizard.employed_retired_disabled === 'Retired') {
                employment_status = 'Retired';
            }
            if (wizard.employed_retired_disabled === 'Unemployed') {
                employment_status = 'Unemployed';
            }
        }

        const employment_status_items = [
            { name: 'Employed', icon: Employed },
            { name: 'Disabled', icon: Disabled },
            { name: 'Homemaker', icon: Homemaker },
            { name: 'Retired', icon: Retired },
            { name: 'Unemployed', icon: Unemployed }
        ];

        const asset_401k_accounts_items = [
            {
                name: '401k',
                icon: Icon401K,
                tip: "An employer sponsored retirement plan offered to employees to help save for retirement.  Money is usually payroll deducted.  The employee chooses the mutual funds within the plan to try and grow the funds for retirement."
            },
            {
                name: '403b',
                icon: Icon403b,
                tip: "A retirement plan offered to employees or teachers in the public schools."
            },
            {
                name: '457',
                icon: Icon457,
                tip: "A retirement plan offered to government employees (e.g. police or firefighters)."
            },
            {
                name: 'Pension Fund',
                icon: IconPensionFund,
                tip: "Pension Fund"
            },
            /*{
                name: 'None',
                icon: IconNo,
                tip: ""
            }*/
        ];

        const selectyears_options = [
            {
                name: "Under 1 Year",
                value: "Under 1 Year"
            },
            {
                name: "1 to 5 years",
                value: "1 to 5"
            },
            {
                name: "5 to 10 years",
                value: "5 to 10"
            },
            {
                name: "10+ years",
                value: "10 +"
            }
        ];

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Tag color="#87d068"><Translate text={wizard.status} /></Tag>
                        <Translate text={`Protecting What You "EARN"`} />
                    </div>
                }>
                    <Card title={<Translate text={`"What's your current employment status?"`} />} type="inner" className="wizardBox" style={{textAlign:"center"}}>
                        <Radio.Group
                            className="radioIcons"
                            value={employment_status}
                            style={{ width: '100%' }}
                            onChange={(e) => this.updateEmploymentStatus(e.target.value)}
                        >
                            <Row type="flex" justify="space-around" gutter={16}>
                                {employment_status_items.map((item, i) => {
                                    return (
                                        <Col key={i} md={4} span={24}>
                                            <Radio value={item.name}>
                                                <div className="radioIconOption">
                                                    <div className="icon"><img src={item.icon} alt={item.name} /></div>
                                                    <div className="title"><Translate text={item.name} /></div>
                                                </div>
                                            </Radio>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </Radio.Group>
                    </Card>

                    {wizard.employed_toggle === '1' ? (
                        <Card title={<Translate text={`"Who do you work for?"`} />} type="inner" className="wizardBox formBox" style={{textAlign:"center"}}>
                            <label><Translate text={`Employer Name`} />:</label>
                            <Input value={wizard.employer_name} onChange={(e) => updateField('employer_name', e.target.value)} style={{ width: 250 }} />
                        </Card>
                    ) : null}

                    {wizard.employed_toggle === '1' ? (
                        <Card title={<Translate text={`How long have you worked there?`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                            <Select value={wizard.employer_years} style={{ width: 250 }} onChange={(value) => updateField('employer_years', value)}>
                                <Option value={''}><Translate text={`Select`} />...</Option>
                                {selectyears_options.map((item, i) => (
                                    <Option value={item.value} key={i}>{item.name}</Option>
                                ))}
                            </Select>
                        </Card>
                    ) : null}

                    {wizard.employed_toggle === '0' && wizard.employed_retired_disabled === 'Retired' ? (
                        <Card title={<Translate text={`"Where did you retire from?"`} />} type="inner" className="wizardBox formBox" style={{textAlign:"center"}}>
                            <label><Translate text={`Company Name`} />:</label>
                            <Input value={wizard.employer_retire_from} onChange={(e) => updateField('employer_retire_from', e.target.value)} style={{ width: 250 }} />
                        </Card>
                    ) : null}

                    <Card title={<Translate text={`Retirement Plan`} />} className="wizardBox wizardBoxBlue" type="inner" style={{textAlign:"center"}}>

                        <Card title={<Translate text={`"Do you or anyone in the household have a retirement plan? (e.g. a 401k, 403b, etc)?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                            <RadioGroup value={wizard.asset_401k_accounts_toggle} onChange={(e) => updateField('asset_401k_accounts_toggle', e.target.value)}>
                                <Radio value={1} className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                                <Radio value={0} className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                            </RadioGroup>
                        </Card>

                        {wizard.asset_401k_accounts_toggle ? (
                            <div>
                                <Card title={<Translate text={`"What Type(s)?"`} />} type="inner" className="wizardBox" style={{textAlign:"center"}}>
                                    <Checkbox.Group
                                        className="radioIcons"
                                        value={asset_401k_accounts}
                                        style={{ width: '100%' }}
                                        onChange={(checkedList) => {
                                        if (checkedList.indexOf("None") >= 0 && asset_401k_accounts.indexOf("None") < 0) {
                                            checkedList = ["None"];
                                            updateField('asset_preservation_value', '');
                                        }
                                        if (checkedList.indexOf("None") >= 0 && asset_401k_accounts.indexOf("None") >= 0 && checkedList.length > 1) {
                                            const i = checkedList.indexOf("None");
                                            checkedList.splice(i, 1);
                                        }
                                        updateField('asset_401k_accounts', JSON.stringify(checkedList))
                                        }}
                                    >
                                        <Row gutter={16}>
                                            {asset_401k_accounts_items.map((item, i) => {
                                                return (
                                                    <Col key={i} md={8} span={24}>
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
                                {asset_401k_accounts.length > 0 && asset_401k_accounts.indexOf('None') < 0 ? (
                                    <Card title={<Translate text={`"What's the approximate value of the retirement plan we need to protect?"`} />} type="inner" className="wizardBox" style={{textAlign:"center"}}>
                                        <Slider
                                            className="rangeSlider"
                                            marks={marks}
                                            step={null}
                                            value={asset_preservation_value}
                                            included={false}
                                            tipFormatter={(val) => this.rangeSliderFormatter(val, marks)}
                                            onChange={(val) => updateField('asset_preservation_value', this.sliderValue(val, marks))}
                                        />
                                        <div className="sliderValue center-align">{wizard.asset_preservation_value || '$0'}</div>
                                    </Card>
                                ) : null}
                            </div>
                        ) : null}
                    </Card>
                    <Card className="wizardBox center-align didYouKnowBox" type="inner">
                        <h2><Translate text={`DID YOU KNOW`} /></h2>
                        <p><Translate text={`"The 401K is often times the first place people go to get money when they suffer a financial hardship. Often times this financial hardship involves a liability award where the insured did not have adequate liability limits on his or her policy."`} /></p>
                    </Card>
                    <div className="pagination">
                        <a className={(wizard.stepIndex === 9) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 9)}>1</a>
                        <a className={(wizard.stepIndex === 10) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 10)}>2</a>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );
    }
}

export default Step;
