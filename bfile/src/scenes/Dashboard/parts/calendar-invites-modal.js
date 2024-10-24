import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Modal,
    List
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';


class DashModal extends Component {
    state = {
        loading: true,
        invites: [],
        calendar_invites: []
    }
    componentDidMount = async () => {
        this.setState({ loading: true });
        var res = await axios.get('/api/user_calendar_invite_past');
        var res1 = await axios.get('/api/calendly/calendar_invites_past');
        this.setState({
            invites: res.data,
            loading: false,
            calendar_invites: res1.data
        })
    }
    render() {

        const { loading, invites, calendar_invites } = this.state;

        var all_calendar_invites = calendar_invites.concat(invites);

        all_calendar_invites = all_calendar_invites.sort((a, b) => new moment(a.date).format('YYYYMMDDHHmmss') - new moment(b.date).format('YYYYMMDDHHmmss'))

        return (
            <Modal
                title={<Translate text={`Past Appointments`} />}
                visible={this.props.showModal}
                onCancel={this.props.hideModal}
                footer={null}
            >
                <div className="formBox">
                    <List
                        loading={loading}
                        itemLayout="horizontal"
                        dataSource={all_calendar_invites}
                        renderItem={item => (
                            <Link to={'/customer/' + item.bfile_id}>
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.customer_name}
                                        description={(<div><Translate text={`Agency`} /> {item.agency_name}</div>)}
                                    />
                                    <div>
                                        <Icon type="clock-circle-o" style={{ marginRight: 10 }} />
                                        {moment(item.date).format('MM/DD/YYYY hh:mmA')}
                                    </div>
                                </List.Item>
                            </Link>
                        )}
                    />
                </div>
            </Modal>
        )
    }
}

export default DashModal;
