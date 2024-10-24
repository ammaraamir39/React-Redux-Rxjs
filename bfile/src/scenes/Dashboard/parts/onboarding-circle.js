import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Row,
    Col,
    Card,
    Button
} from 'antd';
import moment from 'moment';
import { Translate } from 'react-translated';

class OnboardingCircle extends Component {
    state = {
        pending: false
    }
    togglePending = () => {
        this.setState({
            pending: !this.state.pending
        })
    }
    render() {

        const { dashboard, loading, period, start_date, end_date } = this.props;

        if (typeof dashboard.stats === "undefined") {
            dashboard.stats = {
                onboarding_calls: 0,
                onboarding_attempts: 0,
                financial_intro: 0
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
                            <Translate text={`Welcome/Thank You Calls`} />
                        </div>
                    }
                    className="onboarding-circle"
                    loading={loading}
                    bordered={false}
                >
                    {this.state.pending ? (
                        <div>
                            <div className="chartVal">
                                <Link to={'/bfiles/pending-onboarding-calls' + date_url}>{dashboard.stats.pending_onboarding_calls}</Link>
                            </div>
                            <Button onClick={this.togglePending.bind(this)} icon="close"> <Translate text={`Hide Pending B-Files`} /></Button>
                        </div>
                    ) : (
                        <div>
                            <div className="chartVal">
                                <Link to={'/bfiles/onboarding-calls' + date_url}>{dashboard.stats.onboarding_calls}</Link>
                            </div>
                            <Button onClick={this.togglePending.bind(this)} icon="clock-circle-o"> <Translate text={`Show Pending B-Files`} /></Button>
                        </div>
                    )}
                </Card>
                <Row className="footerStats">
                    <Col md={12} span={24}>
                        <Card loading={loading} className="card-small card-red" hoverable bordered={false}>
                            <div className="chartVal">
                                {this.state.pending ? (
                                    <Link to={'/bfiles/pending-onboarding-calls-attempted' + date_url}>{dashboard.stats.pending_onboarding_attempts}</Link>
                                ) : (
                                    <Link to={'/bfiles/onboarding-calls-attempted' + date_url}>{dashboard.stats.onboarding_attempts}</Link>
                                )}
                            </div>
                            <div className="title"><Translate text={`Attempted to Reach`} /></div>
                        </Card>
                    </Col>
                    <Col md={12} span={24}>
                        <Card loading={loading} className="card-small card-blue" hoverable bordered={false}>
                            <div className="chartVal">
                                {this.state.pending ? (
                                    <Link to={'/bfiles/pending-financial-intro' + date_url}>{dashboard.stats.pending_financial_intro}</Link>
                                ) : (
                                    <Link to={'/bfiles/financial-intro' + date_url}>{dashboard.stats.financial_intro}</Link>
                                )}
                            </div>
                            <div className="title"><Translate text={`Life & Retirement Introductions`} /></div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default OnboardingCircle;
