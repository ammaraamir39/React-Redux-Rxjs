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
        token: '',
        user: {
            id: '',
            first_name: '',
            last_name: '',
            password: '',
            confirm_password: '',
            timezone: ''
        }
    }
    componentDidMount = () => {
        window.document.body.classList.add("register")
        if (typeof this.props.match.params.token !== "undefined") {
            this.setState({ loading: true });
            axios.get("/api/token/" + this.props.match.params.token).then((res) => {
                const user = res.data;
                this.setState({
                    loading: false,
                    token: this.props.match.params.token,
                    user: {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        timezone: user.timezone
                    }
                });
            }).catch(() => {
                this.setState({ loading: false });
                message.error(F.translate(`Token has been expired.`));
                this.props.history.push('/login');
            })
        } else {
            this.setState({ loading: false });
            this.props.history.push('/login');
            message.error(F.translate(`No user token found.`));
        }
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
        const { user, token } = this.state;
        if (user.first_name === "" || user.last_name === "" || user.password === "" || user.confirm_password === "") {
            message.error(F.translate(`Please fill all required fields.`));
        } else if (user.password !== user.confirm_password) {
            message.error(F.translate(`Confirmation password does not match the password.`));
        } else {
            this.setState({ loading: true });
            axios.put("/api/token/" + token, {
                first_name: user.first_name,
                last_name: user.last_name,
                password: user.password,
                timezone: user.timezone,
                timezone_offset: this.timezone_offset(user.timezone)
            }).then(() => {
                this.setState({ loading: false });
                this.props.history.push('/login');
            }).catch(() => {
                this.setState({ loading: false });
                message.error(F.translate(`Please try again later.`));
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
                            <Divider />
                            <Row gutter={16}>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label>First Name:</label>
                                        <Input value={user.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label>Last Name:</label>
                                        <Input value={user.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
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
