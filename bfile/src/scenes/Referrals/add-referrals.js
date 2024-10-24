import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Modal,
    Button,
    Spin,
    Switch,
    Input,
    message,
    Divider
} from 'antd';
import axios from 'axios';
import './add-referrals.css';
import F from '../../Functions';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class AddReferrals extends Component {
    state = {
        loading: false,
        token: null,
        referral: {},
        referrals: [
            {
                first_name: '',
                last_name: '',
                phone: '',
                email: ''
            }
        ]
    }
    componentDidMount = () => {
        window.document.body.classList.add("add-referrals");

        if (typeof this.props.match.params.token !== "undefined") {
            this.setState({ loading: true });
            axios.get("/api/referral/" + this.props.match.params.token).then((res) => {
                this.setState({
                    loading: false,
                    referral: res.data,
                    token: this.props.match.params.token
                })
            }).catch(() => {
                this.setState({
                    loading: false
                })
                message.error(F.translate(`Token invalid.`));
                this.props.history.push("/");
            });
        }
    }
    componentWillUnmount = () => {
        window.document.body.classList.remove("add-referrals")
    }
    addReferral = () => {
        const { referrals } = this.state;
        referrals.push({
            first_name: '',
            last_name: '',
            phone: '',
            email: ''
        });
        this.setState({ referrals });
    }
    updateReferral = (index, name, value) => {
        const { referrals } = this.state;
        referrals[index][name] = value;
        this.setState({ referrals });
    }
    removeReferral = (index) => {
        const { referrals } = this.state;
        referrals.splice(index, 1);
        this.setState({ referrals });
    }
    submitReferral = (u, resolve) => {
        const { referral } = this.state;
        if (u.email !== '' || u.phone !== '') {
            axios.post("/api/referrals_data", {
                first_name: u.first_name,
                last_name: u.last_name,
                phone: u.phone,
                email: u.email,
                status: 0,
                bfile_id: referral.bfile_id,
                agency_id: referral.agency_id
            }).then(() => {
                resolve({ success: true });
            }).catch(() => {
                message.error(F.translate(`Email ("+u.email+") has already been referred.`));
                resolve({ success: false });
            });
        } else {
            resolve({ success: false });
        }
    }
    submit = () => {
        const { token, referral, referrals } = this.state;
        const that = this;
        this.setState({ loading: true });
        axios.put("/api/referral/"+token, {
            status: 1,
            referral_amount: referral.referral_amount
        }).then((res) => {
            const promises = [];
            for (let i=0; i<referrals.length; i++) {
                let promise = new Promise(function (resolve, reject) {
                    that.submitReferral(referrals[i], resolve);
                });
                promises.push(promise);
            }
            Promise.all(promises).then((val) => {
                that.setState({
                    loading: false,
                    referrals: [
                        {
                            first_name: '',
                            last_name: '',
                            phone: '',
                            email: ''
                        }
                    ]
                });
                message.success(F.translate(`Referrals has been successfully submitted.`));
            });

        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Can't add referrals.`));
        });
    }
    render() {

        const { loading, referrals } = this.state;
        const updateReferral = this.updateReferral;

        return (
            <div id="box">
                <Card title={`Add Referrals`}>
                    <Spin indicator={antIcon} spinning={loading}>
                        {referrals.map((referral, i) => (
                            <div>
                                <Row gutter={16} type="flex" justify="space-around" align="bottom">
                                    <Col md={5} span={24}>
                                        <div className="inputField">
                                            <label>First Name:</label>
                                            <Input value={referral.first_name} onChange={(e) => updateReferral(i, 'first_name', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={5} span={24}>
                                        <div className="inputField">
                                            <label>Last Name:</label>
                                            <Input value={referral.last_name} onChange={(e) => updateReferral(i, 'last_name', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={5} span={24}>
                                        <div className="inputField">
                                            <label>Phone:</label>
                                            <Input value={referral.phone} onChange={(e) => updateReferral(i, 'phone', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={5} span={24}>
                                        <div className="inputField">
                                            <label>Email:</label>
                                            <Input value={referral.email} onChange={(e) => updateReferral(i, 'email', e.target.value)} />
                                        </div>
                                    </Col>
                                    <Col md={4} span={24}>
                                        <div className="inputField">
                                            <Button onClick={() => this.removeReferral(i)} disabled={referrals.length === 1}>
                                                <Icon type="close" />
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                                <Divider />
                            </div>
                        ))}
                        <Row gutter={16} type="flex" justify="space-around" align="bottom">
                            <Col md={12} span={24}>
                                <Button onClick={() => this.addReferral()}>
                                    <Icon type="plus" /> Add Another
                                </Button>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="right-align">
                                    <Button type="primary" onClick={() => this.submit()}>Submit</Button>
                                </div>
                            </Col>
                        </Row>
                    </Spin>
                </Card>
            </div>
        );

    }
}

export default AddReferrals;
