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
        email: '',
        showPassword: false,
        loading: false
    }
    copyToClipboard = (e) => {
        window.document.getElementById("linkTextarea").select();
        window.document.execCommand('copy');
        window.document.getElementById("linkTextarea").focus();
        message.success('Copied!');
    }
    sendEmail() {
        if (this.state.email !== '') {
            this.setState({ loading: true });
            axios.post('/api/send_bfile_invitation', {
                email: this.state.email,
                bfile_id: this.props.bfile.id
            }).then((res) => {
                this.setState({ loading: false });
                if (res.data.success) {
                    message.success('Email sent successfully.');
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
                title={<Translate text={`Invitation Link`} />}
                visible={this.props.showModal}
                onOk={this.copyToClipboard.bind(this)}
                onCancel={this.props.hideModal}
                okText={<Translate text={`Copy URL`} />}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    <div className="formBox">
                        <TextArea
                            id="linkTextarea"
                            ref={(textarea) => this.textArea = textarea}
                            prefix={<Icon type="link" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            value={'https://bfilesystem.com/app/bfile/' + bfile.token}
                        />
                        <div style={{marginTop: 20}}>
                            Password:
                            {' '}
                            {this.state.showPassword ? (
                                <span className="passwordField">{bfile.invite_password}</span>
                            ) : (
                                <Button onClick={() => this.setState({ showPassword: true })}>
                                    Show Password
                                </Button>
                            )}
                        </div>
                        <div style={{marginTop: 20}}>
                            <label>Send invite link by email:</label>
                            <Input className="sendEmail" addonAfter={<Button onClick={() => this.sendEmail()}>Send</Button>} placeholder="Email" onChange={(e) => this.setState({ email: e.target.value })} />
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default DashModal;
