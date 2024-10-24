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

class OrderHistory extends Component {
    state = {
        loading: true,
        order_history: [],
        page: 1,
        total_pages: 0
    }
    componentDidMount = () => {
        this.loadOrderHistory(1);
    }
    loadOrderHistory = (page) => {
        const api = '/api/tango/order_history?page=' + page;
        this.setState({ loading: true });
        axios.get(api).then((res) => {
            const order_history = res.data.orders;
            this.setState({
                loading: false,
                page: page,
                total_pages: res.data.page.totalCount,
                order_history
            });
        });
    }
    resend = (order_id) => {
        this.setState({ loading: true });
        axios.post("/api/tango/resend_reward_email", {order_id}).then((res) => {
            if (typeof res.data.errors !== "undefined" && res.data.errors.length > 0) {
                this.setState({ loading: false });
                for (let i = 0; i < res.data.errors.length; i++) {
                    message.error(res.data.errors[i].message);
                }
            } else {
                this.setState({ loading: false });
                message.success(F.translate(`Email has been successfully sent.`));
            }
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Please try again later.`));
        });
    }
    render() {

        const { loading, order_history, page, total_pages } = this.state;

        const columns = [
            {
                title: 'Delivered at',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: 'Recipient',
                dataIndex: 'recipient',
                key: 'recipient'
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount'
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
        for (let i=0; i < order_history.length; i++) {
            let item = order_history[i];

            data.push({
                key: i,
                date: moment(item.createdAt).format('MM/DD/YYYY hh:mmA'),
                recipient: item.recipient.firstName+" "+item.recipient.lastName+" ("+item.recipient.email+")",
                amount: F.dollar_format(item.amount_charged.value),
                action: (
                    <div className="right-align">
                        <Button style={{marginLeft: 10}} type="primary" ghost onClick={() => this.resend(item.order_id)}>
                            <Translate text={`Resend Email`} />
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
                        <div style={{paddingTop:7}}>
                            <Icon type="team" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Order History`} />
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
                        this.loadOrderHistory(page);
                    }} />
                </Card>
            </div>
        );

    }
}

export default OrderHistory;
