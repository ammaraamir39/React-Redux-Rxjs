import React, { Component } from 'react';
import {
    Icon,
    Input,
    Button,
    Spin,
    Row,
    Col,
    message
} from 'antd';
import './register.css';
import registerLogo from './logo.png';
import F from '../../Functions';
import axios from 'axios';
import Sidebar from './parts/sidebar';

import Step2 from './parts/step2';
// import Step3 from './parts/step3';
// import Step4 from './parts/step4';

class Register extends Component {
    state = {
        loading: true,
        user: {},
        step: 2
    }
    componentDidMount = () => {
        window.document.body.classList.add("register")
        axios.get("/api/user").then((res) => {
            if (res.data.user_agency_assoc.length > 0) {
                res.data.agency_id = res.data.user_agency_assoc[0].agency_id;
            }
            this.setState({
                loading: false,
                user: res.data
            })
        }).catch(() => {
            this.setState({ loading: false }, () => {
                message.error(F.translate(`User not logged in.`));
                this.props.history.push('/login');
            })
        })
    }
    componentWillUnmount = () => {
        window.document.body.classList.remove("register")
    }
    updateField = (name, value) => {
        const { user } = this.state;
        user[name] = value;
        this.setState({ user })
    }
    updateStep = (val) => {
        this.setState({ step: val });
    }
    render() {

        const { loading, user, step } = this.state;
        const { updateField, updateStep } = this;

        let Step = Step2;
        // if (step === 3) Step = Step3;
        // if (step === 4) Step = Step4;

        return (
            <div className="register-form">
                <Row type="flex">
                    <Sidebar />
                    <Col md={16} span={24} className="content">
                        <Step
                            user={user}
                            updateField={updateField}
                            updateStep={updateStep}
                            {...this.props}
                        />
                    </Col>
                </Row>
            </div>
        );

    }
}

export default Register;
