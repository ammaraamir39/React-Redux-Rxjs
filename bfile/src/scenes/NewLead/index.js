import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    Input,
    Checkbox,
    Select,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';
import AddressField from '../../components/address-field';

const Option = Select.Option;

class NewLead extends Component {
    state = {
        loading: false,
        lead: {
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            dob_mm: '',
            dob_yyyy: '',
            address: '',
            city: '',
            state: '',
            zipcode: '',
            notes: '',
            agency_id: null,
            user_id: null
        }
    }
    componentDidMount = () => {
        this.setState({ loading: true });
        axios.get("/api/user").then((res) => {
            const u = res.data;
            if (u.user_agency_assoc.length > 0) {
                const agency_id = u.user_agency_assoc[0].agency_id;
                axios.get("/api/agencies/" + agency_id).then((res) => {
                    const a = res.data;
                    this.setState({
                        loading: false,
                        agency_id: a.id,
                        ea_id: a.primary_ea_id
                    });
                }).catch((res) => {
                    message.error(F.translate("Error, please try again."));
                    this.props.history.push('/dashboard');
                });
            } else {
                message.error(F.translate("No agency association found."));
                this.props.history.push('/dashboard');
            }
        }).catch(() => {
            message.error(F.translate("User not logged in."));
            this.props.history.push('/login');
        });
    }
    updateField = (name, val) => {
        const { lead }  = this.state;
        lead[name] = val;
        this.setState({ lead });
    }
    submit = () => {
        const { lead, agency_id, ea_id } = this.state;
        this.setState({ loading: true });
        axios.post('/api/b_file', {
            expiration_date: null,
            first_name: lead.first_name,
            last_name: lead.last_name,
            email: lead.email,
            phone: lead.phone,
            address: lead.address,
            address_cont: null,
            status: 'New Bfile',
            city: lead.city,
            state: lead.state,
            zipcode: lead.zipcode,
            mortgage_referral: 1,
            agency_id: agency_id,
            user_id: ea_id
        }).then((res) => {
            message.success(F.translate(`Lead has been submitted successfully.`));
            axios.post('/api/send_mortgage_lead_notif', {
                bfile_id: res.data.id
            });
            this.setState({ loading: false }, () => {
                this.props.history.push('/dashboard');
            })
        }).catch((res) => {
            message.error(F.translate(`Can't submit the lead.`));
            this.setState({ loading: false });
        })
    }
    render() {

        const { loading, lead } = this.state;
        const updateField = this.updateField;
        const dob_years = [];
        const dob_months = [];
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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

        return (
            <div>
                <Card type="inner" title={<Translate text={`New Lead`} />} loading={loading}>
                    <div>
                        <Row gutter={16}>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`First Name`} />:</label>
                                    <Input value={lead.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Last Name`} />:</label>
                                    <Input value={lead.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`DOB`} /> *</label>
                                    <Row gutter={5}>
                                        <Col md={12} span={24}>
                                            <Select value={lead.dob_mm} style={{ width: '100%' }} onChange={(value) => updateField('dob_mm', value)}>
                                                <Option value={''}>{"MM"}</Option>
                                                {dob_months.map((item, i) => (
                                                    <Option value={item.value} key={i}><Translate text={item.name} /></Option>
                                                ))}
                                            </Select>
                                        </Col>
                                        <Col md={12} span={24}>
                                            <Select value={lead.dob_yyyy} style={{ width: '100%' }} onChange={(value) => updateField('dob_yyyy', value)}>
                                                <Option value={''}>{"YYYY"}</Option>
                                                {dob_years.map((value, i) => (
                                                    <Option value={value} key={i}>{value}</Option>
                                                ))}
                                            </Select>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Email`} />:</label>
                                    <Input value={lead.email} onChange={(e) => updateField('email', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Phone`} />:</label>
                                    <Input value={F.phone_format(lead.phone)} onChange={(e) => updateField('phone', e.target.value)} />
                                </div>
                            </Col>
                        </Row> 
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Address`} />:</label>
                                    <AddressField value={lead.address}
                                        onChange={(val) => updateField('address', val)}
                                        setCity={(val) => updateField('city', val)}
                                        setState={(val) => updateField('state', val)}
                                        setZipCode={(val) => updateField('zipcode', val)}
                                    />
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`City`} />:</label>
                                    <Input value={lead.city} onChange={(e) => updateField('city', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`State`} />:</label>
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        value={lead.state}
                                        style={{ width: '100%' }} onChange={(value) => updateField('state', value)}>
                                        <Option value={''}><Translate text={`Select`} />...</Option>
                                        {states.map((item, i) => (
                                            <Option value={item.value} key={i}>{item.name}</Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Zipcode`} />:</label>
                                    <Input value={lead.zipcode} onChange={(e) => updateField('zipcode', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={this.submit.bind(this)}>
                            <Translate text={`Submit`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
}

export default NewLead;
