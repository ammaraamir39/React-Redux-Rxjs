import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Card,
    Timeline,
    Popconfirm,
    Spin,
    Button
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';
import PastAppointments from './calendar-invites-modal';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class CalendarInvites extends Component {
    state = {
        invites: [],
        calendar_invites: [],
        loading: false,
        past_appointments_modal: false
    }
    componentDidMount = () => {
        this.loadCalendarInivtes();
    }
    loadCalendarInivtes = async () => {
        this.setState({ loading: true });
        var res = await axios.get('/api/user_calendar_invite');
        var res1 = await axios.get('/api/calendly/calendar_invites');
        this.setState({
            invites: res.data,
            loading: false,
            calendar_invites: res1.data
        })
    }
    deleteCalendar = (id) => {
        this.setState({ loading: true });
        axios.put('/api/calendar_invite/'+id, {hide: 1}).then((res) => {
            this.loadCalendarInivtes();
        })
    }
    render() {
        const { invites, calendar_invites, loading } = this.state;
        return (
            <div className="calendar-invites" style={{marginBottom: 10}}>
                <Card title={
                    <div>
                        <Icon type="calendar" style={{marginRight: 10,color:"#1890ff"}} />
                        <Translate text={`Calendar Invites`} />
                    </div>
                } bordered={false}>
                    <Spin indicator={antIcon} spinning={loading}>
                        <div style={{ maxHeight: 350, overflow: 'auto', marginBottom: 20 }}>
                            <Timeline>
                                {calendar_invites.concat(invites).map((item, i) => (
                                    <Timeline.Item key={i}>
                                        <div>
                                            <Link to={"/customer/" + item.bfile_id} className="invite inviteLink">
                                                {item.customer_name}
                                            </Link>
                                            {item.id ? (
                                                <Popconfirm placement="topRight" title={<Translate text={`Do you really want to delete this calendar invite?`} />} onConfirm={() => this.deleteCalendar(item.id)} okText="Yes" cancelText="No">
                                                    <a className="inviteLink"><Icon type="delete" /></a>
                                                </Popconfirm>
                                            ) : null}
                                        </div>
                                        <div className="date"><Translate text={`Date`} />: {moment(new Date(item.date)).format('MM/DD/YYYY hh:mm a')}</div>
                                        <div className="agency"><Translate text={`Agency`} />: {item.agency_name}</div>
                                        {item.appointment_type ? (
                                            <div className="appointment_type"><Translate text={`Appointment Type`} />: {item.appointment_type}</div>
                                        ) : null}
                                    </Timeline.Item>
                                ))}
                                {invites.length === 0 && calendar_invites.length === 0 ? (
                                    <div className="notfound">
                                        <Translate text={`No Invites Found`} />
                                    </div>
                                ) : null}
                            </Timeline>
                        </div>
                        <Button onClick={() => this.setState({ past_appointments_modal: true })}>Past Appointments</Button>
                    </Spin>
                </Card>
                <PastAppointments
                    showModal={this.state.past_appointments_modal}
                    hideModal={() => this.setState({ past_appointments_modal: false })}
                />
            </div>
        )
    }
}

export default CalendarInvites;
