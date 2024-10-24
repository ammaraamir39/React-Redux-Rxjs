import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Card
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';

class StatBox extends Component {
    render() {

        const { title, val, color } = this.props;

        const gridStyle = {
            width: '20%',
            textAlign: 'center'
        };

        return (
            <Card.Grid style={gridStyle} className={"card-"+color}>
                {'link' in this.props ? (
                    <div className="value"><Link to={this.props.link}>{val}</Link></div>
                ) : (
                    <div className="value">{val}</div>
                )}
                <div className="title"><Translate text={title} /></div>
            </Card.Grid>
        )
    }
}

class Stats extends Component {
    render() {

        let { stats, loading, period, start_date, end_date } = this.props;

        if (typeof stats.review_upcoming_calls === "undefined") {
            stats = {
                review_upcoming_calls: 0,
                review_calls_made: 0,
                review_appointments_scheduled: 0,
                review_not_reached: 0,
                review_not_interested: 0
            }
        }
        
        let date_url = '';
        if (period === 'from_to') {
            date_url = '/all/' + encodeURIComponent(moment(start_date).format('MM/DD/YYYY')) + '/' + encodeURIComponent(moment(end_date).format('MM/DD/YYYY'))
        }
        if (period === 'all_bfiles') {
            date_url = '?all_bfiles';
        }

        if (!stats.review_not_reached) stats.review_not_reached = 0;
        if (!stats.review_not_interested) stats.review_not_interested = 0;
        stats.review_calls_made = stats.review_appointments_scheduled + stats.review_not_reached + stats.review_not_interested;
        
        return (
            <div style={{marginBottom: 20}}>
                <Card
                    title={
                        <div>
                            <Icon type="appstore" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Stats`} />
                        </div>
                    }
                    bordered={false}
                    className="statsDetails"
                >
                    <div className="statsGrid">
                        <Card bordered={false} loading={loading}>
                            <StatBox title="Upcoming Calls" val={stats.review_upcoming_calls || 0} color={'red'} link={'/bfiles/rs-upcoming-calls' + date_url} />
                            <StatBox title="Calls Made" val={stats.review_calls_made || 0} color={'green'} link={'/bfiles/rs-calls-made' + date_url} />
                            <StatBox title="Appointments Scheduled" val={stats.review_appointments_scheduled || 0} color={'blue'} link={'/bfiles/rs-appointments-scheduled' + date_url} />
                            <StatBox title="Not Reached" val={stats.review_not_reached || 0} color={'purple'} link={'/bfiles/review-scheduler-not-reached' + date_url} />
                            <StatBox title="Not Interested" val={stats.review_not_interested || 0} color={'yellow'} link={'/bfiles/review-scheduler-not-interested' + date_url} />
                        </Card>
                    </div>
                </Card>
            </div>
        )
    }
}

export default Stats
