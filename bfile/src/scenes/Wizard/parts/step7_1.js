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
    Select,
    Input,
    DatePicker,
    Divider
} from 'antd';
import F from '../../../Functions';
import AddressField from '../../../components/address-field';
import WizardFooter from './wizard-footer';
import { Translate } from 'react-translated';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;

class Step extends Component {
    updatePolicies = (index, value) => {
        const { wizard, updateField } = this.props;
        wizard.policies[index].sold = value;
        updateField("policies", wizard.policies);
    }
    componentDidMount() {
      const { wizard, updateField } = this.props;
      if (wizard.spouse_last_name === '') {
        updateField("spouse_last_name", wizard.last_name);
      }
    }
    render() {

        const { wizard, updateField } = this.props;
        const dob_years = [];
        const dob_months = [];
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const states = [
            {name: 'Alabama', value: 'AL'},
            {name: 'Alaska', value: 'AK'},
            {name: 'Arizona', value: 'AZ'},
            {name: 'Arkansas', value: 'AR'},
            {name: 'California', value: 'CA'},
            {name: 'Colorado', value: 'CO'},
            {name: 'Connecticut', value: 'CT'},
            {name: 'Delaware', value: 'DE'},
            {name: 'District Of Columbia', value: 'DC'},
            {name: 'Florida', value: 'FL'},
            {name: 'Georgia', value: 'GA'},
            {name: 'Hawaii', value: 'HI'},
            {name: 'Idaho', value: 'ID'},
            {name: 'Illinois', value: 'IL'},
            {name: 'Indiana', value: 'IN'},
            {name: 'Iowa', value: 'IA'},
            {name: 'Kansas', value: 'KS'},
            {name: 'Kentucky', value: 'KY'},
            {name: 'Louisiana', value: 'LA'},
            {name: 'Maine', value: 'ME'},
            {name: 'Maryland', value: 'MD'},
            {name: 'Massachusetts', value: 'MA'},
            {name: 'Michigan', value: 'MI'},
            {name: 'Minnesota', value: 'MN'},
            {name: 'Mississippi', value: 'MS'},
            {name: 'Missouri', value: 'MO'},
            {name: 'Montana', value: 'MT'},
            {name: 'Nebraska', value: 'NE'},
            {name: 'Nevada', value: 'NV'},
            {name: 'New Hampshire', value: 'NH'},
            {name: 'New Jersey', value: 'NJ'},
            {name: 'New Mexico', value: 'NM'},
            {name: 'New York', value: 'NY'},
            {name: 'North Carolina', value: 'NC'},
            {name: 'North Dakota', value: 'ND'},
            {name: 'Ohio', value: 'OH'},
            {name: 'Oklahoma', value: 'OK'},
            {name: 'Oregon', value: 'OR'},
            {name: 'Pennsylvania', value: 'PA'},
            {name: 'Rhode Island', value: 'RI'},
            {name: 'South Carolina', value: 'SC'},
            {name: 'South Dakota', value: 'SD'},
            {name: 'Tennessee', value: 'TN'},
            {name: 'Texas', value: 'TX'},
            {name: 'Utah', value: 'UT'},
            {name: 'Vermont', value: 'VT'},
            {name: 'Virginia', value: 'VA'},
            {name: 'Washington', value: 'WA'},
            {name: 'West Virginia', value: 'WV'},
            {name: 'Wisconsin', value: 'WI'},
            {name: 'Wyoming', value: 'WY'}
        ];

        const top_companies = ["AAA","Allstate Insurance Group","American Family Insurance Group","Amica Mutual Group","Auto-Owners Insurance Group","Country Financial PC Group","Erie Insurance Group","Farmers Insurance Group","GEICO","Hartford Insurance Group","Infinity P&C Group","Liberty Mutual Insurance Cos.","MAPFRE North America Group","Mercury General Group","MetLife Personal Lines Group","National General Group","Nationwide Group","New Jersey Manufacturers Insurance Group","Progressive Insurance Group","State Farm Group","Hanover Insurance Group","Travelers Group","USAA Group","Other"];

        for (let i=1; i<13; i++) {
            if (i < 10) {
                dob_months.push({
                    name: monthNames[i-1],
                    value: '0'+i
                });
            } else {
                dob_months.push({
                    name: monthNames[i-1],
                    value: i + ''
                });
            }
        }
        for (let i=2017; i>=1900; i--) {
            if (i < 10) {
                dob_years.push('0' + i);
            } else {
                dob_years.push(i + '');
            }
        }

        return (
            <div>
                <Card className="wizardCard wizardFinalStep" bordered={false} title={
                    <div>
                        <Tag color="#87d068"><Translate text={wizard.status} /></Tag>
                        <Translate text={`Customer Information`} />
                    </div>
                }>
                    <Card className="wizardBox formBox formBox2" type="inner" bordered={false}>
                        <Row gutter={16}>
                            <Col md={6} span={24}>
                                <label><Translate text={`First Name`} /> *</label>
                                <Input value={wizard.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`Last Name`} /> *</label>
                                <Input value={wizard.last_name} onChange={(e) => updateField('last_name', e.target.value)} onBlur={() => {
                                    if (wizard.spouse_last_name === '') {
                                        updateField('spouse_last_name', wizard.last_name)
                                    }
                                }} />
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`Phone Number`} /> *</label>
                                <Input value={F.phone_format(wizard.phone)} onChange={(e) => updateField('phone', e.target.value)} />
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`DOB`} /> *</label>
                                <Row gutter={5}>
                                    <Col md={10} span={24}>
                                        <Select value={wizard.dob_mm} style={{ width: '100%' }} onChange={(value) => updateField('dob_mm', value)}>
                                            <Option value={''}>{"MM"}</Option>
                                            {dob_months.map((item, i) => (
                                                <Option value={item.value} key={i}><Translate text={item.name} /></Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col md={10} span={24}>
                                        <Select value={wizard.dob_yyyy} style={{ width: '100%' }} onChange={(value) => updateField('dob_yyyy', value)}>
                                            <Option value={''}>{"YYYY"}</Option>
                                            {dob_years.map((value, i) => (
                                                <Option value={value} key={i}>{value}</Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col md={4} span={24}>{wizard.dob_age}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                    <Card className="wizardBox formBox formBox2" type="inner" bordered={false}>
                        <Row gutter={16}>
                            <Col md={6} span={24}>
                                <label><Translate text={`Spouse First Name`} /></label>
                                <Input value={wizard.spouse_first_name} onChange={(e) => updateField('spouse_first_name', e.target.value)} />
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`Spouse Last Name`} /></label>
                                <Input value={wizard.spouse_last_name} onChange={(e) => updateField('spouse_last_name', e.target.value)} />
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`Alternate Phone Number`} /></label>
                                <Input value={F.phone_format(wizard.phone2)} onChange={(e) => updateField('phone2', e.target.value)} />
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`Spouse's DOB`} /></label>
                                <Row gutter={5}>
                                    <Col md={10} span={24}>
                                        <Select value={wizard.dob2_mm} style={{ width: '100%' }} onChange={(value) => updateField('dob2_mm', value)}>
                                            <Option value={''}>{"MM"}</Option>
                                            {dob_months.map((item, i) => (
                                                <Option value={item.value} key={i}><Translate text={item.name} /></Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col md={10} span={24}>
                                        <Select value={wizard.dob2_yyyy} style={{ width: '100%' }} onChange={(value) => updateField('dob2_yyyy', value)}>
                                            <Option value={''}>{"YYYY"}</Option>
                                            {dob_years.map((value, i) => (
                                                <Option value={value} key={i}>{value}</Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col md={4} span={24}>{wizard.dob2_age}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>

                    <Card className="wizardBox formBox formBox2" type="inner" bordered={false}>
                        <Row gutter={16}>
                            <Col md={6} span={24}>
                                <label><Translate text={`Address`} /> *</label>
                                <AddressField value={wizard.address}
                                    onChange={(val) => updateField('address', val)}
                                    setCity={(val) => updateField('city', val)}
                                    setState={(val) => updateField('state', val)}
                                    setZipCode={(val) => updateField('zipcode', val)}
                                />
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`City`} /></label>
                                <Input value={wizard.city} onChange={(e) => updateField('city', e.target.value)} />
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`State`} /></label>
                                <Select
                                    showSearch
                                    value={wizard.state}
                                    style={{ width: '100%' }}
                                    onChange={(value) => updateField('state', value)}
                                    optionFilterProp="children"
                                >
                                    <Option value={''}><Translate text={`Select`} />...</Option>
                                    {states.map((item, i) => (
                                        <Option value={item.value} key={i}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`Zip Code`} /></label>
                                <Input value={wizard.zipcode} onChange={(e) => updateField('zipcode', e.target.value)} />
                            </Col>
                        </Row>
                    </Card>

                    <Card className="wizardBox formBox formBox2" type="inner" bordered={false}>
                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <label><Translate text={`Email Address`} /></label>
                                <Input value={wizard.email} onChange={(e) => updateField('email', e.target.value)} />
                            </Col>
                        </Row>
                    </Card>

                    <Row gutter={16}>
                        <Col md={12} span={24}>
                            <Row gutter={16} style={{marginBottom:20}}>
                                <Col md={12} span={24}>
                                    <Card title={<span><Translate text={`Auto Policy Sold/Renewed`} /> *</span>} className="wizardBox formBox" type="inner">
                                        <RadioGroup value={wizard.auto_sold_toggle} onChange={(e) => updateField('auto_sold_toggle', e.target.value)}>
                                            <Radio value="1"><Translate text={`Yes`} /></Radio>
                                            {wizard.status === 'Renewal' ? (
                                                <Radio value="0"><Translate text={`Did Not Renew`} /></Radio>
                                            ) : (
                                                <Radio value="0"><Translate text={`No`} /></Radio>
                                            )}
                                            <Radio value="2"><Translate text={`Not Quoted`} /></Radio>
                                        </RadioGroup>
                                    </Card>
                                </Col>
                                <Col md={12} span={24}>
                                    <Card title={<span><Translate text={`Home Policy Sold/Renewed`} /> *</span>} className="wizardBox formBox" type="inner">
                                        <RadioGroup value={wizard.home_sold_toggle} onChange={(e) => updateField('home_sold_toggle', e.target.value)}>
                                            <Radio value="1"><Translate text={`Yes`} /></Radio>
                                            {wizard.status === 'Renewal' ? (
                                                <Radio value="0"><Translate text={`Did Not Renew`} /></Radio>
                                            ) : (
                                                <Radio value="0"><Translate text={`No`} /></Radio>
                                            )}
                                            <Radio value="2"><Translate text={`Not Quoted`} /></Radio>
                                        </RadioGroup>
                                    </Card>
                                </Col>
                            </Row>

                            {wizard.auto_sold_toggle === '1' ? (
                                <Card title={<Translate text={`Auto Policy Sold/Renewed`} />} className="wizardBox formBox" type="inner">
                                    <Row gutter={16} style={{marginBottom:10}}>
                                        <Col md={12} span={24}><label><Translate text={`Effective Date`} /></label></Col>
                                        <Col md={12} span={24}>
                                            <DatePicker
                                                format="MM/DD/YYYY"
                                                value={wizard.auto_policy_sold_effective_date}
                                                onChange={(val) => updateField('auto_policy_sold_effective_date', val)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col md={12} span={24}><label><Translate text={`Term`} /></label></Col>
                                        <Col md={12} span={24}>
                                            <Select value={wizard.auto_policy_sold_term} style={{ width: '100%' }} onChange={(value) => updateField('auto_policy_sold_term', value)}>
                                                <Option value={''}>{"Select..."}</Option>
                                                <Option value={'6 Months'}><Translate text={`6 Months`} /></Option>
                                                <Option value={'1 Year'}><Translate text={`1 Year`} /></Option>
                                            </Select>
                                        </Col>
                                    </Row>
                                </Card>
                            ) : null}

                            {wizard.auto_sold_toggle === '0' ? (
                                <Card title={<Translate text={`Auto Policy Not Sold`} />} className="wizardBox formBox" type="inner">
                                    <Row gutter={16} style={{marginBottom:10}}>
                                        <Col md={12} span={24}><label><Translate text={`Current Carrier`} /></label></Col>
                                        <Col md={12} span={24}>
                                            <Select value={wizard.auto_policy_not_sold_current_carrier} style={{ width: '100%' }} onChange={(value) => updateField('auto_policy_not_sold_current_carrier', value)}>
                                                <Option value={''}><Translate text={`Select`} />...</Option>
                                                {top_companies.map((item, i) => (
                                                    <Option value={item} key={i}>{item}</Option>
                                                ))}
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row gutter={16} style={{marginBottom:10}}>
                                        <Col md={12} span={24}><label><Translate text={`Expiration Date`} /></label></Col>
                                        <Col md={12} span={24}>
                                            <DatePicker
                                                format="MM/DD/YYYY"
                                                value={wizard.auto_policy_not_sold_expiration_date}
                                                onChange={(val) => updateField('auto_policy_not_sold_expiration_date', val)}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            ) : null}

                            {wizard.home_sold_toggle === '1' ? (
                                <Card title={<Translate text={`Home Policy Sold/Renewed`} />} className="wizardBox formBox" type="inner">
                                    <Row gutter={16} style={{marginBottom:10}}>
                                        <Col md={12} span={24}><label><Translate text={`Effective Date`} /></label></Col>
                                        <Col md={12} span={24}>
                                            <DatePicker
                                                format="MM/DD/YYYY"
                                                value={wizard.home_policy_sold_effective_date}
                                                onChange={(val) => updateField('home_policy_sold_effective_date', val)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col md={12} span={24}><label><Translate text={`Term`} /></label></Col>
                                        <Col md={12} span={24}>
                                            <Select value={wizard.home_policy_sold_term} style={{ width: '100%' }} onChange={(value) => updateField('home_policy_sold_term', value)}>
                                                <Option value={''}><Translate text={`Select`} />...</Option>
                                                <Option value={'6 Months'}><Translate text={`6 Months`} /></Option>
                                                <Option value={'1 Year'}><Translate text={`1 Year`} /></Option>
                                            </Select>
                                        </Col>
                                    </Row>
                                </Card>
                            ) : null}

                            {wizard.home_sold_toggle === '0' ? (
                                <Card title={<Translate text={`Home Policy Not Sold`} />} className="wizardBox formBox" type="inner">
                                    <Row gutter={16} style={{marginBottom:10}}>
                                        <Col md={12} span={24}><label><Translate text={`Current Carrier`} /></label></Col>
                                        <Col md={12} span={24}>
                                            <Select value={wizard.home_policy_not_sold_current_carrier} style={{ width: '100%' }} onChange={(value) => updateField('home_policy_not_sold_current_carrier', value)}>
                                                <Option value={''}><Translate text={`Select`} />...</Option>
                                                {top_companies.map((item, i) => (
                                                    <Option value={item} key={i}>{item}</Option>
                                                ))}
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row gutter={16} style={{marginBottom:10}}>
                                        <Col md={12} span={24}><label><Translate text={`Expiration Date`} /></label></Col>
                                        <Col md={12} span={24}>
                                            <DatePicker
                                                format="MM/DD/YYYY"
                                                value={wizard.home_policy_not_sold_expiration_date}
                                                onChange={(val) => updateField('home_policy_not_sold_expiration_date', val)}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            ) : null}
                        </Col>
                        <Col md={12} span={24}>
                            <Card title={<Translate text={`Cross Sell Policies Uncovered`} />} className="wizardBox formBox" type="inner">
                                <Input value={wizard.cross_sell_policies_uncovered} onChange={(e) => updateField('cross_sell_policies_uncovered', e.target.value)} />
                            </Card>
                            <Card className="wizardBox" type="inner">
                                <Row gutter={16}>
                                    <Col md={8} span={24}><strong><Translate text={`Type`} /></strong></Col>
                                    <Col md={16} span={24}><strong><Translate text={`Sold/Renewed`} /></strong></Col>
                                </Row>
                                {wizard.policies.map((policy, i) => (
                                    <div key={i}>
                                        <Divider />
                                        <Row gutter={16}>
                                            <Col md={8} span={24}><Translate text={policy.type} /></Col>
                                            <Col md={16} span={24}>
                                                <RadioGroup value={policy.sold} onChange={(e) => this.updatePolicies(i, e.target.value)}>
                                                    <Radio className="btnYes" value="1"><Translate text={`Yes`} /></Radio>
                                                    <Radio className="btnYes" value="0"><Translate text={`No`} /></Radio>
                                                    <Radio className="btnYes" value="2"><Translate text={`Not Quoted`} /></Radio>
                                                </RadioGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </Card>
                        </Col>
                    </Row>

                    <div className="pagination">
                        <a className={(wizard.stepIndex === 14) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 14)}>1</a>
                        <a className={(wizard.stepIndex === 15) ? 'active': ''} onClick={() => updateField('gotoStepIndex', 15)}>2</a>
                    </div>
                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
