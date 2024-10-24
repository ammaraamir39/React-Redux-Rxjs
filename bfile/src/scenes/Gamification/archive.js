import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Pagination from '../../components/pagination';
import { Translate } from 'react-translated';

class Archive extends Component {
    state = {
        loading: true,
        games: [],
        page: 1,
        total_pages: 0
    }
    componentDidMount = () => {
        this.loadGamification(1);
    }
    loadGamification = (page) => {
        const api = '/api/agency_game?page=' + page + '&q={"filters":[{"name":"archived","op":"==","val":1}]}';
        this.setState({ loading: true });
        axios.get(api).then((res) => {
            const games = res.data.objects;
            this.setState({
                loading: false,
                page: res.data.page,
                total_pages: res.data.total_pages,
                games
            });
        });
    }
    enable = (id) => {
        this.setState({ loading: true });
        axios.put("/api/agency_game/"+id, {
            archived: 0
        }).then(() => {
            this.loadGamification(1);
        }).catch(() => {
            this.setState({ loading: false });
        });
    }
    render() {

        const { loading, games, page, total_pages } = this.state;

        const columns = [
            {
                title: 'Game Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Start Date',
                dataIndex: 'start_date',
                key: 'start_date'
            },
            {
                title: 'End Date',
                dataIndex: 'end_date',
                key: 'end_date'
            },
            {
                title: 'Edit',
                dataIndex: 'edit',
                key: 'edit'
            },
            {
                title: 'Reporting',
                dataIndex: 'reporting',
                key: 'reporting'
            },
            {
                title: '',
                dataIndex: 'action',
                key: 'action'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i=0; i < games.length; i++) {
            let item = games[i];

            data.push({
                key: i,
                name: item.name,
                start_date: moment(item.start_date_time).format('MM/DD/YYYY hh:mmA'),
                end_date: moment(item.end_date_time).format('MM/DD/YYYY hh:mmA'),
                edit: (
                    <Link to={"/gamification/edit/" + item.id}>Edit</Link>
                ),
                reporting: (
                    <Link to={"/gamification/view/" + item.id}>View Results</Link>
                ),
                action: (
                    <div className="right-align">
                        <Button style={{marginLeft: 10}} type="primary" ghost onClick={() => this.enable(item.id)}>
                            <Translate text={`Enable`} />
                        </Button>
                    </div>
                )
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="trophy" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Archive`} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <Link to="/gamification/add">
                            <Button><Icon type="plus" /> <Translate text={`Add a Game`} /></Button>
                        </Link>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered={false}
                        pagination={false}
                    />
                    <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                        this.loadGamification(page);
                    }} />
                </Card>
            </div>
        );

    }
}

export default Archive;
