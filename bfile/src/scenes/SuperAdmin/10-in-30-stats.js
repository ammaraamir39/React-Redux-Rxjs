import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Input,
    Table,
    Button,
    Select,
    Menu,
    Dropdown,
    DatePicker,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Pagination from '../../components/pagination';
import EditAgencyModal from './edit-agency-modal';
import EditUserModal from './edit-user-modal';
import Cookies from 'js-cookie';
import { Translate } from 'react-translated';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const today = new Date();

class Stats10in30 extends Component {
    state = {
        loading: false,
        users: [],
        page: 1,
        total_pages: 0,
        filter: "pending",
        start_date: new Date(today.getFullYear(), today.getMonth(), 1),
        end_date: new Date(today.getFullYear(), today.getMonth()+1, 1)
    }
    componentDidMount = () => {
        this.loadStats(1);
    }
    loadStats = (page) => {

        const { filter, start_date, end_date } = this.state;
        const filters = [];

        if (filter === "approved") {
            filters.push({"name":"status","op":"==","val":"1"});
        } else if (filter === "denied") {
            filters.push({"name":"status","op":"==","val":"2"});
        } else {
            filters.push({"name":"status","op":"is_null"});
        }

        const from = moment(start_date).utc().format("YYYY-MM-DD");
        const to = moment(end_date).utc().format("YYYY-MM-DD");
        filters.push({"name":"created_on","op":">=","val": from });
        filters.push({"name":"created_on","op":"<","val": to });

        this.setState({ loading: true });
        axios.get('/api/contests?q={"filters":'+JSON.stringify(filters)+'}').then((res) => {
            this.setState({
                loading: false,
                users: res.data.objects,
                page: res.data.page,
                total_pages: res.data.total_pages
            });
        });
    }
    download = () => {
        axios.post("/api/admin/contest", {
            type: 'one'
        }).then((res) => {
            if (res.data.success) {
                window.location = "/bfile/assets/files/contest/"+res.data.token+".csv";
            } else {
                message.error(F.translate(`Can't download the file.`));
            }
        });
    }
    onChangeDateRange = (date, dateString) => {
        this.setState({
            start_date: date[0],
            end_date: date[1]
        }, () => {
            this.loadStats(1);
        })
    }
    render() {

        const { loading, users, page, total_pages, start_date, end_date } = this.state;
        const dateFormat = 'MM/DD/YYYY';

        const columns = [
            {
                title: 'User Name',
                dataIndex: 'user_name',
                key: 'user_name'
            },
            {
                title: 'Agency',
                dataIndex: 'agency',
                key: 'agency'
            },
            {
                title: 'E-Mail',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Approve/Deny',
                dataIndex: 'approve_deny',
                key: 'approve_deny'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i=0; i<users.length; i++) {
            let user = users[i];

            /*data.push({
                key: i,
                agency: user.name,
                ranking: (user.ranking !== '') ? user.ranking : '-',
                first_name: user.primary.first_name,
                last_name: agency.primary.last_name,
                action: (
                    <div className="right-align">
                        <Button onClick={() => {
                            this.setState({
                                agency: agency,
                                edit_agency_modal: true,
                                current_agency_index: i
                            })
                        }}><Icon type="edit" /> Edit Agency</Button>
                        <Button onClick={() => {
                            this.setState({
                                user: agency.primary,
                                edit_user_modal: true,
                                current_agency_index: i
                            })
                        }} style={{marginLeft:10}}><Icon type="edit" /> Edit EA</Button>
                        <Button onClick={() => this.switchUser(agency.primary)} style={{marginLeft:10}}><Icon type="export" /> Switch to EA</Button>
                    </div>
                )
            })*/
        }

        const menu = (
            <Menu>
                <Menu.Item onClick={() => this.download()}>10 in 30 (New Users)</Menu.Item>
            </Menu>
        );

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="gift" style={{marginRight: 10,color:"#1890ff"}} />
                            10 in 30 Stats
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <div>
                            <Dropdown overlay={menu}>
                                <Button>Download CSV</Button>
                            </Dropdown>
                        </div>
                    }
                >
                    <Card bordered={false} className="filters">
                        <Row gutter={16}>
                            <Row gutter={16}>
                                <Col md={12} span={24}>
                                    <div>
                                        <Button onClick={() => this.setState({ filter: "pending "}, () => this.loadStats(1))}>Pending</Button>
                                        <Button onClick={() => this.setState({ filter: "approved "}, () => this.loadStats(1))} style={{marginLeft:10}}>Approved</Button>
                                        <Button onClick={() => this.setState({ filter: "denied "}, () => this.loadStats(1))}style={{marginLeft:10}}>Denied</Button>
                                    </div>
                                </Col>
                                <Col md={12} span={24}>
                                    <RangePicker
                                        value={[moment(start_date), moment(end_date)]}
                                        onChange={this.onChangeDateRange}
                                        format={dateFormat}
                                    />
                                </Col>
                            </Row>
                        </Row>
                    </Card>
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered={false}
                        pagination={false}
                    />
                    <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                        this.loadStats(page);
                    }} />
                </Card>
            </div>
        );

    }
}

export default Stats10in30;
