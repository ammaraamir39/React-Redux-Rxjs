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
                <div className="value"><Link to={this.props.link}>{val}</Link></div>
                <div className="title"><Translate text={title} /></div>
            </Card.Grid>
        )
    }
}

class VirtualOnboardStats extends Component {
    state = {
        loading: true,
        period: this.props.period,
        start_date: this.props.start_date,
        end_date: this.props.end_date,
        vo_stats: {},
        user_t : this.props.user_t
    
    }
    componentDidMount() {
        this.loadStats();
    }
    componentDidUpdate() {
        let { period, start_date, end_date } = this.props;

        if (period !== this.state.period || start_date !== this.state.start_date || end_date !== this.state.end_date) {
            this.setState({
                period,
                start_date,
                end_date
            }, () => {
                this.loadStats();
            })
        }
    }
    loadStats = () => {
        let { period, start_date, end_date } = this.props;
        console.log("Agency _ id = > ",this.props.agency_id)
        if (period === 'all_bfiles') {
            const today = new Date();
            start_date = new Date('2010-01-01');
            end_date = new Date(today.getFullYear(), today.getMonth()+1, 1);
        }

        
        
        if(this.state.user_t === 'super_admin'){
            console.log("Super Admin")
            axios.post("/api/ea_vo_stats", {
                from: moment(start_date).format("YYYY-MM-DD"),
                to: moment(end_date).format("YYYY-MM-DD")
            }).then((res) => {
                this.setState({
                    vo_stats: res.data,
                    loading: false
                })
            });
        }else {
            let data = {}
            if(this.props.agency_id === null){
                data.from = moment(start_date).format("YYYY-MM-DD"),
                data.to = moment(end_date).format("YYYY-MM-DD"),
                data.all_agency = true
                data.agency_id = this.props.agency_id
            }else{
                data.from = moment(start_date).format("YYYY-MM-DD"),
                data.to = moment(end_date).format("YYYY-MM-DD"),
                data.all_agency = false,
                data.agency_id = this.props.agency_id
            }
           
            console.log("Agency Manager data => ",data)
            axios.post("/api/am_vo_stats", data).then((res) => {
                this.setState({
                    vo_stats: res.data,
                    loading: false
                })
            });
        }
    }
    render() {

        const { period, start_date, end_date } = this.props;
        let { vo_stats, loading } = this.state;
       
        if (typeof vo_stats.total_sent_to_efs === "undefined") {
           
            vo_stats = {
                total_sent_to_efs: 0,
                not_interested: 0,
                appointments_made: 0,
                appointments_kept: 0,
                appointments_sold: 0
            }
        }
        

        
        if(this.state.vo_stats.not_interested == undefined) this.state.vo_stats.not_interested = 0
        if(this.state.vo_stats.not_interested == undefined) this.state.vo_stats.not_interested = 0
        if(this.state.vo_stats.appointments_made == undefined) this.state.vo_stats.appointments_made = 0
        if(this.state.vo_stats.appointments_kept == undefined) this.state.vo_stats.appointments_kept = 0
        if(this.state.vo_stats.appointments_sold == undefined) this.state.vo_stats.appointments_sold = 0

     
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
                            <Icon type="appstore" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Virtual On-Board Stats (Completed)`} />
                        </div>
                    }
                    bordered={false}
                    className="statsDetails"
                >
                    <div className="statsGrid">
                        <Card bordered={false} loading={loading}>
                            <StatBox title="Sent for Introduction to Financial Specialist" val={vo_stats.total_sent_to_efs} color={'red'} link={'/bfiles/vo-sent-to-financial' + date_url} />
                            <StatBox title="Not Interested" val={vo_stats.not_interested} color={'green'} link={'/bfiles/vo-not-interested' + date_url} />
                            <StatBox title="Appointments Made" val={vo_stats.appointments_made} color={'blue'} link={'/bfiles/appointments-made-total' + date_url} />
                            <StatBox title="Appointments Kept" val={vo_stats.appointments_kept} color={'purple'} link={'/bfiles/appointments-kept' + date_url} />
                            <StatBox title="Appointments Sold" val={vo_stats.appointments_sold} color={'yellow'} link={'/bfiles/appointments-sold' + date_url} />
                        </Card>
                    </div>
                </Card>
            </div>
        )
    }
}

export default VirtualOnboardStats
