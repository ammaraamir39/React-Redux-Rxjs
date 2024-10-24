import React, { Component } from 'react';
import {
    Icon,
    Input,
    Button,
    Spin,
    Row,
    Col,
    Divider,
    Tooltip,
    Checkbox,
    message
} from 'antd';
import axios from 'axios';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Step extends Component {
    state = {
        loading: false,
        lsps: [{
            first_name: "",
            last_name: "",
            email: "",
            jobs: []
        }]
    }
    updateField = (name, value) => {
        const { user } = this.state;
        user[name] = value;
        this.setState({ user })
    }
    add_lsp = () => {
        const { lsps } = this.state;
        lsps.push({
            first_name: "",
            last_name: "",
            email: "",
            jobs: []
        });
        this.setState({ lsps })
    }
    remove_lsp = (index) => {
        const { lsps } = this.state;
        lsps.splice(index, 1);
        this.setState({ lsps })
    }
    update_lsp = (index, name, value) => {
        const { lsps } = this.state;
        lsps[index][name] = value;
        this.setState({ lsps })
    }
    validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    submit_lsp = (user, resolve) => {
        const loggedin = this.props.user;
        const agency_id = loggedin.agency_id;

        let jobs = { onboarding: false, life_licensed: false };
        if (user.jobs.indexOf("onboarding") >= 0) jobs.onboarding = true;
        if (user.jobs.indexOf("life_licensed") >= 0) jobs.life_licensed = true;

        axios.post("/api/is_user_exist", {
            email: user.email
        }).then((res) => {
            const user_id = res.data;
            if (user_id) {
                axios.put("/api/users/" + user_id, {
                    jobs: JSON.stringify(jobs)
                }).then(() => {
                    axios.post("/api/user_agency_assoc", {
                        agency_id: agency_id,
                        user_id: user_id
                    }).then(() => {
                        axios.post("/api/associations", {
                            parent_id: loggedin.id,
                            child_id: user_id,
                            status: 1
                        }).then(() => {
                            resolve({ success: true });
                        }).catch(() => {
                            resolve({ success: false });
                            message.error("Can't invite " + user.email);
                        });
                    }).catch(() => {
                        resolve({ success: false });
                        message.error("Can't invite " + user.email);
                    });
                });
            } else {
                axios.post("/api/token", {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    user_type: 'LSP',
                    invited_by: loggedin.id,
                    jobs: JSON.stringify(jobs)
                }).then((res) => {
                    axios.post("/api/user_agency_assoc", {
                        agency_id: agency_id,
                        user_id: res.data.id
                    }).then(() => {
                        resolve({ success: true });
                    });
                }).catch(() => {
                    resolve({ success: false });
                    message.error("Can't invite " + user.email);
                });
            }
        }).catch(() => {
            resolve({ success: false });
            message.error("Can't invite " + user.email);
        });
    }
    submit = () => {
        const { lsps } = this.state;
        const that = this;
        let error = "";
        for (let i=0; i<lsps.length; i++) {
            if (lsps[i].email === "") {
                error = 'Email field is required.';
                break;
            } else {
                if (!this.validateEmail(lsps[i].email)) {
                    error = 'Email address is invalid.';
                    break;
                }
            }
        }
        if (error !== '') {
            message.error(error);
        } else {
            this.setState({ loading: true });
            const promises = [];
            for (let i=0; i<lsps.length; i++) {
                let user = lsps[i];
                let promise = new Promise(function (resolve) {
                    that.submit_lsp(user, resolve);
                });
                promises.push(promise);
            }
            Promise.all(promises).then(() => {
                that.setState({ loading: false });
                //that.props.updateStep(3);
                that.props.history.push("/dashboard");
            });
        }
    }
    skip = () => {
        //this.props.updateStep(4);
        this.props.history.push("/dashboard");
    }
    render() {

        const { loading, lsps } = this.state;
        const { update_lsp } = this;

        return (
            <Spin indicator={antIcon} spinning={loading}>
                <h1>Create Your Sales Team</h1>
                <p>{`Here's where you add your sales & services staff responsible for selling home & auto. If they have other responsibilities, you can activate them below.`}</p>
                <p>{`Please Note: If your agency partners with a life/retirement specialist, you can add them on the next step!`}</p>
                <p>{`Don't worry if you don't add everyone, you can manage users at anytime in your dashboard!`}</p>
                <Divider />
                {lsps.map((lsp, i) => (
                    <div key={i}>
                        <Row gutter={16} type="flex" justify="space-around" align="bottom">
                            <Col md={7} span={24}>
                                <div className="inputField">
                                    <label>First Name:</label>
                                    <Input value={lsp.first_name} onChange={(e) => update_lsp(i, 'first_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={7} span={24}>
                                <div className="inputField">
                                    <label>Last Name:</label>
                                    <Input value={lsp.last_name} onChange={(e) => update_lsp(i, 'last_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={7} span={24}>
                                <div className="inputField">
                                    <label>Email:</label>
                                    <Input value={lsp.email} onChange={(e) => update_lsp(i, 'email', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={3} span={24}>
                                <div className="inputField">
                                    <Button onClick={() => this.remove_lsp(i)} disabled={lsps.length === 1}>
                                        <Icon type="close" />
                                    </Button>
                                </div>
                            </Col>
                            <Col md={24} span={24}>
                                <div>
                                    Select Jobs:
                                    <Checkbox.Group value={lsp.jobs}
                                        style={{ width: 350, marginLeft: 20 }}
                                        onChange={(checkedList) => update_lsp(i, 'jobs', checkedList)}
                                    >
                                        <Checkbox value="onboarding">
                                            Onboarding {' '}
                                            <Tooltip placement="bottom" title={`Selecting this role gives your staff the ability to make 15-day follow-up phone calls to On-Board your New or Renewal customers and introduce them to Life Insurance and Financial Services.`}>
                                                <Icon type="exclamation-circle-o" style={{color:"#1890ff"}} />
                                            </Tooltip>
                                        </Checkbox>
                                        <Checkbox value="life_licensed">
                                            Life Licensed {' '}
                                            <Tooltip placement="bottom" title={`Selecting this role gives your Life Licensed Staff the ability to receive B-Files that the customer requested during On-Boarding to have a conversation about Life Insurance. *This role is designed for Life Insurance licensed staff only. Please do not select if the user is not Life Licensed.`}>
                                                <Icon type="exclamation-circle-o" style={{color:"#1890ff"}} />
                                            </Tooltip>
                                        </Checkbox>
                                    </Checkbox.Group>
                                </div>
                            </Col>
                        </Row>
                        <Divider />
                    </div>
                ))}
                <Button onClick={() => this.add_lsp()}>
                    <Icon type="plus" /> Add Additional Staff
                </Button>
                <Divider />
                <div className="right-align">
                    <Button onClick={() => this.skip()}>Skip</Button>
                    <Button style={{marginLeft:10}} type="primary" onClick={() => this.submit()}>Done</Button>
                </div>
            </Spin>
        );

    }
}

export default Step;
