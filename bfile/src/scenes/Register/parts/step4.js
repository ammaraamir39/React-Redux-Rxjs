import React, { Component } from 'react';
import {
    Icon,
    Input,
    Button,
    Spin,
    Alert,
    Row,
    Col,
    Divider,
    Tooltip,
    Select,
    Checkbox,
    message
} from 'antd';
import F from '../../../Functions';
import axios from 'axios';

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Step extends Component {
    state = {
        loading: false,
        referral: {
            amount: '',
            deposit_amount: '',
            card_number: '',
            exp_month: '',
            exp_year: '',
            cvc: '',
            address: '',
            city: '',
            state: '',
            zipcode: ''
        }
    }
    updateField = (name, value) => {
        const { referral } = this.state;
        referral[name] = value;
        this.setState({ referral })
    }
    generateArrayOfYears = () => {
        var min = new Date().getFullYear()
        var max = min + 15;
        var years = []
      
        for (var i = min; i < max; i++) {
            years.push(i)
        }
        return years
    }
    submit = () => {
        const { referral } = this.state;
        const { user } = this.props;

        this.setState({ loading: true });
        if (referral.amount !== '' && referral.card_number !== '') {
            axios.post("/api/tango/add_card", {
                email: user.email,
                card_number: referral.card_number,
                expiration: referral.exp_year+'-'+referral.exp_month,
                cvv: referral.cvc,
                first_name: user.first_name,
                last_name: user.last_name,
                address: referral.address,
                city: referral.city,
                state: referral.state,
                zip: referral.zipcode,
                country: 'US'
            }).then((res) => {
                if (typeof res.data.errors === "undefined") {
                    const card_token = res.data.token;
                    axios.put("/api/users/" + user.id, {
                        tango_card_amount: referral.amount,
                        tango_card_token_v2: card_token,
                        reward_program_enabled: 1
                    }).then(() => {
                        if (referral.deposit_amount !== "") {
                            axios.post("/api/tango/fund", {
                                security_code: referral.cvc,
                                amount: referral.deposit_amount
                            }).then((res) => {
                                if (res.data.status === 'SUCCESS') {
                                    this.setState({ loading: false });
                                    this.props.history.push("/dashboard");
                                } else {
                                    this.setState({ loading: false });
                                    message.error(res.data.error_message);
                                }
                            }).catch(() => {
                                this.setState({ loading: false });
                                message.error(F.translate(`Can't fund the account.`));
                            });
                        } else {
                            this.setState({ loading: false });
                            this.props.history.push("/dashboard");
                        }
                    }).catch(() => {
                        this.setState({ loading: false });
                        message.error(F.translate(`Can't update user info.`));
                    });
                } else {
                    this.setState({ loading: false });
                    for (var i = 0; i < res.data.errors.length; i++) {
                        message.error(res.data.errors[i].message);
                    }
                }
            }).catch(() => {
                this.setState({ loading: false });
                message.error(F.translate(`Can't add a card.`));
            });
        } else if (referral.deposit_amount != "") {
            this.setState({ loading: false });
            message.error(F.translate(`Credit card is required to make a deposit.`));
        } else {
            this.setState({ loading: false });
            this.props.history.push("/dashboard");
        }
    }
    not_interested = () => {
        this.props.history.push('/dashboard');
    }
    previous = () => {
        this.props.updateStep(3);
    }
    render() {

        const { loading, referral } = this.state;
        const { user } = this.props;
        const updateField = this.updateField;

        return (
            <Spin indicator={antIcon} spinning={loading}>
                <h1>Referral Reward Program</h1>
                <p>{`Activate your referral reward program and immediately unlock the potential to reward customers with electronic gift cards from leading companies like Amazon, Walmart, Starbucks, Best Buy and more!`}</p>
                <Divider />
                <div className="inputField">
                    <label>{`How much do you want to give your customer for a referral?`}</label>
                    <Select defaultValue={referral.amount} style={{ width: '100%' }} onChange={(value) => updateField('amount', value)}>
                        <Option value="">Select...</Option>
                        <Option value="500">$5</Option>
                        <Option value="1000">$10</Option>
                        <Option value="1500">$15</Option>
                        <Option value="2000">$20</Option>
                        <Option value="2500">$25</Option>
                        <Option value="3000">$30</Option>
                    </Select>
                </div>
                <div className="inputField">
                    <label>{`How much do you want to pre-load your reward account with?`}</label>
                    <Select defaultValue={referral.deposit_amount} style={{ width: '100%' }} onChange={(value) => updateField('deposit_amount', value)}>
                        <Option value="">Select...</Option>
                        <Option value="25">$25</Option>
                        <Option value="50">$50</Option>
                        <Option value="75">$75</Option>
                        <Option value="100">$100</Option>
                        <Option value="200">$200</Option>
                        <Option value="300">$300</Option>
                        <Option value="400">$400</Option>
                        <Option value="500">$500</Option>
                        <Option value="750">$750</Option>
                        <Option value="1000">$1000</Option>
                    </Select>
                </div>
                <h2>Billing Information</h2>
                <Row gutter={16}>
                    <Col md={24} span={24}>
                        <div className="inputField">
                            <label>Card Number:</label>
                            <Input value={referral.card_number} onChange={(e) => updateField('card_number', e.target.value)} />
                        </div>
                    </Col>
                    <Col md={8} span={24}>
                        <div className="inputField">
                            <label>Exp Month:</label>
                            <Select defaultValue={referral.exp_month} style={{ width: '100%' }} onChange={(value) => updateField('exp_month', value)}>
                                <Option value="">Month...</Option>
                                <Option value="01">January</Option>
                                <Option value="02">February</Option>
                                <Option value="03">March</Option>
                                <Option value="04">April</Option>
                                <Option value="05">May</Option>
                                <Option value="06">June</Option>
                                <Option value="07">July</Option>
                                <Option value="08">August</Option>
                                <Option value="09">September</Option>
                                <Option value="10">October</Option>
                                <Option value="11">November</Option>
                                <Option value="12">December</Option>
                            </Select>
                        </div>
                    </Col>
                    <Col md={8} span={24}>
                        <div className="inputField">
                            <label>Exp Year:</label>
                            <Select defaultValue={referral.exp_year} style={{ width: '100%' }} onChange={(value) => updateField('exp_year', value)}>
                                <Option value="">Year...</Option>
                                {this.generateArrayOfYears().map((year) => (
                                    <Option key={year} value={year+''}>{year}</Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
                    <Col md={8} span={24}>
                        <div className="inputField">
                            <label>Card CVV:</label>
                            <Input value={referral.cvc} onChange={(e) => updateField('cvc', e.target.value)} />
                        </div>
                    </Col>
                </Row>
                <h2>Billing Address</h2>
                <Row gutter={16}>
                    <Col md={24} span={24}>
                        <div className="inputField">
                            <label>Address:</label>
                            <Input value={referral.address} onChange={(e) => updateField('address', e.target.value)} />
                        </div>
                    </Col>
                    <Col md={8} span={24}>
                        <div className="inputField">
                            <label>City:</label>
                            <Input value={referral.city} onChange={(e) => updateField('city', e.target.value)} />
                        </div>
                    </Col>
                    <Col md={8} span={24}>
                        <div className="inputField">
                            <label>State:</label>
                            <Input value={referral.state} onChange={(e) => updateField('state', e.target.value)} />
                        </div>
                    </Col>
                    <Col md={8} span={24}>
                        <div className="inputField">
                            <label>Zipcode:</label>
                            <Input value={referral.zipcode} onChange={(e) => updateField('zipcode', e.target.value)} />
                        </div>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                    <Col md={14} span={24}>
                        <Button onClick={() => this.not_interested()}>Not interested in Gift card program</Button>
                    </Col>
                    <Col md={10} span={24}>
                        <div className="right-align">
                            <Button onClick={() => this.previous()}>Previous</Button>
                            <Button style={{marginLeft:10}} type="primary" onClick={() => this.submit()}>Done</Button>
                        </div>
                    </Col>
                </Row>
            </Spin>
        );

    }
}

export default Step;
