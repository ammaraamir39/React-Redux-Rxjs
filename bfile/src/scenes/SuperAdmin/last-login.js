import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';

class LastLogin extends Component {
    state = {
        loading: true,
        ea_users: [],
        lsp_users: [],
        efs_users: []
    }
    componentDidMount = () => {
        this.loadStats();
    }
    loadStats = (page) => {
        const ea_users = [];
        const lsp_users = [];
        const efs_users = [];
        this.setState({ loading: true });
        axios.get("/api/admin/last_login").then((res) => {
            this.setState({ loading: false });
            for (var i = 0; i < res.data.length; i++) {
                res.data[i].last_login_days = moment(res.data[i].last_login).fromNow(true);
                if (res.data[i].user_type === "EA") {
                    ea_users.push(res.data[i]);
                }
                if (res.data[i].user_type === "LSP") {
                    lsp_users.push(res.data[i]);
                }
                if (res.data[i].user_type === "EFS") {
                    efs_users.push(res.data[i]);
                }
            }
            this.setState({ ea_users, lsp_users, efs_users })
        }).catch(() => {
            this.setState({ loading: false });
        });
    }
    download = () => {
        this.setState({ loading: true });
        axios.get("/api/admin/download/last_login").then((res) => {
            this.setState({ loading: false });
            if (res.data.success) {
                window.location = "/bfile/assets/files/last_login/"+res.data.token+".csv";
            } else {
                message.error(F.translate(`Can't download the csv.`));
            }
        });
    }
    render() {

        const { loading, ea_users, lsp_users, efs_users } = this.state;

        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: 'Agency',
                dataIndex: 'agency_name',
                key: 'agency_name'
            },
            {
                title: 'Total B-Files Created',
                dataIndex: 'total_bfiles',
                key: 'total_bfiles'
            },
            {
                title: 'Last Login',
                dataIndex: 'last_login',
                key: 'last_login'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data_ea = [];
        for (let i=0; i < ea_users.length; i++) {
            let user = ea_users[i];
            data_ea.push({
                key: i,
                name: user.first_name+' '+user.last_name,
                email: user.email,
                phone: user.phone,
                agency_name: user.agency_name,
                total_bfiles: user.bfile_count,
                last_login: user.last_login + ' (' + user.last_login_days + ')'
            })
        }

        const data_lsp = [];
        for (let i=0; i < lsp_users.length; i++) {
            let user = lsp_users[i];
            data_lsp.push({
                key: i,
                name: user.first_name+' '+user.last_name,
                email: user.email,
                phone: user.phone,
                agency_name: user.agency_name,
                total_bfiles: user.bfile_count,
                last_login: user.last_login + ' (' + user.last_login_days + ')'
            })
        }

        const data_efs = [];
        for (let i=0; i < efs_users.length; i++) {
            let user = efs_users[i];
            data_efs.push({
                key: i,
                name: user.first_name+' '+user.last_name,
                email: user.email,
                phone: user.phone,
                agency_name: user.agency_name,
                total_bfiles: user.bfile_count,
                last_login: user.last_login + ' (' + user.last_login_days + ')'
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="area-chart" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Last Login`} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <Button onClick={() => this.download()}>
                            <Translate text={`Download CSV`} />
                        </Button>
                    }
                >
                    <Card bordered={false}><h2><Translate text={`EA`} /></h2></Card>
                    <Table
                        columns={columns}
                        dataSource={data_ea}
                        bordered={false}
                        pagination={false}
                    />
                    <Card bordered={false}><h2><Translate text={`LSP`} /></h2></Card>
                    <Table
                        columns={columns}
                        dataSource={data_lsp}
                        bordered={false}
                        pagination={false}
                    />
                    <Card bordered={false}><h2><Translate text={`EFS`} /></h2></Card>
                    <Table
                        columns={columns}
                        dataSource={data_efs}
                        bordered={false}
                        pagination={false}
                    />
                </Card>
            </div>
        );

    }
}

export default LastLogin;
