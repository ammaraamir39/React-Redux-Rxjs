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
                values.token = this.props.match.params.token;
                this.props.login(values, (result) => {
                    if (result.success) {
                        this.setState({
                            loading: false
                        }, () => {
                            history.push(result.redirect);
                        })
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
            <Form onSubmit={this.login} className="login-form" style={{minHeight:0}}>
                <div className="login-form-header">
                    <img src={loginLogo} alt="B-File" />
                </div>
                {errorMessage !== '' ? (
                    <FormItem>
                        <Alert message={errorMessage} type="error" />
                    </FormItem>
                ) : null}
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
                        </div>
                    )}
                </FormItem>
            </Form>
        );

    }
}

const WrappedNormalLoginForm = Form.create()(Login);
export default WrappedNormalLoginForm;
