import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Icon,
    Table,
    Button,
    Input,
    message
} from 'antd';
import moment from 'moment';
import F from '../../Functions';
import axios from 'axios';

const { TextArea } = Input;

class EditFeature extends Component {
    state = {
        loading: false,
        post: {
            title: '',
            description: ''
        }
    }
    componentDidMount = () => {
        if (typeof this.props.match.params.post_id !== "undefined") {
            const api = '/api/feature_and_fix/' + this.props.match.params.post_id;
            this.setState({ loading: true });
            axios.get(api).then((res) => {
                this.setState({
                    loading: false,
                    post: res.data
                });
            });
        }
    }
    updateField = (name, value) => {
        const { post } = this.state;
        post[name] = value;
        this.setState({ post });
    }
    save = () => {
        const { post } = this.state;
        this.setState({ loading: true });
        axios.put("/api/feature_and_fix/" + post.id, {
            title: post.title,
            description: post.description
        }).then((res) => {
            this.setState({ loading: false });
            message.success(F.translate(`Post has been updated successfully.`));
            this.props.history.push('/super-admin/features');
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Can't update the post.`));
        });
    }
    render() {

        const { loading, post } = this.state;
        const updateField = this.updateField;

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="mail" style={{marginRight: 10,color:"#1890ff"}} />
                            Edit Feature/Fix
                        </div>
                    }
                    loading={loading}
                >
                    <div className="inputField">
                        <label>Title</label>
                        <Input value={post.title} onChange={(e) => updateField('title', e.target.value)} />
                    </div>
                    <div className="inputField">
                        <label>Description</label>
                        <TextArea value={post.description} rows={4} onChange={(e) => updateField('description', e.target.value)} />
                    </div>
                    <div className="right-align">
                        <Button type="primary" onClick={this.save.bind(this)}>
                            Save
                        </Button>
                    </div>
                </Card>
            </div>
        );

    }
}

export default EditFeature;
