import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Card,
    Timeline,
    Collapse,
    Button
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';

const Panel = Collapse.Panel;

class Games extends Component {
    state = {
        loading: true,
        games: []
    }
    componentDidMount() {
        this.loadGames();
    }
    loadGames() {
        const start_date = moment(this.props.start_date).format('YYYY-MM-DD');
        const end_date = moment(this.props.end_date).format('YYYY-MM-DD');
        let url = '/api/agency_game?q={"filters":[{"or":[{"name":"finished","op":"is_null"},{"name":"finished","op":"==","val":0}]},{"or":[{"name":"archived","op":"is_null"},{"name":"archived","op":"==","val":0}]},{"or":[{"name":"start_date_time","op":">=","val":"'+start_date+'"},{"name":"end_date_time","op":"<=","val":"'+end_date+'"}]}]}';
        if (start_date === "2010-01-01") {
            url = '/api/agency_game?q={"filters":[{"or":[{"name":"finished","op":"is_null"},{"name":"finished","op":"==","val":0}]},{"or":[{"name":"archived","op":"is_null"},{"name":"archived","op":"==","val":0}]}]}';
        }
        this.setState({
            loading: true
        });
        axios.get(url).then((res) => {
            this.setState({
                loading: false,
                games: res.data.objects
            })
        }).catch((e) => {
            this.setState({
                loading: false
            })
        })
    }
    render() {

        const { games, loading } = this.state;

        if (this.state.games.length > 0) {
            return (
                <div>
                    <Card loading={loading} title={
                        <div>
                            <Icon type="trophy" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Leaderboard`} />
                        </div>
                    } bordered={false}>
                        <div style={{ maxHeight: 350, overflow: 'auto' }}>
                            <Collapse defaultActiveKey={[0]}>
                                {this.state.games.map((game, i) => (
                                    <Panel header={game.name} key={i}>
                                        <p style={{textAlign:'center'}}>
                                            {moment(game.start_date_time).format('MM/DD/YYYY')} to {moment(game.end_date_time).format('MM/DD/YYYY')}
                                        </p>
                                        <ol style={{paddingLeft:18}}>
                                            {game.players.map((player, ii) => (
                                                <li key={ii}>
                                                    {player.first_name + ' ' + player.last_name}
                                                </li>
                                            ))}
                                        </ol>
                                        <div style={{textAlign:'center'}}>
                                            <Link to={"/gamification/view/" + game.id}>
                                                <Button><Translate text={`View Results`} /></Button>
                                            </Link>
                                        </div>
                                    </Panel>
                                ))}
                            </Collapse>
                        </div>
                    </Card>
                </div>
            )
        } else {
            return null;
        }
    }
}

export default Games;
