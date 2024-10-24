import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    DatePicker,
    Input,
    Table,
    Select,
    Button,
    Tag,
    Radio,
    Spin
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Stats from './parts/review-admin/stats';
import { Translate } from 'react-translated';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const today = new Date();
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class ReviewAdmin extends Component {
    state = {
        loading: false,
        period: 'mtd',
        start_date: new Date(today.getFullYear(), today.getMonth(), 1),
        end_date: new Date(today.getFullYear(), today.getMonth()+1, 1),
        user: this.props.auth.user,
        dashboard: {},
        users: []
    }
    componentDidMount = () => {
        this.loadStats();
        var api = '/api/my_associations';
        axios.get(api).then((res) => {
            const users = [];
            for (let x in res.data) {
                const results = res.data[x];
                for (let i = 0; i < results.length; i++) {
                    var user = results[i];
                    if (user.user_type === "REVIEWSCHEDULER") {
                        users.push({
                            id: user.id,
                            name: user.first_name+" "+user.last_name
                        })
                    }
                }
            }
            this.setState({ users });
        });
    }
    changePeriod = (e) => {
        const value = e.target.value;
        if (value === "mtd") {
            this.setState({
                start_date: null,
                end_date: null,
                period: value
            }, () => {
                this.loadStats();
            })
        } else {
            this.setState({
                start_date: new Date('2010-01-01'),
                end_date: new Date(today.getFullYear(), today.getMonth()+1, 1),
                period: value
            }, () => {
                this.loadStats();
            })
        }
    }
    onChangeDateRange = (date, dateString) => {
        this.setState({
            start_date: date[0],
            end_date: date[1],
            period: "from_to"
        }, () => {
            this.loadStats();
        })
    }
    refresh = () => {
        this.setState({ loading: true });
        axios.get('/api/delete_user_cache').then((res) => {
            this.setState({ loading: false });
            this.loadStats();
        });
    }
    loadStats = () => {
        const { period, start_date, end_date } = this.state;
        let data = { window: period };
        if (period === "from_to") {
            data.from = moment(start_date).format('YYYY-MM-DD');
            data.to = moment(end_date).format('YYYY-MM-DD');
        }
        this.setState({ loading: true });
        axios.post('/api/dashboard', data).then((res) => {
            const dashboard = res.data;
            this.setState({
                loading: false,
                dashboard
            })
        })
    }
    showStats = (user_id) => {
        this.props.history.push('/dashboard/rs-stats/' + user_id);
    }
    render() {

        const {
            start_date,
            end_date,
            period,
            user,
            loading,
            dashboard,
            users
        } = this.state;

        const dateFormat = 'MM/DD/YYYY';
        const today = new Date();
        const defaultFromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const defaultToDate = new Date(today.getFullYear(), today.getMonth()+1, 1);

        return (
            <div>
                <div className="topbar">
                    <Card bordered={false}>
                        <Row gutter={16} type="flex" justify="space-around" align="middle">
                            <Col md={8} span={24}>
                                <div className="username">
                                    <Icon type="user" />
                                    {user.first_name+" "+user.last_name}
                                    {" "}
                                    <Tag color="blue">{user.user_type}</Tag>
                                </div>
                            </Col>
                            <Col md={16} span={24}>
                                <div className="right-align" style={{marginTop:-5, marginBottom:-5}}>
                                    <div className="inlineField">
                                        <Button icon="reload" onClick={this.refresh.bind(this)}>
                                            {' '}<Translate text={`Refresh`} />
                                        </Button>
                                    </div>
                                    <div className="inlineField">
                                        <Radio.Group defaultValue={period} onChange={this.changePeriod.bind(this)} style={{width: '100%'}}>
                                            <Radio.Button value="mtd"><Translate text={`This Month`} /></Radio.Button>
                                            <Radio.Button value="from_to"><Translate text={`All B-Files`} /></Radio.Button>
                                        </Radio.Group>
                                    </div>
                                    <div className="inlineField">
                                        {period !== 'all_bfiles' ? (
                                            <RangePicker
                                                value={[moment(defaultFromDate), moment(defaultToDate)]}
                                                onChange={this.onChangeDateRange}
                                                format={dateFormat}
                                                style={{maxWidth:280}}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>

                <Stats dashboard={dashboard} loading={loading} />

                <Card
                    type="inner"
                    title="Review Schedulers"
                    loading={loading}
                    style={{marginBottom:20}}
                >
                    <div className="center-align">
                        <Select defaultValue={''} style={{ width: 220 }} onChange={(val) => {
                            this.showStats(val)
                        }}>
                            <Option value={''}>{"Select a Review Scheduler"}</Option>
                            {users.map((user, i) => (
                                <Option key={i} value={user.id}>{user.name}</Option>
                            ))}
                        </Select>
                    </div>
                </Card>
            </div>
        );

    }
}

export default ReviewAdmin;
