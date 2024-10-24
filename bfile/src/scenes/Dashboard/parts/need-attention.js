import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Card,
    Popconfirm,
    Timeline
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';

class NeedAttention extends Component {
    state = {
        loading: true,
        timeline: []
    }
    componentDidMount() {
        this.loadNeedAttention();
    }
    deleteNeedAttention = (id) => {
        this.setState({ loading: true });
        axios.put('/api/b_file/'+id, {deleted: 1}).then((res) => {
            this.loadNeedAttention();
        })
    }
    loadNeedAttention() {
        axios.get('/api/user_need_attention').then((res) => {
            let bfiles = res.data;
            let timeline_data = [];
            let timeline = [];
            for(let i=0; i<bfiles.length; i++) {
                let date = bfiles[i].created_on;
                date = moment(date).format("dddd, MMMM D, YYYY");
                if (typeof timeline_data[date] === "undefined") {
                    timeline_data[date] = {
                        date: date,
                        values: []
                    }
                }
                timeline_data[date].values.push({
                    id: bfiles[i].id,
                    name: bfiles[i].customer_name,
                    note: bfiles[i].note,
                    agency: bfiles[i].agency_name,
                    date: bfiles[i].created_on,
                    bfile_id: bfiles[i].bfile_id
                })
            }
            for (let key in timeline_data) {
                timeline.push({
                    date: timeline_data[key].date,
                    values: timeline_data[key].values
                })
            }
            this.setState({
                loading: false,
                timeline: timeline
            })
        }).catch((e) => {
            this.setState({
                loading: false
            })
        })
    }
    render() {

        const { timeline, loading } = this.state;

        return (
            <div style={{marginBottom: 10}}>
                <Card loading={loading} title={
                    <div>
                        <Icon type="bulb" style={{marginRight: 10,color:"#1890ff"}} />
                        <Translate text={`Needs Attention`} />
                    </div>
                } bordered={false}>
                    <div style={{ maxHeight: 350, overflow: 'auto' }}>
                        {timeline.map((date, i) => (
                            <div key={i}>
                                <div className="dateTitle">{date.date}</div>
                                <Timeline>
                                    {date.values.map((item, ii) => (
                                        <Timeline.Item key={ii}>
                                            <div>
                                                <Link to={"/customer/" + item.bfile_id} className="bfile inviteLink">
                                                    {item.name}
                                                </Link>
                                                <Popconfirm placement="topRight" title={<Translate text={`Do you really want to delete this item?`} />} onConfirm={() => this.deleteNeedAttention(item.bfile_id)} okText="Yes" cancelText="No">
                                                    <a className="inviteLink"><Icon type="delete" /></a>
                                                </Popconfirm>
                                            </div>
                                            <div className="agency"><Translate text={`Agency`} />: {item.agency}</div>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </div>
                        ))}
                        {timeline.length === 0 ? (
                            <div className="notfound">
                                <Translate text={`No Items Found`} />
                            </div>
                        ) : null}
                    </div>
                </Card>
            </div>
        )
    }
}

export default NeedAttention;
