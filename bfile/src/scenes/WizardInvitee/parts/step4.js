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
    Select,
    Tooltip
} from 'antd';
import F from '../../../Functions';
import WizardFooter from './wizard-footer';
import Icon401K from './images/bfile-condominium.svg';
import Icon403b from './images/bfile-403b.svg';
import Icon457 from './images/bfile-457.svg';
import IconPensionFund from './images/icon-pensionfund.svg';
import IconNo from './images/bfile-no.svg';
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
        if (wizard.asset_preservation_value !== null && wizard.asset_preservation_value !== '') {
            for(let x in marks) {
                if (marks[x].val === wizard.asset_preservation_value) {
                    asset_preservation_value = parseInt(x, 10);
                }
            }
        }

        let asset_401k_accounts = [];
        if (wizard.asset_401k_accounts !== null && wizard.asset_401k_accounts !== '') {
            asset_401k_accounts = JSON.parse(wizard.asset_401k_accounts);
        }

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
            {
                name: 'None',
                icon: IconNo,
                tip: ""
            }
        ]

        const employees_count_list = ["1-5", "6-10", "11-25", "26-50", "51-100", "101-150", "150+"];
        const business_list = ["Accounting and Financial Services","Administrative Support","Advertising and Marketing","Architects and Engineers","Bakeries","Beauty Salons and Barbers","Business Consultants","Clothing and Accessories Stores","Contractor Services","Contracted Services (e.g. Locksmiths, Furniture Installers,  Commercial Cleaning, etc.)","Drug Stores and Pharmacies","Florists","Funeral Homes","Food and Beverage Stores","Health Care and Medical Offices","Home Goods Stores","Laundry Services","Legal Services","Mortgage Loan Brokers","Motor Vehicle Parts Dealers","Personal Services (e.g. Pet Groomers)","Photography","Real Estate Brokers","Rental Services","Repair and Maintenance","Self Storage","Surveyors","Travel Agents","Veterinarians","Wholesale Apparel","Wholesale Drugs","Wholesale Food","Wholesale Hardware","Wholesale Home and Office","Wholesale Medical Goods","Wholesale Sporting Goods","Other"];

        return (
            <div>
                <Card className="wizardCard" bordered={false} title={
                    <div>
                        <Tag color="#87d068"><Translate text={wizard.status} /></Tag>
                        <Translate text={`Protecting What You "EARN"`} />
                    </div>
                }>
                    <Card title={<Translate text={`"Is anyone within the household self-employed or have ownership interest in a business?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                        <RadioGroup defaultValue={wizard.business_owner_toggle} onChange={(e) => updateField('business_owner_toggle', e.target.value)}>
                            <Radio value="1" className="btnYes"><Icon type="like-o" style={{marginRight:10,color:"#388E3C"}} /> <Translate text={`Yes`} /></Radio>
                            <Radio value="0" className="btnNo"><Icon type="dislike-o" style={{marginRight:10,color:"#FF3D00"}} /> <Translate text={`No`} /></Radio>
                        </RadioGroup>
                    </Card>
                    {wizard.business_owner_toggle === "1" ? (
                        <div>
                            <Card title={<Translate text={`"Name of the business?"`} />} type="inner" className="wizardBox formBox" style={{textAlign:"center"}}>
                                <label><Translate text={`Business Name`} />:</label>
                                <Input value={wizard.business_name} onChange={(e) => updateField('business_name', e.target.value)} style={{ width: 250 }} />
                            </Card>
                            <Card title={<Translate text={`"How many employees?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                <Select defaultValue={wizard.employees_count} style={{ width: 250 }} onChange={(value) => updateField('employees_count', value)}>
                                    <Option value={null}><Translate text={`Select`} />...</Option>
                                    {employees_count_list.map((item, i) => (
                                        <Option value={item} key={i}>{item}</Option>
                                    ))}
                                </Select>
                            </Card>
                            <Card title={<Translate text={`"What type of business is it?"`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                <Select defaultValue={wizard.business_type} style={{ width: 250 }} onChange={(value) => updateField('business_type', value)}>
                                    <Option value={''}><Translate text={`Business Type`} /></Option>
                                    {business_list.map((item, i) => (
                                        <Option value={item} key={i}><Translate text={item} /></Option>
                                    ))}
                                </Select>
                            </Card>
                            {wizard.business_type === 'Other' ? (
                                <Card title={<Translate text={`Other Business Type`} />} className="wizardBox" type="inner" style={{textAlign:"center"}}>
                                    <Input value={wizard.business_type_other} onChange={(e) => updateField('business_type_other', e.target.value)} />
                                </Card>
                            ) : null}
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
                        </div>
                    ) : null}
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
