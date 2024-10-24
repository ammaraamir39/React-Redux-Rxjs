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

const { Column } = Table;

const Option = Select.Option;

class UserBox extends Component {
    render() {

        const { user, stats } = this.props;

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
        },{
            key: '2',
            name: 'Received by Financial or Life Specialist',
            value: stats.efs_sent_to_efs
        },{
            key: '3',
            name: 'Life Opportunities',
            value: stats.efs_life_opportunities
        },{
            key: '4',
            name: 'Retirement Opportunities',
            value: stats.efs_retirement_ops
        },{
            key: '5',
            name: 'Remaining Retirement Dollars',
            value: F.dollar_format(stats.efs_retirement_total)
        },{
            key: '6',
            name: 'Appointments Made',
            value: stats.efs_appointments_made_total
        },{
            key: '7',
            name: 'Appointments Kept',
            value: stats.efs_appointments_kept
        },{
            key: '8',
            name: 'Life/Financial Sale',
            value: stats.efs_appointments_sold
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
            width: '25%',
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

class AgencyLifeRetirementActivity extends Component {
    state = {
        filter_efs: '',
        expandStats: false
    }
    filterEFS = (val) => {
        this.setState({
            filter_efs: val
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
            filter_efs,
            expandStats
        } = this.state;

        let sent_to_efs = 0,
            life_opportunities = 0,
            retirement_ops = 0,
            retirement_uncovered = 0,
            retirement_total = 0,
            appointments_made = 0,
            appointments_kept = 0,
            appointments_sold = 0;

        if (filter_efs !== '') {
            for (let i = 0, len = dashboard.efs.length; i < len; i++) {
                if (dashboard.efs[i].user.email === filter_efs) {
                    const user_stats = dashboard.efs[i].stats;
                    sent_to_efs = user_stats.efs_sent_to_efs;
                    life_opportunities = user_stats.efs_life_opportunities;
                    retirement_ops = user_stats.efs_retirement_ops;
                    retirement_uncovered = user_stats.efs_retirement_uncovered;
                    retirement_total = user_stats.efs_retirement_total;
                    appointments_made = user_stats.efs_appointments_made_total;
                    appointments_kept = user_stats.efs_appointments_kept;
                    appointments_sold = user_stats.efs_appointments_sold;
                    break;
                }
            }
        } else {
            sent_to_efs = dashboard.agency_stats.sent_to_efs;
            life_opportunities = dashboard.agency_stats.financial_life_opportunities;
            retirement_ops = dashboard.agency_stats.financial_retirement_ops;
            retirement_uncovered = dashboard.agency_stats.financial_retirement_uncovered;
            retirement_total = dashboard.agency_stats.financial_retirement_total;
            appointments_made = dashboard.agency_stats.financial_appointments_made_total;
            appointments_kept = dashboard.agency_stats.financial_appointments_kept;
            appointments_sold = dashboard.agency_stats.financial_appointments_sold;
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
                            <Translate text={`Agency Life and/or Retirement Activity`} />
                        </div>
                    }
                    bordered={false}
                    className="statsDetails have_extra"
                    extra={
                        <Select defaultValue="" style={{ width: 200 }} onChange={this.filterEFS}>
                            <Option value=""><Translate text={`Select Financial`} />...</Option>
                            <Option value={user.email}>Me</Option>
                            {associations.map((asso, i) => {
                                if (asso.user_type === "EFS" || (asso.user_type === "LSP" && asso.have_financial_role)) {
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
                            <StatBox title="Received by Financial or Life Specialist" val={sent_to_efs} color={'red'} link={'/bfiles/sent-to-financial' + date_url} />
                            <StatBox title="Life Opportunities" val={life_opportunities} color={'blue2'} link={'/bfiles/life-opportunities' + date_url} />
                            <StatBox title="Retirement Opps" val={retirement_ops} color={'blue3'} link={'/bfiles/retirement-ops' + date_url} />
                            <StatBox title="Total Retirement $'s Uncovered" val={F.dollar_format(retirement_uncovered)} color={'blue4'} link={'/bfiles/retirement-uncovered' + date_url} />
                            <StatBox title="Remaining Retirement Opportunities" val={F.dollar_format(retirement_total)} color={'green1'} link={'/bfiles/retirement-dollars' + date_url} />
                            <StatBox title="Appoint. Made" val={appointments_made} color={'blue1'} link={'/bfiles/appointments-made-total' + date_url} />
                            <StatBox title="Appoint. Kept" val={appointments_kept} color={'green'} link={'/bfiles/appointments-kept' + date_url} />
                            <StatBox title="Life/Financial Sale" val={appointments_sold} color={'orange'} link={'/bfiles/appointments-sold' + date_url} />
                        </Card>
                    </div>
                    {!loading ? (
                        <div className={(expandStats) ? 'usersGrid expand' : 'usersGrid'}>
                            <Card bordered={false} loading={loading}>
                                {dashboard.efs.map((efs, i) => {
                                    let showUserBox = true;
                                    if (filter_efs !== "" && efs.user.email !== filter_efs) {
                                        showUserBox = false;
                                    }
                                    if (showUserBox) {
                                        return (
                                            <UserBox
                                                user={efs.user}
                                                stats={efs.stats}
                                                efs={efs}
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

export default AgencyLifeRetirementActivity
