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
import Sidebar from './parts/sidebar';

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
            timezone: ''
        }
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
        this.setState({ user })
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
    submit = () => {
        const { user } = this.state;
        if (user.agency_name === "" || user.email === "" ||user.first_name === "" || user.last_name === "" || user.password === "" || user.confirm_password === "") {
            message.error(F.translate(`Please fill all required fields.`));
        } else if (user.password !== user.confirm_password) {
            message.error(F.translate(`Confirmation password does not match the password.`));
        } else {
            this.setState({ loading: true });
            let payload = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                user_type: "EFS",
                phone: user.phone_number,
                mobile_number: user.mobile_number,
                invited_by: 1,
                timezone: user.timezone,
                timezone_offset: this.timezone_offset(user.timezone)
            };
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
                    Cookies.set("user_info", JSON.stringify({
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
                    this.setState({ loading: false }, () => {
                        this.props.history.push('/dashboard');
                    });
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
    render() {

        const { loading, user, price, agree } = this.state;
        const updateField = this.updateField;

        return (
            <div className="register-form">
                <Row type="flex">
                    <Sidebar />
                    <Col md={16} span={24} className="content">
                        <Spin indicator={antIcon} spinning={loading}>
                            <h1>Register</h1>
                            <p>{`As a financial specialist you will not be charged a licensing fee for using B-File. You will be required to register with B-File and request a link to your agency owner partners. Your system will not be activated until at least one agency owner/partner is registered with B-File.`}</p>
                            <Divider />
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
                            <Divider />
                            <div className="right-align">
                                <Button type="primary" onClick={() => this.submit()}>Submit</Button>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div>
        );

    }
}

export default Register;
