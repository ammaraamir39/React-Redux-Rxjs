import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Button,
    Input,
    Checkbox,
    DatePicker,
    Select,
    Switch,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import { Translate } from 'react-translated';


const Option = Select.Option;
const { TextArea } = Input;

class Notification extends Component {
    state = {
        loading: false,
        agency_id: null,
        loggedin: this.props.auth.user,
        users: [],
        game: {
            name: '',
            start_date_time: '',
            end_date_time: '',
            trigger_one_value: '',
            player_ids: []
        }
    }
    componentDidMount = () => {
        let agency_id = null;

        this.setState({ loading: true });
        axios.get("/api/my_associations").then((res) => {
            let users = [];
            for (let x in res.data) {
                const agency = res.data[x];
                for (let i=0; i < agency.length; i++) {
                    const u = agency[i];
                    if (u.user_type === 'EA') {
                        agency_id = u.agency_id;
                    }
                    if (u.user_type === 'LSP') {
                        users.push({
                            name: u.first_name+" "+u.last_name,
                            id: u.id,
                            user_type: u.user_type
                        });
                    }
                }
            }
            this.setState({
                loading: false,
                users,
                agency_id
            });
        });
    }
    updateField = (name, val) => {
        const { game }  = this.state;
        game[name] = val;
        this.setState({ game });
    }
    updatePlayers = (user_id, checked) => {
        const { game } = this.state;
        if (checked === true) {
            game.player_ids.push(user_id);
        } else {
            const index = game.player_ids.indexOf(user_id);
            game.player_ids.splice(index, 1);
        }
        this.setState({ game });
    }
    save = () => {
        const { agency_id, game } = this.state;

        if (game.player_ids.length === 0) {
            message.error(F.translate(`Please select a least one player.`));
        } else if (game.name === '' || game.start_date_time === '' || game.end_date_time === '') {
            message.error(F.translate(`Please fill all fields.`));
        } else {
            this.setState({ loading: true });
            axios.post("/api/agency_game", {
                agency_id,
                name: game.name,
                start_date_time: moment(game.start_date_time).format('MM/DD/YYYY HH:mm a'),
                end_date_time: moment(game.end_date_time).format('MM/DD/YYYY HH:mm a'),
                trigger_one_value: game.trigger_one_value,
                player_ids: game.player_ids.join(",")
            }).then((res) => {
                this.setState({ loading: false });
                this.props.history.push("/dashboard");
            });
        }
    }
    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    render() {

        const { loading, users, user, game } = this.state;
        const updateField = this.updateField;

        return (
            <div>
                <Card type="inner" title={<Translate text={`Add a Game`} />} loading={loading}
                
                type="inner"
                    title={
                        
                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <Translate text={`Push Notification`} />
                                </div> 
                            </Col>
                            <Col md={3} span={3}>
                                <div className="inputField">
                                    <Select value={game.trigger_one_value} style={{ width: '100%' }} onChange={(val) => updateField('trigger_one_value', val)}>
                                        <Option value={''}><Translate text={`Type`} /></Option>
                                        {[...Array(100)].map((x, i) => (
                                            <Option value={i+1} key={i}>${i+1}</Option>
                                        ))}
                                    </Select>
                                </div> 
                            </Col>
                            <Col md={3} span={3}>
                                <div className="inputField">
                                    <Select value={game.trigger_one_value} style={{ width: '100%' }} onChange={(val) => updateField('trigger_one_value', val)}>
                                        <Option value={''}><Translate text={`User Type`} /></Option>
                                        {[...Array(100)].map((x, i) => (
                                            <Option value={i+1} key={i}>${i+1}</Option>
                                        ))}
                                    </Select>
                                </div> 
                            </Col>
                        </Row>
                    }>
                    <div>
                        <Row gutter={16}>
                            <Col md={24} span={24}>
                                <div className="inputField">
                                    <label><Translate text={`Description`} /></label>
                                    <TextArea rows={6} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={this.save.bind(this)}>
                            <Translate text={`Save`} />
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
}

export default Notification;
