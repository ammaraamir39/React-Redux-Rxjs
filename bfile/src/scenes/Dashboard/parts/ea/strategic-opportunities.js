import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Card
} from 'antd';
import moment from 'moment';
import { Translate } from 'react-translated';

class StatBox extends Component {
    render() {

        const { title, val, color } = this.props;

        const gridStyle = {
            width: '50%',
            textAlign: 'center'
        };

        return (
            <Card.Grid style={gridStyle} className={["card-"+color, "card-cols-2"]}>
                <div className="value"><Link to={this.props.link}>{val}</Link></div>
                <div className="title"><Translate text={title} /></div>
            </Card.Grid>
        )
    }
}

class StrategicOpportunities extends Component {
    render() {

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
                            <Icon type="line-chart" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Strategic Opportunities`} />
                        </div>
                    }
                    bordered={false}
                    className="statsDetails"
                >
                    <div className="statsGrid">
                        <Card bordered={false} loading={loading}>
                            <StatBox title="S&P 500" val={dashboard.stats.pending_sp_500} color={'red'} link={'/bfiles/pending-sp-500' + date_url} />
                            <StatBox title="VIP" val={dashboard.stats.pending_vip} color={'green'} link={'/bfiles/pending-vip' + date_url} />
                        </Card>
                    </div>
                </Card>
            </div>
        )
    }
}

export default StrategicOpportunities
