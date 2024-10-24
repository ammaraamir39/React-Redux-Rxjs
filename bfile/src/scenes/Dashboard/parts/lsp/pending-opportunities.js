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
import axios from 'axios';
import { Translate } from 'react-translated';

class StatBox extends Component {
    render() {

        const { title, val, color } = this.props;

        const gridStyle = {
            width: '25%',
            textAlign: 'center'
        };

        return (
            <Card.Grid style={gridStyle} className={["card-"+color, "card-cols-4"]}>
                <div className="value"><Link to={this.props.link}>{val}</Link></div>
                <div className="title"><Translate text={title} /></div>
            </Card.Grid>
        )
    }
}

class PendingOpportunities extends Component {
    state = {
        filter_efs: '',
        expandStats: false,
        referral_leads: 0
    }
    componentDidMount = () => {
        axios.get('/api/referrals_data?page=1&q={"filters":[{"name":"status","op":"==","val":3},{"name":"bfile","op":"has","val":{"name":"deleted","op":"==","val":0}}]}').then((res) => {
            this.setState({
                referral_leads: res.data.num_results
            })
        });
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

        if (typeof dashboard.stats === 'undefined') {
            dashboard.stats = {
                pending_ea_saved_for_later: 0,
                renewals: 0,
                review_scheduler_bfiles: 0
            }
        }
        let date_url = '';
        if (period === 'from_to') {
            date_url = '/' + encodeURIComponent(moment(start_date).format('MM/DD/YYYY')) + '/' + encodeURIComponent(moment(end_date).format('MM/DD/YYYY'))
        }
        if (period === 'all_bfiles') {
            date_url = '?all_bfiles';
        }
        
        return (
            <div style={{marginBottom: 20}}>
                <Card
                    title={
                        <div>
                            <Icon type="appstore" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Pending Opportunities`} />
                        </div>
                    }
                    bordered={false}
                    className="statsDetails have_extra"
                >
                    <div className="statsGrid">
                        <Card bordered={false} loading={loading}>
                            <StatBox title="P&C Referrals Leads" val={this.state.referral_leads} color={'red'} link={'/bfiles/pc-referrals-leads' + date_url} />
                            <StatBox title="Saved for Later" val={dashboard.stats.pending_ea_saved_for_later} color={'blue2'} link={'/bfiles/pending-saved-for-later' + date_url} />
                            <StatBox title="P&C Reviews" val={dashboard.stats.user_pc_reviews} color={'blue3'} link={'/bfiles/pc-reviews' + date_url} />
                            <StatBox title="Review Scheduled Calls" val={dashboard.stats.review_scheduler_bfiles} color={'blue4'} link={'/bfiles/review-scheduler-bfiles' + date_url} />
                        </Card>
                    </div>
                </Card>
            </div>
        )
    }
}

export default PendingOpportunities
