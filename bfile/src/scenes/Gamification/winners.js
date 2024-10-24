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

class Winners extends Component {
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
        const api = '/api/agency_game?page=' + page + '&q={"filters":[{"name":"finished","op":"==","val":1}]}';
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
    render() {

        const { loading, games, page, total_pages } = this.state;

        const columns = [
            {
                title: 'Game Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Winner',
                dataIndex: 'winner',
                key: 'winner'
            },
            {
                title: 'B-File Sent',
                dataIndex: 'bfile_sent',
                key: 'bfile_sent'
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total'
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
                winner: (item.winner) ? item.winner.first_name + ' ' + item.winner.last_name : '-',
                bfile_sent: F.dollar_format(item.players[0].stats.trigger_one),
                total: F.dollar_format(item.players[0].stats.total)
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="trophy" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Winners`} />
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

export default Winners;
