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

class EmailContent extends Component {
    state = {
        loading: true,
        email: {
            header: '',
            content: ''
        }
    }
    componentDidMount = () => {
        const api = '/api/email_content/1';
        this.setState({ loading: true });
        axios.get(api).then((res) => {
            this.setState({
                loading: false,
                email: res.data
            });
        });
    }
    updateField = (name, value) => {
        const { email } = this.state;
        email[name] = value;
        this.setState({ email });
    }
    save = () => {
        const { email } = this.state;
        this.setState({ loading: true });
        axios.put("/api/email_content/1", email).then((res) => {
            this.setState({ loading: false });
            message.success(F.translate(`Email content has been updated successfully.`));
        }).catch(() => {
            this.setState({ loading: false });
            message.error(F.translate(`Can't update the email content.`));
        });
    }
    render() {

        const { loading, email } = this.state;
        const updateField = this.updateField;

        return (
            <div>
                <Card
                    type="inner"
                    title={
                        <div style={{paddingTop:7}}>
                            <Icon type="mail" style={{marginRight: 10,color:"#1890ff"}} />
                            Email Content
                        </div>
                    }
                    loading={loading}
                >
                    <div className="inputField">
                        <label>Header</label>
                        <Input value={email.header} onChange={(e) => updateField('header', e.target.value)} />
                    </div>
                    <div className="inputField">
                        <label>Content</label>
                        <TextArea value={email.content} rows={4} onChange={(e) => updateField('content', e.target.value)} />
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

export default EmailContent;
