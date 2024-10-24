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

class TangoAccounts extends Component {
    state = {
        loading: true,
        accounts: []
    }
    componentDidMount = () => {
        this.loadAccounts();
    }
    loadAccounts = () => {
        const api = '/api/tango_accounts';

        this.setState({ loading: true });

        axios.get(api).then((res) => {
            this.setState({
                loading: false,
                accounts: res.data
            });
        });
    }
    render() {

        const { loading, accounts, user } = this.state;

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
                title: 'Tango Identifier',
                dataIndex: 'tango_identifier',
                key: 'tango_identifier'
            },
            {
                title: 'Tango Customer',
                dataIndex: 'tango_customer',
                key: 'tango_customer'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i=0; i < accounts.length; i++) {
            let account = accounts[i];

            data.push({
                key: i,
                name: account.name,
                email: account.email,
                tango_identifier: account.tango_identifier,
                tango_customer: account.tango_customer
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="star-o" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Tango Accounts`} />
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

export default TangoAccounts;
