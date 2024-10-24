import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Card,
    Select,
    Table,
    Button
} from 'antd';
import F from '../../../../Functions';
import moment from 'moment';
import { Translate } from 'react-translated';
import axios from 'axios';
import Pagination from '../../../../components/pagination';

const { Column } = Table;

const Option = Select.Option;

class StatBox extends Component {
    render() {

        const { title, val, color } = this.props;

        const gridStyle = {
            width: '20%',
            textAlign: 'center'
        };

        return (
            <Card.Grid style={gridStyle} className={"card-"+color}>
                <div className="value"><Link to={this.props.link}>{val}</Link></div>
                <div className="title"><Translate text={title} /></div>
            </Card.Grid>
        )
    }
}

class RSCalendarInvites extends Component {
    state = {
        filter_lsp: '',
        bfiles: [],
        page: 1,
        total_pages: 0,
        loading: false,
        start_date: null,
        end_date: null,
        period: null,
        stats: {
            review_upcoming_calls: 0,
            review_calls_made: 0,
            review_appointments_scheduled: 0,
            review_not_reached: 0,
            review_not_interested: 0
        },
        stats_loading: true
    }
    componentDidMount = () => {
        this.setState({
            loading: true
        })
        axios.get("/api/calendly/sync_events").then((res) => {
            this.setState({
                loading: false
            })
            this.loadBFiles(1);
        });
        this.loadStats();
    }
    componentDidUpdate = () => {
        if (this.props.start_date !== this.state.start_date || this.props.end_date !== this.state.end_date || this.props.period !== this.state.period) {
            this.loadBFiles(1);
            this.loadStats();
        }
    }
    loadBFiles(page) {
        let {
            start_date,
            end_date,
            period
        } = this.props;

        this.setState({
            loading: true,
            start_date,
            end_date,
            period
        })

        if (period === "mtd") {
            const today = new Date();
            start_date = new Date(today.getFullYear(), today.getMonth(), 1);
            end_date = new Date(today.getFullYear(), today.getMonth()+1, 1);
        }

        start_date = moment(start_date).format('YYYY-MM-DD');
        end_date = moment(end_date).format('YYYY-MM-DD');

        axios.get("/api/user").then((res) => {
            const u = res.data;
            let agency_id = null;
            for (let i=0; i < u.user_agency_assoc.length; i++) {
                agency_id = u.user_agency_assoc[i].agency_id;
                break;
            }
            
            var filters = [
                {"name":"agency_id","op":"==","val": agency_id},
                {"name":"review","op":"==","val":"1"},
                {"name":"rs_archived","op":"is_null"},
                {"name":"is_saved_for_later","op":"==","val":"0"},
                {"name":"deleted","op":"==","val":"0"},
                {"name":"archive","op":"==","val":"0"},
                {"name":"rs_action","op":"==", "val":"1"},
                // {
                //     "or": [
                //         {"name":"financial_id","op":"is_not_null"},
                //         {"name":"onboarding_id","op":"is_not_null"},
                //         {"name":"need_attention","op":"==","val":"1"},
                //     ]
                // }
            ];
            if (period !== 'all_bfiles') {
                filters.push({
                    "or": [
                        {
                            "and": [
                                {"name":"created_on","op":">=","val":start_date},
                                {"name":"created_on","op":"<","val":end_date}
                            ]
                        },
                        {
                            "and": [
                                {"name":"rs_date","op":">=","val":start_date},
                                {"name":"rs_date","op":"<","val":end_date}
                            ]
                        }
                    ]
                })
            }
            if (this.state.filter_lsp !== "") {
                filters.push({"name":"user_id","op":"==","val":this.state.filter_lsp})
            }
            filters = JSON.stringify(filters);
            var url = '/api/b_file?page=' + page + '&q={"filters":'+filters+',"order_by":[{"field":"rs_appointment_date","direction":"desc"}]}';
    
            axios.get(url).then((res) => {
                let page = res.data.page;
                let total_pages = res.data.total_pages;
    
                this.setState({
                    loading: false,
                    bfiles: res.data.objects,
                    page,
                    total_pages
                })
            });

        });
    }
    loadStats = () => {
        const { period, start_date, end_date } = this.props;
        const { user } = this.props;
        const today = new Date();
        let from = new Date(today.getFullYear(), today.getMonth(), 1);
        let to = new Date(today.getFullYear(), today.getMonth()+1, 1);
        let url = "/api/user_review_stats";

        this.setState({ stats_loading: true });

        if (period === "from_to") {
            from = start_date,
            to = end_date;
        }

        if (period === "all_bfiles") {
            from = new Date('2010-01-01');
            to = new Date(today.getFullYear(), today.getMonth()+1, 1);
        }

        axios.post(url, {
            user: user.id,
            from: moment(from).utc().format("YYYY-MM-DD"),
            to: moment(to).utc().format("YYYY-MM-DD")
        }).then((res) => {
            this.setState({
                stats: res.data,
                stats_loading: false
            });
        })
    }
    filterLSP = (val) => {
        this.setState({
            filter_lsp: val
        }, () => this.loadBFiles(1))
    }
    render() {

        const {
            dashboard,
            associations,
            user,
            period,
            start_date,
            end_date
        } = this.props;

        const {
            filter_lsp,
            bfiles,
            stats,
            page,
            total_pages,
            loading
        } = this.state;

        let columns = [{
            title: <div><Translate text={`Customer Name`} /></div>,
            dataIndex: 'customer_name',
            key: 'customer_name',
            width: 200,
        }, {
            title: <div><Translate text={`Calendar Time`} /></div>,
            dataIndex: 'calendar_time',
            key: 'calendar_time',
            width: 200,
        }, {
            title: <div><Translate text={`LSP`} /></div>,
            dataIndex: 'lsp',
            key: 'lsp',
            width: 200,
        }, {
            title: <div><Translate text={`Status`} /></div>,
            dataIndex: 'status',
            key: 'status',
            width: 200,
        }];

        const data = [];
        for (let i=0; i<bfiles.length; i++) {
            let bfile = bfiles[i];
            let status = 'Not Complete';
            if (bfile.need_attention || bfile.onboarding_id || bfile.financial_id || bfile.is_onboarded || bfile.archive) {
                status = "Complete";
            }

            var calendar_time = moment(new Date(bfile.rs_appointment_date)).format('MM/DD/YYYY hh:mmA');

            data.push({
                customer_name: <Link to={"/customer/"+bfile.id}>{bfile.first_name + ' ' + bfile.last_name}</Link>,
                calendar_time,
                lsp: bfile.user.first_name + ' ' + bfile.user.last_name,
                status
            })
        }

        // let stats = {
        //     review_upcoming_calls: dashboard.agency_stats.review_upcoming_calls,
        //     review_calls_made: dashboard.agency_stats.review_calls_made,
        //     review_appointments_scheduled: dashboard.agency_stats.review_appointments_scheduled,
        //     review_not_reached: dashboard.agency_stats.review_not_reached,
        //     review_not_interested: dashboard.agency_stats.review_not_interested,
        // };

        let date_url = '';
        if (period === 'from_to') {
            date_url = '/all/' + encodeURIComponent(moment(start_date).format('MM/DD/YYYY')) + '/' + encodeURIComponent(moment(end_date).format('MM/DD/YYYY'))
        }
        if (period === 'all_bfiles') {
            date_url = '?all_bfiles';
        }

        //const calls_made = stats.review_appointments_scheduled + stats.review_not_reached + stats.review_not_interested;

        if (!stats.review_not_reached) stats.review_not_reached = 0;
        if (!stats.review_not_interested) stats.review_not_interested = 0;
        stats.review_calls_made = stats.review_appointments_scheduled + stats.review_not_reached + stats.review_not_interested;
        
        return (
            <div>
                <div style={{marginBottom: 20}}>
                    <Card
                        title={
                            <div>
                                <Icon type="appstore" style={{marginRight: 10,color:"#1890ff"}} />
                                <Translate text={`Review Scheduler Stats`} />
                            </div>
                        }
                        bordered={false}
                        className="statsDetails"
                    >
                        <div className="statsGrid">
                            <Card bordered={false} loading={this.props.loading}>
                                <StatBox title="Upcoming Calls" val={dashboard.agency_stats.review_upcoming_calls || 0} color={'red'} link={'/bfiles/review-scheduler-upcoming-calls' + date_url} />
                                <StatBox title="Calls Made" val={dashboard.agency_stats.review_calls_made || 0} color={'green'} link={'/bfiles/review-scheduler-calls-made' + date_url} />
                                <StatBox title="Appointments Scheduled" val={dashboard.agency_stats.review_appointments_scheduled || 0} color={'blue'} link={'/bfiles/review-scheduler-appointments-scheduled' + date_url} />
                                <StatBox title="Not Reached" val={dashboard.agency_stats.review_not_reached || 0} color={'purple'} link={'/bfiles/review-scheduler-not-reached' + date_url} />
                                <StatBox title="Not Interested" val={dashboard.agency_stats.review_not_interested || 0} color={'yellow'} link={'/bfiles/review-scheduler-not-interested' + date_url} />
                            </Card>
                        </div>
                    </Card> <div style={{marginBottom: 20}}>
                    {this.props.user_t !== 'agency_manager' ? (<Card
                        title={
                            <div>
                                <Icon type="appstore" style={{marginRight: 10,color:"#1890ff"}} />
                                <Translate text={`Review Scheduled Calendar Invites`} />
                </div>
                        }
                        bordered={false}
                        className="statsDetails have_extra"
                        extra={
                            <Select defaultValue="" style={{ width: 200 }} onChange={this.filterLSP}>
                                <Option value=""><Translate text={`Select LSP`} />...</Option>
                                <Option value={user.id}>Me</Option>
                                {associations.map((asso, i) => {
                                    if (asso.user_type === "LSP") {
                                        return (
                                            <Option value={asso.id} key={i}>
                                                {asso.first_name+" "+asso.last_name}
                                            </Option>
                                        )
                                    } else {
                                        return null;
                                    }
                                })}
                            </Select>
                        }
                    >
                        <Table
                            loading={loading}
                            columns={columns}
                            dataSource={data}
                            bordered={false}
                            pagination={false}
                        />
                        <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                            this.loadBFiles(page);
                        }} />
                    </Card>) : (<div></div>)}
                    
