import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Form, Icon, Input, Button, Spin, Alert, message } from 'antd';
import './login.css';
import loginLogo from './logo.png';
import axios from 'axios';
import F from '../../Functions';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class ResetPassword extends Component {
    state = {
        loading: false,
        token: ''
    }
    componentDidMount = () => {
        window.document.body.classList.add("login")
        if (typeof this.props.match.params.token !== "undefined") {
            this.setState({ token: this.props.match.params.token });
        } else {
            this.props.history.push('/login');
            message.error(F.translate(`No password token found.`));
        }
    }
    componentWillUnmount = () => {
        window.document.body.classList.remove("login")
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Confirmation password does not match the password.');
        } else {
            callback();
        }
    }
    send = (e) => {
        const { history } = this.props;
        const { token } = this.state;

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                axios.post("/api/reset_password/" + token, {
                    password: values.password
                }).then((res) => {
                    this.setState({ loading: false });
                    if (res.data.success) {
                        message.success(F.translate(`Password has been changed successfully.`));
                        history.push('/login');
                    } else {
                        message.error(F.translate(`Can't update password.`));
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
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Password field is required.' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('confirm_password', {
                        rules: [{ required: true, message: 'Confirm password field is required.' }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Confirm Password" />
                    )}
                </FormItem>
                <FormItem>
                    {loading ? (
                        <Spin indicator={antIcon} />
                    ) : (
                        <div>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Update Password
                            </Button>
                        </div>
                    )}
                </FormItem>
            </Form>
        );

    }
}

const WrappedNormalLoginForm = Form.create()(ResetPassword);
export default WrappedNormalLoginForm;
