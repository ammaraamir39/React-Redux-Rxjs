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

class Referrals extends Component {
    state = {
        loading: true,
        referrals: [],
        page: 1,
        total_pages: 0,
        tango_card_amount: null
    }
    componentDidMount = () => {
        this.loadReferrals(1);
        axios.get("/api/tango/user_data").then((res) => {
            this.setState({ tango_card_amount: res.data.tango_card_amount });
        });
    }
    loadReferrals = (page) => {
        const api = '/api/referrals_data?page=' + page +'&q={"filters":[{"name":"status","op":"==","val":3},{"name":"bfile","op":"has","val":{"name":"deleted","op":"==","val":0}}]}';

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
    approve = (ref) => {
        this.setState({ loading: true });
        axios.post("/api/tango/send_gift_card", {
            first_name: ref.bfile.first_name,
            last_name: ref.bfile.last_name,
            email: ref.bfile.email
        }).then((res) => {
            if (typeof res.data.errors !== "undefined" && res.data.errors.length > 0) {
                this.setState({ loading: false });
                for (let i = 0; i < res.data.errors.length; i++) {
                    message.error(res.data.errors[i].message);
                }
            } else {
                axios.put("/api/referrals_data/" + ref.id, {
                    status: 1,
                    amount_paid: this.state.tango_card_amount
                }).then((res) => {
                    message.success(F.translate(`Referral payout has been approved.`));
                    this.setState({ loading: false });
                    this.loadReferrals(1);
                }).catch(() => {
                    this.setState({ loading: false });
                    message.error(F.translate(`Please try again later.`));
                });
            }
        });
    }
    deny = (ref) => {
        this.setState({ loading: true });
        axios.put("/api/referrals_data/" + ref.id, {
            status: 2
        }).then((res) => {
            this.setState({ loading: false });
            message.success(F.translate(`Referral payout has been denied.`));
            this.loadReferrals(1);
        }).catch(() => {
            message.error(F.translate(`Can\'t deny the referral payout.`));
            this.setState({ loading: false });
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
                title: '',
                dataIndex: 'action',
                key: 'action'
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
                action: (
                    <div className="right-align">
                        <Button style={{marginLeft: 10}} type="primary" ghost onClick={() => this.approve(referral)}>
                            <Icon type="plus" /> <Translate text={`Approve`} />
                        </Button>
                        <Button style={{marginLeft: 10}} type="danger" ghost onClick={() => this.deny(referral)}>
                            <Icon type="minus" /> <Translate text={`Deny`} />
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
                            <Translate text={`Referral Payouts`} />
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

export default Referrals;
