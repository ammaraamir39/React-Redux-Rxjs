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
import SendReferralLink from './send-referral-link-modal';
import { Translate } from 'react-translated';

class Referrals extends Component {
    state = {
        loading: true,
        referrals: [],
        page: 1,
        total_pages: 0,
        user: this.props.auth.user,
        send_referral_link: false
    }
    componentDidMount = () => {
        this.loadReferrals(1);
    }
    loadReferrals = (page) => {
        const api = '/api/referrals_data?page='+page+'&q={"filters":[{"name":"status","op":"==","val":0}]}';

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
        axios.put("/api/referrals_data/" + ref.id, {
            status: 3
        }).then((res) => {
            axios.post("/api/b_file", {
                first_name: ref.first_name,
                last_name: ref.last_name,
                email: ref.email,
                phone: ref.phone,
                agency_id: ref.agency_id,
                user_id: ref.bfile.user_id,
                spouse_first_name: "",
                spouse_last_name: "",
                asset_accounts: "[]",
                asset_401k_accounts: "[]",
                is_lead: 1,
                birthday: "",
                address: "",
                address_cont: "",
                city: "",
                state: "",
                zipcode: "",
                rollover_dollars_created: 0,
                children: null,
                primary_vehicles_num: null
            });
            this.setState({ loading: false });
            message.success(F.translate(`The referral has been approved.`));
            this.loadReferrals(1);
        }).catch(() => {
            message.error(F.translate(`Can\'t approve the referral.`));
            this.setState({ loading: false });
        });
    }
    deny = (ref) => {
        this.setState({ loading: true });
        axios.put("/api/referrals_data/" + ref.id, {
            status: 2
        }).then((res) => {
            this.setState({ loading: false });
            message.success(F.translate(`Referral has been denied.`));
            this.loadReferrals(1);
        }).catch(() => {
            message.error(F.translate(`Can\'t deny the referral.`));
            this.setState({ loading: false });
        });
    }
    render() {

        const { loading, referrals, page, total_pages, user } = this.state;

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
                        <Link to={'/referrals/edit/' + referral.id}>
                            <Button><Icon type="edit" /> <Translate text={`Edit`} /></Button>
                        </Link>
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
                            <Translate text={`Referrals`} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <Button onClick={() => this.setState({ send_referral_link: true })}>
                            <Icon type="mail" /> <Translate text={`Send Referral Link`} />
                        </Button>
                    }
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
                <SendReferralLink
                    showModal={this.state.send_referral_link}
                    hideModal={() => this.setState({ send_referral_link: false })}
                    user={user}
                />
            </div>
        );

    }
}

export default Referrals;
