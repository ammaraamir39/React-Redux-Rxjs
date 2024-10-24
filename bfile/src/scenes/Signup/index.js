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
import './register.css';
import registerLogo from './logo.png';
import F from '../../Functions';
import axios from 'axios';
import Cookies from 'js-cookie';
import onboard_image from './onboard.png';
import reviewScheduler_image from './review-scheduler.png';
import payment_methods from './payment-methods.png';

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

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
            package: '',
            card_number: '',
            exp_month: '',
            exp_year: '',
            cvc: '',
            stripe_token: '',
            stripe_card_number: ''
        },
        price: 0,
        agree: false,
        step: 1,
        bonboard: false,
        review_scheduler: false
    }
    componentDidMount = () => {
        window.document.body.classList.add("signup")
    }
    componentWillUnmount = () => {
        window.document.body.classList.remove("signup")
    }
    updateField = (name, value) => {
        const { user } = this.state;
        user[name] = value;
        this.setState({ user });
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
    next() {
        const { user, step } = this.state;
        if (step === 1) {
            if (user.agency_name === "" || user.email === "" || user.first_name === "" || user.last_name === "" || user.password === "" || user.confirm_password === "") {
                message.error(F.translate(`Please fill all required fields.`));
                return false;
            }
            if (user.password !== user.confirm_password) {
                message.error(F.translate(`Confirmation password does not match the password.`));
                return false;
            }
            if (!F.validateEmail(user.email)) {
                message.error(F.translate(`Email is invalid.`));
                return false;
            }
        }
        if (step === 2) {
            if (user.package === "") {
                message.error(F.translate(`Package field is required.`));
                return false;
            }
        }
        if (step === 3) {
            if (user.card_number === "" || user.exp_month === "" || user.exp_year === "" || user.cvc === "") {
                message.error(F.translate(`Card info missing.`));
                return false;
            }
        }

        this.setState({
            step: this.state.step + 1
        })
    }
    submit = () => {
        const { user, agree, review_scheduler, bonboard } = this.state;
        if (!agree) {
            message.error(F.translate(`Please fill all required fields.`));
        } else if (user.agency_name === "" || user.email === "" || user.first_name === "" || user.last_name === "" || user.password === "" || user.confirm_password === "" || user.package === "") {
            message.error(F.translate(`Please fill all required fields.`));
        } else if (user.card_number === "" || user.exp_month === "" || user.exp_year === "" || user.cvc === "") {
            message.error(F.translate(`Card info missing.`));
        } else if (user.password !== user.confirm_password) {
            message.error(F.translate(`Confirmation password does not match the password.`));
        } else {
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
                let subscription = null;
                if (user.package === 'annual') {
                    subscription = 'prod_FhBTNOyRj5Y3Z5';
                    if (review_scheduler) {
                        subscription = 'prod_FhBFKolwNYT5Vv';
                        if (bonboard) {
                            subscription = 'prod_FhBFKolwNYT5Vv';
                        }
                    }
                } else {
                    subscription = 'prod_FhBCIV5jgHiPNY';
                    if (review_scheduler) {
                        subscription = 'prod_FhBU8EahbHmseb';
                        if (bonboard) {
                            subscription = 'prod_FhBVydoU9LmYo8';
                        }
                    }
                }
                let payload = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    user_type: "EA",
                    phone: user.phone_number,
                    mobile_number: user.mobile_number,
                    timezone: user.timezone,
                    timezone_offset: this.timezone_offset(user.timezone),
                    subscription
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
                        subscription
                    };
                    axios.post("/api/charge", payload).then((res) => {
                        if (res.data.success) {
                            let agency_payload = {
                                name: user.agency_name,
                                primary_ea_id: registred_user.id,
                                address: user.agency_address,
                                state: null,
                                billing_address: user.agency_address,
                                active: 1
                            };
                            if (review_scheduler) {
                                agency_payload.review = 1;
                            }
                            if (bonboard) {
                                agency_payload.vonboard = 1;
                            }

                            const customer = 'allstate';
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
                            message.error(res.data.message);
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
                    if (typeof res.data.message !== "undefined") {
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

        const { loading, user, price, agree } = this.state;
        const updateField = this.updateField;

        return (
            <div className="register-form">
                <Row type="flex">
                    <Col md={16} span={24} className="content">
                        <Spin indicator={antIcon} spinning={loading}>
                            {this.state.step === 1 ? (
                                <div>
                                    <h1>Agency Information</h1>
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
                                                            <Icon type="exclamation-circle-o" style={{color:"#1890ff"}} />
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
                                </div>
                            ) : null}
                            

                            {this.state.step === 2 ? (
                                <div>
                                    <h1>Plan</h1>
                                    <div className="inputField">
                                        <Select defaultValue={user.package} style={{ width: '100%' }} onChange={(value) => this.updateField('package', value)}>
                                            <Option value={''}>{"Select Plan..."}</Option>
                                            <Option value="month">Monthly</Option>
                                            <Option value="annual">Annual</Option>
                                        </Select>
                                    </div>
                                    <h1>Additional Add-Ons</h1>
                                    <div className="packages">
                                        <Row gutter={16}>
                                            <Col md={12} span={24}>
                                                <div className="package">
                                                    <div className="thumb">
                                                        <img src={reviewScheduler_image} />
                                                    </div>
                                                    <div className="amount">
                                                        $400
                                                    </div>
                                                    <div className="desc">
                                                        Review Scheduler provides your agency with a dedicated virtual employee who will contact your renewal customers and schedule a 15 min phone review with your agency CSR.
                                                    </div>
                                                    <div className="btnContainer">
                                                        <a className="btn" onClick={() => this.setState({ review_scheduler: !this.state.review_scheduler, bonboard: false })}>
                                                            {this.state.review_scheduler ? (
                                                                <span>Remove</span>
                                                            ) : (
                                                                <span>Add</span>
                                                            )}
                                                        </a>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={12} span={24}>
                                                <div className="package">
                                                    <div className="thumb">
                                                        <img src={onboard_image} />
                                                    </div>
                                                    <div className="amount">
                                                        $500
                                                    </div>
                                                    <div className="desc">
                                                        B-Onboard provides your agents
                                                        with a Virtual On-Boarder (VOB)
                                                        employee to make a 15 day post
                                                        sale/renewal call to any customer
                                                        sent through your Hoopinsure system.
                                                    </div>
                                                    <div className="btnContainer">
                                                        {this.state.review_scheduler ? (
                                                            <a className="btn" onClick={() => this.setState({ bonboard: !this.state.bonboard})}>
                                                                {this.state.bonboard ? (
                                                                    <span>Remove</span>
                                                                ) : (
                                                                    <span>Add</span>
                                                                )}
                                                            </a>
                                                        ) : (
                                                            <a className="btn disabled">
                                                                <span>Add</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>    
                                    </div>
                                </div>
                            ) : null}

                            {this.state.step === 3 ? (
                                <div className="step3">
                                    <h1>Payment Information</h1>
                                    <div className="price">Total: <span>{F.dollar_format(price, 2)}</span></div>
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
                                                        <Option key={year} value={year+''}>{year}</Option>
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
                                    </Row>

                                    <div class="center-align">
                                        <div className="methods"><img src={payment_methods} /></div>
                                        <div>
                                            <Checkbox checked={agree} onChange={(e) => this.setState({agree: e.target.checked})}>
                                                {`By creating an account, you agree to our Privacy Policy, Terms of Use, License Agreement.`}
                                            </Checkbox>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="navbuttons">
                                {this.state.step === 3 ? (
                                    <p><Button type="primary" onClick={() => this.submit()}>Create Account</Button></p>
                                ) : (
                                    <p><Button type="primary" onClick={() => this.next()}>Next Step</Button></p>
                                )}
                                {this.state.step > 1 ? (
                                    <p><Button onClick={() => this.setState({ step: this.state.step - 1 })}>Back</Button></p>
                                ) : null}
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div>
        );

    }
}

export default Register;
