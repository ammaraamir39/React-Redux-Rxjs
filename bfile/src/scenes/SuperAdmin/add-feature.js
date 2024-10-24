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

class AddFeature extends Component {
    state = {
        loading: false,
        post: {
            title: '',
            description: ''
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
        axios.post("/api/feature_and_fix", post).then((res) => {
            this.setState({ loading: false });
            message.success(F.translate(`Post has been successfully added.`));
            this.props.history.push('/super-admin/features');
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Can't add the post.`));
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
                            Add Feature/Fix
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

export default AddFeature;
