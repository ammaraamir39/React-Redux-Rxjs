import React, { Component } from 'react';
import {
    Icon,
    Row,
    Col,
    Card,
    Modal,
    Button,
    Input,
    message,
    Spin
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Translate } from 'react-translated';
import F from '../../../Functions';

const { TextArea } = Input;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class DashModal extends Component {
    state = {
        email: this.props.bfile.email,
        loading: false
    }
    sendEmail() {
        if (this.state.email !== '') {
            this.setState({ loading: true });
            axios.post('/api/send_mortgage_email', {
                email: this.state.email,
                bfile_id: this.props.bfile.id
            }).then((res) => {
                this.setState({ loading: false });
                if (res.data.success) {
                    message.success('Email sent successfully.');
                    this.props.hideModal();
                } else {
                    message.error('Can\'t send email.');
                }
            })
        } else {
            message.error('Email is required.');
        }
    }
    render() {

        const { loading } = this.state;
        const { bfile } = this.props;

        return (
            <Modal
                title={<Translate text={`Resend Mortgage Approval`} />}
                visible={this.props.showModal}
                onOk={this.sendEmail.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Send`} />}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <div>
                            <label>Email:</label>
                            <Input
                                defaultValue={this.props.bfile.email}
                                className="sendEmail"
                                placeholder="Email"
                                onChange={(e) => this.setState({ email: e.target.value })}
                            />
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
