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
import Pagination from '../../components/pagination';
import { Translate } from 'react-translated';

class PaidReferrals extends Component {
    state = {
        loading: true,
        referrals: [],
        page: 1,
        total_pages: 0
    }
    componentDidMount = () => {
        this.loadReferrals(1);
    }
    loadReferrals = (page) => {
        const api = '/api/referrals_data?page=' + page + '&q={"filters":[{"name":"status","op":"==","val":1}]}';

        this.setState({ loading: true });

        axios.get(api).then((res) => {
            const referrals = res.data.objects;
            this.setState({
                loading: false,
                page: res.data.page,
                total_pages: res.data.total_pages,
                referrals
            });
        });
    }

    render() {

        const { loading, referrals, page, total_pages } = this.state;

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
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Amount Paid',
                dataIndex: 'amount_paid',
                key: 'amount_paid'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i=0; i < referrals.length; i++) {
            let referral = referrals[i];

            data.push({
                key: i,
                first_name: referral.first_name,
                last_name: referral.last_name,
                email: referral.email,
                phone: F.phone_format(referral.phone),
                amount_paid: F.dollar_format(referral.amount_paid)
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="team" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Paid Referrals`} />
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
                    <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                        this.loadReferrals(page);
                    }} />
                </Card>
            </div>
        );

    }
}

export default PaidReferrals;
