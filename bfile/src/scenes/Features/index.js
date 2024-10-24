import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon
} from 'antd';
import './features.css';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';

class Features extends Component {
    state = {
        loading: true,
        posts: []
    }
    componentDidMount = () => {
        axios.get('/api/feature_and_fix?q={"order_by":[{"field":"id","direction":"desc"}]}').then((res) => {
            this.setState({
                posts: res.data.objects,
                loading: false
            })
        })
    }
    render() {

        const { posts, loading } = this.state;

        return (
            <div>
                <Card
                    title={<div><Icon type="tool" style={{marginRight:10,color:"#1890ff"}} /> <Translate text={`Features & Fixes`} /></div>}
                    bordered={false}
                    loading={loading}
                >
                    {posts.map((post, i) => (
                        <Card
                            key={i}
                            style={{marginBottom:20}}
                            type="inner"
                        >
                            <Card.Meta
                                title={post.title}
                                description={moment(post.created_on).format('MM/DD/YYYY hh:mmA')}
                            />
                            <div className="postContent">
                                {post.description}
                            </div>
                        </Card>
                    ))}
                </Card>
            </div>
        );

    }
}

export default Features;
