import React, { Component } from 'react';
import {
    Card,
    Tag,
    Radio,
    Slider,
    Checkbox,
    Row,
    Col
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
import IconNo from './images/bfile-no.svg';
import { Translate } from 'react-translated';

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
            { name: '401k', icon: Icon401K },
            { name: '403b', icon: Icon403b },
            { name: '457', icon: Icon457 },
            { name: 'Pension Fund', icon: IconPensionFund },
            { name: 'None', icon: IconNo }
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

                    <Card title={<Translate text={`Retirement Plan`} />} className="wizardBox wizardBoxBlue" type="inner" style={{textAlign:"center"}}>
                        <Card title={<Translate text={`"Do you or anyone in the household have a retirement plan?(e.g. a 401k, 403b, etc) and, if so, what is the approximate value of the retirement plan?"`} />} type="inner" className="wizardBox" style={{textAlign:"center"}}>
                            <Checkbox.Group
                                className="radioIcons"
                                value={asset_401k_accounts}
                                style={{ width: '100%' }}
                                onChange={(checkedList) => updateField('asset_401k_accounts', JSON.stringify(checkedList))}
                            >
                                <Row gutter={16}>
                                    {asset_401k_accounts_items.map((item, i) => {
                                        return (
                                            <Col key={i} md={6} span={24}>
                                                <Checkbox value={item.name}>
                                                    <div className="radioIconOption">
                                                        <div className="icon"><img src={item.icon} alt={item.name} /></div>
                                                        <div className="title"><Translate text={item.name} /></div>
                                                    </div>
                                                </Checkbox>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Checkbox.Group>
                        </Card>
                        <Card title={<Translate text={`"What's the approximate value of the retirement plan we need to protect?"`} />} type="inner" className="wizardBox" style={{textAlign:"center"}}>
                            <Slider
                                className="rangeSlider"
                                marks={marks}
                                step={null}
                                defaultValue={asset_preservation_value}
                                included={false}
                                tipFormatter={(val) => this.rangeSliderFormatter(val, marks)}
                                onChange={(val) => updateField('asset_preservation_value', this.sliderValue(val, marks))}
                            />
                            <div className="sliderValue center-align">{wizard.asset_preservation_value || '$0'}</div>
                        </Card>
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
