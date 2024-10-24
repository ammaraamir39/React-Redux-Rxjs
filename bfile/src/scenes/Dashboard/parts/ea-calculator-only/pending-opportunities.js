import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Card,
    Radio
} from 'antd';
import moment from 'moment';
import { Translate } from 'react-translated';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class StatBox extends Component {
    render() {

        const { title, val, color } = this.props;

        const gridStyle = {
            width: '33.33%',
            textAlign: 'center'
        };

        return (
            <Card.Grid style={gridStyle} className={["card-"+color, "card-cols-3"]}>
                <div className="value"><Link to={this.props.link}>{val}</Link></div>
                <div className="title"><Translate text={title} /></div>
            </Card.Grid>
        )
    }
}

class PendingOpportunities extends Component {
    state = {
        callsType: "My Calls"
    }
    render() {

        const { callsType } = this.state;
        const { dashboard, loading, period, start_date, end_date } = this.props;

        if (typeof dashboard.stats === "undefined") {
            dashboard.stats = {
                pending_ea_leads: 0,
                pending_ea_saved_for_later: 0,
                renewals: 0
            }
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
                            <Icon type="clock-circle-o" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Pending Opportunities`} />
                        </div>
                    }
                    bordered={false}
                    className="statsDetails pendingOpportunities"
                    extra={
                        <RadioGroup onChange={(e) => this.setState({ callsType: e.target.value })} defaultValue={callsType}>
                            <RadioButton value="My Calls"><Translate text={`My Calls`} /></RadioButton>
                            <RadioButton value="Agency Calls"><Translate text={`Agency Calls`} /></RadioButton>
                        </RadioGroup>
                    }
                >
                    <div className="statsGrid">
                        {callsType === "My Calls" ? (
                            <Card bordered={false} loading={loading}>
                                <StatBox title="P&C Leads" val={dashboard.stats.pending_ea_leads} color={'red'} link={'/bfiles/pending-internet-leads-mycalls' + date_url} />
                                <StatBox title="Saved for Later" val={dashboard.stats.pending_ea_saved_for_later} color={'blue'} link={'/bfiles/pending-saved-for-later-mycalls' + date_url} />
                                <StatBox title="Renewals" val={dashboard.stats.renewals} color={'green'} link={'/bfiles/renewal-mycalls' + date_url} />
                            </Card>
                        ) : (
                            <Card bordered={false} loading={loading}>
                                <StatBox title="P&C Leads" val={dashboard.agency_stats.pending_leads} color={'red'} link={'/bfiles/pending-internet-leads' + date_url} />
                                <StatBox title="Saved for Later" val={dashboard.agency_stats.pending_saved_for_later} color={'blue'} link={'/bfiles/pending-saved-for-later' + date_url} />
                                <StatBox title="Renewals" val={dashboard.agency_stats.renewals} color={'green'} link={'/bfiles/renewal' + date_url} />
                            </Card>
                        )}
                    </div>
                </Card>
            </div>
        )
    }
}

export default PendingOpportunities
