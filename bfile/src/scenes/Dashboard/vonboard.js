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
    Timeline,
    Spin
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Pagination from '../../components/pagination';
import Stats from './parts/vonboard/stats';
import AgencyModal from './parts/vonboard/dedicated-agency-modal';
import { Translate } from 'react-translated';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const today = new Date();
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Vonboard extends Component {
    state = {
        loading: false,
        period: 'mtd',
        start_date: new Date(today.getFullYear(), today.getMonth(), 1),
        end_date: new Date(today.getFullYear(), today.getMonth()+1, 1),
        buckets: [
            {index: 0, title: "My Claimed Calls", calls: [], loading: false, page: 1, total_pages: 0, filters: {
                search: ("vo_box1_search" in window.localStorage) ? window.localStorage.vo_box1_search : '',
                agency: ("vo_box1_agency" in window.localStorage) ? window.localStorage.vo_box1_agency : ''
            }},
            {index: 1, title: "Due Calls", calls: [], loading: false, page: 1, total_pages: 0, filters: {
                search: ("vo_box2_search" in window.localStorage) ? window.localStorage.vo_box2_search : '',
                agency: ("vo_box2_agency" in window.localStorage) ? window.localStorage.vo_box2_agency : ''
            }},
            {index: 2, title: "Attempted Calls", calls: [], loading: false, page: 1, total_pages: 0, filters: {
                search: ("vo_box3_search" in window.localStorage) ? window.localStorage.vo_box3_search : '',
                agency: ("vo_box3_agency" in window.localStorage) ? window.localStorage.vo_box3_agency : ''
            }},
            {index: 3, title: "Calendar Invites", calls: [], loading: false, page: 1, total_pages: 0, filters: {
                search: ("vo_box4_search" in window.localStorage) ? window.localStorage.vo_box4_search : '',
                agency: ("vo_box4_agency" in window.localStorage) ? window.localStorage.vo_box4_agency : ''
            }},
            {index: 4, title: "Upcoming Calls", calls: [], loading: false, page: 1, total_pages: 0, filters: {
                search: ("vo_box5_search" in window.localStorage) ? window.localStorage.vo_box5_search : '',
                agency: ("vo_box5_agency" in window.localStorage) ? window.localStorage.vo_box5_agency : ''
            }},
            {index: 5, title: "Completed Calls", calls: [], loading: false, page: 1, total_pages: 0, filters: {
                search: ("vo_box6_search" in window.localStorage) ? window.localStorage.vo_box6_search : '',
                agency: ("vo_box6_agency" in window.localStorage) ? window.localStorage.vo_box6_agency : ''
            }},
            {index: 6, title: "Not Reached Archived", calls: [], loading: false, page: 1, total_pages: 0, filters: {
                search: ("vo_box7_search" in window.localStorage) ? window.localStorage.vo_box7_search : '',
                agency: ("vo_box7_agency" in window.localStorage) ? window.localStorage.vo_box7_agency : ''
            }},
            {index: 7, title: "Sent For Financial", calls: [], loading: false, page: 1, total_pages: 0, filters: {
                search: ("vo_box8_search" in window.localStorage) ? window.localStorage.vo_box8_search : '',
                agency: ("vo_box8_agency" in window.localStorage) ? window.localStorage.vo_box8_agency : ''
            }},
            {index: 8, title: "Not Interested", calls: [], loading: false, page: 1, total_pages: 0, filters: {
                search: ("vo_box9_search" in window.localStorage) ? window.localStorage.vo_box9_search : '',
                agency: ("vo_box9_agency" in window.localStorage) ? window.localStorage.vo_box9_agency : ''
            }}
        ],
        columns: [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Agency',
            dataIndex: 'agency',
            key: 'agency'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date'
        },
        {
            title: 'Call Attempts',
            dataIndex: 'call_attempts',
            key: 'call_attempts'
        },
        {
            title: 'Who Created',
            dataIndex: 'who_created',
            key: 'who_created'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action'
        }],
        agency_id: null,
        user: this.props.auth.user,
        agencies: [],
        stats: {},
        stats_loading: false,
        dedicated_agency_modal: false
    }
    componentDidMount = () => {
        let agency_id = null;

        axios.get("/api/vo_agencies").then((res) => {
            this.setState({
                agencies: res.data
            })
        });

        if (typeof this.props.match.params.action !== 'undefined' && this.props.match.params.action === "select-agency") {
            this.setState({ dedicated_agency_modal: true });
        }
        if (typeof this.props.match.params.agency_id !== 'undefined') {
            agency_id = this.props.match.params.agency_id;
            if (agency_id === 'all') {
                agency_id = null;
                delete window.localStorage.vo_agency_id;
            } else {
                window.localStorage.vo_agency_id = agency_id;
            }
        } else {
            if ("vo_agency_id" in window.localStorage) {
                agency_id = window.localStorage.vo_agency_id;
            }
        }

        if ("vo_period" in window.localStorage) {
            if (window.localStorage.vo_period === 'from_to') {
                this.setState({
                    start_date: window.localStorage.vo_start_date,
                    end_date: window.localStorage.vo_end_date,
                    period: window.localStorage.vo_period
                })
            } else if (window.localStorage.vo_period === 'all_bfiles') {
                this.setState({
                    period: window.localStorage.vo_period
                })
            }
        }

        this.setState({ agency_id }, () => {
            this.loadBuckets("all", 1);
            this.loadStats();
            this.loadCalendar(3);
        });
    }
    componentDidUpdate() {
        if ("agency_id" in this.props.match.params) {
            let { agency_id } = this.props.match.params;
            if (agency_id === 'all') {
                agency_id = null;
            }
            if (this.state.agency_id !== agency_id) {
                if (!agency_id) {
                    delete window.localStorage.vo_agency_id;
                } else {
                    window.localStorage.vo_agency_id = agency_id;
                }
                this.setState({ agency_id, dedicated_agency_modal: false }, () => {
                    this.loadBuckets("all", 1);
                    this.loadStats();
                    this.loadCalendar(3);
                });
            }
        } else if (this.state.agency_id !== null && this.props.location.pathname === '/dashboard') {
            delete window.localStorage.vo_agency_id;
            this.setState({ agency_id: null, dedicated_agency_modal: false }, () => {
                this.loadBuckets("all", 1);
                this.loadStats();
                this.loadCalendar(3);
            });
        }
        if ("action" in this.props.match.params) {
            if (this.props.match.params.action === "select-agency" && !this.state.dedicated_agency_modal) {
                this.setState({ dedicated_agency_modal: true });
            }
        }
    }
    changePeriod = (e) => {
        const value = e.target.value;
        if (value === "mtd") {
            window.localStorage.vo_start_date = null;
            window.localStorage.vo_end_date = null;
            window.localStorage.vo_period = value;

            this.setState({
                start_date: null,
                end_date: null,
                period: value
            }, () => {
                this.loadBuckets("all", 1);
                this.loadStats();
            })
        } else {
            window.localStorage.vo_start_date = new Date('2010-01-01');
            window.localStorage.vo_end_date = new Date(today.getFullYear(), today.getMonth()+1, 1);
            window.localStorage.vo_period = value;

            this.setState({
                start_date: new Date('2010-01-01'),
                end_date: new Date(today.getFullYear(), today.getMonth()+1, 1),
                period: value
            }, () => {
                this.loadBuckets("all", 1);
                this.loadStats();
            })
        }
    }
    search = (ind, search) => {
        let buckets = this.state.buckets;
        for (let i = 0; i < buckets.length; i++) {
            if (buckets[i].index === ind) {
                buckets[i].loading = true;
                buckets[i].filters.search = search;
                break;
            }
        }
        this.setState({ buckets }, () => {
            this.loadBuckets(ind, 1);
        });
    }
    agencyChange = (ind, agency_id) => {
        let buckets = this.state.buckets;
        for (let i = 0; i < buckets.length; i++) {
            if (buckets[i].index === ind) {
                buckets[i].loading = true;
                buckets[i].filters.agency = agency_id;
                window.localStorage["vo_box" + (i+1) + "_agency"] = agency_id;
                break;
            }
        }
        this.setState({ buckets }, () => {
            this.loadBuckets(ind, 1);
        });
    }
    onChangeDateRange = (date, dateString) => {
        window.localStorage.vo_start_date = date[0];
        window.localStorage.vo_end_date = date[1];
        window.localStorage.vo_period = "from_to";

        this.setState({
            start_date: date[0],
            end_date: date[1],
            period: "from_to"
        }, () => {
            this.loadBuckets("all", 1);
            this.loadStats();
        })
    }
    refresh = () => {
        this.setState({ loading: true });
        axios.get('/api/delete_user_cache').then((res) => {
            this.setState({ loading: false });
            this.loadBuckets("all", 1);
            this.loadStats();
        });
    }
    loadStats = () => {
        const { agency_id, user, period, start_date, end_date } = this.state;
        const today = new Date();
        let from = new Date(today.getFullYear(), today.getMonth(), 1);
        let to = new Date(today.getFullYear(), today.getMonth()+1, 1);
        let url = "/api/user_vonboard_stats";

        if (agency_id) {
            url = "/api/user_vonboard_stats?agency_id=" + agency_id;
        }

        this.setState({ stats_loading: true });

        if (period === "from_to") {
            from = start_date,
            to = end_date;
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
    loadBuckets = (sec, page) => {
        const url_filters = '';
        const { user } = this.state;
        const today = moment(new Date()).utc().format();

        if (sec === "all" || sec == 0) {
            this.loadBucket(0, 'my_vonboard_bfiles', '{"name":"vob_attempted","op":"is_null"},{"name":"vob_completed","op":"is_null"},{"name":"vob_archived","op":"is_null"},{"name":"onboarding_id","op":"==","val":"'+user.id+'"}', page);
        }
        if (sec === "all" || sec == 1) {
            this.loadBucket(1, 'b_file', '{"name":"vob_archived","op":"is_null"},{"name":"vob_attempted","op":"is_null"},{"name":"vob_attempted","op":"is_null"},{"name":"vob_completed","op":"is_null"},{"or":[{"name":"onboarding_user","op":"is_null"},{"name":"onboarding_user","op":"has","val":{"name":"user_type","op":"!=","val":"VONBOARDER"}}]},{"name":"expiration_date","op":"<","val":"'+today+'"}', page);
        }
        if (sec === "all" || sec == 2) {
            this.loadBucket(2, 'my_vonboard_bfiles', '{"name":"vob_attempted","op":"==","val":1},{"name":"vob_completed","op":"is_null"},{"name":"vob_archived","op":"is_null"},{"name":"onboarding_id","op":"==","val":"'+user.id+'"}', page);
        }
        if (sec === "all" || sec == 4) {
            this.loadBucket(4, 'b_file', '{"or":[{"name":"onboarding_user","op":"is_null"},{"name":"onboarding_user","op":"has","val":{"name":"user_type","op":"!=","val":"VONBOARDER"}}]},{"name":"expiration_date","op":">=","val":"'+today+'"}', page);
        }
        if (sec === "all" || sec == 5) {
            this.loadBucket(5, 'my_vonboard_bfiles', '{"name":"vob_completed","op":"==","val":1},{"name":"vob_archived","op":"is_null"},{"name":"onboarding_id","op":"==","val":"'+user.id+'"}', page);
        }
        if (sec === "all" || sec == 6) {
            this.loadBucket(6, 'my_vonboard_bfiles', '{"name":"vob_archived","op":"==","val":1},{"name":"vob_attempted","op":"is_null"},{"name":"onboarding_id","op":"==","val":"'+user.id+'"}', page);
        }
        if (sec === "all" || sec == 7) {
            this.loadBucket(7, 'my_vonboard_bfiles', '{"name":"vob_completed","op":"==","val":1},{"name":"vob_archived","op":"is_null"},{"name":"onboarding_id","op":"==","val":"'+user.id+'"},{"name":"financial_id","op":"is_not_null"}', page);
        }
        if (sec === "all" || sec == 8) {
            this.loadBucket(8, 'my_vonboard_bfiles', '{"name":"vob_archived","op":"==","val":1},{"name":"onboarding_id","op":"==","val":"'+user.id+'"},{"name":"vob_attempted","op":"==","val":1}', page);
        }
    }
    loadCalendar = (ind) => {
        let buckets = this.state.buckets;
        buckets[ind].loading = true;
        this.setState({ buckets });
        axios.get('/api/user_calendar_invite').then((res) => {
            buckets[ind].calls = res.data;
            buckets[ind].loading = false;
            this.setState({ buckets });
        })
    }
    loadBucket = (ind, api, filters, page) => {

        const { user, period, start_date, end_date, agency_id } = this.state;

        let buckets = this.state.buckets;
        let more_filters = {};

        for (let i = 0; i < buckets.length; i++) {
            if (buckets[i].index === ind) {
                buckets[i].loading = true;
                more_filters = buckets[i].filters;
                break;
            }
        }
        this.setState({ buckets });

        const today = new Date();
        let from = new Date(today.getFullYear(), today.getMonth(), 1);
        let to = new Date(today.getFullYear(), today.getMonth()+1, 1);

        if (period === "from_to") {
            from = moment(start_date).utc().format("YYYY-MM-DD");
            to = moment(end_date).utc().format("YYYY-MM-DD");
        } else {
            from = moment(from).utc().format("YYYY-MM-DD");
            to = moment(to).utc().format("YYYY-MM-DD");
        }

        if (ind !== 1) {
            if (filters !== "") filters = filters + ",";
            filters = filters + '{"name":"created_on","op":">=","val":"'+from+'"},{"name":"created_on","op":"<","val":"'+to+'"}';
        }

        if (agency_id) {
            more_filters.agency = agency_id;
        }

        let queries = null;
        if (typeof more_filters.search !== 'undefined') {
            queries = [];
            queries.push({"name":"first_name","op":"like","val":encodeURIComponent("%"+more_filters.search+"%")});
            queries.push({"name":"last_name","op":"like","val":encodeURIComponent("%"+more_filters.search+"%")});
            queries.push({"name":"spouse_first_name","op":"like","val":encodeURIComponent("%"+more_filters.search+"%")});
            queries.push({"name":"spouse_last_name","op":"like","val":encodeURIComponent("%"+more_filters.search+"%")});
            queries.push({"name":"email","op":"like","val":encodeURIComponent("%"+more_filters.search+"%")});

            const search_arr = more_filters.search.split(" ");
            for (let x in search_arr) {
                if (x != "") {
                    queries.push({"name":"first_name","op":"like","val":encodeURIComponent("%"+search_arr[x]+"%")});
                    queries.push({"name":"last_name","op":"like","val":encodeURIComponent("%"+search_arr[x]+"%")});
                    queries.push({"name":"spouse_first_name","op":"like","val":encodeURIComponent("%"+search_arr[x]+"%")});
                    queries.push({"name":"spouse_last_name","op":"like","val":encodeURIComponent("%"+search_arr[x]+"%")});
                }
            }
            filters = filters + ',{"or":' + JSON.stringify(queries)+'}';
        }

        if (this.state.agency_id) {
            filters = filters + ',{"name":"agency_id","op":"==","val":'+this.state.agency_id+'}';
        }

        let url = '';
        if (filters !== "") {
            url = '/api/'+api+'?page='+page+'&q={"filters":['+filters+'],"order_by":[{"field":"expiration_date","direction":"desc"}]}';
            if (ind === 0 || ind === 2 || ind === 4) {
                url = '/api/'+api+'?page='+page+'&q={"filters":['+filters+'],"order_by":[{"field":"expiration_date","direction":"asc"}]}';
            }
        } else {
            url = '/api/'+api+'?page='+page+'&q={"order_by":[{"field":"expiration_date","direction":"desc"}]}';
            if (ind === 0 || ind === 2 || ind === 4) {
                url = '/api/'+api+'?page='+page+'&q={"order_by":[{"field":"expiration_date","direction":"asc"}]}';
            }
        }

        axios.get(url).then((res) => {
            buckets = this.state.buckets;
            let data = [];
            for (let i=0; i<res.data.objects.length; i++) {
                let bfile = res.data.objects[i];
                let action = null;

                if (ind === 1 || ind === 4) {
                    action = (
                        <Button type="primary" onClick={() => this.claim(ind, bfile.id, bfile.expiration_date)}>Claim B-File</Button>
                    )
                } else if (ind === 2) {
                    action = (
                        <Button.Group>
                            <Button type="primary" onClick={() => this.view(bfile.id)}>View</Button>
                            <Button onClick={() => this.archive(ind, bfile.id)}>Complete/Archive</Button>
                        </Button.Group>
                    )
                } else {
                    action = (
                        <Button type="primary" onClick={() => this.view(bfile.id)}>View</Button>
                    )
                }

                data.push({
                    key: i,
                    name: <Link to={"/customer/"+bfile.id}>{bfile.first_name + " " + bfile.last_name}</Link>,
                    phone: <a href={"tel:"+F.phone_format(bfile.phone)}>{F.phone_format(bfile.phone)}</a>,
                    agency: bfile.agency.name,
                    type: bfile.status,
                    status: F.bfile_status(bfile),
                    due_date: F.bfile_due_date(bfile,user.default_date),
                    call_attempts: bfile.attempts,
                    who_created: bfile.user.first_name+" "+bfile.user.last_name,
                    action: action
                })
            }
            for (let i = 0; i < buckets.length; i++) {
                if (buckets[i].index === ind) {
                    buckets[i].loading = false;
                    buckets[i].page = res.data.page;
                    buckets[i].calls = data;
                    buckets[i].total_pages = res.data.total_pages;
                    break;
                }
            }

            this.setState({ buckets })
        })
    }
    claim = (ind, bfile_id, expiration_date) => {
        let buckets = this.state.buckets;
        for (let i = 0; i < buckets.length; i++) {
            if (buckets[i].index === ind) {
                buckets[i].loading = true;
                break;
            }
        }
        this.setState({ buckets });

        axios.put("/api/b_file/" + bfile_id, {
            archive: 0,
            not_interested: 0,
            onboarding_id: this.state.user.id,
            expiration_date: expiration_date,
            vo_claim_date: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss')
        }).then(() => {
            this.props.history.push("/customer/" + bfile_id);
        });
    }
    archive = (ind, bfile_id) => {
        let buckets = this.state.buckets;
        for (let i = 0; i < buckets.length; i++) {
            if (buckets[i].index === ind) {
                buckets[i].loading = true;
                break;
            }
        }
        this.setState({ buckets });

        axios.put("/api/b_file/" + bfile_id, {
            vob_archived: 1
        }).then(() => {
            this.loadBuckets(ind, 1);
        });
    }
    view = (bfile_id) => {
        this.props.history.push("/customer/" + bfile_id);
    }
    render() {

        const {
            start_date,
            end_date,
            period,
            user,
            loading,
            buckets,
            columns,
            agencies,
            stats,
            stats_loading,
            dedicated_agency_modal,
            agency_id
        } = this.state;

        const dateFormat = 'MM/DD/YYYY';

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
                <Spin indicator={antIcon} spinning={loading}>
                    {buckets.map((bucket, i) => {

                        if (bucket.title === 'Calendar Invites') {
                            return (
                                <Card
                                    key={i}
                                    type="inner"
                                    className="tableCard"
                                    title={
                                        <div style={{paddingTop:7}}>
                                            <Icon type="folder" style={{marginRight: 10,color:"#1890ff"}} />
                                            {bucket.title}
                                        </div>
                                    }
                                    loading={bucket.loading}
                                    style={{marginBottom:20}}
                                >
                                    <div style={{padding: '25px'}}>
                                        <Timeline>
                                            {bucket.calls.map((item, i) => (
                                                <Timeline.Item key={i}>
                                                    <div>
                                                        <Link to={"/customer/" + item.bfile_id} className="invite">
                                                            {item.customer_name}
                                                        </Link>
                                                    </div>
                                                    <div className="date"><Translate text={`Date`} />: {moment(new Date(item.date)).format('MM/DD/YYYY hh:mmA')}</div>
                                                    <div className="agency"><Translate text={`Agency`} />: {item.agency_name}</div>
                                                </Timeline.Item>
                                            ))}
                                            {bucket.calls.length === 0 ? (
                                                <div className="notfound">
                                                    <Translate text={`No Invites Found`} />
                                                </div>
                                            ) : null}
                                        </Timeline>
                                    </div>
                                </Card>
                            )
                        }

                        return (
                            <Card
                                key={i}
                                type="inner"
                                className="tableCard"
                                title={
                                    <div style={{paddingTop:7}}>
                                        <Icon type="folder" style={{marginRight: 10,color:"#1890ff"}} />
                                        {bucket.title}
                                    </div>
                                }
                                loading={bucket.loading}
                                style={{marginBottom:20}}
                                extra={
                                    <Row gutter={16} style={{maxWidth:600}} type="flex" justify="end">
                                        <Col md={14} span={24}>
                                            <Input prefix={<Icon type="search" />} placeholder="Search..." onPressEnter={(e) => {
                                                this.search(bucket.index, e.target.value);
                                            }}/>
                                        </Col>
                                        {!agency_id ? (
                                            <Col md={10} span={24}>
                                                <Select value={bucket.filters.agency} style={{ width: '100%' }} onChange={(val) => {
                                                    this.agencyChange(bucket.index, val)
                                                }}>
                                                    <Option value={''}>{"Filter by Agency"}</Option>
                                                    {agencies.map((agency, i) => (
                                                        <Option key={i} value={agency.id+''}>{agency.name}</Option>
                                                    ))}
                                                </Select>
                                            </Col>
                                        ) : null}
                                    </Row>
                                }
                            >
                                <Table
                                    columns={columns}
                                    dataSource={bucket.calls}
                                    bordered={false}
                                    pagination={false}
                                />
                                {!bucket.loading ? (
                                    <Pagination current_page={bucket.page} total_pages={bucket.total_pages} onClick={(page) => {
                                        this.loadBuckets(bucket.index, page);
                                    }} />
                                ) : null}
                            </Card>
                        )
                    })}
                </Spin>

                <Stats stats={stats} loading={stats_loading} />

                <AgencyModal history={this.props.history} showModal={dedicated_agency_modal}
                    reset={() => {
                        this.setState({ agency_id: null }, () => {
                            this.loadBuckets("all", 1);
                            this.loadStats();
                            this.loadCalendar(3);
                        })
                    }}
                    hideModal={() => {
                        this.setState({ dedicated_agency_modal: false })
                    }}
                    cancelModal={() => {
                        this.setState({ dedicated_agency_modal: false }, () => {
                            this.props.history.push('/dashboard');
                        })
                    }}
                />
            </div>
        );

    }
}

export default Vonboard;
