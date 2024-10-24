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
    message,
    Modal,
    Checkbox,
    Spin
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Pagination from '../../components/pagination';
import { Translate } from 'react-translated';

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class RSAdmin extends Component {
    state = {
        loading: true,
        users: [],
        page: 1,
        total_pages: 0,
        user: {},
        agencies_modal: false,
        agencies_modal_loading: false,
        agencies: [],
        user_agencies: [],
        search: ''
    }
    componentDidMount = () => {
        this.loadUsers(1);

        axios.get("/api/rs_all_agencies").then((res) => {
            this.setState({
                agencies: res.data
            });
        })
    }
    loadUsers = (page) => {

        const filters = [];
        filters.push({"name":"active","op":"==","val":1});
        filters.push({"name":"user_type","op":"==","val":"REVIEWSCHEDULER"});

        if (this.state.search !== "") {
            filters.push(
                {"or": [
                    {"name":"first_name","op":"like","val":encodeURIComponent("%"+this.state.search+"%")},
                    {"name":"last_name","op":"like","val":encodeURIComponent("%"+this.state.search+"%")},
                    {"name":"email","op":"like","val":encodeURIComponent("%"+this.state.search+"%")}
                ]}
            );
        }

        const api = "/api/users?page="+page+'&q={"filters":' + JSON.stringify(filters) + '}';
        this.setState({ loading: true });
        axios.get(api).then((res) => {
            this.setState({
                loading: false,
                users: res.data.objects,
                page: res.data.page,
                total_pages: res.data.total_pages
            });
        });
    }
    updateAgencyAssoc(agency_id, checked) {
        this.setState({
            agencies_modal_loading: true
        });
        var val = 0;
        if (checked) val = 1;
        axios.post("/api/update_rs_agency_assoc/" + this.state.user.id + "/" + agency_id + "/" + val).then(() => {
            this.loadUserAgencies(this.state.user.id);
        });
    }
    loadUserAgencies(user_id) {
        this.setState({
            agencies_modal_loading: true
        });
        axios.get("/api/rs_agencies_assoc/" + user_id).then((res) => {
            var agencies = [];
            for (let i = 0; i < res.data.length; i++) {
                const agency = res.data[i];
                agencies.push(agency.agency_id);
            }
            this.setState({
                agencies_modal_loading: false,
                user_agencies: agencies
            });
        });
    }
    render() {
        const { loading, users, page, total_pages } = this.state;
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
            // {
            //     title: 'Phone',
            //     dataIndex: 'phone',
            //     key: 'phone'
            // },
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
        for (let i=0; i<users.length; i++) {
            let user = users[i];

            data.push({
                key: i,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                action: (
                    <div className="right-align">
                        <Button onClick={() => {
                            this.setState({
                                agencies_modal: true,
                                user
                            }, () => {
                                this.loadUserAgencies(user.id)
                            })
                        }}><Icon type="edit" /> Agencies</Button>
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
                            Review Scheduler
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <div>
                            <Row gutter={16}>
                                <Col md={12} span={24} />
                                <Col md={12} span={24}>
                                    <Input placeholder="Search User" onChange={(e) => this.setState({ search: e.target.value })} style={{ width: '100%' }} onPressEnter={() => this.loadUsers(1)} />
                                </Col>
                            </Row>
                        </div>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered={false}
                        pagination={false}
                    />
                    <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                        this.loadUsers(page);
                    }} />
                </Card>
                {this.state.agencies_modal ? (
                    <Modal
                        title={<Translate text={`Agencies`} />}
                        visible={this.state.agencies_modal}
                        onCancel={() => this.setState({ agencies_modal: false })}
                        footer={<div>
                            <Button onClick={() => this.setState({ agencies_modal: false })}><Translate text={`Cancel`} /></Button>
                        </div>}
                    > 
                        <Spin indicator={antIcon} spinning={this.state.agencies_modal_loading}>
                            <div className="formBox">
                                {this.state.agencies.map((agency, i) => (
                                    <div key={i}>
                                        <Checkbox checked={(this.state.user_agencies.indexOf(agency.id) >= 0)} onChange={(e) => {
                                            this.updateAgencyAssoc(agency.id, e.target.checked);
                                        }}>
                                            {agency.name}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        </Spin>
                    </Modal>
                ) : null}
            </div>
        );

    }
}

export default RSAdmin;
