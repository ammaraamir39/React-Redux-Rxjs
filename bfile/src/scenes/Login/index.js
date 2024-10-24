import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Form, Icon, Input, Button, Spin, Alert } from 'antd';
import './login.css';
import loginLogo from './logo.png';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Login extends Component {
    state = {
        success: false,
        loading: false,
        errorMessage: ""
    }
    componentDidMount = () => {
        window.document.body.classList.add("login")
    }
    componentWillUnmount = () => {
        window.document.body.classList.remove("login")
    }
    login = (e) => {
        const { history } = this.props;

        e.preventDefault();
        this.setState({
            success: false,
            loading: false,
            errorMessage: ""
        })
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                this.props.login(values, (result) => {
                    if (result.success) {
                        if (result.user.user_type === 'SUPER_ADMIN') {
                            history.push('/super-admin');
                        } else {
                            history.push('/dashboard');
                        }
                    } else {
                        this.setState({
                            loading: false,
                            errorMessage: result.errorMessage
                        })
                    }
                })
            }
        });
    }
    render() {

        const { success, loading, errorMessage } = this.state;
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.login} className="login-form">
                <div className="login-form-header">
                    <img src={loginLogo} alt="B-File" />
                </div>
                {errorMessage !== '' ? (
                    <FormItem>
                        <Alert message={errorMessage} type="error" />
                    </FormItem>
                ) : null}
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
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Password field is required.' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    {loading ? (
                        <Spin indicator={antIcon} />
                    ) : (
                        <div>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                            <Link to="/forgot-password" className="login-form-forgot">Forgot password</Link>
                            or <a href="https://bfilesystem.com/pricing/">Register now!</a> 
                        </div>
                    )}
                </FormItem>
                <div className="acknowledge">
                    By selecting to login you are acknowledging the <a href="https://bfilesystem.com/terms-of-service/" target="_blank" rel="noopener noreferrer">terms and conditions</a> of the licensing agreement issued by PersistEplan Software LLC
                </div>
            </Form>
        );

    }
}

const WrappedNormalLoginForm = Form.create()(Login);
export default WrappedNormalLoginForm;
