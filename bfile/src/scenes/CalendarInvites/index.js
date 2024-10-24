import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';

class CalendarInvites extends Component {
    state = {
        loading: true,
        invites: []
    }
    componentDidMount = () => {
        axios.get('/api/user_calendar_invite').then((res) => {
            this.setState({
                invites: res.data,
                loading: false
            })
        })
    }
    render() {

        const { loading, invites } = this.state;

        const columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: 'Customer Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Agency Name',
                dataIndex: 'agency_name',
                key: 'agency_name'
            },
            {
                title: '',
                dataIndex: 'action',
                key: 'action'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i=0; i<invites.length; i++) {
            let invite = invites[i];

            data.push({
                key: i,
                date: moment(invite.date).format('MM/DD/YYYY hh:mmA'),
                name: invite.customer_name,
                agency_name: invite.agency_name,
                action: (
                    <Button onClick={() => this.view(invite.bfile_id)}><Translate text={`View`} /></Button>
                )
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="folder" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Calendar Invites`} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered={false}
                        pagination={false}
                    />
                </Card>
            </div>
        );

    }
}

export default CalendarInvites;
