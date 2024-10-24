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
        },{
            key: '2',
            name: 'Sent for Introduction to Financial Specialist',
            value: stats.sent_to_efs
        },{
            key: '3',
            name: 'Not Interested',
            value: stats.not_interested
        },{
            key: '4',
            name: 'Appointments Made',
            value: stats.appointments_made_total
        },{
            key: '5',
            name: 'Appointments Kept',
            value: stats.appointments_kept
        },{
            key: '6',
            name: 'Life/Financial Sale',
            value: stats.appointments_sold
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
            width: '16.66%',
            textAlign: 'center'
        };

        return (
            <Card.Grid style={gridStyle} className={"card-"+color}>
                <div className="value">{val}</div>
                <div className="title"><Translate text={title} /></div>
            </Card.Grid>
        )
    }
}

class Stats extends Component {
    state = {
        filter_lsp: '',
        expandStats: false
    }
    filterLSP = (val) => {
        this.setState({
            filter_lsp: val
        })
    }
    render() {

        let {
            dashboard,
            loading,
            associations
        } = this.props;

        const {
            filter_lsp,
            expandStats
        } = this.state;

        let sent_to_efs = 0,
            not_interested = 0,
            not_reached = 0,
            appointments_made = 0,
            appointments_kept = 0,
            appointments_sold = 0;

        if (typeof dashboard.vonboarder !== 'undefined') {
            for (let i = 0, len = dashboard.vonboarder.length; i < len; i++) {
                if (filter_lsp === '' || dashboard.vonboarder[i].user.email === filter_lsp) {
                    const user_stats = dashboard.vonboarder[i].stats;
                    sent_to_efs = sent_to_efs + user_stats.sent_to_efs;
                    not_interested = not_interested + user_stats.not_interested;
                    not_reached = not_reached + user_stats.not_reached;
                    appointments_made = appointments_made + user_stats.appointments_made_total;
                    appointments_kept = appointments_kept + user_stats.appointments_kept;
                    appointments_sold = appointments_sold + user_stats.appointments_sold;

                    if (dashboard.vonboarder[i].user.email === filter_lsp) break;
                }
            }
        } else {
            dashboard.vonboarder = [];
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
                    className="statsDetails have_extra2"
                    extra={
                        <Select defaultValue="" style={{ width: 200 }} onChange={this.filterLSP}>
                            <Option value=""><Translate text={`Select Virtual Onboarder`} />...</Option>
                            {associations.map((asso, i) => {
                                if (asso.user_type === "VONBOARDER") {
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
                            <StatBox title="Sent for Introduction to Financial Specialist" val={sent_to_efs} color={'red'} />
                            <StatBox title="Not Interested" val={not_interested} color={'green'} />
                            <StatBox title="Not Reached" val={not_reached} color={'blue'} />
                            <StatBox title="Appointments Made" val={appointments_made} color={'purple'} />
                            <StatBox title="Appointments Kept" val={appointments_kept} color={'yellow'} />
                            <StatBox title="Appointments Sold" val={appointments_sold} color={'blue4'} />
                        </Card>
                    </div>
                </Card>
                {!loading ? (
                    <div className={(expandStats) ? 'usersGrid expand' : 'usersGrid'}>
                        <Card bordered={false} loading={loading}>
                            {dashboard.vonboarder.map((lsp, i) => {
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
            </div>
        )
    }
}

export default Stats
