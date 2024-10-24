import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Row,
    Col,
    Card
} from 'antd';
import moment from 'moment';
import { Translate } from 'react-translated';

class FinancialCircle extends Component {
    render() {

        const { dashboard, loading, period, start_date, end_date } = this.props;

        if (typeof dashboard.stats === "undefined") {
            dashboard.stats = {
                pending_financial_calls: 0
            }
        }
        if (typeof dashboard.agency_stats === "undefined") {
            dashboard.agency_stats = {
                pending_attempted_financial_calls: 0,
                pending_appointments_made: 0
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
                <Row gutter={16}>
                    <Col md={12} span={24}>
                        <Card
                            title={
                                <div>
                                    <Icon type="phone" style={{marginRight: 10,color:"#1890ff"}} />
                                    <Translate text={`Immediate Life and Retirement Opportunities`} />
                                </div>
                            }
                            loading={loading}
                            bordered={false}
                        >
                            <div className="chartVal">
                                <Link to={'/bfiles/pending-financial-calls' + date_url}>{dashboard.stats.pending_financial_calls}</Link>
                            </div>
                        </Card>
                    </Col>
                    <Col md={12} span={24}>
                        <div className="statsGrid topStatsGrid">
                            <Card bordered={false} loading={loading}>
                                <Card.Grid style={{width: '50%'}} className={"card-red"}>
                                    <div className="value"><Link to={'/bfiles/pending-financial-attempted' + date_url}>{dashboard.agency_stats.pending_attempted_financial_calls}</Link></div>
                                    <div className="title"><Translate text={`Attempted Life & Retirement Calls`} /></div>
                                </Card.Grid>
                                <Card.Grid style={{width: '50%'}} className={"card-yellow"}>
                                    <div className="value"><Link to={'/bfiles/pending-sp-500' + date_url}>{dashboard.agency_stats.pending_sp_500}</Link></div>
                                    <div className="title"><Translate text={`S&P500`} /></div>
                                </Card.Grid>
                                <Card.Grid style={{width: '50%'}} className={"card-blue"}>
                                    <div className="value"><Link to={'/bfiles/pending-appointments-made' + date_url}>{dashboard.agency_stats.pending_appointments_made}</Link></div>
                                    <div className="title"><Translate text={`Appointments Made`} /></div>
                                </Card.Grid>
                                <Card.Grid style={{width: '50%'}} className={"card-orange"}>
                                    <div className="value"><Link to={'/bfiles/pending-vip' + date_url}>{dashboard.agency_stats.pending_vip}</Link></div>
                                    <div className="title"><Translate text={`VIP`} /></div>
                                </Card.Grid>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default FinancialCircle;
