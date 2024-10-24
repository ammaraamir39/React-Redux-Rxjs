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
                pending_financial_calls: 0,
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
                <Card
                    title={
                        <div>
                            <Icon type="phone" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`My Life & Retirement Opportunities`} />
                        </div>
                    }
                    className="financial-circle"
                    loading={loading}
                    bordered={false}
                >
                    <div className="chartVal">
                        <Link to={'/bfiles/pending-financial-calls' + date_url}>{dashboard.stats.pending_financial_calls}</Link>
                    </div>
                </Card>
                <Row className="footerStats">
                    <Col md={12} span={24}>
                        <Card loading={loading} className="card-small card-red" hoverable bordered={false}>
                            <div className="chartVal">
                                <Link to={'/bfiles/pending-financial-attempted' + date_url}>{dashboard.stats.pending_attempted_financial_calls}</Link>
                            </div>
                            <div className="title"><Translate text={`Attempted to Reach`} /></div>
                        </Card>
                    </Col>
                    <Col md={12} span={24}>
                        <Card loading={loading} className="card-small card-blue" hoverable bordered={false}>
                            <div className="chartVal">
                                <Link to={'/bfiles/pending-appointments-made' + date_url}>{dashboard.stats.pending_appointments_made}</Link>
                            </div>
                            <div className="title"><Translate text={`Appointments Made`} /></div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default FinancialCircle;
