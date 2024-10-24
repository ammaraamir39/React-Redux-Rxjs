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
    message,
    Radio
} from 'antd';
import './register.css';
import F from '../../Functions';
import axios from 'axios';
import Cookies from 'js-cookie';
import Sidebar from './parts/sidebar';

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const RadioGroup = Radio.Group;

class Register extends Component {
    state = {
        loading: false,
        user: {
            id: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            agency_name: '',
            agency_address: '',
            phone_number: '',
            mobile_number: '',
            timezone: '',
            card_number: '',
            exp_month: '',
            exp_year: '',
            cvc: '',
            promo_code: '',
            billing_address: '',
            valid_promo_code: '',
            plan: '',
        },
        price: 750,
        agree: false,
        agree2: false,
        farmers_checkbox: null
    }
    componentDidMount = () => {
        window.document.body.classList.add("register")
    }
    componentWillUnmount = () => {
        window.document.body.classList.remove("register")
    }
    updateField = (name, value) => {
        const { user } = this.state;
        user[name] = value;
        this.setState({ user }, () => {
            if (name === 'package') {
                this.promo_code_update();
            }
        })
    }
    timezone_offset = (timezone) => {
        const offsets = {
            "US/Samoa": "-11",
            "US/Hawaii": "-10",
            "US/Alaska": "-9",
            "US/Pacific": "-8",
            "US/Mountain": "-7",
            "US/Central": "-6",
            "US/Eastern": "-5"
        };
        if (typeof offsets[timezone] !== "undefined") {
            return offsets[timezone];
        } else {
            return null;
        }
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
    promo_code_update = () => {
        const { user } = this.state;
        let price = 750;

        if (user.promo_code !== "") {
            this.setState({ loading: true });
            axios.post("/api/coupon_check", {
                coupon_code: user.promo_code
            }).then((res) => {
                let error = false;
                if (typeof res.data.success !== "undefined" && res.data.success === "false") {
                    error = true;
                }
                if (typeof res.data.valid !== "undefined" && !res.data.valid) {
                    error = true;
                }
                if (!error) {
                    let discount = 0;
                    user.valid_promo_code = user.promo_code;
                    if (res.data.amount_off !== null) {
                        discount = res.data.amount_off / 100;
                    }
                    if (res.data.percent_off !== null) {
                        discount = (price * res.data.percent_off) / 100;
                    }
                    price = price - parseFloat(discount);
                    this.setState({ user, price, loading: false });
                } else {
                    this.setState({ price, loading: false });
                    this.updateField("promo_code", "");
                    message.error(F.translate(`Promo code not valid.`));
                }
            }).catch(() => {
                this.setState({ price, loading: false });
                this.updateField("promo_code", "");
                message.error(F.translate(`Please try again later.`));
            });
        } else {
            this.setState({ price });
        }
    }
    submit = () => {
        const { user } = this.state;
        if (user.agency_name === "" || user.email === "" || user.first_name === "" || user.last_name === "" || user.password === "" || user.confirm_password === "" || user.plan === "") {
            message.error(F.translate(`Please fill all required fields.`));
        } else if (user.card_number === "" || user.exp_month === "" || user.exp_year === "" || user.cvc === "") {
            message.error(F.translate(`Card info missing.`));
        } else if (user.password !== user.confirm_password) {
            message.error(F.translate(`Confirmation password does not match the password.`));
        } else {
            if (this.state.farmers_checkbox) {
                window.open("https://na3.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=c8839f43-1084-4804-8d07-c793db0fd903&env=na3&acct=bf37d7c4-5862-4a64-8220-5d6037b83a54&v=2", "_blank");
            }
            this.setState({ loading: true });
            if (user.stripe_token === "" || user.stripe_token !== "" && user.stripe_card_number !== user.card_number) {
                window.Stripe.setPublishableKey(window.stripe);
                window.Stripe.createToken({
                    number: user.card_number,
                    cvc: user.cvv,
                    exp_month: user.exp_month,
                    exp_year: user.exp_year
                }, (status, response) => {
                    const stripe_token = response.id;
                    this.setState({ loading: false });
                    if (response.error) {
                        message.error(response.error.message);
                    } else {
                        user.stripe_token = stripe_token;
                        user.stripe_card_number = user.card_number;
                        this.setState({ user }, () => {
                            this.submit();
                        })
                    }
                });
            } else {
                let payload = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    user_type: "EA",
                    phone: user.phone_number,
                    mobile_number: user.mobile_number,
                    timezone: user.timezone,
                    timezone_offset: this.timezone_offset(user.timezone),
                    subscription: user.plan
                }
                if (user.valid_promo_code !== "") {
                    payload.coupon_code = user.valid_promo_code;
                }

                let ajax = null;
                if (user.id !== '') {
                    ajax = axios.put("/api/users/" + user.id, payload);
                    axios.post("/api/update_password", {
                        password: user.password
                    });
                } else {
                    payload.password = user.password;
                    ajax = axios.post("/api/register", payload);
                }
                ajax.then((res) => {
                    const registred_user = res.data;
                    user.id = registred_user.id;
                    this.setState({ user });

                    axios.get("/api/user").then((res) => {
                        const loggedin = res.data;
                        Cookies.set('is_logged_in', 'true');
                        Cookies.set('user_info', JSON.stringify({
                            first_name: loggedin.first_name,
                            last_name: loggedin.last_name,
                            email: loggedin.email,
                            id: loggedin.id,
                            user_type: loggedin.user_type,
                            jobs: loggedin.jobs,
                            default_date: loggedin.default_date,
                            last_login: loggedin.last_login,
                            language: loggedin.language
                        }));
                    });

                    let payload = {
                        type: "CREDIT",
                        stripe_token: user.stripe_token,
                        subscription: user.plan
                    };
                    if (user.valid_promo_code !== "") {
                        payload.coupon_code = user.valid_promo_code;
                    }
                    axios.post("/api/charge", payload).then((res) => {
                        if (res.data.success) {
                            let agency_payload = {
                                name: user.agency_name,
                                primary_ea_id: registred_user.id,
                                address: user.agency_address,
                                state: user.state,
                                billing_address: user.billing_address,
                                active: 1,
                                vonboard: 1
                            };

                            const customer = user.plan.toLowerCase().replace(/ /g, "-");
                            const identifier = "bfile-user-" + registred_user.id;

                            axios.post("/api/agencies", agency_payload).then((res) => {
                                return axios.post("/api/user_agency_assoc", {
                                    agency_id: res.data.id,
                                    user_id: registred_user.id
                                });
                            }).then((res) => {
                                return axios.post("/api/tango/create_account", {
                                    "customer": customer,
                                    "identifier": identifier,
                                    "email": user.email
                                });
                            }).then((res) => {
                                axios.put('/api/users/' + registred_user.id, {
                                    tango_identifier_v2: identifier,
                                    tango_customer: customer
                                }).then(() => {
                                    this.setState({ loading: false });
                                    //this.props.history.push('/register/wizard');
                                    this.props.history.push('/dashboard');
                                }).catch(() => {
                                    this.setState({ loading: false });
                                    message.error(F.translate(`Please try again later.`));
                                });
                            }).catch(() => {
                                this.setState({ loading: false });
                                message.error(F.translate(`Please try again later.`));
                            });

                        } else {
                            this.setState({ loading: false });
                            if (typeof res.data.message !== "undefined") {
                                message.error(res.data.message);
                            } else {
                                message.error(F.translate(`Please try again later.`));
                            }
                        }
                    }).catch((res) => {
                        this.setState({ loading: false });
                        if (typeof res.data.message !== "undefined") {
                            message.error(res.data.message);
                        } else {
                            message.error(F.translate(`Please try again later.`));
                        }
                    });

                }).catch((res) => {
                    this.setState({ loading: false });
                    if (typeof res.data !== "undefined" && typeof res.data.message !== "undefined") {
                        if (res.data.message === "IntegrityError") {
                            message.error(F.translate(`Email already exists in the system.`));
                        } else {
                            message.error(res.data.message);
                        }
                    } else {
                        message.error(F.translate(`Please try again later.`));
                    }
                });

            }
        }
    }
    render() {

        const { loading, user, price, agree, agree2 } = this.state;
        const updateField = this.updateField;

        return (
            <div className="register-form">
                <Row type="flex">
                    <Sidebar />
                    <Col md={16} span={24} className="content">
                        <Spin indicator={antIcon} spinning={loading}>
                            <h1>Register</h1>
                            <p>{`Sell more life, retirement & P&C items with the world's best insurance opportunity platform.`}</p>
                            <Divider />
                            <h2 className="secTitle"><span className="secNum">1</span> Tell us about your agency</h2>
                            <Row gutter={16}>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label>First Name:</label>
                                        <Input value={user.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label>Last Name:</label>
                                        <Input value={user.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label>Work Email:</label>
                                        <Input value={user.email} onChange={(e) => updateField('email', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label>
                                            Password:
                                            <div className="right">
                                                <Tooltip placement="bottom" title={`Password must be at least 8 characters, include at least 1 Uppercase character, 1 Lowercase character and an approved symbol. !@#$%^&*()`}>
                                                    <Icon type="exclamation-circle-o" style={{ color: "#1890ff" }} />
                                                </Tooltip>
                                            </div>
                                        </label>
                                        <Input type="password" value={user.password} onChange={(e) => updateField('password', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label>
                                            Confirm Password:
                                        </label>
                                        <Input type="password" value={user.confirm_password} onChange={(e) => updateField('confirm_password', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label>Agency Name:</label>
                                        <Input value={user.agency_name} onChange={(e) => updateField('agency_name', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label>Agency Address:</label>
                                        <Input value={user.agency_address} onChange={(e) => updateField('agency_address', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label>Phone Number:</label>
                                        <Input value={user.phone_number} onChange={(e) => updateField('phone_number', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label>Mobile Number:</label>
                                        <Input value={user.mobile_number} onChange={(e) => updateField('mobile_number', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={24} span={24}>
                                    <div className="inputField">
                                        <label>Timezone:</label>
                                        <Select defaultValue={user.timezone} style={{ width: '100%' }} onChange={(value) => this.updateField('timezone', value)}>
                                            <Option value={''}>{"Select Timezone..."}</Option>
                                            <Option value="US/Samoa">Samoa Time Zone (-11:00)</Option>
                                            <Option value="US/Hawaii">Hawaii-Aleutian Time Zone (-10:00)</Option>
                                            <Option value="US/Alaska">Alaska Time Zone (-09:00)</Option>
                                            <Option value="US/Pacific">Pacific Time Zone (-08:00)</Option>
                                            <Option value="US/Mountain">Mountain Time Zone (-07:00)</Option>
                                            <Option value="US/Central">Central Time Zone (-06:00)</Option>
                                            <Option value="US/Eastern">Eastern Time Zone (-05:00)</Option>
                                        </Select>
                                    </div>
                                </Col>
                            </Row>
                            <Divider />
                            <h2 className="secTitle"><span className="secNum">2</span> Choose your plan</h2>
                            <div className="inputField">
                                <label>Plan:</label>
                                <Select defaultValue={user.plan} style={{ width: '100%' }} onChange={(value) => this.updateField('plan', value)}>
                                    <Option value={''}>{"Select Plan..."}</Option>
                                    <Option value="price_1IEDo02DVWmKiFC5rPWTFyyA">Allstate</Option>
                                    <Option value="price_1IEDoN2DVWmKiFC5EdOTFSrb">Farmers</Option>
                                    <Option value="price_1IEDpI2DVWmKiFC5n9qT9c1H">Country Financial</Option>
                                    <Option value="price_1IEDol2DVWmKiFC53MWJWvIi">Farm Bureau</Option>
                                    <Option value="price_1IEDpj2DVWmKiFC5j5w86kE1">Independent Agent</Option>
                                </Select>
                            </div>
                            {user.plan === "price_1IEDol2DVWmKiFC53MWJWvIi" ? (
                                <div className="inputField">
                                    <Row gutter={16}>
                                        <Col md={12} span={24}>
                                            Do you want to use Payroll Deduct?
                                        </Col>
                                        <Col md={12} span={24}>
                                            <RadioGroup
                                                value={this.state.farmers_checkbox}
                                                onChange={(e) => {
                                                    this.setState({ farmers_checkbox: e.target.value })
                                                }}
                                                options={[
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' },
                                                ]}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            ) : null}
                            <Divider />
                            <h2 className="secTitle"><span className="secNum">3</span> Enter payment details</h2>
                            <Row gutter={16}>
                                <Col md={24} span={24}>
                                    <div className="inputField">
                                        <label>Card Number:</label>
                                        <Input value={user.card_number} onChange={(e) => updateField('card_number', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label>Exp Month:</label>
                                        <Select defaultValue={user.exp_month} style={{ width: '100%' }} onChange={(value) => updateField('exp_month', value)}>
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
                                        <Select defaultValue={user.exp_year} style={{ width: '100%' }} onChange={(value) => updateField('exp_year', value)}>
                                            <Option value="">Year...</Option>
                                            {this.generateArrayOfYears().map((year) => (
                                                <Option key={year} value={year + ''}>{year}</Option>
                                            ))}
                                        </Select>
                                    </div>
                                </Col>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label>Card CVV:</label>
                                        <Input value={user.cvc} onChange={(e) => updateField('cvc', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label>Promo Code:</label>
                                        <Input value={user.promo_code} onChange={(e) => updateField('promo_code', e.target.value)} onBlur={() => this.promo_code_update()} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label>Billing Address (Optional):</label>
                                        <Input placeholder="if different than agency address" value={user.billing_address} onChange={(e) => updateField('billing_address', e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                            <div className="price">Price: <span>{F.dollar_format(price, 2)}</span></div>
                            <p>
                                <Checkbox checked={agree} onChange={(e) => this.setState({ agree: e.target.checked })}>
                                    By creating an account, you agree to our {' '}
                                    <a href="/privacy-policy/" target="_blank">Privacy Policy</a>, {' '}
                                    <a href="/terms-of-service/" target="_blank">Terms of Use</a>, {' '}
                                    <a href="/license-agreement/" target="_blank">License Agreement</a>.
                                </Checkbox>
                            </p>
                            <p>
                                <Checkbox checked={agree2} onChange={(e) => this.setState({ agree2: e.target.checked })}>
                                    I understand I am signing up and committing to a 12 month subscription.
                                </Checkbox>
                            </p>
                            <Divider />
                            <div className="right-align">
                                {user.plan === "price_1IEDol2DVWmKiFC53MWJWvIi" && this.state.farmers_checkbox === null ? (
                                    <Button type="primary" onClick={() => this.submit()} disabled={true}>Submit</Button>
                                ) : (
                                    <Button type="primary" onClick={() => this.submit()} disabled={agree && agree2 ? false : true}>Submit</Button>
                                )}                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div>
        );

    }
}

export default Register;
