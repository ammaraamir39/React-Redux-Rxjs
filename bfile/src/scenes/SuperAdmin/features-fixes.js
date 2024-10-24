import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Popconfirm,
    Button,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';
import Pagination from '../../components/pagination';
import { Translate } from 'react-translated';

class FeaturesAndFixes extends Component {
    state = {
        loading: true,
        posts: [],
        page: 1,
        total_pages: 0
    }
    componentDidMount = () => {
        this.loadPosts(1);
    }
    loadPosts = (page) => {
        const users_list = [];
        const api = '/api/feature_and_fix?page='+page+'&q={"order_by":[{"field":"id","direction":"desc"}]}';
        this.setState({ loading: true });
        axios.get(api).then((res) => {
            this.setState({
                loading: false,
                posts: res.data.objects,
                page: res.data.page,
                total_pages: res.data.total_pages
            });
        });
    }
    delete = (id) => {
        this.setState({ loading: true });
        axios.delete('/api/feature_and_fix/' + id).then((res) => {
            this.setState({ loading: false });
            this.loadPosts(1);
            message.success(F.translate(`Post has been deleted successfully.`));
        }).catch(() => {
            message.error(F.translate(`Can't delete the post.`));
        });
    }
    render() {

        const { loading, posts, page, total_pages } = this.state;

        const columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                width: '33%'
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
        for (let i=0; i<posts.length; i++) {
            let post = posts[i];

            data.push({
                key: i,
                date: moment(post.created_on).format('MM/DD/YYYY hh:mm a'),
                title: post.title,
                description: post.description,
                action: (
                    <div className="right-align">
                        <Link to={'/super-admin/features/edit/' + post.id}>
                            <Button><Icon type="edit" /> Edit</Button>
                        </Link>
                        <Popconfirm placement="topRight" title={'Do you really want to delete this post?'} onConfirm={() =>  this.delete(post.id)} okText="Yes" cancelText="No">
                            <Button style={{marginLeft: 10}} type="danger" ghost>
                                <Icon type="minus" /> Delete
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
                            <Icon type="tool" style={{marginRight: 10,color:"#1890ff"}} />
                            <Translate text={`Features & Fixes`} />
                        </div>
                    }
                    className="tableCard"
                    loading={loading}
                    extra={
                        <Link to={'/super-admin/features/add'}>
                            <Button><Icon type="plus" /> <Translate text={`Add Feature/Fix`} /></Button>
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
                        this.loadPosts(page);
                    }} />
                </Card>
            </div>
        );

    }
}

export default FeaturesAndFixes;
