import React, { Component } from 'react';
import {
    Row,
    Col,
    DatePicker,
    Card,
    Radio,
    Icon,
    Button,
    Tag
} from 'antd';
import './dashboard.css';
import FinancialCircle from './parts/efs/immediate-life';
import NeedAttention from './parts/need-attention';
import CalendarInvites from './parts/calendar-invites';
import AgencyPartnersDetail from './parts/efs/agency-partners-detail';
import MyLifeRetirementActivity from './parts/efs/my-life-retirement-activity';
import moment from 'moment';
import axios from 'axios';
import { Translate } from 'react-translated';

const { RangePicker } = DatePicker;
const today = new Date();

class Dashboard extends Component {
    state = {
        loading: true,
        dashboard: {},
        period: 'mtd',
        start_date: null,
        end_date: null,
        associations: [],
        user: this.props.auth.user,
        vonboard: 0
    }
    componentDidMount = () => {
        axios.get('/api/get_active_associations').then((res) => {
            this.setState({
                associations: res.data
            })
        })

        if ("user_period" in window.localStorage) {
            if (window.localStorage.user_period === 'from_to') {
                this.setState({
                    start_date: window.localStorage.user_start_date,
                    end_date: window.localStorage.user_end_date,
                    period: window.localStorage.user_period
                }, () => {
                    this.loadStats();
                })
            } else if (window.localStorage.user_period === 'all_bfiles') {
                this.setState({
                    period: window.localStorage.user_period
                }, () => {
                    this.loadStats();
                })
            } else {
                this.loadStats();
            }
        } else {
            this.loadStats();
        }

        let user_id = this.state.user.id;
        axios.get("/api/users/" + user_id).then((res) => {
            let agency_id = null;
            for (let i=0; i < res.data.user_agency_assoc.length; i++) {
                agency_id = res.data.user_agency_assoc[i].agency_id;
                break;
            }
            axios.get("/api/agencies/" + agency_id).then((res) => {
                this.setState({ 
                    vonboard: res.data.vonboard
                });
            });
        });
    }
    changePeriod = (e) => {
        const value = e.target.value;
        if (value === "mtd") {
            window.localStorage.user_start_date = null;
            window.localStorage.user_end_date = null;
            window.localStorage.user_period = value;

            this.setState({
                start_date: null,
                end_date: null,
                period: value
            }, () => {
                this.loadStats();
            })
        } else {
            window.localStorage.user_start_date = new Date('2010-01-01');
            window.localStorage.user_end_date = new Date(today.getFullYear(), today.getMonth()+1, 1);
            window.localStorage.user_period = value;

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
        window.localStorage.user_start_date = date[0];
        window.localStorage.user_end_date = date[1];
        window.localStorage.user_period = "from_to";

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
        axios.post('/api/dash_stats', data).then((res) => {
            const dashboard = res.data;
            dashboard.lsp = [{
                user: this.props.auth.user,
                stats: dashboard.stats
            }].concat(dashboard.lsp);
            dashboard.efs = [{
                user: this.props.auth.user,
                stats: dashboard.stats
            }].concat(dashboard.efs);
            this.setState({
                loading: false,
                dashboard
            })
        })
    }
    render() {

        const {
            dashboard,
            associations,
            loading,
            start_date,
            end_date,
            period
        } = this.state;
        const dateFormat = 'MM/DD/YYYY';
        const user = this.props.auth.user;

        let defaultFromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        if (start_date) defaultFromDate = start_date;

        let defaultToDate = new Date(today.getFullYear(), today.getMonth()+1, 1);
        if (end_date) defaultToDate = end_date;

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
                                        <Radio.Group value={period} onChange={this.changePeriod.bind(this)} style={{width: '100%'}}>
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

                <Row gutter={16}>
                    <Col md={18} span={24}>
                        <FinancialCircle
                            dashboard={dashboard}
                            loading={loading}
                            user={user}
                            start_date={start_date}
                            end_date={end_date}
                            period={period}
                        />
                        <AgencyPartnersDetail
                            dashboard={dashboard}
                            associations={associations}
                            user={user}
                            loading={loading}
                            user={user}
                            start_date={start_date}
                            end_date={end_date}
                            period={period}
                            vonboard={this.state.vonboard}
                        />
                        <MyLifeRetirementActivity
                            dashboard={dashboard}
                            associations={associations}
                            user={user}
                            loading={loading}
                            user={user}
                            start_date={start_date}
                            end_date={end_date}
                            period={period}
                        />
                    </Col>
                    <Col md={6} span={24}>
                        <NeedAttention />
                        <CalendarInvites />
                    </Col>
                </Row>
            </div>
        );

    }
}

export default Dashboard;
