import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Form, Icon, Input, Button, Spin, Alert, message } from 'antd';
import './login.css';
import loginLogo from './logo.png';
import axios from 'axios';
import F from '../../Functions';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class ForgotPassword extends Component {
    state = {
        loading: false
    }
    componentDidMount = () => {
        window.document.body.classList.add("login")
    }
    componentWillUnmount = () => {
        window.document.body.classList.remove("login")
    }
    send = (e) => {
        const { history } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                axios.post("/api/request_reset_password", { email: values.email }).then((res) => {
                    this.setState({ loading: false });
                    if (typeof res.data.error != "undefined") {
                        message.error(res.data.error);
                    } else {
                        message.success(F.translate(`A password reset link has been sent to your email address.`));
                        history.push('/login');
                    }
                }).catch(() => {
                    this.setState({ loading: false });
                    message.error(F.translate(`Please try again later.`));
                });
            }
        });
    }
    render() {

        const { loading } = this.state;
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.send} className="login-form forgot-password-form">
                <div className="login-form-header">
                    <img src={loginLogo} alt="B-File" />
                </div>
                <FormItem>
                    {getFieldDecorator('email', {
                        rules: [{
                          type: 'email', message: 'Email is invalid.',
                        }, {
                          required: true, message: 'Email field is required.',
                        }]
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
                    )}
                </FormItem>
                <FormItem>
                    {loading ? (
                        <Spin indicator={antIcon} />
                    ) : (
                        <div>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Reset Password
                            </Button>
                        </div>
                    )}
                </FormItem>
            </Form>
        );

    }
}

const WrappedNormalLoginForm = Form.create()(ForgotPassword);
export default WrappedNormalLoginForm;
