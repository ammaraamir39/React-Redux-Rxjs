import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    Input,
    Checkbox,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';

class LinkEFS extends Component {
    state = {
        loading: false,
        agency_id: null,
        loggedin: this.props.auth.user,
        user: {
            first_name: '',
            last_name: '',
            email: '',
            user_type: 'EFS'
        }
    }
    componentDidMount = () => {
        axios.get("/api/user").then((res) => {
            const u = res.data;
            let agency_id = null;
            for (let i=0; i < u.user_agency_assoc.length; i++) {
                agency_id = u.user_agency_assoc[i].agency_id;
                break;
            }
            this.setState({ agency_id })
        });
    }
    updateField = (name, val) => {
        const { user }  = this.state;
        user[name] = val;
        this.setState({ user });
    }
    link = () => {
        const { user, loggedin, agency_id } = this.state;

        if (user.email !== '' && user.first_name !== '' && user.last_name !== '') {
            this.setState({ loading: true });
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
                            message.success(F.translate(`Invite sent successfully`));
                            this.setState({ loading: false }, () => {
                                this.props.history.push('/manage-users');
                            });
                        }).catch(() => {
                            message.error(F.translate(`Invitation not sent`));
                            this.setState({ loading: false });
                        });
                    }).catch((res) => {
                        message.error(F.translate(`Invitation not sent, please try again later.`));
                        this.setState({ loading: false });
                    });
                } else {
                    axios.post("/api/token", {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        user_type: user.user_type,
                        invited_by: loggedin.id
                    }).then((res) => {
                        axios.post("/api/user_agency_assoc", {
                            agency_id: agency_id,
                            user_id: res.data.id
                        }).then(() => {
                            message.success(F.translate(`Invite sent successfully`));
                            this.setState({ loading: false }, () => {
                                this.props.history.push('/manage-users');
                            });
                        });
                    }).catch(() => {
                        message.error(F.translate(`Invitation not sent, please try again later.`));
                    });
                }
            }).catch(() => {
                message.error(F.translate(`Please try again later.`));
                this.setState({ loading: false });
            });
        } else {
            message.error(F.translate(`Please fill all required fields.`));
            this.setState({ loading: false });
        }
    }
    render() {

        const { loading, user } = this.state;
        const updateField = this.updateField;

        return (
            <div>
                <Card type="inner" title={<Translate text={`Link Financial Specialist`} />} loading={loading}>
                    <div>
                        <Row gutter={16}>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`First Name`} /> *</label>
                                    <Input value={user.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Last Name`} /> *</label>
                                    <Input value={user.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={8} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Email`} /> *</label>
                                    <Input value={user.email} onChange={(e) => updateField('email', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={this.link.bind(this)}>
                            <Translate text={`Link User`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
}

export default LinkEFS;
