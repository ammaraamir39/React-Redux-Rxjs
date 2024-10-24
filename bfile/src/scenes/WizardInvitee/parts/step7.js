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
                                <Input value={wizard.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`Phone Number`} /> *</label>
                                <Input value={F.phone_format(wizard.phone)} onChange={(e) => updateField('phone', e.target.value)} />
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`DOB`} /> *</label>
                                <Row gutter={5}>
                                    <Col md={10} span={24}>
                                        <Select defaultValue={wizard.dob_mm} style={{ width: '100%' }} onChange={(value) => updateField('dob_mm', value)}>
                                            <Option value={''}>{"MM"}</Option>
                                            {dob_months.map((item, i) => (
                                                <Option value={item.value} key={i}><Translate text={item.name} /></Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col md={10} span={24}>
                                        <Select defaultValue={wizard.dob_yyyy} style={{ width: '100%' }} onChange={(value) => updateField('dob_yyyy', value)}>
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
                                <label><Translate text={`City`} /> *</label>
                                <Input value={wizard.city} onChange={(e) => updateField('city', e.target.value)} />
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`State`} /> *</label>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    value={wizard.state} style={{ width: '100%' }} onChange={(value) => updateField('state', value)}>
                                    <Option value={''}><Translate text={`Select`} />...</Option>
                                    {states.map((item, i) => (
                                        <Option value={item.value} key={i}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col md={6} span={24}>
                                <label><Translate text={`Zip Code`} /> *</label>
                                <Input value={wizard.zipcode} onChange={(e) => updateField('zipcode', e.target.value)} />
                            </Col>
                        </Row>
                    </Card>

                    <Card className="wizardBox formBox formBox2" type="inner" bordered={false}>
                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <label><Translate text={`Email Address`} /> *</label>
                                <Input value={wizard.email} onChange={(e) => updateField('email', e.target.value)} />
                            </Col>
                        </Row>
                    </Card>

                </Card>
                <WizardFooter {...this.props} />
            </div>
        );

    }
}

export default Step;
