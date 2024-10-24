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

class InviteLSP extends Component {
    state = {
        loading: false,
        agency_id: null,
        loggedin: this.props.auth.user,
        user: {
            first_name: '',
            last_name: '',
            email: '',
            user_type: 'LSP',
            jobs: '{"onboarding":false,"life_licensed":false}'
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
        if (name === 'jobs') {
            const data = {onboarding: false, life_licensed: false};
            if (val.indexOf('onboarding') >= 0) data.onboarding = true;
            if (val.indexOf('life_licensed') >= 0) data.life_licensed = true;
            val = JSON.stringify(data);
        }
        user[name] = val;
        this.setState({ user });
    }
    invite = () => {
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
                        })
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
        const jobs = [];
        if (user.user_type === 'LSP' && user.jobs !== '' && user.jobs !== null) {
            const jobs_json = JSON.parse(user.jobs);
            if (jobs_json.onboarding) {
                jobs.push('onboarding');
            }
            if (jobs_json.life_licensed) {
                jobs.push('life_licensed');
            }
        }

        return (
            <div>
                <Card type="inner" title={<Translate text={`Invite Agency Sales Staff (LSP's)`} />} loading={loading}>
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
                        <h3><Translate text={`Select Jobs`} /></h3>
                        <Checkbox.Group value={jobs}
                            style={{ width: '100%' }}
                            onChange={(checkedList) => updateField('jobs', checkedList)}
                        >
                            <Checkbox value="onboarding"><Translate text={`Onboarding`} /></Checkbox>
                            <Checkbox value="life_licensed"><Translate text={`Life Licensed`} /></Checkbox>
                        </Checkbox.Group>
                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={this.invite.bind(this)}>
                            <Translate text={`Invite User`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
}

export default InviteLSP;
