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
            width: '20%',
            textAlign: 'center'
        };

        return (
            <Card.Grid style={gridStyle} className={["card-"+color, "card-cols-1"]}>
                <div className="value"><Link to={this.props.link}>{val}</Link></div>
                <div className="title"><Translate text={title} /></div>
            </Card.Grid>
        )
    }
}

class ReviewScheduledCalls extends Component {
    state = {
        callsType: "My Calls",
        user_t:this.props.user_t
    }
    render() {

        const {
            dashboard, loading, period, start_date, end_date
        } = this.props;

        const { callsType } = this.state;

        if (typeof dashboard.agency_stats === "undefined") {
            dashboard.agency_stats = {
                review_scheduler_bfiles: 0
            }
        }

        if(dashboard.agency_stats.review_scheduler_bfiles == undefined) dashboard.agency_stats.review_scheduler_bfiles=0

        let date_url = '';
        if (period === 'from_to') {
            date_url = '/all/' + encodeURIComponent(moment(start_date).format('MM/DD/YYYY')) + '/' + encodeURIComponent(moment(end_date).format('MM/DD/YYYY'))
        }
        if (period === 'all_bfiles') {
            date_url = '?all_bfiles';
        }

        return (
            <div style={{marginBottom: 20}}>
                {this.state.user_t !== 'agency_manager' ? (
                <Card
                    title={
                        <div>
                            <Icon type="check-circle-o" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Review Calls`} />
                        </div>
                    }
                    bordered={false}
                    extra={
                        <RadioGroup onChange={(e) => this.setState({ callsType: e.target.value })} defaultValue={callsType}>
                            <RadioButton value="My Calls"><Translate text={`My Calls`} /></RadioButton>
                            <RadioButton value="Agency Calls"><Translate text={`Agency Calls`} /></RadioButton>
                        </RadioGroup>
                    }
                    className="statsDetails pendingOpportunities"
                >
                    <div className="statsGrid">
                        {callsType === "My Calls" ? (
                            <Card bordered={false} loading={loading}>
                                <StatBox title="Review Scheduled Calls" val={dashboard.stats.user_review_scheduler_bfiles} color={'red'} link={'/bfiles/review-scheduler-bfiles-mycalls' + date_url} />
                                <StatBox title="Appointment Kept" val={dashboard.stats.efs_appointments_kept} color={'red'} link={'/bfiles/review-scheduler-bfiles-mycalls' + date_url} />
                                <StatBox title="Appointment Sold" val={dashboard.stats.efs_appointments_sold} color={'red'} link={'/bfiles/review-scheduler-bfiles-mycalls' + date_url} />
                                <StatBox title="Appointments Total" val={dashboard.stats.efs_appointments_made_total} color={'red'} link={'/bfiles/review-scheduler-bfiles-mycalls' + date_url} />
                            </Card>
                        ) : (
                            <Card bordered={false} loading={loading} className={["review_schedule_full_width"]}>
                                <StatBox title="Review Scheduled Calls" val={dashboard.agency_stats.review_scheduler_bfiles} color={'red'} link={'/bfiles/review-scheduler-bfiles' + date_url} />
                            </Card>
                        )}
                    </div>
                </Card>
                ):(
                    <Card
                    title={
                        <div>
                            <Icon type="check-circle-o" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Review Calls`} />
            </div>
                    }
                    bordered={false}
                 
                    className="statsDetails pendingOpportunities"
                >
                    <div className="statsGrid">
                  
                            <Card bordered={false} loading={loading}>
                                <StatBox title="Review Scheduled Calls" val={dashboard.stats.user_review_scheduler_bfiles} color={'red'} link={'/bfiles/review-scheduler-bfiles-mycalls' + date_url} />
                                <StatBox title="Appointment Kept" val={dashboard.stats.efs_appointments_kept} color={'red'} link={'/bfiles/review-scheduler-bfiles-mycalls' + date_url} />
                                <StatBox title="Appointment Sold" val={dashboard.stats.efs_appointments_sold} color={'red'} link={'/bfiles/review-scheduler-bfiles-mycalls' + date_url} />
                                <StatBox title="Appointments Total" val={dashboard.stats.efs_appointments_made_total} color={'red'} link={'/bfiles/review-scheduler-bfiles-mycalls' + date_url} />
                            </Card>
                   
                        
                    </div>
                </Card>
                )}
                
            </div>
        )
    }
}

export default ReviewScheduledCalls
