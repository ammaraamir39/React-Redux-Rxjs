import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Card,
    Select,
    Button
} from 'antd';
import F from '../../../../Functions';
import moment from 'moment';
import { Translate } from 'react-translated';
import axios from 'axios';

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

class TotalOpportunitiesUncovered extends Component {
    state = {
        filter_lsp: '',
        expandStats: false,
        start_date: null,
        end_date: null,
        sent_to_vo: 0
    }
    componentDidMount() {
        let start_date = this.props.start_date;
        let end_date = this.props.end_date;

        this.setState({
            start_date,
            end_date
        })

        this.loadVoStats();
    }
    componentDidUpdate() {
        let start_date = this.props.start_date;
        let end_date = this.props.end_date;

        if (start_date !== this.state.start_date || end_date !== this.state.end_date) {
            this.setState({
                start_date,
                end_date
            }, () => {
                this.loadVoStats();
            })
        }
    }
    loadVoStats() {
        let start_date = this.state.start_date;
        let end_date = this.state.end_date;
        
        const today = new Date();

        if (!start_date) {
            start_date = new Date(today.getFullYear(), today.getMonth(), 1);
        }
        if (!end_date) {
            end_date = new Date(today.getFullYear(), today.getMonth()+1, 1);
        }

        start_date = moment(start_date).format('YYYY-MM-DD');
        end_date = moment(end_date).format('YYYY-MM-DD');

        axios.get('/api/b_file?q={"filters":[{"name":"vonboard","op":"==","val":"1"},{"name":"vo_sent_date","op":">=","val":"' + start_date + '"},{"name":"vo_sent_date","op":"<","val":"' + end_date + '"},{"name":"archive","op":"==","val":"0"},{"name":"deleted","op":"==","val":"0"}]}').then((res) => {
            this.setState({
                sent_to_vo: res.data.num_results
            })
        })
    }
    filterLSP = (val) => {
        this.setState({
            filter_lsp: val
        })
    }
    render() {

        const {
            dashboard,
            associations,
            user,
            loading,
            period,
            start_date,
            end_date
        } = this.props;

        let onboarding_calls = 0,
            need_attention = 0,
            sent_to_vonboarder = 0,
            umbrella_policy_uncovered = 0,
            umbrella_policy_sold = 0,
            cross_sell_policies_uncovered = 0,
            life_opportunities = 0,
            retirement_ops = 0,
            retirement_uncovered = 0,
            retirement_total = 0,
            no_follow_up = 0;

        if (dashboard.stats) {
            onboarding_calls = dashboard.stats.user_sent_to_ea;
            need_attention = dashboard.stats.user_need_attention;
            sent_to_vonboarder = dashboard.stats.user_sent_to_vonboarder;
            umbrella_policy_uncovered = dashboard.stats.user_umbrella_policy_uncovered;
            umbrella_policy_sold = dashboard.stats.user_umbrella_policy_sold;
            cross_sell_policies_uncovered = dashboard.stats.user_cross_sell_policies_uncovered;
            life_opportunities = dashboard.stats.user_life_opportunities;
            retirement_ops = dashboard.stats.user_retirement_ops;
            retirement_uncovered = dashboard.stats.user_retirement_uncovered;
            retirement_total = dashboard.stats.user_retirement_total;
            no_follow_up = dashboard.stats.user_no_follow_up
        }

        let date_url = '/lsp/' + user.id;
        if (period === 'from_to') {
            date_url = '/lsp/' + user.id + '/' + encodeURIComponent(moment(start_date).format('MM/DD/YYYY')) + '/' + encodeURIComponent(moment(end_date).format('MM/DD/YYYY'))
        }
        if (period === 'all_bfiles') {
            date_url = '/lsp/' + user.id + '?all_bfiles';
        }

        return (
            <div style={{marginBottom: 20}}>
                <Card
                    title={
                        <div>
                            <Icon type="appstore" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`My B-Files`} />
                        </div>
                    }
                    bordered={false}
                    className="statsDetails have_extra"
                >
                    <div className="statsGrid">
                        <Card bordered={false} loading={loading}>
                            <StatBox title="Sent for Welcome/Thank You Call" val={onboarding_calls} color={'red'} link={'/bfiles/sent-to-ea' + date_url} />
                            <StatBox title="Sent for Immediate Attention" val={need_attention} color={'green'} link={'/bfiles/need-attention' + date_url} />
                            {this.props.vonboard ? (
                                <StatBox title="Sent to Virtual Onboarder" val={this.state.sent_to_vo} color={'blue'} link={'/bfiles/sent-to-vonboarder' + date_url} />
                            ) : null}
                            <StatBox title="Umbrellas Uncovered (Not Sold)" val={umbrella_policy_uncovered} color={'purple'} link={'/bfiles/umbrella-uncovered' + date_url} />
                            <StatBox title="Umbrellas Sold" val={umbrella_policy_sold} color={'yellow'} link={'/bfiles/umbrella-sold' + date_url} />
                            <StatBox title="Households w/P&C Cross Sell Opportunities" val={cross_sell_policies_uncovered} color={'blue1'} link={'/bfiles/cross-sell-policies-uncovered' + date_url} />
                            <StatBox title="Life Opportunities" val={life_opportunities} color={'blue2'} link={'/bfiles/life-opportunities' + date_url} />
                            <StatBox title="Retirement Opportunities" val={retirement_ops} color={'blue3'} link={'/bfiles/retirement-ops' + date_url} />
                            <StatBox title="Total Retirement $'s Uncovered" val={F.dollar_format(retirement_uncovered)} color={'blue4'} link={'/bfiles/retirement-uncovered' + date_url} />
                            <StatBox title="Remaining Retirement Opportunities" val={F.dollar_format(retirement_total)} color={'green1'} link={'/bfiles/retirement-dollars' + date_url} />

                            <StatBox title="No follow-Up" val={no_follow_up} color={'blue5'} link={'/bfiles/no-follow-up' + date_url} />
                        </Card>
                    </div>
                </Card>
            </div>
        )
    }
}

export default TotalOpportunitiesUncovered
