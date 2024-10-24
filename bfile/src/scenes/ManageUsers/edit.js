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

class EditUser extends Component {
    state = {
        loading: true,
        user: {}
    }
    componentDidMount = () => {
        this.setState({ loading: true });
        let user_id = 0;
        if (typeof this.props.match.params.user_id !== "undefined") {
            user_id = this.props.match.params.user_id;
        }
        axios.get("/api/users/" + user_id).then((res) => {
            this.setState({
                loading: false,
                user: res.data
            });
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
    update = () => {
        const { user } = this.state;

        this.setState({ loading: true });

        axios.put('/api/users/' + user.id, {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            company_name: user.company_name,
            address: user.address,
            city: user.city,
            state: user.state,
            zipcode: user.zipcode,
            jobs: user.jobs
        }).then((res) => {
            message.success(F.translate(`User has been updated successfully.`));
            this.setState({ loading: false }, () => {
                this.props.history.push('/manage-users');
            })
        })
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
                <Card type="inner" title={<Translate text={`Edit User`} />} loading={loading}>
                    {user.user_type === 'LSP' ? (
                        <div>
                            <Row gutter={16}>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`First Name`} />:</label>
                                        <Input value={user.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Last Name`} />:</label>
                                        <Input value={user.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Email`} />:</label>
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
                    ) : (
                        <div>
                            <Row gutter={16}>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`First Name`} />:</label>
                                        <Input value={user.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Last Name`} />:</label>
                                        <Input value={user.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Email`} />:</label>
                                        <Input value={user.email} onChange={(e) => updateField('email', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Phone`} />:</label>
                                        <Input value={user.phone} onChange={(e) => updateField('phone', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={8} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Company Name`} />:</label>
                                        <Input value={user.company_name} onChange={(e) => updateField('company_name', e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Address`} />:</label>
                                        <Input value={user.address} onChange={(e) => updateField('address', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`City`} />:</label>
                                        <Input value={user.city} onChange={(e) => updateField('city', e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`State`} />:</label>
                                        <Input value={user.state} onChange={(e) => updateField('state', e.target.value)} />
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <div className="inputField">
                                        <label><Translate text={`Zipcode`} />:</label>
                                        <Input value={user.zipcode} onChange={(e) => updateField('zipcode', e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                    <div className="right-align">
                        <Button type="primary" onClick={this.update.bind(this)}>
                            <Translate text={`Edit User`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
}

export default EditUser;
