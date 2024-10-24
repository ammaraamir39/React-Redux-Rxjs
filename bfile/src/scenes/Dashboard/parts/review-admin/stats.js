import React, { Component } from 'react';
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
                <div className="value">{val}</div>
                <div className="title"><Translate text={title} /></div>
            </Card.Grid>
        )
    }
}

class Stats extends Component {
    render() {

        let { dashboard, loading } = this.props;

        if (typeof dashboard.agency_stats === "undefined") {
            dashboard = {};
            dashboard.agency_stats = {
                review_upcoming_calls: 0,
                review_calls_made: 0,
                review_appointments_scheduled: 0,
                review_not_reached: 0,
                review_not_interested: 0
            }
        }

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
                            <StatBox title="Upcoming Calls" val={dashboard.agency_stats.review_upcoming_calls} color={'red'} />
                            <StatBox title="Calls Made" val={dashboard.agency_stats.review_calls_made} color={'green'} />
                            <StatBox title="Appointments Scheduled" val={dashboard.agency_stats.review_appointments_scheduled} color={'blue'} />
                            <StatBox title="Not Reached" val={dashboard.agency_stats.review_not_reached} color={'purple'} />
                            <StatBox title="Not Interested" val={dashboard.agency_stats.review_not_interested} color={'yellow'} />
                        </Card>
                    </div>
                </Card>
            </div>
        )
    }
}

export default Stats
