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
import Pagination from '../../components/pagination';
import Stats from './parts/reviewscheduler/stats';
import AgencyModal from './parts/reviewscheduler/dedicated-agency-modal';
import { Translate } from 'react-translated';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const today = new Date();
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class ReviewScheduler extends Component {
    state = {
        loading: false,
        period: 'mtd',
        start_date: new Date(today.getFullYear(), today.getMonth(), 1),
        end_date: new Date(today.getFullYear(), today.getMonth()+1, 1),
        buckets: [
            {index: 0, title: "Calls Made (Not Reached)", calls: [], loading: false, page: 1, total_pages: 0, filters: {}},
            {index: 1, title: "Appointments Scheduled", calls: [], loading: false, page: 1, total_pages: 0, filters: {}},
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
        columns2: [{
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
            title: 'Appointment Date',
            dataIndex: 'appointment_date',
            key: 'appointment_date'
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
        child_id: this.props.match.params.user_id,
        agency_id: null,
        user: this.props.auth.user,
        agencies: [],
        stats: {},
        stats_loading: false,
        dedicated_agency_modal: false
    }
    componentDidMount = () => {
        let agency_id = null;

        axios.get("/api/rs_agencies").then((res) => {
            this.setState({
                agencies: res.data
            })
        });

        if (typeof this.props.match.params.action !== 'undefined') {
            this.setState({ dedicated_agency_modal: true });
        }
        if (typeof this.props.match.params.agency_id !== 'undefined') {
            agency_id = this.props.match.params.agency_id;
        }

        this.setState({ agency_id }, () => {
            this.loadBuckets("all", 1);
            this.loadStats();
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
                this.loadBuckets("all", 1);
                this.loadStats();
            })
        } else {
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
                break;
            }
        }
        this.setState({ buckets }, () => {
            this.loadBuckets(ind, 1);
        });
    }
    onChangeDateRange = (date, dateString) => {
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
        const { agency_id, user, period, start_date, end_date, child_id } = this.state;
        const today = new Date();
        let from = new Date(today.getFullYear(), today.getMonth(), 1);
        let to = new Date(today.getFullYear(), today.getMonth()+1, 1);
        let url = "/api/user_review_stats";

        if (agency_id) {
            url = "/api/user_review_stats?agency_id=" + agency_id;
        }

        this.setState({ stats_loading: true });

        if (period === "from_to") {
            from = start_date,
            to = end_date;
        }

        axios.post(url, {
            user: child_id,
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
        const { user, child_id } = this.state;
        const today = moment(new Date()).utc().format();

        if (sec === "all" || sec == 0) {
            this.loadBucket(0, 'b_file', '{"name":"rs_archived","op":"is_null"},{"name":"deleted","op":"==","val":"0"},{"name":"archive","op":"==","val":"0"},{"name":"reviewer_id","op":"==","val":"'+child_id+'"},{"name":"rs_action","op":"==","val":0}', page);
        }
        if (sec === "all" || sec == 1) {
            this.loadBucket(1, 'b_file', '{"name":"rs_archived","op":"is_null"},{"name":"deleted","op":"==","val":"0"},{"name":"archive","op":"==","val":"0"},{"name":"reviewer_id","op":"==","val":"'+child_id+'"},{"name":"rs_action","op":"==","val":1}', page);
        }
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

        if (filters !== "") filters = filters + ",";
        filters = filters + '{"name":"created_on","op":">=","val":"'+from+'"},{"name":"created_on","op":"<","val":"'+to+'"}';

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

        if (typeof more_filters.agency !== 'undefined' && more_filters.agency !== '') {
            filters = filters + ',{"name":"agency_id","op":"==","val":'+more_filters.agency+'}';
        }

        let url = '';
        if (filters !== "") {
            url = '/api/'+api+'?page='+page+'&q={"filters":['+filters+'],"order_by":[{"field":"expiration_date","direction":"desc"}]}';
            if (ind === 1) {
                url = '/api/'+api+'?page='+page+'&q={"filters":['+filters+'],"order_by":[{"field":"rs_appointment_date","direction":"asc"}]}';
            }
        } else {
            url = '/api/'+api+'?page='+page+'&q={"order_by":[{"field":"expiration_date","direction":"desc"}]}';
            if (ind === 1) {
                url = '/api/'+api+'?page='+page+'&q={"order_by":[{"field":"rs_appointment_date","direction":"asc"}]}';
            }
        }

        axios.get(url).then((res) => {
            buckets = this.state.buckets;
            let data = [];
            for (let i=0; i<res.data.objects.length; i++) {
                let bfile = res.data.objects[i];
                let action = null;

                if (ind !== 1) {
                    action = (
                        <div className="right-align">
                            <Button.Group>
                                <Button onClick={() => this.complete(ind, bfile.id)}>Complete/Archive</Button>
                                <Button type="primary" onClick={() => this.view(bfile.id)}>View</Button>
                            </Button.Group>
                        </div>
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
                    call_attempts: bfile.rs_attempts,
                    who_created: bfile.user.first_name+" "+bfile.user.last_name,
                    appointment_date: moment(bfile.rs_appointment_date).format('MM/DD/YYYY hh:mmA'),
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
    complete = (ind, bfile_id) => {
        let buckets = this.state.buckets;
        for (let i = 0; i < buckets.length; i++) {
            if (buckets[i].index === ind) {
                buckets[i].loading = true;
                break;
            }
        }
        this.setState({ buckets });

        axios.put("/api/b_file/" + bfile_id, {
            rs_archived: 1
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
            columns2,
            agencies,
            stats,
            stats_loading,
            dedicated_agency_modal,
            agency_id
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
                <Spin indicator={antIcon} spinning={loading}>
                    {buckets.map((bucket, i) => (
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
                                            <Select defaultValue={''} style={{ width: 220 }} onChange={(val) => {
                                                this.agencyChange(bucket.index, val)
                                            }}>
                                                <Option value={''}>{"Filter by Agency"}</Option>
                                                {agencies.map((agency, i) => (
                                                    <Option key={i} value={agency.id}>{agency.name}</Option>
                                                ))}
                                            </Select>
                                        </Col>
                                    ) : null}
                                </Row>
                            }
                        >
                            {bucket.index === 0 ? (
                                <Table
                                    columns={columns}
                                    dataSource={bucket.calls}
                                    bordered={false}
                                    pagination={false}
                                />
                            ) : (
                                <Table
                                    columns={columns2}
                                    dataSource={bucket.calls}
                                    bordered={false}
                                    pagination={false}
                                />
                            )}
                            {!bucket.loading ? (
                                <Pagination current_page={bucket.page} total_pages={bucket.total_pages} onClick={(page) => {
                                    this.loadBuckets(bucket.index, page);
                                }} />
                            ) : null}
                        </Card>
                    ))}
                </Spin>

                <Stats stats={stats} loading={stats_loading} />

                <AgencyModal history={this.props.history} showModal={dedicated_agency_modal} hideModal={() => {
                    this.setState({ dedicated_agency_modal: false }, () => {
                        this.props.history.push('/dashboard');
                    })
                }} />
            </div>
        );

    }
}

export default ReviewScheduler;
