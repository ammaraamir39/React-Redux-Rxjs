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
import { Translate } from 'react-translated';

class Reporting extends Component {
    state = {
        loading: true,
        title: '',
        players: []
    }
    componentDidMount = () => {
        if (typeof this.props.match.params.game_id !== "undefined") {
            this.setState({ loading: true });
            axios.get('/api/agency_game/'+this.props.match.params.game_id).then((res) => {
                const game = res.data;

                const players = game.players;
                for (let i=0; i < players.length; i++) {
                    players[i].total = players[i].stats.total;
                }
                players.sort(this.compare);

                this.setState({
                    loading: false,
                    title: game.name,
                    players
                })
            }).catch(() => {
                this.setState({ loading: false });
            });
        } else {
            this.props.history.push('/gamification');
        }
    }
    compare = (b, a) => {
        if (a.total < b.total)
            return -1;
        if (a.total > b.total)
            return 1;
        return 0;
    }
    render() {

        const { loading, players, title } = this.state;

        const columns = [
            {
                title: 'Participant Name',
                dataIndex: 'name',
                key: 'name'
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
        for (let i=0; i < players.length; i++) {
            let item = players[i];

            data.push({
                key: i,
                name: item.first_name+' '+item.last_name,
                bfile_sent: item.stats.trigger_one,
                total: F.dollar_format(item.total)
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="trophy" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={title} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered={false}
                        pagination={false}
                    />
                </Card>
            </div>
        );

    }
}

export default Reporting;
