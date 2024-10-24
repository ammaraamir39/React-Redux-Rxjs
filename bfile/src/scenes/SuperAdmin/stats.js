import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Input,
    Table,
    DatePicker,
    Button,
    message,
    Mentions
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';
import RV from '../Wizard/parts/images/bfile-rv.svg';
import Boat from '../Wizard/parts/images/bfile-boat.svg';
import Landlord from '../Wizard/parts/images/bfile-landlord.svg';
import Motorcycle from '../Wizard/parts/images/bfile-motorcycle.svg';
import Drone from '../Wizard/parts/images/icon-drone.svg';
import VacantProperty from '../Wizard/parts/images/bfile-vacant-land.svg';
import Umbrella from '../Wizard/parts/images/bfile-umbrella.svg';
import { Select } from 'antd';

const { Option } = Select;

const { RangePicker } = DatePicker;
const today = new Date();

let timeout;
const fetch = async (value, callback) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    const search = async () => {
        const r = await axios.get("/api/search_ea/" + encodeURIComponent(value));
        callback(r.data);
    };
    timeout = setTimeout(search, 300);
}

class Stats extends Component {
    state = {
        loading: true,
        data: [],
        emails: [],
        start_date: new Date(today.getFullYear(), today.getMonth(), 1),
        end_date: new Date(today.getFullYear(), today.getMonth()+1, 1),
        stats: null
    }
    componentDidMount = () => {
        //this.loadStats();
    }
    loadStats = () => {
        const { start_date, end_date, emails } = this.state;
        const api = '/api/get_admin_stats';
        this.setState({ loading: true });
        axios.post(api, {
            ea: emails.join(","),
            from: moment(start_date).format('YYYY-MM-DD'),
            to: moment(end_date).format('YYYY-MM-DD')
        }).then((res) => {
            this.setState({
                loading: false,
                stats: res.data.stats
            });
        });
    }
    filter = () => {
        const { start_date, end_date, emails } = this.state;
        let data = { 
            ea: emails.join(","),
            from: moment(start_date).format('YYYY-MM-DD'),
            to: moment(end_date).format('YYYY-MM-DD')
        }
        const api = '/api/get_admin_stats';
        this.setState({ loading: true });
        axios.post(api, data).then((res) => {
            this.setState({
                loading: false,
                stats: res.data.stats
            });
        });
    }
    onChangeDateRange = (date, dateString) => {
        this.setState({
            start_date: date[0],
            end_date: date[1]
        })
    }
    download_stats = () => {
        this.setState({ loading: true });
        axios.post("/api/admin/download/admin_stats", {
            stats: JSON.stringify(this.state.stats)
        }).then((res) => {
            this.setState({ loading: false });
            if (res.data.success) {
                window.location = "/bfile/assets/files/admin/"+res.data.token+".csv";
            } else {
                message.error(F.translate(`Can't download the csv.`));
            }
        });
    }
    handleSearch = value => {
        if (value) {
            fetch(value, data => this.setState({ data }));
        } else {
            this.setState({ data: [] });
        }
    };
    handleChange = value => {
        this.setState({ emails: value });
    };
    render() {

        const { loading, stats } = this.state;

        const columns = [
            {
                title: '',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '',
                dataIndex: 'value',
                key: 'value'
            }
        ];

        let data = [];
        if (stats) {
            data = [
                {
                    key: 0,
                    name: (<div><img src={Boat} alt={""} className="icon" /> <strong>Boats</strong></div>),
                    value: (
                        <Row>
                            <Col xs={8}>
                                <strong>Identified:</strong> {stats.cross_sell_boats_sold + stats.cross_sell_boats_not_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Sold:</strong> {stats.cross_sell_boats_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Not Sold:</strong> {stats.cross_sell_boats_not_sold}
                            </Col>
                        </Row>
                    )
                },
                {
                    key: 1,
                    name: (<div><img src={Motorcycle} alt={""} className="icon" /> <strong>Motorcycles</strong></div>),
                    value: (
                        <Row>
                            <Col xs={8}>
                                <strong>Identified:</strong> {stats.cross_sell_motorcycles_sold + stats.cross_sell_motorcycles_not_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Sold:</strong> {stats.cross_sell_motorcycles_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Not Sold:</strong> {stats.cross_sell_motorcycles_not_sold}
                            </Col>
                        </Row>
                    )
                },
                {
                    key: 28,
                    name: (<div><img src={Drone} alt={""} className="icon" /> <strong>Drones</strong></div>),
                    value: (
                        <Row>
                            <Col xs={8}>
                                <strong>Identified:</strong> {stats.cross_sell_drones_sold + stats.cross_sell_drones_not_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Sold:</strong> {stats.cross_sell_drones_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Not Sold:</strong> {stats.cross_sell_drones_not_sold}
                            </Col>
                        </Row>
                    )
                },
                {
                    key: 2,
                    name: (<div><img src={RV} alt={""} className="icon" /> <strong>{`RV's`}</strong></div>),
                    value: (
                        <Row>
                            <Col xs={8}>
                                <strong>Identified:</strong> {stats.cross_sell_rv_sold + stats.cross_sell_rv_not_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Sold:</strong> {stats.cross_sell_rv_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Not Sold:</strong> {stats.cross_sell_rv_not_sold}
                            </Col>
                        </Row>
                    )
                },
                {
                    key: 3,
                    name: (<div><img src={Landlord} alt={""} className="icon" /> <strong>Landlords</strong></div>),
                    value: (
                        <Row>
                            <Col xs={8}>
                                <strong>Identified:</strong> {stats.cross_sell_landlord_sold + stats.cross_sell_landlord_not_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Sold:</strong> {stats.cross_sell_landlord_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Not Sold:</strong> {stats.cross_sell_landlord_not_sold}
                            </Col>
                        </Row>
                    )
                },
                {
                    key: 4,
                    name: (<div><img src={VacantProperty} alt={""} className="icon" /> <strong>Vacant Properties</strong></div>),
                    value: (
                        <Row>
                            <Col xs={8}>
                                <strong>Identified:</strong> {stats.cross_sell_vacantproperty_sold + stats.cross_sell_vacantproperty_not_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Sold:</strong> {stats.cross_sell_vacantproperty_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Not Sold:</strong> {stats.cross_sell_vacantproperty_not_sold}
                            </Col>
                        </Row>
                    )
                },
                {
                    key: 5,
                    name: (<div><img src={Umbrella} alt={""} className="icon" /> <strong>Umbrellas</strong></div>),
                    value: (
                        <Row>
                            <Col xs={8}>
                                <strong>Identified:</strong> {stats.umbrella_not_sold + stats.umbrella_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Sold:</strong> {stats.umbrella_sold}
                            </Col>
                            <Col xs={8}>
                                <strong>Not Sold:</strong> {stats.umbrella_not_sold}
                            </Col>
                        </Row>
                    )
                },
                {
                    key: 6,
                    name: (<strong>Total Household Assets</strong>),
                    value: F.dollar_format(stats.total_household)
                },
                {
                    key: 7,
                    name: (<strong>Total Retirement Dollars</strong>),
                    value: F.dollar_format(stats.total_retirement_ops)
                },
                {
                    key: 8,
                    name: (<strong>Total IRA, Brokerage Account…</strong>),
                    value: F.dollar_format(stats.total_value_assets)
                },
                {
                    key: 9,
                    name: (<strong>Total 401k Value</strong>),
                    value: F.dollar_format(stats.total_401_value)
                },
                {
                    key: 10,
                    name: (<strong>Life Insurance - Term</strong>),
                    value: (stats.total_term_policy)
                },
                {
                    key: 11,
                    name: (<strong>Life Insurance - Universal</strong>),
                    value: (stats.total_universal_policy)
                },
                {
                    key: 12,
                    name: (<strong>Life Insurance - Employer</strong>),
                    value: (stats.total_employer_policy)
                },
                {
                    key: 13,
                    name: (<strong># of People Retired</strong>),
                    value: (stats.total_retired)
                },
                {
                    key: 14,
                    name: (<strong># of People Disabled</strong>),
                    value: (stats.total_disabled)
                },
                {
                    key: 15,
                    name: (<strong># of Business Owners</strong>),
                    value: (stats.total_business_owners)
                },
                {
                    key: 16,
                    name: (<strong># of Young Households</strong>),
                    value: (stats.total_young_households)
                },
                {
                    key: 17,
                    name: (<strong># of Emerging Adults</strong>),
                    value: (stats.total_emerging_adults)
                },
                {
                    key: 18,
                    name: (<strong># of Established Households</strong>),
                    value: (stats.total_established_household)
                },
                {
                    key: 19,
                    name: (<strong># of Mature Households</strong>),
                    value: (stats.total_mature_households)
                },
                {
                    key: 20,
                    name: (<strong># of Retirees</strong>),
                    value: (stats.total_retirees)
                },
                {
                    key: 21,
                    name: (<strong>Review Scheduler - Scheduled</strong>),
                    value: (stats.review_scheduler_scheduled)
                },
                {
                    key: 22,
                    name: (<strong>Review Scheduler - Calls Made</strong>),
                    value: (stats.review_scheduler_calls_made)
                },
                {
                    key: 23,
                    name: (<strong>Sent to Onboard</strong>),
                    value: (stats.sent_to_onboard)
                },
                {
                    key: 24,
                    name: (<strong>Sent to Virtual Onboard</strong>),
                    value: (stats.sent_to_vo)
                },
                {
                    key: 25,
                    name: (<strong>How Many New B-Files</strong>),
                    value: (stats.total_new_bfiles)
                },
                {
                    key: 26,
                    name: (<strong>How Many Renewals</strong>),
                    value: (stats.total_renewals)
                },
                {
                    key: 27,
                    name: (<strong>Total B-Files Created</strong>),
                    value: (stats.total_bfiles_created)
                }
            ];
        }

        const dateFormat = 'MM/DD/YYYY';
        const {
            start_date,
            end_date
        } = this.state;

        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);

        return (
            <div>
                <div style={{marginBottom: 20}}>
                    <Card
                        type="inner"
                        title={
                            <div style={{paddingTop:7}}>
                                <Translate text={`Filter`} />
                            </div>
                        }
                        className="tableCard adminStatsCard"
                    >
                        <div style={{padding: 20}}>
                            <Row gutter={16}>
                                <Col md={16} span={24}>
                                    <RangePicker
                                        style={{width: '100%'}}
                                        value={[moment(start_date), moment(end_date)]}
                                        onChange={this.onChangeDateRange}
                                        format={dateFormat}
                                    />
                                </Col>
                                <Col md={8} span={24}>
                                    <Select
                                        placeholder="Select EA..."
                                        mode='multiple'
                                        showSearch
                                        value={this.state.emails}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={this.handleSearch}
                                        onChange={this.handleChange}
                                        notFoundContent={null}
                                        style={{width: '100%'}}
                                    >
                                        {options}
                                    </Select>
                                </Col>
                            </Row>
                            <div style={{marginTop: 10, textAlign: "right"}}>
                                <Button type="primary" onClick={() => this.filter()}>
                                    Filter
                                </Button>
                                {/* <Button onClick={() => this.download_stats()}>
                                    Download CSV
                                </Button> */}
                            </div>
                        </div>
                    </Card>
                </div>
                {this.state.stats ? (
                    <Card
                        type="inner"
                        title={
                            <div style={{paddingTop:7}}>
                                <Translate text={`Stats`} />
                            </div>
                        }
                        className="tableCard adminStatsCard"
                        loading={loading}
                    >
                        {!loading ? (
                            <Table
                                columns={columns}
                                dataSource={data}
                                bordered={false}
                                pagination={false}
                            />
                        ) : null}
                    </Card>
                ) : null}
            </div>
        );

    }
}

export default Stats;
