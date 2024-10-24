import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Card,
    Select,
    Table,
    Rate,
    Button
} from 'antd';
import axios from 'axios';
import F from '../../../../Functions';
import moment from 'moment';
import { Translate } from 'react-translated';

const { Column } = Table;

const Option = Select.Option;

class UserBox extends Component {
    render() {

        const { user, stats, lsp } = this.props;
        const date1 = new Date(user.last_login);
        const date2 = new Date();
        const timeDiff = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        user.user_login_status = "green";
        if (diffDays > 7) {
            user.user_login_status = "orange";
        } else if (diffDays > 14) {
            user.user_login_status = "red";
        }

        const gridStyle = {
            width: '50%',
            padding: 0
        };

        const data = [{
            key: '1',
            name: 'Last Logged In',
            value: moment(new Date(user.last_login)).format("MM/DD/YYYY")
        },
        {
            key: '2',
            name: 'Sent for Follow Up',
            value: stats.user_need_attention + stats.user_sent_to_ea
        },
        /*{
            key: '2',
            name: 'Sent for Immediate Attention',
            value: stats.user_need_attention
        },{
            key: '3',
            name: 'Sent for Welcome/Thank You Call',
            value: stats.user_sent_to_ea
        },
        {
            key: '4',
            name: 'Sent for Financial Conversation',
            value: stats.user_sent_to_efs
        },*/
        {
            key: '5',
            name: 'Umbrellas Uncovered (Not Sold)',
            value: stats.user_umbrella_policy_uncovered
        },{
            key: '6',
            name: 'Umbrellas Sold',
            value: stats.user_umbrella_policy_sold
        },{
            key: '7',
            name: 'Cross Sell Opportunities',
            value: stats.user_cross_sell_policies_uncovered
        },{
            key: '8',
            name: 'Life Opportunities',
            value: stats.user_life_opportunities
        },{
            key: '9',
            name: 'Retirement Opportunities',
            value: stats.user_retirement_ops
        },{
            key: '10',
            name: 'Total Retirement $\'s Uncovered',
            value: F.dollar_format(stats.user_retirement_uncovered)
        },{
            key: '11',
            name: 'Remaining Retirement Opportunities',
            value: F.dollar_format(stats.user_retirement_total)
        }];

        for (var i = 0; i < data.length; i++) {
            data[i].name = (<Translate text={data[i].name} />);
        }

        return (
            <Card.Grid style={gridStyle}>
                <Table dataSource={data} pagination={false}>
                    <Column
                        title={
                            <div>
                                {user.first_name+" "+user.last_name}<br/>
                                {typeof lsp.lsp_rating !== "undefined" ? (
                                    <Rate disabled defaultValue={lsp.lsp_rating / 2} />
                                ) : (
                                    <Rate disabled defaultValue={0} />
                                )}
                            </div>
                        }
                        dataIndex="name"
                        key="name"
                    />
                    <Column
                        title={
                            <div>
                                <span className={"userStatus "+user.user_login_status}></span>
                            </div>
                        }
                        dataIndex="value"
                        key="value"
                    />
                </Table>
            </Card.Grid>
        )
    }
}

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
        period: this.props.period,
        start_date: this.props.start_date,
        end_date: this.props.end_date,
        vo_totals: {
            count: 0
        }
    }
    filterLSP = (val) => {
        this.setState({
            filter_lsp: val
        })
    }
    componentDidMount() {
        this.loadVoStats();
    }
    componentDidUpdate() {
        let { period, start_date, end_date } = this.props;

        if (period !== this.state.period || start_date !== this.state.start_date || end_date !== this.state.end_date) {
            this.setState({
                period,
                start_date,
                end_date
            }, () => {
                this.loadVoStats();
            })
        }
    }
    loadVoStats() {
        let { period, start_date, end_date } = this.state;

        const today = new Date();

        if (!start_date) {
            start_date = new Date(today.getFullYear(), today.getMonth(), 1);
        }
        if (!end_date) {
            end_date = new Date(today.getFullYear(), today.getMonth()+1, 1);
        }

        if (period === 'all_bfiles') {
            const today = new Date();
            start_date = new Date('2010-01-01');
            end_date = new Date(today.getFullYear(), today.getMonth()+1, 1);
        }

        start_date = moment(start_date).format('YYYY-MM-DD');
        end_date = moment(end_date).format('YYYY-MM-DD');
        
        axios.post('/api/agency_ea_vo_stats', {
            start_date,
            end_date
        }).then((res) => {
            this.setState({
                vo_totals: res.data
            })
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

        const {
            filter_lsp,
            expandStats
        } = this.state;

        let auto = 0,
            home = 0,
            boat = 0,
            motorcycle = 0,
            rv = 0,
            commercial = 0,
            umbrella = 0,
            life_insurance = 0,
            retirement_planning = 0;

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
            no_follow_up = 0,
            saved_for_later = 0;

        if (filter_lsp !== '') {
            for (let i = 0, len = dashboard.lsp.length; i < len; i++) {
                if (dashboard.lsp[i].user.email === filter_lsp) {
                    let total_vo = 0;
                    if (dashboard.lsp[i].user.email in this.state.vo_totals) {
                        total_vo = this.state.vo_totals[dashboard.lsp[i].user.email];
                    }
                    const user_stats = dashboard.lsp[i].stats;
                    onboarding_calls = user_stats.user_sent_to_ea;
                    no_follow_up = user_stats.user_no_follow_up;
                    need_attention = user_stats.user_need_attention;
                    sent_to_vonboarder = total_vo;
                    umbrella_policy_uncovered = user_stats.user_umbrella_policy_uncovered;
                    umbrella_policy_sold = user_stats.user_umbrella_policy_sold;
                    cross_sell_policies_uncovered = user_stats.user_cross_sell_policies_uncovered;
                    life_opportunities = user_stats.user_life_opportunities;
                    retirement_ops = user_stats.user_retirement_ops;
                    retirement_uncovered = user_stats.user_retirement_uncovered;
                    retirement_total = user_stats.user_retirement_total;
                    saved_for_later = user_stats.user_saved_for_later;
                    auto = user_stats.user_total_opportunities_uncovered_auto;
                    home = user_stats.user_total_opportunities_uncovered_home;
                    boat = user_stats.user_total_opportunities_uncovered_boat;
                    motorcycle = user_stats.user_total_opportunities_uncovered_motorcycle;
                    rv = user_stats.user_total_opportunities_uncovered_rv;
                    commercial = user_stats.user_total_opportunities_uncovered_commercial;
                    break;
                }
            }
        } else {
            onboarding_calls = dashboard.agency_stats.sent_to_ea;
            no_follow_up = dashboard.agency_stats.no_follow_up;
            need_attention = dashboard.agency_stats.need_attention;
            sent_to_vonboarder = this.state.vo_totals.count;
            umbrella_policy_uncovered = dashboard.agency_stats.umbrella_policy_uncovered;
            umbrella_policy_sold = dashboard.agency_stats.umbrella_policy_sold;
            cross_sell_policies_uncovered = dashboard.agency_stats.cross_sell_policies_uncovered;
            life_opportunities = dashboard.agency_stats.life_opportunities;
            retirement_ops = dashboard.agency_stats.retirement_ops;
            retirement_uncovered = dashboard.agency_stats.retirement_uncovered;
            retirement_total = dashboard.agency_stats.retirement_total;
            saved_for_later = dashboard.agency_stats.saved_for_later;

            auto = dashboard.agency_stats.total_opportunities_uncovered_auto;
            home = dashboard.agency_stats.total_opportunities_uncovered_home;
            boat = dashboard.agency_stats.total_opportunities_uncovered_boat;
            motorcycle = dashboard.agency_stats.total_opportunities_uncovered_motorcycle;
            rv = dashboard.agency_stats.total_opportunities_uncovered_rv;
            commercial = dashboard.agency_stats.total_opportunities_uncovered_commercial;
        }

        

        let date_url = '';
        if (period === 'from_to') {
            date_url = '/all/' + encodeURIComponent(moment(start_date).format('MM/DD/YYYY')) + '/' + encodeURIComponent(moment(end_date).format('MM/DD/YYYY'))
        }
        if (period === 'all_bfiles') {
            date_url = '?all_bfiles';
        }
        
        return (
            <div style={{marginBottom: 20}}>
                <Card
                    title={
                        <div>
                            <Icon type="appstore" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Total Opportunities Uncovered`} />
                        </div>
                    }
                    bordered={false}
                    className="statsDetails have_extra"
                    extra={
                        <Select defaultValue="" style={{ width: 200 }} onChange={this.filterLSP}>
                            <Option value=""><Translate text={`Select LSP`} />...</Option>
                            <Option value={user.email}><Translate text={`Me`} /></Option>
                            {associations.map((asso, i) => {
                                if (asso.user_type === "LSP") {
                                    return (
                                        <Option value={asso.email} key={i}>
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
                    <div className="statsGrid">
                        <Card bordered={false} loading={loading}>
                            <StatBox title="Auto" val={auto} color={'purple'} link={'/bfiles/total-opportunities-uncovered-auto' + date_url} />
                            <StatBox title="Home" val={home} color={'green'} link={'/bfiles/total-opportunities-uncovered-home' + date_url} />
                            <StatBox title="Boat" val={boat} color={'blue'} link={'/bfiles/total-opportunities-uncovered-boat' + date_url} />
                            <StatBox title="Motorcycle" val={motorcycle} color={'yellow'} link={'/bfiles/total-opportunities-uncovered-motorcycle' + date_url} />
                            <StatBox title="RV" val={rv} color={'blue2'} link={'/bfiles/total-opportunities-uncovered-rv' + date_url} />
                            <StatBox title="Commercial" val={commercial} color={'blue3'} link={'/bfiles/total-opportunities-uncovered-commercial' + date_url} />
                            <StatBox title="Umbrella" val={umbrella_policy_uncovered} color={'purple'} link={'/bfiles/umbrella-uncovered' + date_url} />
                            <StatBox title="Life Insurance" val={life_opportunities} color={'green'} link={'/bfiles/life-opportunities' + date_url} />
                            <StatBox title="Retirement Planning" color={'blue'} val={retirement_ops} color={'blue3'} link={'/bfiles/retirement-ops' + date_url} />


                        </Card>
                    </div>
                    {!loading ? (
                        <div className={(expandStats) ? 'usersGrid expand' : 'usersGrid'}>
                            <Card bordered={false} loading={loading}>
                                {dashboard.lsp.map((lsp, i) => {
                                    let showUserBox = true;
                                    if (filter_lsp !== "" && lsp.user.email !== filter_lsp) {
                                        showUserBox = false;
                                    }
                                    if (showUserBox) {
                                        return (
                                            <UserBox
                                                user={lsp.user}
                                                stats={lsp.stats}
                                                lsp={lsp}
                                                key={i}
                                            />
                                        )
                                    } else {
                                        return null;
                                    }
                                })}
                            </Card>
                            {!expandStats ? (
                                <Button type="primary" size="large" className="show_stats" onClick={() => this.setState({expandStats: !expandStats})}><Translate text={`Show Stats`} /></Button>
                            ) : (
                                <div className="hideStatsContainer">
                                    <Button type="primary" size="large" className="hide_stats" onClick={() => this.setState({expandStats: !expandStats})}><Translate text={`Hide Stats`} /></Button>
                                </div>
                            )}
                        </div>
                    ) : null}
                </Card>
            </div>
        )
    }
}

export default TotalOpportunitiesUncovered
