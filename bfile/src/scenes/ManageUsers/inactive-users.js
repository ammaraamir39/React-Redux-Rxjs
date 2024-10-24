import React, { Component } from 'react';
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
import Cookies from 'js-cookie';

class InactiveUsers extends Component {
    state = {
        loading: true,
        users: [],
        user: {}
    }
    componentDidMount = () => {
        this.loadUsers(1);
    }
    loadUsers = (page) => {
        const users_list = [];
        let api = ''
        let user = JSON.parse(Cookies.get('user_info'))
        if (user.user_type == 'SUPER_ADMIN') {

            api = "/api/inactive_users_sa";
        } else {
            api = "/api/inactive_users";
        }
        

        this.setState({ loading: true });

        axios.get(api).then((res) => {
            const users = res.data.results;
            this.setState({ loading: false, users });
        });
    }
    enable = (id) => {
        this.setState({ loading: true });
        axios.put("/api/users/" + id, {
            active: 1
        }).then(() => {
            message.success(F.translate(`User has been enabled.`));
            this.setState({ loading: false }, () => {
                this.loadUsers(1);
            });
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Can't enable the user.`));
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
                action: (
                    <div className="right-align">
                    <Link to={'/manage-users/edit-user/' + user.id}>
                        <Button><Icon type="edit" /> <Translate text={`Edit User`} /></Button>
                    </Link>
                    <Button type="primary" onClick={() => this.enable(user.id)} style={{ marginLeft: 10 }}>
                        <Icon type="plus" /> <Translate text={`Enable User`} />
                    </Button>
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
                            <Translate text={`Inactive Users`} />
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

export default InactiveUsers;