                 </div>
                </div>
                {
                    this.props.user_t !== "agency_manager" ? (
                <div style={{marginBottom: 20}}>
                    <Card
                        title={
                            <div>
                                <Icon type="appstore" style={{marginRight: 10,color:"#1890ff"}} />
                                <Translate text={`Review Scheduled Calendar Invites`} />
                            </div>
                        }
                        bordered={false}
                        className="statsDetails have_extra"
                        extra={
                            <Select defaultValue="" style={{ width: 200 }} onChange={this.filterLSP}>
                                <Option value=""><Translate text={`Select LSP`} />...</Option>
                                <Option value={user.id}>Me</Option>
                                {associations.map((asso, i) => {
                                    if (asso.user_type === "LSP") {
                                        return (
                                            <Option value={asso.id} key={i}>
                                                {asso.first_name+" "+asso.last_name}
                                            </Option>
                                        )
                                    } else {
                                        return null;
                                    }
                                })}
                            </Select>
                        }
                    >
                        <Table
                            loading={loading}
                            columns={columns}
                            dataSource={data}
                            bordered={false}
                            pagination={false}
                        />
                        <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                            this.loadBFiles(page);
                        }} />
                    </Card>
                </div>
                    ):(<div></div>)
                }
               
                
               
            </div>
        )
    }
}

export default RSCalendarInvites;
