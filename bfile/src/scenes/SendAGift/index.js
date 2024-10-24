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
import SendTangoGiftCard from './send-tango-gift-card-modal';
import { Translate } from 'react-translated';

class TangoGiftCards extends Component {
    state = {
        loading: true,
        giftcards: [],
        page: 1,
        total_pages: 0,
        user: this.props.auth.user,
        send_tango_gift_card: false
    }
    componentDidMount = () => {
        this.loadgiftcards(1);
    }
    loadgiftcards = (page) => {
        const api = '/api/tango_gift_cards?page=' + page;

        this.setState({ loading: true });

        axios.get(api).then((res) => {
            const giftcards = res.data.objects;
            this.setState({
                loading: false,
                page: res.data.page,
                total_pages: res.data.total_pages,
                giftcards
            });
        });
    }
    render() {

        const { loading, giftcards, page, total_pages, user } = this.state;

        const columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount'
            }
        ];
        for (var i = 0; i < columns.length; i++) {
            columns[i].title = (<Translate text={columns[i].title} />);
        }

        const data = [];
        for (let i=0; i < giftcards.length; i++) {
            let giftcard = giftcards[i];

            data.push({
                key: i,
                date: moment(giftcard.created_on).format('MM/DD/YYYY'),
                name: giftcard.name,
                email: giftcard.email,
                amount: F.dollar_format(giftcard.amount)
            })
        }

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="gift" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Tango Gift Cards`} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <Button onClick={() => this.setState({ send_tango_gift_card: true })}>
                            <Icon type="mail" /> <Translate text={`Send Tango Gift Card`} />
                        </Button>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        bordered={false}
                        pagination={false}
                    />
                    <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                        this.loadgiftcards(page);
                    }} />
                </Card>
                <SendTangoGiftCard
                    showModal={this.state.send_tango_gift_card}
                    hideModal={() => this.setState({ send_tango_gift_card: false })}
                    user={user}
                    refresh={() => this.loadgiftcards(1)}
                />
            </div>
        );

    }
}

export default TangoGiftCards;
