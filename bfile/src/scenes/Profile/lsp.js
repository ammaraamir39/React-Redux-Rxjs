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
    Switch,
    Collapse
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';

const Option = Select.Option;
const { TextArea } = Input;
const { Panel } = Collapse;

class Profile extends Component {
    state = {
        pass_loading: false
    }
    copyToClipboard = (e) => {
        window.document.getElementById("linkTextarea").select();
        window.document.execCommand('copy');
        window.document.getElementById("linkTextarea").focus();
        message.success('Copied!');
    }
    render() {

        const {
            loading,
            user,
            updateField,
            update
        } = this.props;

        let link = "";
        if (user.user_agency_assoc.length > 0) {
            link = "https://bfilesystem.com/app/create-bfile/" + user.user_agency_assoc[0].agency_id + "/" + user.id;
        }

        let calendly_connect = "https://auth.calendly.com/oauth/authorize?client_id=TOmzViVrU2VxnA9XAxFyLwRBJB3wFqZso2Y45b3BlEA&response_type=code&redirect_uri=https://bfilesystem.com/api/auth/calendly";

        if (window.location.host === 'beta.bfilesystem.com') {
            calendly_connect = "https://auth.calendly.com/oauth/authorize?client_id=hUALsvqvT91JNB8crNJiAhQZGwRB09jriZsLfXfhG_E&response_type=code&redirect_uri=https://beta.bfilesystem.com/api/auth/calendly";
        }

        return (
            <div>
                <Card type="inner" title={<Translate text={`Personal Information`} />} loading={loading} style={{marginBottom: 20}}>
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
                                    <label><Translate text={`Language`} />:</label>
                                    <Select defaultValue={user.language} style={{ width: '100%' }} onChange={(value) => updateField('language', value)}>
                                        <Option value={''}><Translate text={`Select Language`} />...</Option>
                                        <Option value="en"><Translate text={`English`} /></Option>
                                        <Option value="es"><Translate text={`Spanish`} /></Option>
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={24}>
                                <div className="inputField">
                                <label><Translate text={`Virtual Meeting Link (Zoom, WebEx etc.)`} />:</label>
                                    <Input value={user.virtual_link} onChange={(e) => updateField('virtual_link', e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        
                        {!this.props.has_calendly ? (
                            <div>
                                <h2><Translate text={`Connect Calendly`} /></h2>
                                <a href={calendly_connect}>
                                    <Button>
                                        Connect Calendly
                                    </Button>
                                </a>
                                <br/>
                                <br/>
                            </div>
                        ) : (
                            <div>
                                <h2><Translate text={`Connect Calendly`} /></h2>
                                <Button onClick={() => this.props.logoutCalendly()}>
                                    Logout
                                </Button>
                                <br/>
                                <br/>
                            </div>
                        )}

                        {this.props.has_calendly ? (
                            <div>
                                <h2><Translate text={`Calendly Settings`} /></h2>
                                <Row gutter={16}>
                                    <Col md={12} span={24}>
                                        <div className="inputField">
                                            <label><Translate text={`RS Setup Appointment Event Type`} />:</label>
                                            <Select defaultValue={user.calendly_rs_setup_appointment} style={{ width: '100%' }} onChange={(value) => updateField('calendly_rs_setup_appointment', value)}>
                                                <Option value={''}><Translate text={`Select Event Type`} />...</Option>
                                                {this.props.calendly_event_types.map((event_type, i) => (
                                                    <Option key={i} value={"https://api.calendly.com/event_types/"+event_type.id}>{event_type.attributes.name}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ) : null}

                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Appointment Hours`} />:</label>
                                    <Collapse>
                                        {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((day, i) => (
                                            <Panel header={day} key={i}>
                                                <div className="checkboxes">
                                                    {this.props.appointment_hours[day].map((hour, h) => (
                                                        <span key={day + '_' + hour.value}>
                                                            <Checkbox checked={hour.checked} onChange={(e) => this.props.update_appointment_hours(day, h, e.target.checked)}>
                                                                <span style={{display: 'inline-block', minWidth: 75}}>
                                                                    {hour.value}
                                                                </span>
                                                            </Checkbox>
                                                        </span>
                                                    ))}
                                                </div>
                                            </Panel>
                                        ))}
                                    </Collapse>
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
                {link !== "" ? (
                    <Card type="inner" title={<Translate text={`External B-File Creation Link`} />}>
                        <div>
                            <p>This link will allow your customers to fill out the B-File on their own time.</p>
                            <TextArea
                                id="linkTextarea"
                                prefix={<Icon type="link" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                value={link}
                                style={{marginBottom: 10}}
                            />
                            <div className="right">
                                <Button onClick={() => this.copyToClipboard()}>
                                    Copy Link
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : null}
            </div>
        );

    }
}

export default Profile;
