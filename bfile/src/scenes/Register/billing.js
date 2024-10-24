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

class Billing extends Component {
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
                            <h1>Update Billing</h1>
                            <Divider />
                            
                        </Spin>
                    </Col>
                </Row>
            </div>
        );

    }
}

export default Billing;
