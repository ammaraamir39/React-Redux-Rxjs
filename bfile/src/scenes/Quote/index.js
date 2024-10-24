import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button,
    message,
    Popconfirm
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Pagination from '../../components/pagination';
import { Translate } from 'react-translated';

class Quotes extends Component {
    state = {
        loading: true,
        quotes: [],
        page: 1,
        total_pages: 0,
        user: this.props.auth.user,
        send_referral_link: false
    }
    componentDidMount = () => {
        this.loadQuotes(1);
    }
    loadQuotes = (page) => {
        const api = '/api/quotes?page='+page;

        this.setState({ loading: true });

        axios.get(api).then((res) => {
            const quotes = res.data.objects;
            this.setState({
                loading: false,
                page: res.data.page,
                total_pages: res.data.total_pages,
                quotes
            });
        });
    }
    delete = (quote_id) => {
        this.setState({ loading: true });
        axios.delete('/api/quotes/' + quote_id).then((res) => {
            this.loadQuotes(1);
        });
    }
    render() {

        const { loading, quotes, page, total_pages, user } = this.state;

        const columns = [
            {
                title: 'First Name',
                dataIndex: 'first_name',
                key: 'first_name'
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name',
                key: 'last_name'
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
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
        for (let i=0; i < quotes.length; i++) {
            let quote = quotes[i];

            data.push({
                key: i,
                first_name: quote.first_name,
                last_name: quote.last_name,
                email: quote.email,
                phone: F.phone_format(quote.phone),
                action: (
                    <div className="right-align">
                        <Link to={'/quotes/edit/' + quote.id}>
                            <Button><Icon type="edit" /> <Translate text={`Edit`} /></Button>
                        </Link>
                        <Popconfirm placement="topRight" title={'Do you really want to delete this item?'} onConfirm={() =>  this.delete(quote.id)} okText="Yes" cancelText="No">
                            <Button style={{marginLeft: 10}} type="danger" ghost>
                                <Icon type="minus" /> <Translate text={`Delete`} />
                            </Button>
                        </Popconfirm>
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
                            <Icon type="team" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Quotes`} />
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
                    <Pagination current_page={page} total_pages={total_pages} onClick={(page) => {
                        this.loadQuotes(page);
                    }} />
                </Card>
            </div>
        );

    }
}

export default Quotes;
