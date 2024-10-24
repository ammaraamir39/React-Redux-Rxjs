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

class EditReferral extends Component {
    state = {
        loading: true,
        referral: {}
    }
    componentDidMount = () => {
        this.setState({ loading: true });
        let referral_id = 0;
        if (typeof this.props.match.params.referral_id !== "undefined") {
            referral_id = this.props.match.params.referral_id;
        }
        axios.get("/api/referrals_data/" + referral_id).then((res) => {
            this.setState({
                loading: false,
                referral: res.data
            });
        });
    }
    updateField = (name, val) => {
        const { referral }  = this.state;
        referral[name] = val;
        this.setState({ referral });
    }
    update = () => {
        const { referral } = this.state;

        this.setState({ loading: true });

        axios.put('/api/referrals_data/' + referral.id, {
            first_name: referral.first_name,
            last_name: referral.last_name,
            email: referral.email,
            phone: referral.phone
        }).then((res) => {
            message.success(F.translate(`Referral has been updated successfully.`));
            this.setState({ loading: false }, () => {
                this.props.history.push('/referrals');
            })
        })
    }
    render() {

        const { loading, referral } = this.state;
        const updateField = this.updateField;

        return (
            <div>
                <Card type="inner" title={<Translate text={`Edit Referral`} />} loading={loading}>
                    <Row gutter={16}>
                        <Col md={12} span={24}>
                            <div className="inputField">
                                <label><Translate text={`First Name`} />:</label>
                                <Input value={referral.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
                            </div>
                        </Col>
                        <Col md={12} span={24}>
                            <div className="inputField">
                                <label><Translate text={`Last Name`} />:</label>
                                <Input value={referral.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
                            </div>
                        </Col>
                        <Col md={12} span={24}>
                            <div className="inputField">
                                <label><Translate text={`Email`} />:</label>
                                <Input value={referral.email} onChange={(e) => updateField('email', e.target.value)} />
                            </div>
                        </Col>
                        <Col md={12} span={24}>
                            <div className="inputField">
                                <label><Translate text={`Phone`} />:</label>
                                <Input value={referral.phone} onChange={(e) => updateField('phone', e.target.value)} />
                            </div>
                        </Col>
                    </Row>
                    <div className="right-align">
                        <Button type="primary" onClick={this.update.bind(this)}>
                            <Translate text={`Edit Referral`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
}

export default EditReferral;
