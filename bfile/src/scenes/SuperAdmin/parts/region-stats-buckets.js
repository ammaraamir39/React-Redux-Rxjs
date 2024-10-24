import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Card,
    Select,
    Button,
    Divider
} from 'antd';
import F from '../../../Functions';
import moment from 'moment';

const Option = Select.Option;

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
                <div className="title">{title}</div>
            </Card.Grid>
        )
    }
}

class Stats extends Component {
    render() {

        const {
            stat,
            loading,
            filter_agencies
        } = this.props;

        return (
            <div style={{marginBottom: 20}}>
                <Card
                    title={
                        <div>
                            <Icon type="appstore" style={{marginRight: 10,color:"#1890ff"}} />
                            {stat.agency_name}
                        </div>
                    }
                    bordered={true}
                    className="statsDetails"
                >
                    <div className="statsGrid">
                        <Card bordered={false} loading={loading}>
                            <StatBox title="Sent for Welcome/Thank You Call" val={stat.sent_to_ea} color={'red'} />
                            <StatBox title="Sent for Immediate Attention" val={stat.need_attention} color={'green'} />
                            <StatBox title="Sent to Virtual Onboarder" val={stat.sent_to_vonboarder} color={'blue'} />
                            <StatBox title="Umbrellas Uncovered (Not Sold)" val={stat.umbrella_policy_uncovered} color={'purple'} />
                            <StatBox title="Umbrellas Sold" val={stat.umbrella_policy_sold} color={'yellow'} />
                            <StatBox title="Households w/P&C Cross Sell Opportunities" val={stat.cross_sell_policies_uncovered} color={'blue1'} />
                            <StatBox title="Life Opportunities" val={stat.life_opportunities} color={'blue2'} />
                            <StatBox title="Retirement Opportunities" val={stat.retirement_ops} color={'blue3'} />
                            <StatBox title="Total Retirement $'s Uncovered" val={F.dollar_format(stat.retirement_uncovered)} color={'blue4'} />
                            <StatBox title="Remaining Retirement Opportunities" val={F.dollar_format(stat.retirement_total)} color={'green1'} />
                        </Card>
                    </div>
                    {filter_agencies === 'onboard' ? (
                        <div>
                            <Card bordered={false}>Virtual On-Board Stats (Completed)</Card>
                            <div className="statsGrid">
                                <Card bordered={false} loading={loading}>
                                    <StatBox title="Sent for Introduction to Financial Specialist" val={stat.vo_total_sent_to_efs} color={'red'} />
                                    <StatBox title="Not Interested" val={stat.vo_not_interested} color={'green'} />
                                    <StatBox title="Appointments Made" val={stat.vo_appointments_made} color={'blue'} />
                                    <StatBox title="Appointments Kept" val={stat.vo_appointments_kept} color={'purple'} />
                                    <StatBox title="Life/Financial Sale" val={stat.vo_appointments_sold} color={'yellow'} />
                                </Card>
                            </div>
                        </div>
                    ) : null}
                </Card>
            </div>
        )
    }
}

export default Stats
