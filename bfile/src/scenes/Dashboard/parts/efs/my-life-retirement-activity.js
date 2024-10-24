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

        let date_url = '/efs/' + user.id;
        if (period === 'from_to') {
            date_url = '/efs/' + user.id + '/' + encodeURIComponent(moment(start_date).format('MM/DD/YYYY')) + '/' + encodeURIComponent(moment(end_date).format('MM/DD/YYYY'))
        }
        if (period === 'all_bfiles') {
            date_url = '/efs/' + user.id + '?all_bfiles';
        }

        return (
            <div style={{marginBottom: 20}}>
                <Card
                    title={
                        <div>
                            <Icon type="appstore" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`My Life and/or Retirement Activity`} />
                        </div>
                    }
                    bordered={false}
                    className="statsDetails"
                >
                    <div className="statsGrid">
                        <Card bordered={false} loading={loading}>
                            <StatBox title="Sent to Financial Specialist" val={dashboard.stats.efs_sent_to_efs} color={'red'} link={'/bfiles/sent-to-financial' + date_url} />
                            <StatBox title="Life Opportunities" val={dashboard.stats.efs_life_opportunities} color={'blue2'} link={'/bfiles/life-opportunities' + date_url} />
                            <StatBox title="Retirement Opps" val={dashboard.stats.efs_retirement_ops} color={'blue3'} link={'/bfiles/retirement-ops' + date_url} />
                            <StatBox title="Total Retirement $'s Uncovered" val={F.dollar_format(dashboard.stats.efs_retirement_uncovered)} color={'blue4'} link={'/bfiles/retirement-uncovered' + date_url} />
                            <StatBox title="Remaining Retirement Opportunities" val={F.dollar_format(dashboard.stats.efs_retirement_total)} color={'green1'} link={'/bfiles/retirement-dollars' + date_url} />
                            <StatBox title="Appoint. Made" val={dashboard.stats.efs_appointments_made_total} color={'blue1'} link={'/bfiles/appointments-made-total' + date_url} />
                            <StatBox title="Appoint. Kept" val={dashboard.stats.efs_appointments_kept} color={'green'} link={'/bfiles/appointments-kept' + date_url} />
                            <StatBox title="Life/Financial Sale" val={dashboard.stats.efs_appointments_sold} color={'orange'} link={'/bfiles/appointments-sold' + date_url} />
                        </Card>
                    </div>
                </Card>
            </div>
        )
    }
}

export default AgencyLifeRetirementActivity
