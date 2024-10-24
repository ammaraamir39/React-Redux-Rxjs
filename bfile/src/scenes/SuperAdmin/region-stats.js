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
import Stats from './parts/region-stats-buckets';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const today = new Date();

class RegionStats extends Component {
    state = {
        loading: false,
        users: [],
        page: 1,
        total_pages: 0,
        filter_agencies: 'active',
        region: '',
        state: 'all',
        start_date: new Date(today.getFullYear(), today.getMonth(), 1),
        end_date: new Date(today.getFullYear(), today.getMonth()+1, 1),
        region_stats: [],
        total_sent_to_ea: 0,
        total_need_attention: 0,
        total_sent_to_vonboarder: 0,
        total_umbrella_policy_uncovered: 0,
        total_umbrella_policy_sold: 0,
        total_cross_sell_policies_uncovered: 0,
        total_life_opportunities: 0,
        total_retirement_ops: 0,
        total_retirement_uncovered: 0,
        total_retirement_total: 0
    }
    componentDidMount = () => {
        this.loadStats();
    }
    loadStats = () => {
        const { filter_agencies, region, state, start_date, end_date } = this.state;
        if (region !== "") {
            this.setState({ loading: true });
            const from = moment(start_date).utc().format("YYYY-MM-DD");
            const to = moment(end_date).utc().format("YYYY-MM-DD");
            let total_sent_to_ea = 0,
                total_need_attention = 0,
                total_sent_to_vonboarder = 0,
                total_umbrella_policy_uncovered = 0,
                total_umbrella_policy_sold = 0,
                total_cross_sell_policies_uncovered = 0,
                total_life_opportunities = 0,
                total_retirement_ops = 0,
                total_retirement_uncovered = 0,
                total_retirement_total = 0;
            const url = "/api/region_stats/"+region+"/"+state+"/"+from+"/"+to+"?agencies="+filter_agencies;
            axios.get(url).then((res) => {
                const region_stats = res.data;
                if (region_stats > 0) {
                    for (var i = 0; i < region_stats.length; i++) {
                        total_sent_to_ea += region_stats[i].sent_to_ea;
                        total_need_attention += region_stats[i].need_attention;
                        total_sent_to_vonboarder += region_stats[i].sent_to_vonboarder;
                        total_umbrella_policy_uncovered += region_stats[i].umbrella_policy_uncovered;
                        total_umbrella_policy_sold += region_stats[i].umbrella_policy_sold;
                        total_cross_sell_policies_uncovered += region_stats[i].cross_sell_policies_uncovered;
                        total_life_opportunities += region_stats[i].life_opportunities;
                        total_retirement_ops += region_stats[i].retirement_ops;
                        total_retirement_uncovered += region_stats[i].retirement_uncovered;
                        total_retirement_total += region_stats[i].retirement_total;
                    }
                }
                this.setState({
                    loading: false,
                    region_stats,
                    total_sent_to_ea,
                    total_need_attention,
                    total_sent_to_vonboarder,
                    total_umbrella_policy_uncovered,
                    total_umbrella_policy_sold,
                    total_cross_sell_policies_uncovered,
                    total_life_opportunities,
                    total_retirement_ops,
                    total_retirement_uncovered,
                    total_retirement_total
                });
            }).catch(() => {
                this.setState({ loading: false });
            });
        }
    }
    download = () => {
        const { start_date, end_date, region, state, filter_agencies } = this.state;
        const from = moment(start_date).utc().format("YYYY-MM-DD");
        const to = moment(end_date).utc().format("YYYY-MM-DD");

        let url = "/api/region_stats_download/"+region+"/"+state+"/"+from+"/"+to;
        const params = [];
        if (filter_agencies === 'active') {
            params.push("active=true");
        }
        if (filter_agencies === 'onboard') {
            params.push("onboard=true");
        }
        if (params.length > 0) {
            url = url + "?" + params.join("&");
        }

        this.setState({ loading: true });
        axios.get(url).then((res) => {
            this.setState({ loading: false });
            if (res.data.success) {
                window.location = "http://dev.bfilesystem.com/bfile/assets/files/region/"+res.data.token+".csv";
            } else {
                message.error(F.translate(`Can't download the file.`));
            }
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Can't download the file.`));
        });
    }
    onChangeDateRange = (date, dateString) => {
        this.setState({
            start_date: date[0],
            end_date: date[1]
        }, () => {
            this.loadStats();
        })
    }
    render() {

        const {
            loading,
            region,
            users,
            state,
            page,
            total_pages,
            start_date,
            end_date,
            region_stats,
            filter_agencies,
            total_sent_to_ea,
            total_need_attention,
            total_sent_to_vonboarder,
            total_umbrella_policy_uncovered,
            total_umbrella_policy_sold,
            total_cross_sell_policies_uncovered,
            total_life_opportunities,
            total_retirement_ops,
            total_retirement_uncovered,
            total_retirement_total
        } = this.state;

        const dateFormat = 'MM/DD/YYYY';

        const regions = [
            {"name": "Northwest", "value":"northwest"},
            {"name": "West Central", "value":"west-central"},
            {"name": "California", "value":"california"},
            {"name": "Southwest", "value":"southwest"},
            {"name": "Southern", "value":"southern"},
            {"name": "Capital", "value":"capital"},
            {"name": "Midwest", "value":"midwest"},
            {"name": "New York", "value":"new-york"},
            {"name": "Northeast", "value":"northeast"},
            {"name": "Anj", "value":"anj"},
            {"name": "Southeast", "value":"southeast"},
            {"name": "Florida", "value":"florida"},
            {"name": "Texas", "value":"texas"},
            {"name": "North Central", "value":"north-central"}
        ];

        let states = [];
        if (region === "northwest") {
            states = [{"name":"Alaska","value":"AK"}, {"name":"Hawaii","value":"HI"}, {"name":"Washington","value":"WA"}, {"name":"Oregon","value":"OR"}, {"name":"Idaho","value":"ID"}];
        }
        if (region === "west-central") {
            states = [{"name":"Montana","value":"MT"}, {"name":"North Dakota","value":"ND"}, {"name":"Wyoming","value":"WY"}, {"name":"South Dakota","value":"SD"}, {"name":"Nebraska","value":"NE"}, {"name":"Colorado","value":"CO"}, {"name":"Kansas","value":"KS"}, {"name":"Iowa","value":"IA"}, {"name":"Missouri","value":"MO"}];
        }
        if (region === "california") {
            states = [{"name":"California","value":"CA"}];
        }
        if (region === "southwest") {
            states = [{"name":"Nevada","value":"NV"}, {"name":"Utah","value":"UT"}, {"name":"Arizona","value":"AZ"}, {"name":"New Mexico","value":"NM"}, {"name":"Oklahoma","value":"OK"}];
        }
        if (region === "southern") {
            states = [{"name":"Kentucky","value":"KY"}, {"name":"Tennessee","value":"TN"}, {"name":"Arkansas","value":"AR"}, {"name":"Mississippi","value":"MS"}, {"name":"Louisiana","value":"LA"}];
        }
        if (region === "capital") {
            states = [{"name":"West Virginia","value":"WV"}, {"name":"Virginia","value":"VA"}, {"name":"Maryland","value":"MD"}, {"name":"Delaware","value":"DE"}, {"name":"District Of Columbia","value":"DC"}];
        }
        if (region === "midwest") {
            states = [{"name":"Minnesota","value":"MN"}, {"name":"Wisconsin","value":"WI"}, {"name":"Illinois","value":"IL"}];
        }
        if (region === "new-york") {
            states = [{"name":"New York","value":"NY"}];
        }
        if (region === "northeast") {
            states = [{"name":"Pennsylvania","value":"PA"}, {"name":"Vermont","value":"VT"}, {"name":"Maine","value":"ME"}, {"name":"New Hampshire","value":"NH"}, {"name":"Massachusetts","value":"MA"}, {"name":"Rhode Island","value":"RI"}, {"name":"Connecticut","value":"CT"}];
        }
        if (region === "anj") {
            states = [{"name":"New Jersey","value":"NJ"}];
        }
        if (region === "southeast") {
            states = [{"name":"Alabama","value":"AL"}, {"name":"Georgia","value":"GA"}, {"name":"South Carolina","value":"SC"}, {"name":"North Carolina","value":"NC"}];
        }
        if (region === "florida") {
            states = [{"name":"Florida","value":"FL"}];
        }
        if (region === "texas") {
            states = [{"name":"Texas","value":"TX"}];
        }
        if (region === "north-central") {
            states = [{"name":"Michigan","value":"MI"}, {"name":"Indiana","value":"IN"}, {"name":"Ohio","value":"OH"}];
        }

        const data = [];
        for (let i=0; i<users.length; i++) {
            let user = users[i];
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="area-chart" style={{marginRight: 10,color:"#1890ff"}} />
                            Region Stats
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <div>
                            <Button onClick={() => this.download()}>Download CSV</Button>
                        </div>
                    }
                >
                    <Card bordered={false} className="filters">
                        <Row gutter={16}>
                            <Row gutter={16}>
                                <Col md={12} span={24}>
                                    <Select value={filter_agencies} style={{ width: '30%' }} onChange={(value) => this.setState({ filter_agencies: value }, () => this.loadStats())}>
                                        <Option value={'active'}>{"All Active Agencies"}</Option>
                                        <Option value={'software'}>{"Software Only"}</Option>
                                        <Option value={'onboard'}>{"B-Onboard"}</Option>
                                    </Select>
                                    <Select defaultValue={region} style={{ width: '30%', marginLeft: 10 }} onChange={(value) => this.setState({ region: value, state: 'all' }, () => this.loadStats())}>
                                        <Option value={''}>{"Select a Region..."}</Option>
                                        {regions.map((item, i) => (
                                            <Option value={item.value} key={i}>{item.name}</Option>
                                        ))}
                                    </Select>
                                    {region !== '' ? (
                                        <Select defaultValue={state} style={{ width: '30%', marginLeft: 10 }} onChange={(value) => this.setState({ state: value }, () => this.loadStats())}>
                                            <Option value={'all'}>{"Select a State..."}</Option>
                                            {states.map((item, i) => (
                                                <Option value={item.value} key={i}>{item.name}</Option>
                                            ))}
                                        </Select>
                                    ) : null}
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
                    <div style={{padding: 20}}>
                        {region_stats.map((region, i) => (
                            <Stats stat={region} key={i} filter_agencies={filter_agencies} />
                        ))}
                    </div>
                </Card>
            </div>
        );

    }
}

export default RegionStats;
