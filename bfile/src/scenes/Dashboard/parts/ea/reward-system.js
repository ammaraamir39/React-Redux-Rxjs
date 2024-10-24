import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Icon,
    Card
} from 'antd';
import axios from 'axios';
import F from '../../../../Functions';
import tangocard from './tangocard.png';
import moment from 'moment';
import { Translate } from 'react-translated';

class TangoBox extends Component {
    render() {

        const { balance, giftcard, color } = this.props;

        const gridStyle = {
            width: '20%',
            textAlign: 'center'
        };

        return (
            <Card.Grid style={gridStyle} className={["card-"+color, "card-cols-5"]}>
                <div className="value">
                    <img src={tangocard} alt="Tangocard" style={{maxWidth:70}} />
                </div>
                <div className="title">
                    <span>{`Balance ${balance ? F.dollar_format(balance) : F.dollar_format(0)}`}</span>
                    {giftcard ? (
                        <span>{`Gift Card ${F.dollar_format(giftcard)}`}</span>
                    ) : null}
                </div>
            </Card.Grid>
        )
    }
}

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

class RewardSystem extends Component {
    state = {
        loading: true,
        tango_balance: 0,
        tango_card_amount: 0,
        approved_referrals: 0,
        pending_referrals: 0,
        total_amount_paid: 0,
        pending_payout: 0
    }
    componentDidMount = () => {

        let tango_card_amount = 0,
            tango_data = {},
            tango_balance = 0,
            pending_referrals = 0,
            approved_referrals = 0,
            total_amount_paid = 0,
            pending_payout = 0;

        axios.get('/api/tango/user_data').then((res) => {
            tango_data = res.data;
            tango_card_amount = tango_data.tango_card_amount;

            return axios.post("/api/tango/info", {})
        }).then((res) => {
            if (tango_data.has_tango_identifier && tango_data.has_tango_customer
                    && typeof res.data.account !== "undefined") {
                tango_balance = res.data.tango_balance;
            }

            return axios.get('/api/referrals_data?page=1&q={"filters":[{"name":"status","op":"==","val":0},{"name":"bfile","op":"has","val":{"name":"deleted","op":"==","val":0}}]}');
        }).then((res) => {
            pending_referrals = res.data.num_results;

            return axios.get('/api/referrals_data?page=1&q={"filters":[{"name":"status","op":"==","val":1},{"name":"bfile","op":"has","val":{"name":"deleted","op":"==","val":0}}]}');
        }).then((res) => {
            approved_referrals = res.data.num_results;
            total_amount_paid = approved_referrals * tango_card_amount;

            return axios.get('/api/referrals_data?page=1&q={"filters":[{"name":"status","op":"==","val":3},{"name":"bfile","op":"has","val":{"name":"deleted","op":"==","val":0}}]}');
        }).then((res) => {
            pending_payout = res.data.num_results;

            this.setState({
                loading: false,
                tango_card_amount,
                tango_data,
                tango_balance,
                pending_referrals,
                approved_referrals,
                total_amount_paid,
                pending_payout
            })
        }).catch((e) => {
            this.setState({
                loading: false
            });
        })

    }
    render() {

        const {
            loading,
            tango_card_amount,
            tango_balance,
            pending_referrals,
            approved_referrals,
            total_amount_paid,
            pending_payout
        } = this.state;

        const { period, start_date, end_date } = this.props;

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
                            <Icon type="mail" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Reward System`} />
                        </div>
                    }
                    bordered={false}
                    className="statsDetails"
                >
                    <div className="statsGrid">
                        <Card bordered={false} loading={loading}>
                            <TangoBox balance={tango_balance} giftcard={tango_card_amount} color={'blue'} link={'/dashboard' + date_url} />
                            <StatBox title="Pending Referrals" val={pending_referrals} color={'red'} link={'/dashboard' + date_url} />
                            <StatBox title="Pending Payouts" val={pending_payout} color={'red'} link={'/dashboard' + date_url} />
                            <StatBox title="Paid Referrals" val={approved_referrals} color={'green'} link={'/bfiles/approved-referrals' + date_url} />
                            <StatBox title="Total Amount Paid" val={F.dollar_format(total_amount_paid)} color={'green'} link={'/dashboard' + date_url} />
                        </Card>
                    </div>
                </Card>
            </div>
        )
    }
}

export default RewardSystem
