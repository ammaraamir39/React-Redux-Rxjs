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
    render() {

        let { stats, loading } = this.props;

        if (typeof stats.total_sent_to_efs === "undefined") {
            stats = {
                total_sent_to_efs: 0,
                not_interested: 0,
                not_reached: 0,
                appointments_made: 0,
                appointments_kept: 0,
                appointments_sold: 0
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
                            <StatBox title="Sent for Introduction to Financial Specialist" val={stats.total_sent_to_efs} color={'red'} />
                            <StatBox title="Not Interested" val={stats.not_interested} color={'green'} />
                            <StatBox title="Not Reached" val={stats.not_reached} color={'blue'} />
                            <StatBox title="Appointments Made" val={stats.appointments_made} color={'purple'} />
                            <StatBox title="Appointments Kept" val={stats.appointments_kept} color={'yellow'} />
                            <StatBox title="Appointments Sold" val={stats.appointments_sold} color={'blue4'} />
                        </Card>
                    </div>
                </Card>
            </div>
        )
    }
}

export default Stats
