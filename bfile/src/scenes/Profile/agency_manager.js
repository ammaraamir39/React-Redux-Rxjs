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
    message,
    Select,
    Switch
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';
import AddressField from '../../components/address-field';

const Option = Select.Option;

class AgencyManagerProfile extends Component {

    state = {
        agencies: []
    }
    componentDidMount = () => {
        axios.get(`/api/am_agencies_assoc/${this.props.user.id}`).then((res) => {
            console.log("Data = > ", res.data)
            this.setState({
                agencies: res.data
            })
        })
    }

    showAgencies = () => {
        this.state.agencies ? this.state.agencies.map((agency) => (
            <div>

            </div>
        )) : (
            <div>No Agencies Found</div>
        )
    }

    render() {

        const {
            loading,
            user,
            updateField,
            update
        } = this.props;
        console.log("User = > ", user)
        return (
            <div>
                <Card type="inner" title={<Translate text={`Personal Information`} />} loading={loading}>
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
                            {/* <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Email`} />:</label>
                                    <Input value={user.email} onChange={(e) => updateField('email', e.target.value)} />
                                </div>
                            </Col> */}
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Company Name`} />:</label>
                                    <Input value={user.company_name} onChange={(e) => updateField('company_name', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Phone`} />:</label>
                                    <Input value={user.phone} onChange={(e) => updateField('phone', e.target.value)} />
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Mobile`} />:</label>
                                    <Input value={user.mobile_number} onChange={(e) => updateField('mobile_number', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Address`} />:</label>
                                    <AddressField value={user.address}
                                        onChange={(val) => updateField('address', val)}
                                        setCity={(val) => updateField('city', val)}
                                        setState={(val) => updateField('state', val)}
                                        setZipCode={(val) => updateField('zipcode', val)}
                                    />
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


                        <h2><Translate text={`Update Password`} /></h2>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <Button onClick={() => this.props.requestPassword()}><Translate text={`Request a new Password`} /></Button>
                                </div>
                            </Col>
                        </Row>

                        <h2><Translate text={`Agencies Associated`} /></h2>
                        {this.state.agencies ? (<ul><span className='custom_hk'>{
                            this.state.agencies.map(agency => {
                                return (
                                    <li>
                                        {agency.agency_name}
                                    </li>
                                )
                            })
                        }</span></ul>) : (<div>No Agencies Found</div>)}
                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={update.bind(this)}>
                            <Translate text={`Edit User`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
}

export default AgencyManagerProfile;
