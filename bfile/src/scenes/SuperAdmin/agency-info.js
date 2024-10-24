import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Popconfirm,
    Button,
    message,
    List
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Translate } from 'react-translated';

class AgencyInfo extends Component {
    state = {
        loading: true,
        agency: {}
    }
    componentDidMount = () => {
        if (typeof this.props.match.params.agency_id !== "undefined") {
            const agency_id = this.props.match.params.agency_id;
            axios.get("/api/admin_feed/" + agency_id).then((res) => {
                this.setState({
                    loading: false,
                    agency: res.data
                });
            });
        } else {
            this.props.history.push('/404');
        }
    }
    switchUser = (user) => {
        this.setState({ loading: true });
        axios.post("/api/switchuser/"+user.id).then((res) => {
            this.setState({ loading: false });
            if (res.data.success) {
                const user = res.data.user;
                Cookies.set("user_info", JSON.stringify({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    id: user.id,
                    user_type: user.user_type,
                    default_date: user.default_date,
                    last_login: user.last_login,
                    language: user.language
                }));
                this.props.history.push('/dashboard');
            } else {
                message.error(F.translate(`Can't switch to the user.`));
            }
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Can't switch to the user.`));
        });
    }
    render() {

        const { loading, agency } = this.state;

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
                title: 'User Type',
                dataIndex: 'user_type',
                key: 'user_type'
            },
            {
                title: 'Last Login',
                dataIndex: 'last_login',
                key: 'last_login'
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
        let agencyInfoList = [];
        let subscriptionList = [];
        let statsList = [];

        if ("efs" in agency && "lsp" in agency) {
            for (let i=0; i<agency.efs.length; i++) {
                let user = agency.efs[i];

                data.push({
                    key: i,
                    last_login: moment(user.last_login).format('MM/DD/YYYY hh:mmA'),
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: F.phone_format(user.phone),
                    user_type: 'EFS',
                    action: (
                        <div className="right-align">
                            <Button onClick={() => this.switchUser(user)} style={{marginLeft:10}}><Icon type="export" /> Switch User</Button>
                        </div>
                    )
                })
            }
            for (let i=0; i<agency.lsp.length; i++) {
                let user = agency.lsp[i];

                data.push({
                    key: i,
                    last_login: moment(user.last_login).format('MM/DD/YYYY hh:mmA'),
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: F.phone_format(user.phone),
                    user_type: 'LSP',
                    action: (
                        <div className="right-align">
                            <Button onClick={() => this.switchUser(user)} style={{marginLeft:10}}><Icon type="export" /> Switch User</Button>
                        </div>
                    )
                })
            }
            agencyInfoList = [
                {
                    name: 'Name',
                    value: agency.primary.first_name
                },
                {
                    name: 'Phone',
                    value: F.phone_format(agency.primary.phone)
                },
                {
                    name: 'Agency',
                    value: agency.name
                },
                {
                    name: 'Agency ID',
                    value: agency.id
                },
                {
                    name: 'Email',
                    value: agency.primary.email
                },
                {
                    name: 'Address',
                    value: agency.address || agency.primary.address
                },
                {
                    name: '',
                    value: (
                        <div className="right-align">
                            <Button onClick={() => this.switchUser(agency.primary)} style={{marginLeft:10}}><Icon type="export" /> Switch User</Button>
                        </div>
                    )
                },
            ];
            subscriptionList = [
                {
                    name: 'Active?',
                    value: (agency.active) ? 'True' : 'False'
                },
                {
                    name: 'Stripe ID',
                    value: agency.primary.stripe_subscription_id
                },
                {
                    name: 'Subscription On',
                    value: moment(agency.primary.created_on).format('MM/DD/YYYY hh:mmA'),
                },
                {
                    name: 'Last Login',
                    value: moment(agency.primary.last_login).format('MM/DD/YYYY hh:mmA')
                },
            ];
            statsList = [
                {
                    name: 'Tango card balance',
                    value: F.dollar_format(agency.primary.tango_account_balance || 0)
                },
                {
                    name: 'Total BFiles',
                    value: agency.stats.count
                },
                {
                    name: 'Total Saved for Later',
                    value: agency.stats.saved_for_later
                },
                {
                    name: 'Sent for Immediate Attention',
                    value: agency.stats.need_attention
                },
                {
                    name: 'Sent for Welcome Call',
                    value: agency.stats.sent_to_ea
                },
                {
                    name: 'Sent for Introduction to Financial Specialist',
                    value: agency.stats.sent_to_efs
                }
            ];
        }


        return (
            <div>
                <Row gutter={16}>
                    <Col md={13} span={24}>
                        <div style={{marginBottom: 20}}>
                            <Card
                                type="inner"
                                title={
                                    <div style={{paddingTop:7}}>
                                        <Translate text={`Agency Owner Account Details`} />
                                    </div>
                                }
                                className="listCard"
                                loading={loading}
                            >
                                <List
                                    loading={loading}
                                    itemLayout="horizontal"
                                    dataSource={agencyInfoList}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta title={item.name} description={item.value} />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>
                    </Col>
                    <Col md={11} span={24}>
                        <div style={{marginBottom: 20}}>
                            <Card
                                type="inner"
                                title={
                                    <div style={{paddingTop:7}}>
                                        <Translate text={`Subscription Details`} />
                                    </div>
                                }
                                className="listCard"
                                loading={loading}
                            >
                                <List
                                    loading={loading}
                                    itemLayout="horizontal"
                                    dataSource={subscriptionList}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta title={item.name} description={item.value} />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>
                    </Col>
                </Row>
                <div style={{marginBottom: 20}}>
                    <Card
                        type="inner"
                        title={
                            <div style={{paddingTop:7}}>
                                <Translate text={`Linked Users`} />
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
                <div style={{marginBottom: 20}}>
                    <Card
                        type="inner"
                        title={
                            <div style={{paddingTop:7}}>
                                <Translate text={`Stats`} />
                            </div>
                        }
                        className="listCard"
                        loading={loading}
                    >
                        <List
                            loading={loading}
                            itemLayout="horizontal"
                            dataSource={statsList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.name} description={item.value} />
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
            </div>
        );

    }
}

export default AgencyInfo;
