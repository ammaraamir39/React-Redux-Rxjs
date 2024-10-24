import React, { Component } from 'react';
import Cookies from 'js-cookie'
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button,
    Popconfirm,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';

class InvitedUsers extends Component {
    state = {
        loading: true,
        users: [],
        user: {}
    }
    componentDidMount = () => {
        this.loadUsers(1);
    }
    loadUsers = (page) => {
        let user = JSON.parse(Cookies.get('user_info'))
        const users_list = [];
        let api = ''
        if (user.user_type === 'SUPER_ADMIN') {

            api = "/api/invited_users_sa";
        } else {
            api = "/api/invited_users";
        }


        this.setState({ loading: true });

        axios.get(api).then((res) => {
            const users = res.data.results;
            this.setState({ loading: false, users });
        });
    }
    resend = (id, email) => {
        this.setState({ loading: true });
        axios.get("/api/reinvite/" + id).then(() => {
            this.setState({ loading: false });
            message.success("Your invitation request has been successfully sent to " + email);
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Invite not sent.`));
        });
    }
    delete = (id) => {
        this.setState({ loading: true });
        axios.put("/api/users/" + id, {
            registration_token: null
        }).then(() => {
            message.success(F.translate(`The invitation request has been removed.`));
            this.setState({ loading: false }, () => {
                this.loadUsers(1);
            });
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Invite not removed.`));
        });
    }
   
    render() {

        const { loading, users } = this.state;

        const columns = [
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name'
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'User Type',
                dataIndex: 'user_type',
                key: 'user_type'
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
        for (let i = 0; i < users.length; i++) {
            let user = users[i];

            data.push({
                key: i,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                user_type: user.user_type,
                action: (
                    <div className="right-align">
                    <Button onClick={() => this.resend(user.id, user.email)}><Icon type="mail" /> <Translate text={`Resend`} /></Button>
                    <Popconfirm placement="topRight" title={<Translate text={`Do you really want to delete this invite?`} />} onConfirm={() => this.delete(user.id)} okText={<Translate text={`Yes`} />} cancelText={<Translate text={`No`} />}>
                        <Button style={{ marginLeft: 10 }} type="danger" ghost>
                            <Icon type="delete" /> <Translate text={`Delete`} />
                        </Button>
                    </Popconfirm>
                </div>
                )
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{ paddingTop: 7 }}>
                            <Icon type="team" style={{ marginRight: 10, color: "#1890ff" }} />
                            <Translate text={`Invited Users`} />
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

export default InvitedUsers;
