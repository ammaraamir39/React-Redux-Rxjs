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
import F from '../../../Functions';
import axios from 'axios';

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Step extends Component {
    state = {
        loading: false,
        efss: [{
            first_name: "",
            last_name: "",
            email: ""
        }]
    }
    updateField = (name, value) => {
        const { user } = this.state;
        user[name] = value;
        this.setState({ user })
    }
    add_efs = () => {
        const { efss } = this.state;
        efss.push({
            first_name: "",
            last_name: "",
            email: ""
        });
        this.setState({ efss })
    }
    remove_efs = (index) => {
        const { efss } = this.state;
        efss.splice(index, 1);
        this.setState({ efss })
    }
    update_efs = (index, name, value) => {
        const { efss } = this.state;
        efss[index][name] = value;
        this.setState({ efss })
    }
    validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    submit_efs = (user, resolve) => {
        const loggedin = this.props.user;
        const agency_id = loggedin.agency_id;

        axios.post("/api/is_user_exist", {
            email: user.email
        }).then((res) => {
            const user_id = res.data;
            if (user_id) {
                axios.post("/api/user_agency_assoc", {
                    agency_id: agency_id,
                    user_id: user_id
                }).then((res) => {
                    axios.post("/api/associations", {
                        parent_id: loggedin.id,
                        child_id: user_id,
                        status: 1
                    }).then((res) => {
                        resolve({ success: true });
                    }).catch(() => {
                        resolve({ success: false });
                        message.error("Can't invite " + user.email);
                    });
                }).catch((res) => {
                    resolve({ success: false });
                    message.error("Can't invite " + user.email);
                });
            } else {
                axios.post("/api/token", {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    user_type: 'EFS',
                    invited_by: loggedin.id
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
        const { efss } = this.state;
        const that = this;
        let error = "";
        for (let i=0; i<efss.length; i++) {
            if (efss[i].email === "") {
                error = 'Email field is required.';
                break;
            } else {
                if (!this.validateEmail(efss[i].email)) {
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
            for (let i=0; i<efss.length; i++) {
                let user = efss[i];
                let promise = new Promise(function (resolve, reject) {
                    that.submit_efs(user, resolve);
                });
                promises.push(promise);
            }
            Promise.all(promises).then((val) => {
                that.setState({ loading: false });
                that.props.updateStep(4);
            });
        }
    }
    previous = () => {
        this.props.updateStep(2);
    }
    skip = () => {
        this.props.updateStep(4);
    }
    render() {

        const { loading, efss } = this.state;
        const { user } = this.props;
        const { update_efs } = this;

        return (
            <Spin indicator={antIcon} spinning={loading}>
                <h1>Add Financial Specialists</h1>
                <p><strong>{`Almost Done!`}</strong></p>
                <p>{`Add Your Life/Retirement Specialist If You Have One!`}</p>
                <Divider />
                {efss.map((efs, i) => (
                    <div>
                        <Row gutter={16} type="flex" justify="space-around" align="bottom">
                            <Col md={7} span={24}>
                                <div className="inputField">
                                    <label>First Name:</label>
                                    <Input value={efs.first_name} onChange={(e) => update_efs(i, 'first_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={7} span={24}>
                                <div className="inputField">
                                    <label>Last Name:</label>
                                    <Input value={efs.last_name} onChange={(e) => update_efs(i, 'last_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={7} span={24}>
                                <div className="inputField">
                                    <label>Email:</label>
                                    <Input value={efs.email} onChange={(e) => update_efs(i, 'email', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={3} span={24}>
                                <div className="inputField">
                                    <Button onClick={() => this.remove_efs(i)} disabled={efss.length === 1}>
                                        <Icon type="close" />
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        <Divider />
                    </div>
                ))}
                <Button onClick={() => this.add_efs()}>
                    <Icon type="plus" /> Add Additional Financial Specialist
                </Button>
                <Divider />
                <div className="right-align">
                    <Button onClick={() => this.previous()}>Previous</Button>
                    <Button style={{marginLeft:10}} onClick={() => this.skip()}>Skip</Button>
                    <Button style={{marginLeft:10}} type="primary" onClick={() => this.submit()}>Next</Button>
                </div>
            </Spin>
        );

    }
}

export default Step;
