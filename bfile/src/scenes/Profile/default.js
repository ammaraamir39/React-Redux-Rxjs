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

class Profile extends Component {
    render() {

        const {
            loading,
            user,
            card,
            agency,
            updateField,
            updateCCField,
            updateAgencyField,
            change_payment_method,
            update
        } = this.props;

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
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Timezone`} />:</label>
                                    <Select defaultValue={user.timezone} style={{ width: '100%' }} onChange={(value) => updateField('timezone', value)}>
                                        <Option value={''}><Translate text={`Select Timezone`} />...</Option>
                                        <Option value="US/Samoa"><Translate text={`Samoa Time Zone`} /> (-11:00)</Option>
                                        <Option value="US/Hawaii"><Translate text={`Hawaii-Aleutian Time Zone`} /> (-10:00)</Option>
                                        <Option value="US/Alaska"><Translate text={`Alaska Time Zone`} /> (-09:00)</Option>
                                        <Option value="US/Pacific"><Translate text={`Pacific Time Zone`} /> (-08:00)</Option>
                                        <Option value="US/Mountain"><Translate text={`Mountain Time Zone`} /> (-07:00)</Option>
                                        <Option value="US/Central"><Translate text={`Central Time Zone`} /> (-06:00)</Option>
                                        <Option value="US/Eastern"><Translate text={`Eastern Time Zone`} /> (-05:00)</Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Welcome/Thank You Calls Default Date`} />:</label>
                                    <Select defaultValue={user.default_date} style={{ width: '100%' }} onChange={(value) => updateField('default_date', value)}>
                                        <Option value={null}><Translate text={`Select Default Date`} />...</Option>
                                        <Option value={0}><Translate text={`Immediately`} /></Option>
                                        <Option value={5}>5 <Translate text={`days`} /></Option>
                                        <Option value={10}>10 <Translate text={`days`} /></Option>
                                        <Option value={15}>15 <Translate text={`days`} /></Option>
                                        <Option value={20}>20 <Translate text={`days`} /></Option>
                                        <Option value={25}>25 <Translate text={`days`} /></Option>
                                        <Option value={30}>30 <Translate text={`days`} /></Option>
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Language`} />:</label>
                                    <Select defaultValue={user.language} style={{ width: '100%' }} onChange={(value) => updateField('language', value)}>
                                        <Option value={''}><Translate text={`Select Language`} />...</Option>
                                        <Option value="en"><Translate text={`English`} /></Option>
                                        <Option value="es"><Translate text={`Spanish`} /></Option>
                                    </Select>
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
                        <h2><Translate text={`Notifications`} /></h2>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <Switch checked={user.email_cron_notification ? true : false} onChange={(checked) => updateField('email_cron_notification', (checked) ? 1 : 0 )} />
                                    <span style={{marginLeft:10}}><Translate text={`Reminder Notifications`} /></span>
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <Switch checked={user.email_game_notification ? true : false} onChange={(checked) => updateField('email_game_notification', (checked) ? 1 : 0 )} />
                                    <span style={{marginLeft:10}}><Translate text={`Gamification Notifications`} /></span>
                                </div>
                            </Col>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                    <Switch checked={user.email_sale_notification ? true : false} onChange={(checked) => updateField('email_sale_notification', (checked) ? 1 : 0 )} />
                                    <span style={{marginLeft:10}}><Translate text={`Sale Notifications`} /></span>
                                </div>
                            </Col>
                        </Row>
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

export default Profile;
